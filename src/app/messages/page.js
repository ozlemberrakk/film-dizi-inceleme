'use client';

import { useEffect, useState } from 'react';

export default function MessagesPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;

    fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Kullanıcılar alınamadı:', err));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetch('/api/messages', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('Mesajlar alınamadı:', err));
  }, [token]);

  const sendMessage = async () => {
    if (!content || !selectedUserId) return;

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId: selectedUserId, content }),
    });

    const newMsg = await res.json();
    if (res.ok) {
      setMessages(prev => [...prev, newMsg]);
      setContent('');
    } else {
      console.error('Mesaj gönderme hatası:', newMsg.error);
    }
  };

  return (
    <div className="container py-4">
      <div className="row border rounded shadow-lg" style={{ minHeight: '80vh' }}>
        {/* Kullanıcılar */}
        <div className="col-md-4 border-end p-3 bg-light">
          <h5 className="mb-4">Kullanıcılar</h5>
          <div className="list-group">
            {users.map(user => (
              <button
                key={user.id}
                className={`list-group-item list-group-item-action ${
                  selectedUserId === user.id ? 'active' : ''
                }`}
                onClick={() => setSelectedUserId(user.id)}
              >
                {user.username}
              </button>
            ))}
          </div>
        </div>

        {/* Mesajlar */}
        <div className="col-md-8 d-flex flex-column p-3">
          <h5 className="mb-3">Mesajlar</h5>

          <div
            className="flex-grow-1 overflow-auto mb-3 border rounded p-3 bg-white"
            style={{ maxHeight: '60vh' }}
          >
            {messages
              .filter(msg => msg.senderId === selectedUserId || msg.receiverId === selectedUserId)
              .map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex mb-2 ${
                    msg.senderId === selectedUserId ? 'justify-content-start' : 'justify-content-end'
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      msg.senderId === selectedUserId ? 'bg-light text-dark' : 'bg-primary text-white'
                    }`}
                    style={{ maxWidth: '70%' }}
                  >
                    <div className="fw-bold mb-1">
                      {msg.sender?.username || 'Bilinmeyen'}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              ))}
          </div>

          {/* Mesaj Gönderme */}
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Mesaj yaz..."
              value={content}
              onChange={e => setContent(e.target.value)}
              disabled={!selectedUserId}
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={!selectedUserId || !content.trim()}
            >
              Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
