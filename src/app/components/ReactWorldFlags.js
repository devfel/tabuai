import React from "react";
import Flag from "react-world-flags";

// Example usage in a component
const LanguageFlag = ({ idioma }) => {
  const languageToCountryCode = {
    "Português BR": "BR",
    "Português PT": "PT",
    Inglês: "US",
    Espanhol: "ES",
    Italiano: "IT",
    Alemão: "DE",
    Outros: "AQ", // Antartica flag for generic purposes
    "Não especificado": "AQ", // Fallback to a generic flag
  };

  const countryCode = languageToCountryCode[idioma] || "UN"; // Default to 'UN' if not specified

  return <Flag code={countryCode} className="h-9" />;
};

export default LanguageFlag;
