'use client';

import { useEffect, useRef, useState } from 'react';

interface User {
  id: number;
  username: string;
}

export default function Information() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/user', {
        credentials: 'include',
      });

      console.log('Fetch user response status:', res.status);

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || 'Unauthorized');
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user');
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchUser();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">User Information</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
    </div>
  );
}
