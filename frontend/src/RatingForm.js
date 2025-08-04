import React, { useState } from "react";
import { BASE_URL } from "./api";

function RatingForm({ titleId, onRatingAdded }) {
  const [score, setScore] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/titles/${titleId}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ score, review }),
    });

    if (response.ok) {
      alert("Point added!");
      setScore("");
      setReview("");
      onRatingAdded();
    } else {
      alert("An error occurred!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Rate the Movie</h4>

      <input
        type="number"
        min="1"
        max="10"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Point"
        required
        style={{
          backgroundColor: "#2e2e2e",
          color: "#ffffff",
          border: "1px solid #444",
          borderRadius: "4px",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Comment"
        style={{
          backgroundColor: "#2e2e2e",
          color: "#ffffff",
          border: "1px solid #444",
          borderRadius: "4px",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          resize: "vertical",
        }}
      />

      <button type="submit" className="custom-button">
        Submit
      </button>
    </form>
  );
}

export default RatingForm;
