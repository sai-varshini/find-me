from pydantic import BaseModel
from datetime import datetime

class ContactCreate(BaseModel):
    name: str
    email: str
    message: str


class SearchHistoryCreate(BaseModel):
    username: str
    query: str

class SearchHistoryOut(BaseModel):
    id: int
    username: str
    query: str
    timestamp: datetime

    class Config:
        orm_mode = True