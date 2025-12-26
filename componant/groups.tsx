import Image from "next/image";
import { useState, useEffect } from "react";
import { getUserGroups, createGroup } from "@/lib/api";

interface Group {
  id: number;
  name: string;
  description?: string;
}

export default function GroupCard({
  title,
  image,
  create,
  group,
  onGroupCreated,
}: {
  title?: string;
  image?: string;
  create?: boolean;
  group?: Group;
  onGroupCreated?: () => void;
}) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  useEffect(() => {
    if (!create) {
      fetchGroups();
    }
  }, [create]);

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

  const handleCreateGroup = async () => {
    try {
      await createGroup(newGroupName, newGroupDesc);
      setShowCreateModal(false);
      setNewGroupName("");
      setNewGroupDesc("");
      if (onGroupCreated) onGroupCreated();
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  if (create) {
    return (
      <>
        <div
          className="h-40 rounded-xl bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400"
          onClick={() => setShowCreateModal(true)}
        >
          <span className="text-3xl">+</span>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl mb-4">Create New Group</h2>
              <input
                type="text"
                placeholder="Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Description (optional)"
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateGroup}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Display actual groups
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="rounded-xl overflow-hidden border hover:shadow-md cursor-pointer"
          onClick={() => window.location.href = `/group/${group.id}`}
        >
          <div className="h-28 bg-gray-400 relative">
            {image && (
              <Image
                src={image}
                alt={group.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="px-3 py-2 flex justify-between items-center">
            <span className="font-medium">{group.name}</span>
            <span>⋮</span>
          </div>
        </div>
      ))}
    </div>
  );
}