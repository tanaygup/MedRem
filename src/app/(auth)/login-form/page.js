// pages/app.js
"use client";
import { useState,useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useDetailsStore } from "@/lib/detailsContext";

export default function LoginFormPage() {
  const { user,isSignedIn,isLoaded } = useUser();
  const clerkId = user?.id;
  const router = useRouter();

  const {setIsDetailsUpdated} = useDetailsStore();

  const [form, setForm] = useState({
    name:  "",
    phone: "",
    age: "",
    address: "",
    gender: "",
  });

  const [status, setStatus] = useState({
    type: "idle",
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clerkId) {
      setStatus({ type: "error", message: "Not signed in." });
      return;
    }

    setStatus({ type: "saving" });
    try {
      const res = await fetch("../api/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId,
          ...form,
          createdAt: new Date().toISOString(),
          detailsUpdated: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Unknown error");
      setStatus({ type: "success", message: json.success ? "Saved!" : "Up to date." });
      setIsDetailsUpdated(true);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.message });
    }
  };

  if(!isLoaded || !isSignedIn || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold">Please sign in to access this page.</h1>
      </div>
    );
  }

  return (

    <div className="max-w-md mx-auto p-6">

      <h1 className="text-2xl font-semibold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

      
        {/* Phone */}
        <div>
          <label className="block mb-1">Phone</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block mb-1">Age</label>
          <input
            name="age"
            type="number"
            min="1"
            value={form.age}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select one…</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>


        {/* Submit */}
        <button
          type="submit"
          disabled={status.type === "saving"}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {status.type === "saving" ? "Saving…" : "Save Details"}
        </button>

        {status.type === "error" && (
          <p className="text-red-600 mt-2">{status.message}</p>
        )}
        {status.type === "success" && (
          <p className="text-green-600 mt-2">{status.message}</p>
        )}
      </form>
    </div>
  );
}
