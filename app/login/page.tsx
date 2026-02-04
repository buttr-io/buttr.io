"use client";

import { useState } from "react";

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
      const getUsersBrandRes = await getUsersBrand()
      let brandId = null;
      if(getUsersBrandRes.brands.length)
        brandId = getUsersBrandRes.brands[0].id

      window.location.href = `/dashboard?brand_id=${brandId}`;
    } else {
      alert("Login failed");
    }
  }

  const getUsersBrand = async () => {
    const getUsersBrandRes = await (await fetch("/api/users/brands")).json()
    console.log("User brands",getUsersBrandRes)
    if(getUsersBrandRes.ok){
    } else {
      // Handle error state
    }
    return getUsersBrandRes
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
