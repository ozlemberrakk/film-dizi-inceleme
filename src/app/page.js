"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();

        if (response.ok) {
          setMovies(data);
        } else {
          setError("Filmler yüklenemedi.");
        }
      } catch (err) {
        setError("Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;
  if (!movies || movies.length === 0) return <div>Hiç film bulunamadı.</div>;

  return (
    <>
      <style jsx>{`
        .grid-container {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 15px;
          max-width: 1200px;
          margin: 30px auto;
          padding: 0 10px;
        }

        .movie-card {
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-bottom: 10px;
        }

        .movie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgb(0 0 0 / 0.15);
        }

        .movie-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .movie-title {
          margin-top: 10px;
          font-weight: 600;
          font-size: 1rem;
          color: #333;
          padding: 0 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        @media (max-width: 1200px) {
          .grid-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .grid-container {
            grid-template-columns: 1fr;
          }
          .movie-card {
            height: auto;
          }
          .movie-image {
            height: 250px;
          }
        }
      `}</style>

      <div className="grid-container">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} passHref>
            <div className="movie-card" role="button" tabIndex={0}>
              <img
                src={movie.image || "/placeholder.jpg"}
                alt={movie.title}
                className="movie-image"
              />
              <div className="movie-title" title={movie.title}>
                {movie.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default HomePage;
