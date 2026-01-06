"use client";
import Navbar from "../../../componant/nav";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getGroupMembers, addGroupMember, removeGroupMember, updateGroupMemberPermission } from "@/lib/api";

interface Member {
  id: number;
  user: {
    id: number;
    username: string;
    fullname: string;
    email: string;
  };

  permission: string;
}

export default function GroupManage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const [members, setMembers] = useState<Member[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserPermission, setCurrentUserPermission] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    try {
      // First, get current user
      const authRes = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/user`, {
        credentials: "include",
      });
      if (authRes.ok) {
        const authData = await authRes.json();
        const currentUserId = authData.id;
        // Now fetch members
        const response = await getGroupMembers(Number(groupId));
        if (response.success) {
          setMembers(response.members);
          // Find current user's permission
          const currentMember = response.members.find((m: Member) => m.user.id === currentUserId);
          setCurrentUserPermission(currentMember ? currentMember.permission : null);
          console.log("Fetched members:", response.members);
        }
      } else {
        console.error("Failed to get current user");
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

  const handleUpdatePermission = async (userId: number, newPermission: string) => {
    try {
      await updateGroupMemberPermission(Number(groupId), userId, newPermission);
      fetchMembers();
    } catch (error) {
      console.error("Failed to update permission:", error);
      alert("Failed to update permission.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1 p-10">
        {currentUserPermission === 'admin' && (
          <div className="mb-6">
            <h2 className="text-xl mb-4">เพิ่มสมาชิก</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ชื่อผู้ใช้"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="p-2 border rounded"
              />
              <button
                onClick={handleAddMember}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                เพิ่ม
              </button>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl mb-4">ข้อมูลสมาชิก</h2>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <span className="font-medium">{member.user.fullname}</span>
                  <span className="text-gray-500 ml-2">{member.user.email}</span>
                  <span className="text-gray-500 ml-2">({member.user.username})</span>
                </div>
                <div className="flex items-center gap-2">
                  {currentUserPermission === 'admin' ? (
                    <select
                      value={member.permission}
                      onChange={(e) => handleUpdatePermission(member.user.id, e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="text-sm bg-gray-200 px-2 py-1 rounded">{member.permission}</span>
                  )}
                  {currentUserPermission === 'admin' && (
                    <button
                      onClick={() => handleRemoveMember(member.user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      ลบ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}