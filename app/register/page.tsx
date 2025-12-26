"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ 
    username: "", 
    password: "" ,
    email: "",
    fullname: "",
    confirmPassword: ""
});
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    console.log("123456 ", res);

    const data = await res.json();
    console.log("data ", data);
    if (data.success) {
      alert("Register successful!");
      router.push("/login");
    } else {
      setMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1>register ja</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-1/3"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">ลงทะเบียน</h2>

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-3 rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <label htmlFor="fullname">Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 mb-3 rounded"
          value={form.fullname}
          onChange={(e) => setForm({ ...form, fullname: e.target.value })}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 mb-3 rounded"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-red-500">{message}</p>
        )}
      </form>
    </div>
  );
}
