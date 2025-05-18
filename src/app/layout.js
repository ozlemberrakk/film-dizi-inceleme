"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Link from "next/link";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [searchText, setSearchText] = useState("");

  const checkLogin = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUsername(decoded.username);
      } catch (error) {
        console.error("Token decode hatası:", error);
        setIsLoggedIn(false);
        setUsername("");
      }
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  useEffect(() => {
    checkLogin();

    const handleStorageChange = () => {
      checkLogin();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    // sayfayı yenile (isteğe bağlı)
    window.location.href = "/";
  };

  const handleSearch = () => {
    if (searchText.trim() === "") {
      alert("Lütfen arama metni girin.");
      return;
    }
    console.log("Arama yapıldı: ", searchText);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Film ve Dizi İnceleme</title>
      </head>
      <body>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" href="/">Film Dizi İnceleme</Link>
            <div className="d-flex align-items-center">
              {isLoggedIn ? (
                <>
                  <Link className="btn btn-outline-success mx-2" href={`/profile/${username}`}>
                    Hesabınız ({username})
                  </Link>
                  <Link className="btn btn-outline-warning mx-2" href="/messages">
                    Mesajlar
                  </Link>
                  <button className="btn btn-outline-danger mx-2" onClick={handleLogout}>
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn btn-outline-primary mx-2" href="/login">
                    Giriş Yap
                  </Link>
                  <Link className="btn btn-outline-secondary mx-2" href="/register">
                    Kayıt Ol
                  </Link>
                </>
              )}
              <input
                type="text"
                className="form-control mx-2"
                placeholder="Kullanıcı adı veya Film adı..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "200px" }}
              />
              <button className="btn btn-outline-dark" onClick={handleSearch}>Ara</button>
            </div>
          </div>
        </nav>

        <div className="container mt-4">{children}</div>
      </body>
    </html>
  );
}
