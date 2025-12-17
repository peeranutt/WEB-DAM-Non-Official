"use client";
import Navbar from "../../componant/nav";
import SearchPage from "@/componant/search/searchBar";

export default function Upload() {
  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <SearchPage />
      </main>
    </div>
  );
}
