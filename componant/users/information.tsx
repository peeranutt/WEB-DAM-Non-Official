'use client';
import { useEffect, useState } from 'react';

export default function UserPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token');

      console.log('Fetched token from localStorage:', token);
      if (!token) return;

      const res = await fetch('http://localhost:3001/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(await res.json());
        return;
      }

      setUser(await res.json());
    }

    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>User</h1>
      <p>ID: {user.userId}</p>
      <p>Username: {user.username}</p>
    </div>
  );
}
