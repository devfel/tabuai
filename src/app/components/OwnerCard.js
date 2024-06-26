// project/src/app/components/OwnerCard.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function OwnerCard({ game }) {
  const [offerDetails, setOfferDetails] = useState([]);
  const [unansweredCount, setUnansweredCount] = useState(0);

  const userToken = localStorage.getItem("token");

  const heartIconSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-5 w-5">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );

  useEffect(() => {
    const fetchOfferDetails = async () => {
      const details = await Promise.all(
        game.offers.map(async (offer) => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/ofertas/${offer.id}?populate[usuario_fez_oferta_id]=*`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });

          if (!response.ok) {
            console.error("Failed to fetch offer details");
            return null;
          }

          const data = await response.json();
          if (!data.data || !data.data.attributes || !data.data.attributes.usuario_fez_oferta_id || !data.data.attributes.usuario_fez_oferta_id.data) {
            return null; // Retornar nulo se não houver dados suficientes
          }

          // Formatar a data de criação
          const createdAtFormatted = new Intl.DateTimeFormat("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(new Date(data.data.attributes.createdAt));

          return {
            id: data.data.id,
            ValorOferta: data.data.attributes.ValorOferta,
            Usuario: data.data.attributes.usuario_fez_oferta_id.data.attributes.nomeUsuario,
            Email: data.data.attributes.usuario_fez_oferta_id.data.attributes.email,
            Whatsapp: data.data.attributes.usuario_fez_oferta_id.data.attributes.whatsapp,
            DataCriacao: createdAtFormatted,
          };
        })
      );

      setOfferDetails(details.filter((detail) => detail !== null));
    };

    if (game.offers.length > 0) {
      fetchOfferDetails();
    }
  }, [game.offers]);

  useEffect(() => {
    if (game) {
      // Safe access using optional chaining
      const totalQuestions = game.questions?.length ?? 0;
      const totalAnswers = game.answers?.length ?? 0;

      // Calculate unanswered questions
      const unansweredQuestions = totalQuestions - totalAnswers;
      setUnansweredCount(unansweredQuestions);
    }
  }, [game]);

  const toggleActiveStatus = async () => {
    const newActiveStatus = !game.statusActive;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/board-games/${game.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          data: {
            active: newActiveStatus,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle active status");
      }

      // Refresh or notify upon success
      window.location.reload(); // Simple way to refresh the data/page
    } catch (error) {
      console.error("Failed to toggle active status:", error);
    }
  };

  // Cria o vertor com as ofertas ordenadas pelo valor maior para correta exibição.
  const sortedOffers = offerDetails.sort((a, b) => b.ValorOferta - a.ValorOferta);

  return (
    <div className={`flex flex-col p-4 border-4 border-white rounded-lg shadow-md ${game.statusActive ? "bg-gray-50" : "bg-gray-200"}`}>
      {/* Game Name */}
      <Link href={`/product/${game.id}`} passHref>
        <h5 className="text-lg font-bold text-black hover:text-gray-700 hover:underline transition-colors duration-200 ease-in-out">{game.name}</h5>
      </Link>

      {/* Game Value & Status on the same line */}
      <div className="flex mt-2 justify-between gap-4 items-center ">
        <p className="text-base dark:text-gray-700">
          Preço: <span className="font-semibold dark:text-gray-700">{` R$ ${game.price}`}</span>
        </p>

        {/* Displaying the count of unanswered questions */}
        <Link href={`/product/${game.id}`} passHref>
          <p className={unansweredCount > 0 ? "text-blue-600 font-semibold hover:underline" : "text-base dark:text-gray-700"}>
            Responder: <span className="">{unansweredCount}</span>
          </p>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start gap-2 mt-1">
        <button className={`py-1 px-1 border-2 text-center font-bold rounded-lg  ${game.statusActive ? "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600" : "text-green-500 border-green-500 hover:text-green-600 hover:border-green-600"}`} onClick={toggleActiveStatus}>
          {game.statusActive ? "Desativar Anúncio" : "Ativar Anúncio"}
        </button>
      </div>
      {/* Offers Table */}

      {sortedOffers.length === 0 && <p className="text-gray-800 mt-2">Nenhuma oferta recebida.</p>}
      {sortedOffers.length > 0 && (
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-white border border-gray-800 bg-opacity-50">
                <tr>
                  <th className="px-2 py-1 text-left font-semibold text-gray-800">Cliques Recebido</th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-800">Data e Hora</th>
                  <th className="px-2 py-1 text-right font-semibold text-gray-800">Valor / Curtida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="px-2 py-1 text-left text-xs text-black">
                      {offer.Usuario || "n/a"}
                      <p className="text-gray-600 underline">{offer.Email || "n/a"}</p>
                      {offer.Whatsapp ? <p className="text-gray-600">{offer.Whatsapp}</p> : null}
                    </td>
                    <td className="px-2 py-1 align-top text-center dark:text-gray-700">{offer.DataCriacao}</td>
                    <td className="flex justify-end px-2 py-1">{offer.ValorOferta === 0 ? <>{heartIconSvg}</> : `R$ ${offer.ValorOferta.toFixed(2)}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerCard;
