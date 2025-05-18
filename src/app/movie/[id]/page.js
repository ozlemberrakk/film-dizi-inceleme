"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(`/api/movies/${id}`);
      const data = await res.json();
      setMovie(data);
    };

    const fetchComments = async () => {
      const res = await fetch(`/api/comments?movieId=${id}`);
      const data = await res.json();
      setComments(data);
    };

    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserId(decoded.id);
    }

    fetchMovie();
    fetchComments();
  }, [id]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newComment, movieId: id, userId }),
    });

    if (res.ok) {
      setNewComment("");
      const updated = await fetch(`/api/comments?movieId=${id}`);
      setComments(await updated.json());
    }
  };

  if (!movie) return <p>Film yükleniyor...</p>;

  return (
    <>
      <style jsx>{`
        .movie-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-top: 40px;
        }

        .movie-image {
          width: 300px;
          height: auto;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .movie-info {
          flex: 1;
          min-width: 280px;
        }

        .movie-title {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .movie-details {
          font-size: 1.05rem;
          color: #444;
          line-height: 1.6;
        }

        .comments-section {
          margin-top: 50px;
        }

        .comment {
          background: #f9f9f9;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .comment-author {
          font-weight: bold;
          color: #007bff;
        }

        textarea {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          resize: vertical;
        }

        .submit-button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }

        @media (max-width: 768px) {
          .movie-container {
            flex-direction: column;
            align-items: center;
          }

          .movie-image {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>

      <div className="container">
        <div className="movie-container">
          <img
            src={movie.image || "/placeholder.jpg"}
            alt={movie.title}
            className="movie-image"
          />

          <div className="movie-info">
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-details">{movie.details}</p>
          </div>
        </div>

        <div className="comments-section">
          <h3>Yorumlar</h3>
          {comments.length === 0 && <p>Henüz yorum yok.</p>}
          {comments.map((c) => (
            <div key={c.id} className="comment">
              <span className="comment-author">{c.user?.username || "Anonim"}:</span>{" "}
              {c.content}
            </div>
          ))}

          {userId && (
            <div className="mt-4">
              <textarea
                rows="4"
                placeholder="Yorumunuzu yazın"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="submit-button" onClick={handleSubmit}>
                Gönder
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
