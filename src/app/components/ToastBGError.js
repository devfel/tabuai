// project/src/app/components/ToastBGError.js
"use client";
import React, { useEffect, useState } from "react";

const ToastBGError = ({ message, onDismiss, duration = 5000 }) => {
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
    <p className={`fixed top-0 right-5 mt-16 mx-5 font-bold bg-gray-50 border-2 border-gray-800 text-gray-800 px-6 py-3 rounded-lg shadow-lg transition-all duration-1000 ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`} style={{ animation: `${visible ? "slideIn" : "slideOut"} 2s forwards` }}>
      {message}
    </p>
  );
};

export default ToastBGError;
