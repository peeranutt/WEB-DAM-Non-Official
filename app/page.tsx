"use client";
import Navbar from "@/componant/nav";
import AllAssrts from "@/componant/assets/allAssets";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <AllAssrts />
      </main>
    </div>
  );
}
