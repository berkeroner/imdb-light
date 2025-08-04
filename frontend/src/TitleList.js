import React, { useEffect, useState } from "react";
import RatingForm from "./RatingForm";
import { BASE_URL } from "./api";

function TitleList({ token }) {
  const [titles, setTitles] = useState([]);
  const [ratings, setRatings] = useState({});
  const [visibleRatings, setVisibleRatings] = useState({});
  const [editing, setEditing] = useState({});
  const [editValues, setEditValues] = useState({});

  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    fetchTitlesAndRatings();
  }, []);

  const fetchTitlesAndRatings = async () => {
    try {
      const titlesRes = await fetch("${BASE_URL}/titles");
      const titlesData = await titlesRes.json();
      setTitles(titlesData);

      const ratingsData = {};
      for (const title of titlesData) {
        const res = await fetch(`${BASE_URL}/titles/${title.id}/ratings`);
        const data = await res.json();
        ratingsData[title.id] = data;
      }
      setRatings(ratingsData);
    } catch (error) {
      console.error("Failed to fetch titles or ratings", error);
    }
  };

  const toggleComments = (titleId) => {
    setVisibleRatings((prev) => ({ ...prev, [titleId]: !prev[titleId] }));
  };

  const handleDelete = async (titleId) => {
    const confirm = window.confirm("Are you sure you want to delete your comment?");
    if (!confirm) return;

    try {
      const res = await fetch(`${BASE_URL}/titles/${titleId}/ratings`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.ok) {
        const updated = await fetch(`${BASE_URL}/titles/${titleId}/ratings`);
        const updatedData = await updated.json();
        setRatings((prev) => ({ ...prev, [titleId]: updatedData }));
      } else {
        alert("Failed to delete comment.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (titleId, currentRating) => {
    setEditing((prev) => ({ ...prev, [titleId]: true }));
    setEditValues((prev) => ({
      ...prev,
      [titleId]: {
        score: currentRating.score,
        review: currentRating.review,
      },
    }));
  };

  const handleEditChange = (titleId, field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [titleId]: {
        ...prev[titleId],
        [field]: value,
      },
    }));
  };

  const handleEditSubmit = async (titleId) => {
    try {
      const res = await fetch(`${BASE_URL}/titles/${titleId}/ratings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(editValues[titleId]),
      });

      if (res.ok) {
        const updated = await fetch(`${BASE_URL}/titles/${titleId}/ratings`);
        const updatedData = await updated.json();
        setRatings((prev) => ({ ...prev, [titleId]: updatedData }));
        setEditing((prev) => ({ ...prev, [titleId]: false }));
      } else {
        alert("Failed to update comment.");
      }
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const calculateAverageScore = (list) => {
    if (!list || list.length === 0) return null;
    const total = list.reduce((sum, r) => sum + r.score, 0);
    return (total / list.length).toFixed(1);
  };

  const sortedTitles = [...titles].sort((a, b) => {
    const aAvg = parseFloat(calculateAverageScore(ratings[a.id] || [])) || 0;
    const bAvg = parseFloat(calculateAverageScore(ratings[b.id] || [])) || 0;
    return bAvg - aAvg;
  });

  return (
    <div className="w3-container">
      <h2 className="w3-center">Movies</h2>

      {sortedTitles.length === 0 ? (
        <p className="w3-center">No movies added yet!</p>
      ) : (
        sortedTitles.map((title) => {
          const movieRatings = ratings[title.id] || [];
          const average = calculateAverageScore(movieRatings);
          const commentCount = movieRatings.length;
          const isVisible = visibleRatings[title.id];
          const userRating = movieRatings.find((r) => r.user_id === userId);

          return (
            <div key={title.id} className="w3-card w3-padding w3-margin-bottom">
              {title.image_url && (
                <img
                  src={`${BASE_URL}/${title.image_url}`}
                  alt={title.name}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
              )}
              <h3>{title.name} ({title.year})</h3>
              <p><b>Genre:</b> {title.genre}</p>
              <p>{title.description}</p>

              <p style={{ marginTop: "10px" }}>
                <b>{commentCount} comment{commentCount !== 1 && "s"}</b>
                {average && <> | <b>Average Score:</b> {average}/10</>}
              </p>

              <button
                onClick={() => toggleComments(title.id)}
                className="custom-button"
              >
                {isVisible ? "Hide Comments" : "View Comments"}
              </button>

              {isVisible && (
                <div style={{ marginTop: "10px" }}>
                  {commentCount > 0 ? (
                    movieRatings.map((r, i) => (
                      <div key={i} style={{ borderTop: "1px solid #ccc", paddingTop: "5px", marginTop: "5px" }}>
                        <p><b>{r.username}</b> rated:</p>
                        <p><b>Score:</b> {r.score}/10</p>
                        <p>{r.review}</p>
                        <p style={{ fontSize: "0.8em", color: "gray" }}>
                          {new Date(r.created_at).toLocaleString()}
                        </p>

                        {r.user_id === userId && !editing[title.id] && (
                          <div>
                            <button className="w3-button w3-small w3-blue" onClick={() => handleEdit(title.id, r)}>Edit</button>
                            <button className="w3-button w3-small w3-red" onClick={() => handleDelete(title.id)}>Delete</button>
                          </div>
                        )}

                        {r.user_id === userId && editing[title.id] && (
                          <div style={{ marginTop: "10px" }}>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={editValues[title.id]?.score || ""}
                              onChange={(e) => handleEditChange(title.id, "score", e.target.value)}
                            />
                            <textarea
                              value={editValues[title.id]?.review || ""}
                              onChange={(e) => handleEditChange(title.id, "review", e.target.value)}
                            />
                            <button className="w3-button w3-small w3-green" onClick={() => handleEditSubmit(title.id)}>Save</button>
                            <button className="w3-button w3-small w3-grey" onClick={() => setEditing((prev) => ({ ...prev, [title.id]: false }))}>Cancel</button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              )}

              {token && !userRating && (
                <RatingForm
                  titleId={title.id}
                  onRatingAdded={async () => {
                    const res = await fetch(`${BASE_URL}/titles/${title.id}/ratings`);
                    const data = await res.json();
                    setRatings((prev) => ({ ...prev, [title.id]: data }));
                  }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default TitleList;
