import React from "react";
import "/node_modules/flag-icons/css/flag-icons.min.css";

// Example usage in a component
const LanguageFlag = ({ idioma }) => {
  const languageToCountryCode = {
    "Português BR": "br",
    "Português PT": "pt",
    Inglês: "us",
    Espanhol: "es",
    Italiano: "it",
    Alemão: "de",
    Outros: "un", // Antartica flag for generic purposes
    "Não especificado": "un", // Fallback to a generic flag
  };

  const countryCode = languageToCountryCode[idioma] || "un"; // Default to 'UN' if not specified

  return <span className={`fi fi-${countryCode}`} style={{ fontSize: "1.5rem" }}></span>;
};

export default LanguageFlag;
