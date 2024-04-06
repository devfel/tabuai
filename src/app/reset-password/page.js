// src/app/reset-password/page.js
"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ToastSignin from "../components/ToastSignin";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setShowToast(true);
      setToastMessage("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code, // code contained in the reset link
          password: password,
          passwordConfirmation: passwordConfirmation,
        }),
      });

      if (!response.ok) {
        throw new Error("Reset password failed");
      }

      setShowToast(true);
      setToastMessage("Sua senha foi redefinida com sucesso. Você será redirecionado para o login.");
      setTimeout(() => (window.location.href = "/login"), 2000); // Redirect user to login page after showing message
    } catch (error) {
      console.error("Error:", error);
      setShowToast(true);
      setToastMessage("Erro ao redefinir a senha.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-5">Redefinir Senha</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block mb-1">
            Nova Senha
          </label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded-lg" required />
        </div>
        <div>
          <label htmlFor="passwordConfirmation" className="block mb-1">
            Confirme a Nova Senha
          </label>
          <input id="passwordConfirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="w-full border p-2 rounded-lg" required />
        </div>
        <button type="submit" className="w-full bg-gray-800 border border-transparent rounded-md py-2 px-4 font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">
          Redefinir Senha
        </button>
      </form>
      {showToast && <ToastSignin message={toastMessage} onDismiss={() => setShowToast(false)} />}
    </div>
  );
}

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
