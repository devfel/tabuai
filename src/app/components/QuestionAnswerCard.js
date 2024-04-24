// ../src/app/components/QuestionAnswerCard.js
"use client";
import Link from "next/link";

function QuestionAnswerCard({ question }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

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

  return (
    <div className="bg-gray-300 border-b-2 py-3 border-gray-100 px-2 rounded-md text-sm">
      <Link href={`/product/${question.attributes.board_game.data.id}`} passHref>
        <p className="text-sm  text-blue-950 text-center hover:text-gray-700 hover:underline transition-colors duration-200 ease-in-out">{question.attributes.board_game.data.attributes.Title}</p>
      </Link>
      <div className="text-[0.65rem] italic text-gray-500">
        <span className=""> {question.attributes.users_permissions_user && question.attributes.users_permissions_user?.data ? `${standardizeName(question.attributes.users_permissions_user.data.attributes.nomeUsuario)}` : "Usuário Anônimo"}</span>
        {`, em `}
        {formatDate(question.attributes.createdAt)}
      </div>
      <p className="text-gray-800 font-medium whitespace-pre-wrap">{question.attributes.Content}</p>
      {question.attributes.answer?.data ? (
        <div className="ml-6 mt-2 p-2 rounded-md bg-gray-200">
          <div className="text-[0.65rem] italic text-gray-500">
            <span className="">{question.attributes.answer && question.attributes.answer.data.attributes && question.attributes.answer.data.attributes.users_permissions_user && question.attributes.answer.data.attributes.users_permissions_user?.data ? `${standardizeName(question.attributes.answer.data.attributes.users_permissions_user.data.attributes.nomeUsuario)}` : "Usuário Anônimo"}</span>
            {`, em `}
            {formatDate(question.attributes.answer.data.attributes.createdAt)}
          </div>
          <p className="text-gray-800 font-normal whitespace-pre-wrap">{question.attributes.answer.data.attributes.Content}</p>
        </div>
      ) : (
        <div className="ml-6 mt-2 p-2 rounded-md bg-gray-200">
          <p className="text-red-500 text-xs font-medium whitespace-pre-wrap">Pergunta não respondida.</p>
        </div>
      )}
    </div>
  );
}

export default QuestionAnswerCard;
