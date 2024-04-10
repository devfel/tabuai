// src/app/signin/page.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import ToastSignin from "../components/ToastSignin";
import LoadingIndicator from "../components/LoadingIndicator";

const SigninPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showToastSignin, setShowToastSignin] = useState(false);
  const [accCreatedSuccess, setaccCreatedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Create the payload object with mandatory fields
    let payload = {
      nomeUsuario,
      username,
      email,
      password,
    };

    // Conditionally add the whatsapp field if it's not empty
    if (whatsapp.trim()) {
      payload.whatsapp = whatsapp;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Signin failed");
      }

      const data = await response.json();
      setaccCreatedSuccess(true);
      login(data.jwt, data.user.id);
      setShowToastSignin(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      console.error("Error logging in:", error);
      setaccCreatedSuccess(false);
      setShowToastSignin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatWhatsAppNumber = (number) => {
    // Remove all non-digits
    let digits = number.replace(/\D/g, "");

    // Limit digits to the maximum expected length (11 digits for "(XX) 9 XXXX-XXXX")
    digits = digits.slice(0, 11);

    // Apply formatting
    const match = digits.match(/^(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})$/);
    let formattedNumber = "";

    if (match) {
      formattedNumber += match[1] ? `(${match[1]}` : "";
      formattedNumber += match[2] ? `) ${match[2]}` : "";
      formattedNumber += match[3] ? ` ${match[3]}` : "";
      formattedNumber += match[4] ? `-${match[4]}` : "";
    }

    return formattedNumber;
  };

  // Update the onChange handler for the WhatsApp input
  const handleWhatsAppChange = (e) => {
    const formattedNumber = formatWhatsAppNumber(e.target.value);
    setWhatsapp(formattedNumber);
  };

  return (
    <div className="max-w-md mx-auto my-10 p-5 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-5">Criar Conta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nomeUsuario" className="block mb-1">
            Nome Completo
          </label>
          <input id="nomeUsuario" minLength="3" maxLength="40" type="text" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} className="w-full border p-2 rounded-lg" required />
        </div>
        <div>
          <label htmlFor="whatsapp" className="block mb-1">
            WhatsApp (Opcional)
          </label>
          <input id="whatsapp" type="text" value={whatsapp} onChange={handleWhatsAppChange} className="w-full border p-2 rounded-lg" />{" "}
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            minLength="6"
            maxLength="50"
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.toLowerCase());
              setUsername(e.target.value.toLowerCase());
            }}
            className="w-full border p-2 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input id="password" type="password" minLength="6" maxLength="30" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded-lg" required />
        </div>
        <div>
          <p className="block mb-2 text-xs text-gray-700">
            <span className="font-bold">Importante:</span> Seu nome, endereço de email e número de whatsapp cadastrados serão compartilhados com outros usuários, por exemplo, com aqueles que receberem suas ofertas ou fizerem ofertas em seus anúncios.
          </p>
          <p className="block mb-1 text-xs text-gray-700">No momento, essa é a única forma de contato entre os usuários.</p>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-gray-800 border border-transparent rounded-md py-2 px-4 font-medium text-white hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <LoadingIndicator /> Criando Conta...
            </div>
          ) : (
            "Criar Conta"
          )}
        </button>
        <Link type="button" href="/login" className="w-full flex justify-center align-middle bg-gray-200 border-2 border-gray-800 rounded-md py-2 px-2 font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed mt-2">
          Já tenho uma conta
        </Link>
      </form>
      {showToastSignin && accCreatedSuccess && <ToastSignin message={`Conta criada com sucesso! 😁 Conectando em 3... 2...`} onDismiss={() => setShowToastSignin(false)} />}
      {showToastSignin && !accCreatedSuccess && <ToastSignin message={`Tivemos um problema ao tentar criar sua conta, provável email já cadastrado. 😢 `} onDismiss={() => setShowToastSignin(false)} />}
    </div>
  );
};

export default SigninPage;
