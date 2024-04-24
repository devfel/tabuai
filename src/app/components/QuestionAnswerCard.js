// ../src/app/components/QuestionAnswerCard.js

function QuestionAnswerCard({ question }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  return (
    <div className="bg-gray-100 p-2 rounded-md text-sm">
      <div className="text-[0.65rem] italic text-gray-500">{formatDate(question.attributes.createdAt)}</div>
      <p className="text-gray-800 font-medium whitespace-pre-wrap">{question.attributes.Content}</p>
      {question.attributes.answer?.data && (
        <div className="ml-6 mt-2 border border-gray-200 p-2 rounded-md">
          <div className="text-[0.65rem] italic text-gray-500">{formatDate(question.attributes.answer.data.attributes.createdAt)}</div>
          <p className="text-gray-800 font-light whitespace-pre-wrap">{question.attributes.answer.data.attributes.Content}</p>
        </div>
      )}
    </div>
  );
}

export default QuestionAnswerCard;
