"use client";
import Navbar from "../../componant/nav";
import InforUser from "../../componant/users/information";

export default function Upload() {
  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <InforUser />
      </main>
    </div>
  );
}
