// project/src/app/components/Card.js
import Link from "next/link";

function Card({ game }) {
  return (
    <Link href={`/product/${game.id}`} passHref>
      <div className="flex flex-row sm:flex-col cursor-pointer bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl hover:shadow-gray-950 dark:bg-gray-800 dark:border-gray-700 w-full">
        <div className="w-5/12 sm:w-full sm:flex sm:justify-center items-center overflow-hidden rounded-t-lg p-2 bg-gray-300 h-48 sm:h-52">
          <img className="max-w-none h-full w-full object-contain" src={game.image} alt={game.name} />
        </div>
        <div className="p-4 w-7/12 sm:w-full" style={{ height: "190px" }}>
          {/* Handle long game names with ellipsis */}
          <h5 className="mb-2 sm:text-xl text-base font-bold tracking-tight text-gray-800 dark:text-white overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {game.name}
          </h5>

          <p className="mb-2 sm:text-xl text-base">
            <span className="font-semibold dark:text-gray-400">{`R$ ${game.price.toFixed(2)}`}</span>
          </p>
          <p className=" sm:text-sm text-xs">
            Idioma: <span className="font-semibold">{`${game.idioma}`}</span>
          </p>
          <p className="sm:text-sm text-xs">
            Condições: <span className="font-semibold">{`${game.condition}`}</span>
          </p>
          <p className="sm:text-sm text-xs">
            Oferta Recebida: <span className="font-semibold">{game.maiorOferta ? `R$ ${game.maiorOferta.toFixed(2)}` : "-"}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Card;
