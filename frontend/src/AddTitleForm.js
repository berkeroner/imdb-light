import React, { useState } from "react";
import { BASE_URL } from "./api";

function AddTitleForm({ onTitleAdded }) {
  const [name, setName] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("release_year", releaseYear);
    formData.append("genre", genre);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(`${BASE_URL}/titles`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    if (response.ok) {
      alert("Movie added!");
      onTitleAdded();
    } else {
      alert("Movie could not be added!");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="w3-card w3-padding w3-margin-bottom">
      <h3>Add New Movie</h3>
      <input
        className="custom-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        className="custom-input"
        value={releaseYear}
        onChange={(e) => setReleaseYear(e.target.value)}
        placeholder="Year"
      />
      <input
        className="custom-input"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        placeholder="Genre"
      />
      <textarea
        className="custom-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="w3-margin-top"
      />
      <button className="custom-button w3-margin-top" type="submit">
        Add
      </button>
    </form>
  );
}

export default AddTitleForm;
