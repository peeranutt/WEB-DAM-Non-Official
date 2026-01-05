"use client";

import { useEffect, useRef, useState } from "react";
import { getUserGroups } from "@/lib/api";
import GroupCard from "../groups";

interface User {
  id: number;
  username: string;
}

interface Group {
  id: number;
  name: string;
  description?: string;
}

export default function Information() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const [groups, setGroups] = useState<Group[]>([]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/user`, {
        credentials: "include",
      });

      console.log("Fetch user response status:", res.status);

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Unauthorized");
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user");
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchUser();
  }, []);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await getUserGroups();
      if (response.success) {
        setGroups(response.groups);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">User Information</h1>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <div className="grid grid-cols-5 gap-6 w-5/6 m-10">
        <GroupCard create onGroupCreated={fetchGroups} />
        {groups.map((group) => (
          <div
            key={group.id}
            className="rounded-xl overflow-hidden border hover:shadow-md cursor-pointer"
            onClick={() => (window.location.href = `/group/${group.id}`)}
          >
            <div className="h-28 bg-gray-400 relative"></div>
            <div className="px-3 py-2 flex justify-between items-center">
              <span className="font-medium">{group.name}</span>
              <span>⋮</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
