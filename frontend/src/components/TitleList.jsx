import { useEffect, useState } from "react";
import API from "../api";

export default function TitleList() {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    API.get("/titles")
      .then((res) => setTitles(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Movie List</h2>
      <ul>
        {titles.map((t) => (
          <li key={t.id}>
            <strong>{t.name}</strong> ({t.year}) - {t.genre}
          </li>
        ))}
      </ul>
    </div>
  );
}
