"use client";
import { useEffect, useState } from "react";

export default function CommentsAdminPage() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch("/api/all-comments") // tüm yorumları getir
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  const deleteComment = async (id) => {
    await fetch("/api/comments", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    setComments(comments.filter((comment) => comment.id !== id));
  };

  return (
    <div className="container mt-5">
      <h2>Yorumlar</h2>
      <ul className="list-group">
        {comments.map((comment) => (
          <li key={comment.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{comment.user?.username || "Anonim"}</strong> ({comment.movie?.title})
              <p>{comment.content}</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => deleteComment(comment.id)}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
