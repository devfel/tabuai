// src/app/signin/page.js
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import municipiosData from "../data/municipios.json";
import Link from "next/link";
import ToastSignin from "../components/ToastSignin";
import LoadingIndicator from "../components/LoadingIndicator";

const SigninPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [usuarioLudopedia, setUsuarioLudopedia] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showToastSignin, setShowToastSignin] = useState(false);
  const [accCreatedSuccess, setaccCreatedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [cities, setCities] = useState([]);

  // Convert and sort states
  const sortedStates = Object.entries(municipiosData.states).sort((a, b) => a[1].localeCompare(b[1]));

  // Conditionally add the cities that belong to the selected state
  useEffect(() => {
    if (estado) {
      const filteredCities = municipiosData.cities.filter((city) => city.state_id.toString() === estado).sort((a, b) => a.name.localeCompare(b.name)); // Sort cities alphabetically
      setCities(filteredCities);
      setCidade(""); // Reset city selection when state changes
    }
  }, [estado]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Create the payload object with mandatory fields
    let payload = {
      nomeUsuario,
      username,
      email,
      password,
      estado,
      cidade,
      //usuarioLudopedia, //Had to comment this so it wouldnt break the API
    };

    // Conditionally add the whatsapp field if it's not empty removing spaces
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
      setTimeout(() => router.push("/dashboard"), 2000);
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
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label htmlFor="nomeUsuario" className="block mb-1">
            Nome Completo
          </label>
          <input id="nomeUsuario" name="nomeUsuario" minLength="3" maxLength="40" type="text" autoComplete="off" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} className="w-full border p-2 text-gray-900 rounded-lg" required />
        </div>
        {/* <div>
          <label htmlFor="whatsapp" className="block mb-1">
            WhatsApp <span className="font-semibold">(Opcional)</span>
          </label>
          <input id="whatsapp" type="text" autoComplete="off" value={whatsapp} onChange={handleWhatsAppChange} className="w-full border p-2 text-gray-900 rounded-lg" />{" "}
        </div> */}
        {/* <div>
          <label htmlFor="usuarioLudopedia" className="block mb-1">
            Nome de Usuário na Ludopedia <span className="font-semibold">(Opcional)</span>
          </label>
          <input id="usuarioLudopedia" type="text" autoComplete="off" value={usuarioLudopedia} onChange={(e) => setUsuarioLudopedia(e.target.value)} className="w-full border p-2 text-gray-900 rounded-lg" />
        </div> */}
        {/* <div>
          <label htmlFor="estado" className="block mb-1">
            Estado
          </label>
          <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full border p-2 text-gray-900 rounded-lg" required>
            <option value="">Selecione um Estado</option>
            {sortedStates.map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cidade" className="block mb-1">
            Cidade
          </label>
          <select id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full border p-2 text-gray-900 rounded-lg" required>
            <option value="">Selecione uma Cidade</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div> */}
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            name="email"
            minLength="6"
            maxLength="50"
            id="email"
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.toLowerCase());
              setUsername(e.target.value.toLowerCase());
            }}
            className="w-full border p-2 text-gray-900 rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Senha
          </label>
          <input id="password" name="password" type="password" autoComplete="off" minLength="6" maxLength="30" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 text-gray-900 rounded-lg" required />
        </div>
        <div>
          <p className="block mb-2 text-xs text-gray-700 dark:text-gray-300">
            <span className="font-bold">Importante:</span> Seus dados, como nome, endereço de email e número de whatsapp cadastrados serão compartilhados com outros usuários, por exemplo, com aqueles que receberem suas ofertas ou fizerem ofertas em seus anúncios.
          </p>
          <p className="block mb-1 text-xs text-gray-700 dark:text-gray-300">Ao fazer o cadastro e utilizar o sistema você concorda com essas condições.</p>
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
        <Link type="button" href="/login" className="w-full flex justify-center align-middle bg-gray-200 border-2 border-gray-800 rounded-md py-2 px-2 font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed mt-2">
          Já tenho uma conta
        </Link>
      </form>
      {showToastSignin && accCreatedSuccess && <ToastSignin message={`Conta criada com sucesso! 😁 Conectando em 3... 2...`} onDismiss={() => setShowToastSignin(false)} />}
      {showToastSignin && !accCreatedSuccess && <ToastSignin message={`Tivemos um problema ao criar a conta, provável email ou whatsapp já cadastrado. 😢 `} onDismiss={() => setShowToastSignin(false)} />}
    </div>
  );
};

export default SigninPage;
