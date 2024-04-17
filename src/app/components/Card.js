// project/src/app/components/Card.js
import Link from "next/link";
import LanguageFlag from "../components/ReactWorldFlags";

const conditionMappings = {
  "Quinem da loja": "(M)",
  "Só abri pá vê": "(NM)",
  "Joguei um tiquim": "(SP)",
  "Rodou um cado": "(MP)",
  Surradinho: "(HP)",
  Estrupiado: "(DM)",
};

function Card({ game }) {
  const [integerPart, decimalPart] = game.price.toFixed(2).split(".");
  const conditionDescription = conditionMappings[game.condition] || "(N/A)";

  return (
    <Link href={`/product/${game.id}`} passHref>
      <div className="flex flex-row sm:flex-col cursor-pointer bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-md hover:shadow-gray-950 dark:bg-gray-800 dark:border-gray-700 w-full group">
        <div className="w-5/12 sm:w-full sm:flex sm:justify-center items-center overflow-hidden rounded-t-lg p-2 bg-gray-300 h-48 sm:h-52">
          <img className="max-w-none h-full w-full object-contain" src={game.image} alt={game.name} />
        </div>
        <div className="p-4 w-7/12 sm:w-full" style={{ height: "170px" }}>
          {/* Handle long game names with ellipsis */}
          <h5 className="mb-2 text-base sm:text-xl font-medium tracking-tight text-gray-700 dark:text-white overflow-hidden group-hover:text-blue-400" style={{ display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {game.name}
          </h5>

          <div className="flex justify-between items-center mb-2">
            <p className="relative dark:text-gray-400">
              <span className="text-xs sm:text-xs font-normal">R$</span>
              <span className="text-base sm:text-2xl font-semibold">{integerPart}</span>
              <span className="text-xs sm:text-xs font-normal">.{decimalPart}</span>
            </p>
            <div>
              <LanguageFlag idioma={game.idioma} />
            </div>
          </div>

          <p className="text-xs sm:text-sm">
            <span className="font-semibold">{`${game.condition} ${conditionDescription}`}</span>
          </p>
          {game.maiorOferta > 0 && (
            <p className="text-xs sm:text-sm">
              Maior Oferta: <span className="font-semibold">R$ {game.maiorOferta.toFixed(2)}</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Card;
