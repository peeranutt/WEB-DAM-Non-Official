"use client";
import Navbar from "../../componant/nav";
import Collection from "@/componant/collections";

export default function Upload() {
  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <div className="grid grid-cols-5 gap-6 w-5/6 m-10">
          <Collection create />
        <Collection title="name"/><Collection /><Collection title="name"/><Collection />

        </div>
      </main>
    </div>
  );
}
