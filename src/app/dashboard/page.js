// ../src/app/components/dashboard/page.js
"use client";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import OwnerCard from "../components/OwnerCard";
import OwnerOfertaCard from "../components/OwnerOfertaCard";
import LoadingIndicator from "../components/LoadingIndicator";
import QuestionAnswerCard from "../components/QuestionAnswerCard";
import municipiosData from "../data/municipios.json";

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

  const [userBgLudopedia, setUserBgLudopedia] = useState([]);
  const [isUserBgLudopediaLoading, setIsUserBgLudopediaLoading] = useState(true);

  const [updateUserError, setUpdateUserError] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(false);

  const [updateUserErrorMessage, setUpdateUserErrorMessage] = useState("");
  const [refetchLudopediaGames, setRefetchLudopediaGames] = useState(false);

  // ====== Functions and Variables needed to UPDATE USER ======
  const [whatsApp, setWhatsApp] = useState("");
  const [usuarioLudopedia, setUsuarioLudopedia] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [cities, setCities] = useState([]);
  const [isUpdatingUserProfile, setIsUpdatingUserProfile] = useState(false);

  useEffect(() => {
    if (estado) {
      const filteredCities = municipiosData.cities.filter((city) => city.state_id.toString() === estado);
      setCities(filteredCities);
    }
  }, [estado]);

  const handleEstadoChange = (e) => {
    setEstado(e.target.value);
    setCidade(""); // Reset city when state changes
  };

  const handleCidadeChange = (e) => {
    setCidade(e.target.value);
  };

  const handleUsuarioLudopediaChange = (e) => {
    setUsuarioLudopedia(e.target.value);
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

  // Effect to update WhatsApp when userDataState changes
  useEffect(() => {
    if (userDataState && userDataState.whatsapp) {
      setWhatsApp(userDataState.whatsapp);
    }
    if (userDataState && userDataState.usuarioLudopedia) {
      setUsuarioLudopedia(userDataState.usuarioLudopedia);
    }
    if (userDataState && userDataState.estado) {
      setEstado(userDataState.estado);
    }
    if (userDataState && userDataState.cidade) {
      setCidade(userDataState.cidade);
    }
  }, [userDataState]);

  const handleWhatsAppChange = (e) => {
    const formattedNumber = formatWhatsAppNumber(e.target.value);
    setWhatsApp(formattedNumber);
  };

  // Function to update user profile
  const handleUpdateProfile = async () => {
    setIsUpdatingUserProfile(true);
    setUpdateUserError(false);
    setUpdateUserSuccess(false);
    const payload = {
      estado,
      cidade,
    };

    if (usuarioLudopedia.trim()) {
      payload.usuarioLudopedia = usuarioLudopedia;
    }

    if (whatsApp.trim()) {
      payload.whatsapp = whatsApp;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/users/${userDataState.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }
      // console.log("Profile updated successfully:", data); // DEBUG
      setUpdateUserSuccess(true);
      setRefetchLudopediaGames((prev) => !prev);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setUpdateUserError(true);
      setUpdateUserErrorMessage("Ocorreu um erro ao atualizar seus dados, confira as informações, se o problema persistir favor entrar em contato com nossa equipe: tabuai.sac@gmail.com");
      // Implement any error handling logic here
    } finally {
      setIsUpdatingUserProfile(false);
    }
  };
  // ===============
  // ===============

  // Function to Format the User Name (Nome Sobrenome)
  function standardizeName(fullName) {
    if (!fullName) return "Usuário Anônimo";

    const names = fullName.trim().split(/\s+/); // Split by one or more spaces
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase(); // Handle single name case
    }

    const firstName = names[0];
    const lastName = names[names.length - 1];

    // Capitalize first and last name ONLY
    return [firstName, lastName].map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(" ");
  }

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
        // console.log("User data:", userData); // DEBUG
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

  // ----- Fetch Logged-in User BOARD GAMES FROM LUDOPEDIA -----
  useEffect(() => {
    const fetchUserBoardGames = async () => {
      if (!userDataState || !userDataState.id) return;
      const userToken = localStorage.getItem("token");

      setIsUserBgLudopediaLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/external-bgs?filters[donocodid][$eq]=${userDataState.id}&pagination[page]=1&pagination[pageSize]=40`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // console.log("response", response); // DEBUG
        // console.log("IM HERE"); // DEBUG
        const data = await response.json();
        setUserBgLudopedia(data.data);
      } catch (error) {
        console.error("Failed to fetch board games:", error);
      } finally {
        setIsUserBgLudopediaLoading(false);
      }
    };

    if (userDataState) {
      fetchUserBoardGames();
    }
  }, [userDataState, refetchLudopediaGames]);

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
          <div className="p-4 my-2 text-xs md:text-sm bg-gray-100 border border-gray-200 rounded-lg dark:text-gray-700">
            <p className="">Usuário: {userDataState ? userDataState.nomeUsuario : "Loading..."}</p>
            <p className="mb-3">Email: {userDataState ? userDataState.email : ""}</p>

            {(!usuarioLudopedia || !cidade || !estado || updateUserError || updateUserSuccess) && (
              <div className="bg-gray-300 p-2 rounded-md">
                {!usuarioLudopedia && (
                  <p className="text-blue-600 ">
                    - Atualize o campo <span className="font-bold">Usuário na Ludopedia</span> para uma experiência mais completa.
                  </p>
                )}
                {!estado && !cidade && <p className="text-blue-600 font-bold"> - Selecione seu Estado e Cidade.</p>}
                {!cidade && estado && <p className="text-blue-600 font-bold">- Selecione sua Cidade.</p>}
                {updateUserError && <p className="mt-1 mb-1 text-red-600 font-semibold">{updateUserErrorMessage}</p>}
                {updateUserSuccess && <p className="mt-1 mb-1 text-green-600 font-semibold">Informações atualizadas com sucesso.</p>}
              </div>
            )}

            <div>
              <label htmlFor="whatsapp">WhatsApp (Opcional):</label>
              <input id="whatsapp" type="text" value={whatsApp} onChange={handleWhatsAppChange} className="ml-2 mt-3 rounded border-2 border-gray-300" />
            </div>
            <div>
              <label htmlFor="usuarioLudopedia">Usuário na Ludopedia:</label>
              <input id="usuarioLudopedia" type="text" value={usuarioLudopedia} onChange={handleUsuarioLudopediaChange} className="ml-2 mt-1 rounded border-2 border-gray-300" />
            </div>
            <div>
              <label htmlFor="estado">Estado:</label>
              <select id="estado" value={estado} onChange={handleEstadoChange} className="ml-2 mt-1 rounded border-2 border-gray-300">
                <option value="">Selecione um Estado</option>
                {Object.entries(municipiosData.states).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cidade">Cidade:</label>
              <select id="cidade" value={cidade} onChange={handleCidadeChange} className="ml-2 mt-1 rounded border-2 border-gray-300">
                <option value="">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleUpdateProfile} disabled={isUpdatingUserProfile} className="m-2 p-2 text-white bg-gray-800 border-2 text-center font-bold rounded-lg hover:text-gray-300 hover:border-gray-300 disabled:bg-gray-400 ">
              {isUpdatingUserProfile ? "Atualizando..." : "Atualizar Informações"}
            </button>
            <div>
              <p className="block mb-2 text-xs text-gray-700 dark:text-gray-300">
                <span className="font-bold">Importante:</span> Seus dados, como nome, endereço, email e número de whatsapp cadastrados serão compartilhados com outros usuários. Ao fornecer suas informações e utilizar o sistema você concorda com essas condições.
              </p>
            </div>

            <p></p>
            <button className="ml-2 text-red-400 border-red-400 cursor-pointer rounded-lg hover:text-red-600 hover:border-red-600 " onClick={handleLogout}>
              Deslogar
            </button>
          </div>
        )}

        {/* Layout de Grid para Minhas Perguntas */}
        <div className="my-8">
          <div className="flex items-center justify-between px-4 py-2 mt-2 bg-gray-800 border border-gray-800 rounded-lg min-h-16">
            <h5 className="text-lg font-bold text-white">Minhas Últimas Perguntas</h5>
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
            <div className="mt-2 bg-gray-300 py-2 px-4 text-sm rounded-md dark:text-gray-600">
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

        {/* Meus Jogos na Ludopedia */}
        <div className="my-8">
          <div className="flex items-center justify-between px-4 py-2 mt-2 bg-gray-800 border border-gray-800 rounded-lg min-h-16">
            <h5 className="text-lg font-bold text-white">Meus Jogos na Ludopedia</h5>
          </div>
          {isUserBgLudopediaLoading ? (
            <div className="flex flex-col justify-center items-center p-4 bg-gray-100 border border-gray-200 rounded-lg mt-2">
              <>
                <LoadingIndicator />
                <span className="mt-2">Carregando Jogos da Ludopedia...</span>
              </>
            </div>
          ) : userBgLudopedia.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-400 text-white">
                  <tr>
                    <th className="px-1 py-2 text-xs md:text-sm text-left">V/L</th>

                    <th className="px-1 py-2 text-xs lg:text-sm text-left">Nome / Link Ludopedia</th>
                    <th className="px-1 py-2 text-xs lg:text-sm text-left">Preço/Lance</th>
                    <th className="px-1 py-2 text-xs lg:text-sm text-left hidden lg:table-cell">Condição</th>
                    <th className="px-1 py-2 text-xs lg:text-sm text-left hidden md:table-cell">UF</th>
                    <th className="px-1 py-2 text-xs lg:text-sm text-left hidden md:table-cell">Cidade</th>
                    <th className="px-1 py-2 text-xs lg:text-sm text-left">Usuário</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {userBgLudopedia.map((bg) => (
                    <tr key={bg.id} className="border">
                      <td className="px-1 py-1 text-xs md:text-sm" style={{ backgroundColor: bg.attributes.vendaouleilao === "Leilão" ? "#D2FAC6" : "#F2F7F6" }}>
                        {bg.attributes.vendaouleilao}
                      </td>
                      <td className="px-1 py-1 text-xs md:text-sm">
                        <a href={bg.attributes.linkprodutoludopedia} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-gray-950 hover:underline">
                          {bg.attributes.bgnomeludopedia}
                        </a>
                      </td>
                      <td className="px-1 py-1 text-xs md:text-sm">{bg.attributes.precoludopedia}</td>
                      <td className="px-1 py-1 text-xs md:text-sm hidden lg:table-cell">{bg.attributes.condicaoludopedia}</td>
                      <td className="px-1 py-1 text-xs md:text-sm hidden md:table-cell">{bg.attributes.federacaoludopedia}</td>
                      <td className="px-1 py-1 text-xs md:text-sm hidden md:table-cell">{bg.attributes.cidadeludopedia}</td>
                      <td className="px-1 py-1 text-xs md:text-sm">{standardizeName(bg.attributes.dononome)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-2 bg-gray-300 py-2 px-4 text-sm rounded-md dark:text-gray-600">
              <p>
                Nenhum jogo carregado da Ludopedia. Certifique-se de que seu <span className="font-semibold">Usuário na Ludopedia</span> acima esteja cadastrado corretamente. Atualizamos os jogos uma vez a cada 24 horas para evitar sobrecarga na Ludopedia.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
