"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState([]);

  const router = useRouter();

  // useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API}/users`)
  //     .then(res => res.json())
  //     .then(data => setUsers(data));
  // }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', // รับ cookie
      body: JSON.stringify(form),
    });

    console.log("123456 ",res);

    const data = await res.json();
    console.log("data ",data);
    localStorage.setItem('access_token', data.access_token);
    if (data.success) {
      alert("Login successful!"); 
      router.push("/");
    } else {
      setMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div>
      <h1>Users</h1>
      {users.map((u: any) => (
        <div key={u.id}>{u.username}</div>
      ))}
    </div>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">เข้าสู่ระบบ</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-3 rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full borderp-2 mb-3 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {message && <p className="mt-3 text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
