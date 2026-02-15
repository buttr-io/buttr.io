"use client";

import { useEffect, useState } from "react";
import { redirectToDashboard } from "../services/client-redirections";

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
      await redirectToDashboard()
    } else {
      alert("Login failed");
    }
  }

  return (
      <>
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
        <p
          onClick={() => {
            window.location.href = "/api/auth/google";
          }}
        >
          Continue with Google
        </p>
      </>
  );
}


// FOR IdP users, check if using their email id's without password works? It should not let them login