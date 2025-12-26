"use client";
import Navbar from "../../componant/nav";
import GroupCard from "@/componant/groups";
import { useState, useEffect } from "react";
import { getUserGroups } from "@/lib/api";

interface Group {
  id: number;
  name: string;
  description?: string;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);

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

  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <div className="grid grid-cols-5 gap-6 w-5/6 m-10">
          <GroupCard create onGroupCreated={fetchGroups} />
          {groups.map((group) => (
            <div
              key={group.id}
              className="rounded-xl overflow-hidden border hover:shadow-md cursor-pointer"
              onClick={() => window.location.href = `/group/${group.id}`}
            >
              <div className="h-28 bg-gray-400 relative"></div>
              <div className="px-3 py-2 flex justify-between items-center">
                <span className="font-medium">{group.name}</span>
                <span>⋮</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
