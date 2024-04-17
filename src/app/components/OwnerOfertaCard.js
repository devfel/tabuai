// project/src/app/components/OwnerOfertaCard.js
"use client";
import Link from "next/link";
import { useState } from "react";

function OwnerOfertaCard({ game, onOfferDeleted }) {
  // Destructure to simplify access to nested properties
  const { Title, Value, Ofertas, owner, MaiorOferta, active } = game.attributes;
  const [offers, setOffers] = useState(game.attributes.Ofertas.data || []);

  // Safely access the owner's username and email with optional chaining and nullish coalescing operator
  const ownerUsername = owner?.data?.attributes?.nomeUsuario ?? "Unknown";
  const ownerEmail = owner?.data?.attributes?.email ?? "No email";
  const ownerWhatsapp = owner?.data?.attributes?.whatsapp ?? "Não cadastrado";

  const heartIconSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-5 w-5">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );

  // Convert and format the creation date of each offer
  const offersWithFormattedDate = offers.map((offer) => ({
    ...offer,
    DataCriacao: new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(offer.attributes.createdAt)),
    ValorOferta: offer.attributes.ValorOferta,
    UsuarioDaOfertaID: offer.attributes.UsuarioDaOfertaID,
  }));

  const handleDeleteOffer = async (offerId) => {
    const userToken = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/ofertas/${offerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the offer.");
      }

      // Filter out the deleted offer from the local state
      const updatedOffers = offers.filter((offer) => offer.id !== offerId);
      setOffers(updatedOffers);
      // Call the parent component to re-fetch the game details
      onOfferDeleted();
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  // Sort offers by ValorOferta in descending order
  const sortedOffers = offersWithFormattedDate.sort((a, b) => b.ValorOferta - a.ValorOferta);

  return (
    <div className={`flex flex-col p-4 border-4 border-gray-800 rounded-lg shadow-md ${active ? "bg-gray-50" : "bg-gray-200"}`}>
      <Link href={`/product/${game.id}`} passHref>
        <h5 className="text-lg font-bold text-black hover:text-gray-700 hover:underline transition-colors duration-200 ease-in-out">{Title}</h5>
      </Link>
      <div className="mt-2 text-base dark:text-gray-700">
        {!active && <p className="font-bold text-center text-lg text-red-600"> DESATIVADO / VENDIDO </p>}
        <p>
          Dono: <span className="font-semibold dark:text-gray-700">{ownerUsername}</span>{" "}
        </p>
        <p>
          E-mail: <span className="font-semibold dark:text-gray-700"> {ownerEmail}</span>{" "}
        </p>
        <p>
          Whatsapp: <span className="font-semibold dark:text-gray-700"> {ownerWhatsapp}</span>{" "}
        </p>
        <p>
          Preço: <span className="font-semibold dark:text-gray-700">R$ {Value.toFixed(2)}</span>{" "}
        </p>

        <p className="text-right text-sm mt-2 dark:text-gray-700">
          Maior Oferta no Produto: <span className="font-semibold dark:text-gray-700">R$ {MaiorOferta?.toFixed(2)}</span>{" "}
        </p>
      </div>

      {sortedOffers.length > 0 && (
        <div className="mt-2">
          <table className="min-w-full text-sm divide-y divide-gray-200 ">
            <thead className="bg-white border border-gray-800 bg-opacity-50">
              <tr>
                <th className="px-2 py-1 text-left font-semibold text-gray-800">Ofertas Feitas</th>
                <th className="px-2 py-1 text-center font-semibold text-gray-800">Data e Hora</th>
                <th className="px-2 py-1 text-right font-semibold text-gray-800">Propus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedOffers.map((offer) => (
                <tr key={offer.id}>
                  <td className="py-1 text-left">
                    <button className="py-[0.15rem] px-2 border-2 font-bold text-center rounded-lg text-red-500 border-red-500 hover:text-red-600 hover:border-red-600" onClick={() => handleDeleteOffer(offer.id)}>
                      {offer.ValorOferta === 0 ? <>Cancelar Curtida</> : <>Cancelar Oferta</>}
                    </button>
                  </td>
                  <td className="px-2 py-1 text-center dark:text-gray-700">{offer.DataCriacao}</td>
                  <td className="flex justify-end px-2 py-1 dark:text-gray-700">{offer.ValorOferta === 0 ? <>{heartIconSvg}</> : `R$ ${offer.ValorOferta.toFixed(2)}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OwnerOfertaCard;
