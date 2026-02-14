"use client";

import { useState } from "react";
import { getUsersBrand } from "../services/user/user";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Handle submit")

    const getUserResponse = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log(getUserResponse)

    if (getUserResponse.ok) {
      // get user's brands
      const brands = await getUsersBrand()
      let brandId = "";
      if(brands && brands.length)
        brandId = brands[0].id

      window.location.href = `/?brand_id=${brandId}`;
    } else {
      alert("Login failed");
    }
  }

  return (
    <form onSubmit={
      (e) => handleSubmit(e)
      }>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}
