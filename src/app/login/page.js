// src/app/login/page.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import LoadingIndicator from "../components/LoadingIndicator";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      login(data.jwt, data.user.id); // Pass both JWT and user ID to login
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-5">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} className="w-full border p-2 rounded-lg" required />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded-lg" required />
          <Link href="/forgot-password" className="w-full flex justify-left text-sm text-gray-400 hover:underline hover:text-gray-500">
            Esqueci a senha.
          </Link>
        </div>
        <button type="submit" className={`w-full bg-gray-800 border border-transparent rounded-md py-2 px-2 font-medium text-white hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ${isLoggingIn ? "disabled:bg-gray-400 disabled:cursor-not-allowed" : ""}`} disabled={isLoggingIn}>
          {isLoggingIn ? (
            <>
              <LoadingIndicator /> <span>Entrando...</span>
            </>
          ) : (
            "Entrar"
          )}
        </button>
        <Link type="button" href="/signin" className="w-full flex justify-center align-middle bg-gray-200 border-2 border-gray-800 rounded-md py-2 px-2 font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed mt-2">
          Não Tenho Conta
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
