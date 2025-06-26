import React, { useEffect, useState } from "react";
import "./gallery.css"; 

import axios from "axios";

function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get("https://find-me-t594.onrender.com/gallery")
      .then((res) => {
        setImages(res.data.images || []);
      })
      .catch((err) => {
        console.error("Error fetching gallery:", err);
      });
  }, []);

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {images.map((url, i) => (
          <img key={i} src={url} alt={`Gallery ${i}`} className="gallery-image" />
        ))}
      </div>
    </div>
  );
}

export default Gallery;
