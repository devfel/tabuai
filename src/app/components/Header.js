// project/src/app/components/Header.js
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { isLoggedIn } = useAuth();

  return (
    <header className="bg-gray-800 text-white py-4 px-8 ">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/">
          <div className="flex items-center rounded-lg hover:text-gray-200 hover:bg-gray-950 px-4 py-1">
            <Image src="/tabuai-logo.svg" alt="TabUai Logo" width={50} height={50} />
            <h1 className="ml-4 text-3xl font-bold text-center md:text-left  inline-block family" style={{ fontFamily: '"Comic Sans MS", "Chalkboard", "ChalkboardSE-Regular", sans-serif' }}>
              TABUai
            </h1>
          </div>
        </Link>
        {/* APOIO COVIL CON 2024 */}
        <Link href="https://covilcon.com.br/">
          <div className="flex items-center rounded-lg hover:text-gray-200 hover:bg-gray-950 px-4 py-1">
            <h4 className="mx-2 font-bold text-center md:text-left  inline-block ">Apoio: </h4>
            <Image src="/covil-con-2024.webp" alt="Covil Con 2024 Logo" width={100} height={100} />
          </div>
        </Link>

        <div className="w-full md:w-auto flex flex-col md:flex-row justify-center items-center gap-2">
          {isLoggedIn ? (
            <Link href="/dashboard" className="w-full md:w-auto py-2 text-white px-2 border-2 text-center font-bold max-w-80 rounded-lg hover:text-gray-300 hover:border-gray-300">
              Minha Conta
            </Link>
          ) : (
            <Link href="/login" className="w-full md:w-auto py-2 text-white px-2 border-2 text-center font-bold max-w-80 rounded-lg hover:text-gray-300 hover:border-gray-300">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
