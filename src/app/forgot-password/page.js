// src/app/forgot-password/page.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ToastSignin from "../components/ToastSignin";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      // Assuming the API responds with a success message for a valid request
      setShowToast(true);
      setToastMessage("Email de recuperação enviado! Verifique sua caixa de entrada.");
      setTimeout(() => router.push("/login"), 2000); // Redirect user back to login after showing message
    } catch (error) {
      console.error("Error:", error);
      setShowToast(true);
      // Customize this message based on actual API error responses if needed
      setToastMessage("Erro ao enviar email de recuperação.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-5">Recuperar Senha</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} className="w-full border p-2 rounded-lg" required />
        </div>
        <button type="submit" className="w-full bg-gray-800 border border-transparent rounded-md py-2 px-2 font-medium text-white hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
          Enviar Email de Recuperação
        </button>
        <Link href="/login" className="w-full flex justify-center align-middle bg-gray-200 border-2 border-gray-800 rounded-md py-2 px-2 font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed mt-2">
          Voltar para o Login
        </Link>
      </form>
      {showToast && <ToastSignin message={toastMessage} onDismiss={() => setShowToast(false)} />}
    </div>
  );
};

export default ForgotPasswordPage;
