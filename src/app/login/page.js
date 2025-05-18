"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode'; 
import Cookies from "js-cookie";  

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Giriş başarısız.");
        return;
      }

      const token = data.token;

      const decoded = jwtDecode(token);
      console.log("🔸 decode edildi:", decoded);

      const { role, username } = decoded;

      localStorage.setItem("token", token);
      Cookies.set("token", token, { path: "/" }); 

      if (role === "ADMIN") {
        console.log("🔁 Admin yönlendirmesi");
        router.push("/admin");
      } else {
        router.push(`/profile/${username}`);
      }

    } catch (err) {
      console.error("Giriş hatası:", err);
      setError("Giriş sırasında sunucu hatası.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Giriş Yap</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">E-posta</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Parola</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
