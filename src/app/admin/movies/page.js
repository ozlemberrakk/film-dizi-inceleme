"use client";
import { useEffect, useState } from "react";

export default function MoviesAdminPage() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState(null); // Güncellenen filmin id'si

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  const handleAddOrUpdateMovie = async (e) => {
    e.preventDefault();

    if (editingId) {
      // Güncelleme işlemi
      const updatedMovie = { id: editingId, title, details, image };
      const response = await fetch("/api/movies", {
        method: "PATCH",
        body: JSON.stringify(updatedMovie),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      setMovies(movies.map((movie) => (movie.id === editingId ? result : movie)));
      setEditingId(null);
    } else {
      // Yeni film ekleme
      const movie = { title, details, image };
      const response = await fetch("/api/movies", {
        method: "POST",
        body: JSON.stringify(movie),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      setMovies([...movies, result]);
    }

    // Formu temizle
    setTitle("");
    setDetails("");
    setImage("");
  };

  // Güncelleme için verileri forma yükle
  const startEditing = (movie) => {
    setEditingId(movie.id);
    setTitle(movie.title);
    setDetails(movie.details);
    setImage(movie.image);
  };

  // Film silme fonksiyonu
  const deleteMovie = async (id) => {
    const confirmed = confirm("Filmi silmek istediğinizden emin misiniz?");
    if (!confirmed) return;

    const response = await fetch("/api/movies", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (response.ok) {
      setMovies(movies.filter((movie) => movie.id !== id));
    } else {
      alert(result.error || "Film silinemedi!");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Filmleri Yönet</h2>

      <form onSubmit={handleAddOrUpdateMovie}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Film/Dizi Adı
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="details" className="form-label">
            Detaylar
          </label>
          <textarea
            className="form-control"
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Resim URL
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              // Dosyayı API'ye yükle
              const formData = new FormData();
              formData.append("file", file);

              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              const data = await res.json();

              if (res.ok) {
                setImage(data.url); 
              } else {
                alert("Dosya yükleme başarısız!");
              }
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editingId ? "Güncelle" : "Ekle"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setDetails("");
              setImage("");
            }}
          >
            İptal
          </button>
        )}
      </form>

      <ul className="list-group mt-4">
        {movies.map((movie) => (
          <li
            key={movie.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{movie.title}</strong>
              <p>{movie.details}</p>
              {movie.image && (
                <img
                  src={movie.image}
                  alt={movie.title}
                  style={{ width: "100px" }}
                />
              )}
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => startEditing(movie)}
              >
                Güncelle
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteMovie(movie.id)}
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
