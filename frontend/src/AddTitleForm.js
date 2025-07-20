import React, { useState } from "react";

function AddTitleForm({ onTitleAdded }) {
  const [name, setName] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/titles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ name, release_year: releaseYear, genre, description }),
    });

    if (response.ok) {
      alert("Movie added!");
      onTitleAdded();
    } else {
      alert("Movie could not be added!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Movie</h3>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} placeholder="Year" />
      <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Type" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTitleForm;
