import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default async function UserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center" role="alert">
          Lütfen giriş yapınız.
        </div>
      </div>
    );
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          Token geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapınız.
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { username: true, email: true, role: true },
  });

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          Kullanıcı bulunamadı.
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh", backgroundColor: "#f7f9fc" }}
    >
      <div
        className="card shadow-lg"
        style={{ width: "350px", borderRadius: "15px", overflow: "hidden" }}
      >
        {/* Üst renkli bölüm */}
        <div
          style={{
            height: "120px",
            background:
              "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          }}
        ></div>

        <div className="card-body text-center" style={{ marginTop: "-60px" }}>
          {/* Profil Fotoğrafı */}
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=2575fc&color=fff&rounded=true&size=120`}
            alt="Profil Fotoğrafı"
            className="rounded-circle border border-white shadow-sm"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          {/* Kullanıcı Adı */}
          <h3 className="mt-3 mb-1">{user.username}</h3>
          {/* Rol */}
          <p className="text-muted mb-2 text-capitalize" style={{ fontWeight: "600" }}>
            {user.role}
          </p>
          {/* E-posta */}
          <p className="text-secondary mb-4" style={{ fontSize: "0.9rem" }}>
            <i className="bi bi-envelope-fill me-2"></i> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
}
