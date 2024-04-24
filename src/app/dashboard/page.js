// ../src/app/components/dashboard/page.js
"use client";
import Card from "../components/Card";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import OwnerCard from "../components/OwnerCard";
import OwnerOfertaCard from "../components/OwnerOfertaCard";
import LoadingIndicator from "../components/LoadingIndicator";
import QuestionAnswerCard from "../components/QuestionAnswerCard";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [boardGames, setBoardGames] = useState([]);
  const [boardGamesWithOffers, setBoardGamesWithOffers] = useState([]);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [userDataState, setUserDataState] = useState(null);
  const [refreshOffers, setRefreshOffers] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);

  const [isUserDetailsLoading, setIsUserDetailsLoading] = useState(true);
  const [isBoardGamesLoading, setIsBoardGamesLoading] = useState(true);
  const [isBoardGamesWithOffersLoading, setIsBoardGamesWithOffersLoading] = useState(true);
  const [isUserQuestionsLoading, setIsUserQuestionsLoading] = useState(true);

  // Fetch and set user data
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isLoggedIn) {
        console.log("User not logged in");
        return;
      }

      const userToken = localStorage.getItem("token");
      if (!userToken) {
        console.log("No token found");
        return;
      }

      try {
        setIsUserDetailsLoading(true);
        const userDetailsResponse = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (!userDetailsResponse.ok) {
          throw new Error(`Failed to fetch user details: ${userDetailsResponse.statusText}`);
        }

        const userData = await userDetailsResponse.json();
        setUserDataState(userData);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setIsUserDetailsLoading(false);
      }
    };

    fetchUserDetails();
  }, [isLoggedIn]);

  // Fetch board games for the logged-in user
  useEffect(() => {
    const fetchGames = async () => {
      if (!userDataState || !userDataState.id) return;
      const userToken = localStorage.getItem("token");

      try {
        setIsBoardGamesLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/board-games?filters[OwnerID][$eq]=${userDataState.id}&populate=*&pagination[pageSize]=9999`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const json = await res.json();
        const games = json.data.map((item) => ({
          id: item.id,
          name: item.attributes.Title,
          price: item.attributes.Value,
          condition: item.attributes.Condition,
          statusActive: item.attributes.active,
          idioma: item.attributes.Idioma,
          maiorOferta: item.attributes.MaiorOferta,
          offers: item.attributes.Ofertas.data,
          questions: item.attributes.questions.data ?? [],
          answers: item.attributes.answers.data ?? [],
          image: item.attributes.Images.data?.[0]?.attributes.url ? `${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL_IMAGES}${item.attributes.Images.data[0].attributes.url}` : "/placeholder02c.png",
        }));

        setBoardGames(games.sort((a, b) => b.id - a.id));
      } catch (error) {
        console.error("Failed to load board games:", error);
      } finally {
        setIsBoardGamesLoading(false);
      }
    };

    fetchGames();
  }, [userDataState, refreshOffers]);

  // Fetch board games with offers from the logged-in user
  useEffect(() => {
    const fetchBoardGamesWithOffers = async () => {
      if (!userDataState || !userDataState.id) return;
      const userToken = localStorage.getItem("token");

      try {
        setIsBoardGamesWithOffersLoading(true);
        const offersRes = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/board-games/?populate[Ofertas]=*&populate[owner]=*&pagination[page]=1&pagination[pageSize]=9999`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
        });

        if (!offersRes.ok) {
          throw new Error(`Failed to fetch: ${offersRes.statusText}`);
        }

        const offersJson = await offersRes.json();
        const gamesWithMyOffers = offersJson.data
          .filter((game) => game.attributes.Ofertas.data.some((offer) => offer.attributes.UsuarioDaOfertaID === userDataState.id))
          .map((game) => {
            // For each game, filter its offers to keep only those made by the logged-in user
            const myOffers = game.attributes.Ofertas.data.filter((offer) => offer.attributes.UsuarioDaOfertaID === userDataState.id);
            return {
              ...game,
              attributes: {
                ...game.attributes,
                Ofertas: {
                  data: myOffers,
                },
              },
            };
          });

        setBoardGamesWithOffers(gamesWithMyOffers);
      } catch (error) {
        console.error("Failed to load board games with offers:", error);
      } finally {
        setIsBoardGamesWithOffersLoading(false);
      }
    };

    fetchBoardGamesWithOffers();
  }, [userDataState, refreshOffers]);

  // ----- Fetch Logged-in User QUESTIONS -----
  useEffect(() => {
    const fetchUserQuestions = async () => {
      if (!userDataState || !userDataState.id) return;
      const userToken = localStorage.getItem("token");

      setIsUserQuestionsLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/questions?filters[users_permissions_user][id][$eq]=${userDataState.id}&populate=board_game,users_permissions_user,answer.users_permissions_user&pagination[page]=1&pagination[pageSize]=9&sort=id:desc`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch questions");

        const { data } = await response.json();
        setUserQuestions(data);
      } catch (error) {
        console.error("Failed to fetch user questions:", error);
      } finally {
        setIsUserQuestionsLoading(false);
      }
    };

    fetchUserQuestions();
  }, [userDataState]);

  const handleOfferDeleted = () => {
    // Re-fetch the game details when an offer is deleted
    setRefreshOffers((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <main>
        {/* Cabeçalho e Informações do Usuário */}
        <div className="flex items-center justify-between px-4 py-2 mt-2 bg-gray-800 border border-gray-800 rounded-lg min-h-16">
          <h5 className="text-lg font-bold text-white">Minhas Informações:</h5>
        </div>
        {isUserDetailsLoading ? (
          <div className="flex flex-col justify-center items-center p-4 my-2 bg-gray-100 border border-gray-200 rounded-lg mt-2">
            <>
              <LoadingIndicator />
              <span className="mt-2">Carregando Minhas Informações...</span>
            </>
          </div>
        ) : (
          <div className="p-4 my-2 bg-gray-100 border border-gray-200 rounded-lg dark:text-gray-700">
            <p>Usuário: {userDataState ? userDataState.nomeUsuario : "Loading..."}</p>
            <p>Email: {userDataState ? userDataState.email : ""}</p>
            <p>WhatsApp: {userDataState ? userDataState.whatsapp : ""}</p>
            <p className=" text-red-400 border-red-400 cursor-pointer rounded-lg hover:text-red-500 hover:border-red-500 " onClick={handleLogout}>
              Deslogar
            </p>
          </div>
        )}

        {/* Layout de Grid para Minhas Perguntas */}
        <div className="my-8">
          <div className="flex items-center justify-between px-4 py-2 mt-2 bg-gray-800 border border-gray-800 rounded-lg min-h-16">
            <h5 className="text-lg font-bold text-white">Minhas Últimas Perguntas:</h5>
          </div>
          {isUserQuestionsLoading ? (
            <div className="flex flex-col justify-center items-center p-4 bg-gray-100 border border-gray-200 rounded-lg mt-2">
              <>
                <LoadingIndicator />
                <span className="mt-2">Carregando Minhas Perguntas...</span>
              </>
            </div>
          ) : userQuestions.length > 0 ? (
            <div className="mt-2 bg-gray-300 px-4 rounded-md">
              {userQuestions.map((question) => (
                <QuestionAnswerCard key={question.id} question={question} />
              ))}
            </div>
          ) : (
            <div className="mt-2 bg-gray-300 p-4 rounded-md dark:text-gray-600">
              <p>Você não fez nenhuma pergunta ainda. </p>
            </div>
          )}
        </div>

        {/* Layout de Grid para Meus Jogos e Minhas Ofertas */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 mt-4">
          {/* Meus Jogos */}
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-800 rounded-lg  min-h-16">
              <h5 className="text-lg font-bold text-white">Meus Jogos</h5>
              <Link href="/product/create" passHref>
                <button className="py-2 text-white px-2 border-2 text-center font-bold rounded-lg hover:text-gray-300 hover:border-gray-300 ">Anunciar Novo Jogo</button>
              </Link>
            </div>
            {isBoardGamesLoading ? (
              <div className="flex flex-col justify-center items-center p-4 bg-gray-100 border border-gray-200 rounded-lg mt-2">
                <>
                  <LoadingIndicator />
                  <span className="mt-2">Carregando Meus Jogos...</span>
                </>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 py-4">
                {boardGames.map((game) => (
                  <OwnerCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>

          {/* Minhas Ofertas */}
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-800 rounded-lg min-h-16">
              <h5 className="text-lg font-bold text-white">Minhas Ofertas e Curtidas</h5>
            </div>
            {isBoardGamesWithOffersLoading ? (
              <div className="flex flex-col justify-center items-center p-4 bg-gray-100 border border-gray-200 rounded-lg mt-2">
                <>
                  <LoadingIndicator />
                  <span className="mt-2">Carregando Minhas Ofertas...</span>
                </>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 py-4">
                {boardGamesWithOffers.map((game) => (
                  <OwnerOfertaCard key={game.id} game={game} onOfferDeleted={handleOfferDeleted} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
