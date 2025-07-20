import React, { useEffect, useState } from "react";
import RatingForm from "./RatingForm";

function TitleList({ token }) {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch("http://localhost:5000/titles", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        const data = await response.json();
        setTitles(data);
      } catch (error) {
        console.error("Could not get movie list:", error);
      }
    };

    fetchTitles();
  }, [token]);

  return (
    <div className="w3-container">
      <h2 className="w3-center">Movies</h2>
      {titles.length === 0 ? (
        <p className="w3-center">No movies added yet!</p>
      ) : (
        titles.map((title) => (
          <div key={title.title_id} className="w3-card w3-padding w3-margin-bottom">
            <h3>{title.name} ({title.release_year})</h3>
            <p><b>Tür:</b> {title.genre}</p>
            <p>{title.description}</p>

            {}
            <RatingForm
              titleId={title.title_id}
              onRatingAdded={() => alert("Comment added!")}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default TitleList;
