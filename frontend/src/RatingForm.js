import React, { useState } from "react";

function RatingForm({ titleId, onRatingAdded }) {
  const [score, setScore] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/titles/${titleId}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ score, review }),
    });

    if (response.ok) {
      alert("Point added!");
      onRatingAdded();
    } else {
      alert("An error occured!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Rate the Movie</h4>
      <input type="number" min="1" max="10" value={score} onChange={(e) => setScore(e.target.value)} required />
      <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Comment" />
      <button type="submit">Submit</button>
    </form>
  );
}

export default RatingForm;
