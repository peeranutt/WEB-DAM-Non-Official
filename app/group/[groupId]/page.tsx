"use client";
import Navbar from "../../../componant/nav";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getGroupMembers, addGroupMember, removeGroupMember } from "@/lib/api";

interface Member {
  id: number;
  user: {
    id: number;
    username: string;
    fullname: string;
  };
  permission: string;
}

export default function GroupManage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const [members, setMembers] = useState<Member[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    try {
      const response = await getGroupMembers(Number(groupId));
      if (response.success) {
        setMembers(response.members);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newUsername.trim()) return;
    try {
      await addGroupMember(Number(groupId), newUsername);
      setNewUsername("");
      fetchMembers();
    } catch (error) {
      console.error("Failed to add member:", error);
      alert("Failed to add member. Check username.");
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await removeGroupMember(Number(groupId), userId);
      fetchMembers();
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1 p-10">
        <h1 className="text-2xl mb-6">Manage Group {groupId}</h1>

        <div className="mb-6">
          <h2 className="text-xl mb-4">Add Member</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="p-2 border rounded"
            />
            <button
              onClick={handleAddMember}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl mb-4">Members</h2>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <span className="font-medium">{member.user.username}</span>
                  <span className="text-gray-500 ml-2">({member.user.fullname})</span>
                  <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded">{member.permission}</span>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}