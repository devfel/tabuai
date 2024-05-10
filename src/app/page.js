// project/src/app/page.js
"use client";
import Card from "./components/Card";
import LoadingIndicator from "./components/LoadingIndicator";
import { useEffect, useState } from "react";
import Link from "next/link";
import municipalities from "./data/municipios.json";

export default function Home() {
  const [boardGames, setBoardGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const ITEMS_PER_PAGE = 24;
  const MAX_ITEMS_TOTAL = 900;
  const [sortOption, setSortOption] = useState("mostRecent");
  const [cityQuery, setCityQuery] = useState("");

  const [ludopediaGames, setLudopediaGames] = useState([]);
  const [isLudopediaGamesLoading, setIsLudopediaGamesLoading] = useState(true);
  const [displayedLudopediaGames, setDisplayedLudopediaGames] = useState([]);

  // ----- Fetch Tabuai Board Games -----
  useEffect(() => {
    async function fetchGames() {
      setIsLoading(true); // Start loading
      try {
        // Fetch all board games with images considering the max total of items in the constant (ignore pagination). Issue here, need to do proper pagination and filtering at same time.
        const res = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/board-games?populate=*&pagination[page]=1&pagination[pageSize]=${MAX_ITEMS_TOTAL}&sort=id:desc`);
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const json = await res.json();

        const games = json.data
          .map((item) => {
            const imageData = item.attributes.CoverImage.data;
            let image = "/placeholder02c.png";
            if (imageData) {
              image = `${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL_IMAGES}${imageData.attributes.url}`;
            }
            const estadoName = municipalities.states[item.attributes.owner.data.attributes.estado] || "-"; // Map state ID to state name
            const cidadeName = municipalities.cities.find((c) => c.id === parseInt(item.attributes.owner.data.attributes.cidade))?.name || "-"; // Find city by ID and return name

            return {
              id: item.id,
              name: item.attributes.Title,
              price: item.attributes.Value,
              condition: item.attributes.Condition,
              idioma: item.attributes.Idioma,
              statusActive: item.attributes.active,
              maiorOferta: item.attributes.MaiorOferta,
              image: image,
              cidade: cidadeName,
              estado: estadoName,
            };
          })
          .filter((game) => game.statusActive); // Filters out games where statusActive is false

        setBoardGames(games);
        setIsLoading(false); // Stop loading after processing data

        // Após receber e processar os jogos
        const totalCount = games.length;
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to load board games:", error);
        setIsLoading(false); // Ensure loading is stopped even if there's an error
      }
    }

    fetchGames();
  }, []);

  // ------ Fetch Ludopedia games from My Database. ------
  useEffect(() => {
    const fetchLudopediaGames = async () => {
      setIsLudopediaGamesLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/external-bgs?pagination[page]=1&pagination[pageSize]=9999`);
        if (!response.ok) throw new Error("Failed to fetch Ludopedia games");
        const { data } = await response.json();
        // console.log("Fetching Ludopedia games..."); //DEBUG
        // console.log(data); //DEBUG
        setLudopediaGames(data);
      } catch (error) {
        console.error("Error fetching Ludopedia games:", error);
      } finally {
        setIsLudopediaGamesLoading(false);
      }
    };

    fetchLudopediaGames();
  }, []);

  function goToNextPage() {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  }

  function goToPreviousPage() {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }

  function goToPage(page) {
    setCurrentPage(page);
  }

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

  useEffect(() => {
    // Game filtering
    const lowerCaseQuery = searchQuery.toLowerCase();
    const lowerCaseCityQuery = cityQuery.toLowerCase();
    const filtered = boardGames.filter((game) => game.name.toLowerCase().includes(lowerCaseQuery) && game.cidade.toLowerCase().includes(lowerCaseCityQuery));

    function sortGames(games) {
      return [...games].sort((a, b) => {
        switch (sortOption) {
          case "priceAsc":
            return a.price - b.price;
          case "priceDesc":
            return b.price - a.price;
          case "nameAsc":
            return a.name.localeCompare(b.name);
          case "nameDesc":
            return b.name.localeCompare(a.name);

          // IDs are assigned in order of addition (most recent first)
          case "oldFirst":
            return a.id - b.id;
          default:
            return b.id - a.id;
        }
      });
    }

    // Function to sort Ludopedia games based on specific attributes
    const sortLudopediaGames = (games) => {
      return [...games].sort((a, b) => {
        const gameA = a.attributes;
        const gameB = b.attributes;

        const normalizePrice = (price) => {
          return parseFloat(price.replace("R$ ", "").replace(".", "").replace(",", "."));
        };

        switch (sortOption) {
          case "priceAsc":
            return normalizePrice(gameA.precoludopedia) - normalizePrice(gameB.precoludopedia);
          case "priceDesc":
            return normalizePrice(gameB.precoludopedia) - normalizePrice(gameA.precoludopedia);
          case "nameAsc":
            return gameA.bgnomeludopedia.localeCompare(gameB.bgnomeludopedia);
          case "nameDesc":
            return gameB.bgnomeludopedia.localeCompare(gameA.bgnomeludopedia);
          case "oldFirst":
            return parseInt(a.id) - parseInt(b.id);
          default:
            return parseInt(b.id) - parseInt(a.id);
        }
      });
    };

    // ------ BLOCK RELATED TO GAMES - FILTERING, SORTING AND PAGINATION
    const sortedGames = sortGames(filtered);
    const totalFiltered = sortedGames.length;
    setTotalPages(Math.ceil(totalFiltered / ITEMS_PER_PAGE));
    // Apply pagination to the filtered games
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedGames = sortedGames.slice(startIndex, endIndex);
    setFilteredGames(paginatedGames); // update again with the new paginated version
    // ------

    // ------ BLOCK RELATED TO LUDOPEDIA GAMES - FILTERING AND SORTING
    // Filter and sort Ludopedia games based on the same input fields
    const filteredLudopediaGames = ludopediaGames.filter((game) => game.attributes.bgnomeludopedia.toLowerCase().includes(lowerCaseQuery) && game.attributes.cidadeludopedia.toLowerCase().includes(lowerCaseCityQuery));
    const sortedLudopediaGames = sortLudopediaGames(filteredLudopediaGames);
    // Set the sorted games without pagination
    setDisplayedLudopediaGames(sortedLudopediaGames);
    // ------
  }, [searchQuery, cityQuery, currentPage, boardGames, sortOption]); //include all three states dependencies

  useEffect(() => {
    // Reset currentPage to 1 whenever searchQuery changes
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-6 sm:max-w-full md:max-w-full lg:max-w-7xl lg:px-8">
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 md:justify-items-stretch lg:justify-items-stretch justify-items-center items-center">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input className="text-black pl-10 pr-4 py-2 border border-gray-300 w-full md:w-auto max-w-80 rounded-lg shadow" placeholder="Nome do Jogo..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input className="text-black pl-10 pr-4 py-2 border border-gray-300 w-full md:w-auto max-w-80 rounded-lg shadow" placeholder="Cidade..." value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Ordenar:</label>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 text-gray-600 py-2 px-4 pr-8 rounded-lg shadow w-full md:w-56" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="mostRecent">Mais Recente Primeiro</option>
                <option value="oldFirst">Mais Antigo Primeiro</option>
                <option value="priceDesc">Preço (Maior Primeiro)</option>
                <option value="priceAsc">Preço (Menor Primeiro)</option>
                <option value="nameAsc">Nome (A-Z)</option>
                <option value="nameDesc">Nome (Z-A)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.71 7.29a1 1 0 011.42 0L10 10.17l2.86-2.88a1 1 0 111.41 1.41l-4 4a1 1 0 01-1.41 0l-4-4a1 1 0 010-1.42z" />
                </svg>
              </div>
            </div>
          </div>

          <Link href="/about" className="w-auto text-gray-800 px-2 hover:underline hover:text-gray-950 text-sm dark:text-gray-300">
            Não conhece esse trem? Uai, clica aqui sô!
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingIndicator /> Carregando Jogos...
          </div>
        ) : (
          <div className="w-full min-w-64 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 sm:justify-items-stretch md:justify-items-stretch lg:justify-items-stretch justify-items-stretch">
            {filteredGames.map((game) => (
              <Card key={game.id} game={game} />
            ))}
          </div>
        )}
        <div className="pagination-controls">
          <div className="flex items-center justify-center gap-1 mt-8 ">
            {/* Previous Button */}
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className={`px-2 py-2 text-sm font-semibold rounded-md ${currentPage === 1 ? "cursor-not-allowed bg-gray-400 text-gray-800" : "bg-gray-700 hover:bg-gray-950 text-white"}`}>
              Previous
            </button>

            {/* First Page */}
            {currentPage > 3 && (
              <button onClick={() => goToPage(1)} className="px-2 py-1 text-sm font-semibold rounded-md bg-gray-700 hover:bg-gray-950 text-white">
                1
              </button>
            )}

            {currentPage > 4 && <span className="px-0 py-1 text-sm">...</span>}

            {/* Dynamic Page Numbers */}
            {[...Array(totalPages).keys()]
              .filter((page) => page >= currentPage - 3 && page <= currentPage + 1)
              .map((n) => (
                <button key={n + 1} onClick={() => goToPage(n + 1)} disabled={currentPage === n + 1} className={`px-2 py-1 text-sm font-semibold rounded-md ${currentPage === n + 1 ? "cursor-not-allowed bg-gray-400 text-gray-800" : "bg-gray-700 hover:bg-gray-950 text-white"}`}>
                  {n + 1}
                </button>
              ))}

            {currentPage < totalPages - 3 && <span className="px-0 py-1 text-sm">...</span>}

            {/* Last Page */}
            {currentPage < totalPages - 2 && (
              <button onClick={() => goToPage(totalPages)} className="px-2 py-1 text-sm font-semibold rounded-md bg-gray-700 hover:bg-gray-950 text-white">
                {totalPages}
              </button>
            )}

            {/* Next Button */}
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className={`px-2 py-2 text-sm font-semibold rounded-md ${currentPage === totalPages ? "cursor-not-allowed bg-gray-400 text-gray-800" : "bg-gray-700 hover:bg-gray-950 text-white"}`}>
              Next
            </button>
          </div>
        </div>

        {/* Ludopedia Games Section */}
        <div className="my-8">
          <div className="flex items-center justify-between px-4 py-2 mt-2 bg-gray-800 border border-gray-800 rounded-lg min-h-16">
            <h5 className="text-lg font-bold text-white">Anúncios na Ludopedia dos nossos usuários:</h5>
          </div>
          <div className="flex items-center justify-between px-4 py-2 mt-2 bg-gray-300 border border-gray-800 rounded-lg min-h-16">
            <p className="text-xs md:text-sm font-base text-gray-950">
              Todos os anúncios e links nesta seção foram obtidos da Ludopedia. O Tabuai não possui vínculo com a Ludopedia, nem assume responsabilidade pelos produtos anunciados. <br></br>Destacamos que não aprovamos negociações externas à Ludopedia dos produtos abaixo, reconhecemos e respeitamos a abrangência, popularidade e qualidade do serviço.
            </p>
          </div>

          <div className="mt-2 flex items-center justify-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Ordenar: </label>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 text-gray-600 py-2 px-4 pr-8 rounded-lg shadow w-full md:w-56" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="mostRecent">Mais Recente Primeiro</option>
                <option value="oldFirst">Mais Antigo Primeiro</option>
                <option value="priceDesc">Preço (Maior Primeiro)</option>
                <option value="priceAsc">Preço (Menor Primeiro)</option>
                <option value="nameAsc">Nome (A-Z)</option>
                <option value="nameDesc">Nome (Z-A)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.71 7.29a1 1 0 011.42 0L10 10.17l2.86-2.88a1 1 0 111.41 1.41l-4 4a1 1 0 01-1.41 0l-4-4a1 1 0 010-1.42z" />
                </svg>
              </div>
            </div>
          </div>
          {isLudopediaGamesLoading ? (
            <div className="flex flex-col justify-center items-center p-4 bg-gray-100 border border-gray-200 rounded-lg mt-2">
              <LoadingIndicator />
              <span className="mt-2">Carregando Jogos da Ludopedia...</span>
            </div>
          ) : displayedLudopediaGames.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-400 text-white">
                  <tr>
                    <th className="px-1 py-2 text-xs md:text-sm text-left">V/L</th>

                    <th className="px-1 py-2 text-xs md:text-sm text-left">Nome / Link Ludopedia</th>
                    <th className="px-1 py-2 text-xs md:text-sm text-left">Preço/Lance</th>
                    <th className="px-1 py-2 text-xs md:text-sm text-left hidden lg:table-cell">Condição</th>
                    <th className="px-1 py-2 text-xs md:text-sm text-left hidden md:table-cell">UF</th>
                    <th className="px-1 py-2 text-xs md:text-sm text-left hidden md:table-cell">Cidade</th>
                    <th className="px-1 py-2 text-xs md:text-sm text-left">Usuário</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {displayedLudopediaGames.slice(0, ITEMS_PER_PAGE).map((bg) => (
                    <tr key={bg.id}>
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
            // <div className="text-center py-4 text-gray-600">Em Construção... </div>
            <div className="text-center py-4 text-gray-600">Nenhum Jogo dos nosso usuários com o filtro buscado foi encontrado na Ludopedia... :( </div>
          )}
        </div>
      </main>
    </div>
  );
}

// yarn develop (RODAR BACKEND)
// npm run dev (RODAR FRONTEND)
// Images Cloudinary (GITHUB LOGIN)

// TODO:

// Colocar em Produção.

// Arrumar Dashboard ordem dos jogos Cards (Both). Ordem por Active/Desactive, depois Ordem por ID do jogo.
// ADD Loading page compomnente in all pages. (Loading spinner)
// Limitar Quantidade de Jogos ativos por usuário (Tanto no Dashboard quanto no Create Jogos).

// Mostrar Dono do Jogo na página de [id] do jogo (Deixar Comentado)
// Criar Comentários em Jogos (Quem sabe)

// EMAIL
// Pagina e Logica de reiniciar senha, etc.
// email autenticar usuario
// email p/ dono qdo jogo receber oferta

// Arrumar imagem no Modal do caurosel para aparecer no meio e do tamanho Original da imagem.
// Arrumar como as imagens estão sendo salvas no banco para não ocupar espaco desnecessario com certas versoes das imagens.

// Arrumar para salvar a quanto tempo o anuncio do jogo foi desativado para excluir da exibição em XX dias. (nao apagar do banco)
// Arrumar como está sendo carregado jogos sem Paginaçao, necessita refazer paginacao e filtro juntos.
// ARRUMAR TODAS AS BUSCAS COM * que pega todos os campos. Pois vai puxar tambem alem de todas as imagens, todos as ofertas para um jogo, o que não é ideal.

// COVILCON 2024
// Arrumar Footer para referenciar o CovilCon 2024???
// Inclurir Referencia CovilCon Header.

//// Arrumar page[id] descricao, talvez possibilitar rich text com negrito e italico, etc.

// -- IMPORTANTE --
// Filtrar Jogos que foram desativados de aparecerem na página principal.

// -- MAIS RECENTE:
// Cadastrar Produto Sem Imagem.

// Melhorar Cards (Aparecer 16 por página e diminuir no celular)
// Lista de Jogos (Ao inves de Cards) (Salvar opção no localstorage)
// Sorting de Jogo (Mais Recente, Alfabeto, Preço)

// Nos jogos, melhorar Carrossel.

//Alterar Idioma na pagina principal para Fotinhas de Bandeiras.
// ARRUMAR ORDENAÇÃO DOS JOGOS NO DASHBOARD (Só está contando a ordenação dos jogos na pagina, é precisa contar todo ARRAY "e voltar para a pagina 1 talvez?".)

// -- MAIS RECENTE:

// Quando curti um jogo, o botão de curtir nao esta ficando desabilitado, e nem recarrega pagina, pertindo multiplas curtidas.
// Dono do jogo deve ser Padronizado tambem nos cards de owner e owneroferta.
// outro tipo de padrao deve ser aplicado no Minhas Informacoes para o nome do usuario (Sem tirar nomes do meio)
// Fazer Email para quando oferta for cubrida, mensagem for respondida, ou mensagem for enviada em jogo do dono.
// Fazer Logot (Sumir com Minha conta) quando usuario for desconectado, verificar com alguma frequencia.

// Usuario Anonimo na resposta de pergunta de alguns jogos.
// Borda do Minhas Perguntas esta arredonda mas é so border botton e deve ser removido o arredondado.

// // MAIS TODOS RECENTES:
// [V] - Testar com usuarioLudopedia sem jogos.
// [V] - Testar com usuarioLudopedia inválido.
// [V] - Testar com usuarioLudopedia já cadastrado no site Tabuai.
// [V] - Testar com usuarioLudopedia com muitos jogos (varias paginas ludopedia).
// [V] - Atualizar a cada 24 horas (Na verdade de preferencia durante madrugada e aleatorio para cada usuario) (Remover as informaçoes do usuario, e adicionar novamente com novas informaçoes pegadas)

// [V] - Editar Informacoes no Site Tabuai (email, whatsapp, cidade, estado, usuarioLudopedia)
// [V] - Remover informaçoes da criacao de usuario (Para uma melhor experiencia sua e dos outros usuarios recomendados completar seus dados).
// [V] - Ao editar chamar novamente crawler para atualizar dados dos jogos na ludopedia.
// [V] - Dashboard, exibir jogos puxados da ludopedia.
// [V] - Dashboard, atualizar parte de Meus Jogos da Ludopedia depois de Atualizar Informações.
// [V] - Página Principal, ver como vou exibir os jogos da ludopedia com as buscas.
// [V] - Adicionar Nome do Owner na pagina [id] (COM FORMATACAO DE NOME COMPLETO STANDARDIZATION)
// [V] - Dashboard (Error updating user profile: Error: Failed to update user profile) Quando usuario já esta cadastrado no tabuai.

// - COFERIR DARKMODE (Dashboard e Pagina Principal apos alteracoes).

// ---- ERROS A SEREM TRATADOS: -----
// - No dashboard, ao cadastrar usuario na ludapedia, e tentar remover depois o sistema nao permite. (coloquei no codigo para nao mandar se vier em branco pois estava dando erro quando tinha dois em branco nos dados). (Provavelmente o mesmo acontece com Whatsapp)
// - No dashboard, Meus Jogos Informar que nao tem jogos cadastrados e que nao tem curtidas/ofertas ainda.
// - Na Pagina Inicial, ao fazer uma busca sem resultados informar que nao foram encontrados jogos no Tabuai.
// - Na pagina Inicial (arquivo de crawlerLudopedia) arrumar o href dos links para ser href=tabuai.

// - FAZER TODA LOGICA DE CIDADE(Buscar por cidade/estado/distancia filtro na pagina inicial) Mostrar cidade/estado nos cards e na pagina de ID.

// - Formatar nos cards os nomes dos usuarios (ownerCard e OwnerOfertaCard).
// - IMPORTANTE!!! Adicionar Quem está com a Maior Oferta do Produto (na pagina [id]).
// - IMPORTANTE!!! Adicionar Aviso se o usuario tiver oferta em produto e nao for a maior dele (na pagina de Dashboard OwnerOfertaCard).
