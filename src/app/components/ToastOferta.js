// project/src/app/components/ToastOferta.js
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ToastOferta = ({ message, onDismiss, duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Começa a esconder após o tempo de duração
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    // Callback para remover o toast depois que a animação de saída terminar
    const cleanupTimer = setTimeout(() => {
      onDismiss();
    }, duration + 2000); // Adiciona tempo para a animação de saída

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanupTimer);
    };
  }, [onDismiss, duration]);

  return (
    <Link href="/dashboard" className={`fixed top-0 right-5 mt-10 mx-5 font-bold bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg cursor-pointer transition-all duration-1000 ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`} style={{ animation: `${visible ? "slideIn" : "slideOut"} 2s forwards` }}>
      {message}
    </Link>
  );
};

export default ToastOferta;
