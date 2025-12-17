"use client";
import Navbar from "../../componant/nav";
import Collection from "@/componant/collections";

export default function Upload() {
  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <Collection />
      </main>
    </div>
  );
}
