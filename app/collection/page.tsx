"use client";
import Navbar from "../../componant/nav";
import { useState, useEffect } from "react";
import { getCollections, createCollection } from "@/lib/api";

interface Collection {
  id: number;
  name: string;
  description?: string;
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDesc, setNewCollectionDesc] = useState("");

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await getCollections();
      if (response.success) {
        setCollections(response.collections);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };

  const handleCreateCollection = async () => {
    try {
      await createCollection(newCollectionName, newCollectionDesc);
      setShowCreateModal(false);
      setNewCollectionName("");
      setNewCollectionDesc("");
      fetchCollections();
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <div className="grid grid-cols-5 gap-6 w-5/6 m-10">
          <div
            className="h-40 rounded-xl bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="text-3xl">+</span>
          </div>
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="rounded-xl overflow-hidden border hover:shadow-md cursor-pointer"
              onClick={() => window.location.href = `/collection/${collection.id}`}
            >
              <div className="h-28 bg-gray-400 relative"></div>
              <div className="px-3 py-2 flex justify-between items-center">
                <span className="font-medium">{collection.name}</span>
                <span>⋮</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Create New Collection</h2>
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Description (optional)"
              value={newCollectionDesc}
              onChange={(e) => setNewCollectionDesc(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateCollection}
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

    </div>
  );
}
