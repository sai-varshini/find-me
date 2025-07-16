from fastapi import FastAPI, Query, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from passlib.hash import bcrypt
from sqlalchemy.orm import Session
from user import User, Base
from database import SessionLocal, engine
from models import Base, Contact
from schemas import ContactCreate
import models, schemas

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

# Enable CORS for frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Find Me backend is up and running 🚀"}


@app.get("/places")
def get_places(lat: float, lng: float, query: str = "restaurant", open_now: bool = False):
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": 3000,
        "keyword": query,
        "key": GOOGLE_API_KEY
    }
    if open_now:
        params["opennow"] = "true"

    response = requests.get(url, params=params)
    return response.json()


@app.get("/location")
def get_location(lat: float, lng: float):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "latlng": f"{lat},{lng}",
        "key": GOOGLE_API_KEY
    }
    response = requests.get(url, params=params)
    return response.json()


@app.get("/places/cleaned")
def get_cleaned_places(lat: float, lng: float, query: str = "restaurant"):
    nearby_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    textsearch_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    
    params = {
        "location": f"{lat},{lng}",
        "radius": 3000,
        "keyword": query,
        "key": GOOGLE_API_KEY
    }

    res = requests.get(nearby_url, params=params).json()
    results = res.get("results", [])

    # Fallback if nearby results are empty
    if not results:
        text_params = {
            "query": query,
            "location": f"{lat},{lng}",
            "radius": 10000,
            "key": GOOGLE_API_KEY
        }
        res = requests.get(textsearch_url, params=text_params).json()
        results = res.get("results", [])

    # Prioritize results with photos
    sorted_results = sorted(results, key=lambda x: "photos" in x, reverse=True)

    places = []
    for result in sorted_results:
        places.append({
            "name": result.get("name"),
            "vicinity": result.get("formatted_address") or result.get("vicinity"),
            "rating": result.get("rating"),
            "photo_ref": result.get("photos", [{}])[0].get("photo_reference"),
            "place_id": result.get("place_id"),
            "location": result.get("geometry", {}).get("location")
        })

    return {"results": places}


@app.get("/photo")
def get_photo(photo_ref: str, maxwidth: int = 400):
    url = "https://maps.googleapis.com/maps/api/place/photo"
    params = {
        "photoreference": photo_ref,
        "maxwidth": maxwidth,
        "key": GOOGLE_API_KEY
    }
    response = requests.get(url, params=params, allow_redirects=False)
    return {"photo_url": response.headers.get("location")}


@app.get("/categories")
def get_categories():
    return {
        "categories": [
            "restaurant", "hospital", "atm", "pharmacy", "cafe",
            "movie_theater", "gas_station", "gym", "supermarket", "library"
        ]
    }


@app.get("/distance")
def get_distance(origin: str, destination: str):
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": origin,
        "destinations": destination,
        "key": GOOGLE_API_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()

    if data.get("rows") and data["rows"][0]["elements"][0]["status"] == "OK":
        element = data["rows"][0]["elements"][0]
        return {
            "distance": element["distance"]["text"],
            "duration": element["duration"]["text"]
        }
    else:
        return {
            "distance": None,
            "duration": None,
            "error": "Could not find distance data"
        }

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/contact")
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    db_contact = Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return {"message": "Contact message saved"}


@app.get("/gallery")
def get_gallery_images():
    return {
        "images": [
            "https://placekitten.com/300/200",
            "https://placekitten.com/301/200",
            "https://placekitten.com/302/200",
            "https://placekitten.com/303/200",
            "https://placekitten.com/304/200",
            "https://placekitten.com/305/200",
        ]
    }

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # Check if username exists
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    # Check if email exists
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed = bcrypt.hash(password)
    new_user = User(username=username, email=email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}


@app.post("/login")
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not bcrypt.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}



@app.post("/search-history", response_model=schemas.SearchHistoryOut)
def save_search(history: schemas.SearchHistoryCreate, db: Session = Depends(get_db)):
    new_entry = models.SearchHistory(**history.dict())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@app.get("/search-history/{username}", response_model=list[schemas.SearchHistoryOut])
def get_user_history(username: str, db: Session = Depends(get_db)):
    return db.query(models.SearchHistory).filter(models.SearchHistory.username == username).order_by(models.SearchHistory.timestamp.desc()).all()

Base.metadata.create_all(bind=engine)