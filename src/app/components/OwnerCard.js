// project/src/app/components/OwnerCard.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function OwnerCard({ game }) {
  const [offerDetails, setOfferDetails] = useState([]);
  const userToken = localStorage.getItem("token");

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
                  <th className="px-3 py-1 text-left font-semibold text-gray-800">Ofertas Recebidas</th>
                  <th className="px-3 py-1 text-center font-semibold text-gray-800">Data e Hora</th>
                  <th className="px-3 py-1 text-right font-semibold text-gray-800">Valor Ofertado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedOffers.map((offer) => (
                  <tr key={offer.id}>
                    <td className="px-3 py-1 text-left text-xs text-black">
                      {offer.Usuario || "n/a"}
                      <p className="text-gray-600 underline">{offer.Email || "n/a"}</p>
                      {offer.Whatsapp ? <p className="text-gray-600">{offer.Whatsapp}</p> : <></>}
                    </td>
                    <td className="px-3 py-1 text-center dark:text-gray-700">{offer.DataCriacao}</td>
                    <td className="px-3 py-1 text-right dark:text-gray-700">{`R$ ${offer.ValorOferta.toFixed(2)}`}</td>
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

// FETCH OFERTA ID USUARIO EXAMPLE
// http://localhost:1337/api/ofertas/51?populate[usuario_fez_oferta_id]=*
// {
// 	"data": {
// 		"id": 51,
// 		"attributes": {
// 			"ValorOferta": 2999,
// 			"createdAt": "2024-03-26T19:34:41.506Z",
// 			"updatedAt": "2024-03-26T19:34:41.535Z",
// 			"publishedAt": "2024-03-26T19:34:41.504Z",
// 			"UsuarioDaOfertaID": 1,
// 			"usuario_fez_oferta_id": {
// 				"data": {
// 					"id": 1,
// 					"attributes": {
// 						"username": "lucas",
// 						"email": "lucas@gmail.com",
// 						"provider": "local",
// 						"confirmed": true,
// 						"blocked": false,
// 						"createdAt": "2024-03-19T02:44:14.601Z",
// 						"updatedAt": "2024-03-19T02:49:44.297Z"
// 					}
// 				}
// 			}
// 		}
// 	},
// 	"meta": {}
// }
