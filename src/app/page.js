// project/src/app/page.js
"use client";
import Card from "./components/Card";
import LoadingIndicator from "./components/LoadingIndicator";
import { useEffect, useState } from "react";
import Link from "next/link";

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
            return {
              id: item.id,
              name: item.attributes.Title,
              price: item.attributes.Value,
              condition: item.attributes.Condition,
              idioma: item.attributes.Idioma,
              statusActive: item.attributes.active,
              maiorOferta: item.attributes.MaiorOferta,
              image: image,
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

  function goToNextPage() {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  }

  function goToPreviousPage() {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }

  function goToPage(page) {
    setCurrentPage(page);
  }

  useEffect(() => {
    // Game filtering
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = boardGames.filter((game) => game.name.toLowerCase().includes(lowerCaseQuery));

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

    const sortedGames = sortGames(filtered);

    const totalFiltered = sortedGames.length;
    setTotalPages(Math.ceil(totalFiltered / ITEMS_PER_PAGE));

    // Apply pagination to the filtered games
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedGames = sortedGames.slice(startIndex, endIndex);

    setFilteredGames(paginatedGames); // update again with the new paginated version
  }, [searchQuery, currentPage, boardGames, sortOption]); //include all three states dependencies

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
            <input className="text-black pl-10 pr-4 py-2 border border-gray-300 w-full md:w-auto max-w-80 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Buscar jogo..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">Ordenar:</label>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 text-gray-600 py-2 px-4 pr-8 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-56" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
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
