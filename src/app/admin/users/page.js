"use client";

import { useEffect, useState } from "react";

const UsersAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setUsers(data);
        } else {
          setError(data.error || "Kullanıcılar yüklenemedi.");
        }
      } catch (err) {
        setError("Bir hata oluştu.");
      }
    };

    fetchUsers();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    if (!confirm("Bu kullanıcıyı silmek istediğine emin misin?")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        const data = await res.json();
        alert(data.error || "Silme işlemi başarısız.");
      }
    } catch {
      alert("Sunucu hatası.");
    }
  };

  if (error) return <div>{error}</div>;
  if (!users.length) return <div>Kullanıcılar yükleniyor...</div>;

  return (
    <div>
      <h2>Kullanıcıları Yönet</h2>
      <ul className="list-group">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <strong>{user.username}</strong>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteUser(user.id)}
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersAdminPage;
