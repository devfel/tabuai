// project/src/app/components/Card.js
import Link from "next/link";

function Card({ game }) {
  return (
    <Link href={`/product/${game.id}`} passHref>
      <div className="cursor-pointer max-w-sm min-w-96 md:min-w-10 bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 " style={{ width: "100%", height: "100%" }}>
        <div className="flex  justify-center items-center overflow-hidden rounded-t-lg p-2 bg-gray-200" style={{ height: "280px" }}>
          <img className="max-w-none h-full w-full object-contain" src={game.image} alt={game.name} />
        </div>
        <div className="p-5" style={{ height: "220px" }}>
          {/* Handle long game names with ellipsis */}
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {game.name}
          </h5>

          <p className="mb-4 text-2xl ">
            Valor: <span className="font-semibold">{`R$ ${game.price.toFixed(2)}`}</span>
          </p>
          <p className=" text-sm ">
            Idioma: <span className="font-semibold">{`${game.idioma}`}</span>
          </p>
          <p className="text-sm mb-2">
            Condições: <span className="font-semibold">{`${game.condition}`}</span>
          </p>

          <p className="text-lg ">
            Oferta Recebida: <span className="font-semibold">{game.maiorOferta ? `R$ ${game.maiorOferta.toFixed(2)}` : "Nenhuma"}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Card;
