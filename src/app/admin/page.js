import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="container mt-5">
      <h2>Admin Paneli</h2>
      <ul className="list-group">
        <li className="list-group-item">
          <Link href="/admin/users">Kullanıcıları Yönet</Link>
        </li>
        <li className="list-group-item">
          <Link href="/admin/movies">Filmleri Yönet</Link>
        </li>
        <li className="list-group-item">
          <Link href="/admin/comments">Yorumları Yönet</Link>
        </li>
      </ul>
    </div>
  );
}
