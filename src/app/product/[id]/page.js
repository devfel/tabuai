// project/src/app/product/[id]/page.js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LanguageFlag from "../../components/ReactWorldFlags";
import ToastOferta from "../../components/ToastOferta";
import ToastLogin from "../../components/ToastLogin";
import ToastSignin from "../../components/ToastSignin";
import { useAuth } from "../../../context/AuthContext";
import LoadingIndicator from "../../components/LoadingIndicator";

const ProductPage = ({ params }) => {
  const [game, setGame] = useState(null);
  const [isOfferButtonDisabled, setIsOfferButtonDisabled] = useState(false);
  const [isInterestButtonDisabled, setIsInterestButtonDisabled] = useState(false);
  const [offerValue, setOfferValue] = useState(0);
  const [submittedOfferValue, setSubmittedOfferValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [createQuestion, setCreateQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [createOffer, setCreateOffer] = useState(null);
  const [showToastOferta, setShowToastOferta] = useState(false);
  const [showToastInterest, setShowToastInterest] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { isLoggedIn } = useAuth();
  const [showToastLogin, setShowToastLogin] = useState(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [showToastQuestion, setShowToastQuestion] = useState(false);
  const [showToastAnswer, setShowToastAnswer] = useState(false);

  const moneyIconSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <circle cx="3" cy="6" r="2" fill="currentColor" />
      <circle cx="21" cy="6" r="2" fill="currentColor" />
      <circle cx="21" cy="18" r="2" fill="currentColor" />
      <circle cx="3" cy="18" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );

  const heartIconSvg = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-5 w-5">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  }

  React.useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);

      // Attempt to retrieve the token; if not available, proceed without it
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/board-games/${params.id}?populate=Images,owner,CoverImage,Ofertas,questions,answers.question`, { headers });
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const json = await res.json();

        // Process the cover image from the response
        const coverImageData = json.data.attributes.CoverImage.data;
        let coverImage = coverImageData
          ? {
              id: coverImageData.id,
              url: coverImageData.attributes.url,
              smallUrl: coverImageData.attributes.formats?.small?.url || coverImageData.attributes.url,
            }
          : null;

        // Process the other images from the response
        let gameImages =
          json.data.attributes.Images.data?.map((img) => ({
            id: img.id,
            url: img.attributes.url,
            smallUrl: img.attributes.formats?.small?.url || img.attributes.url,
          })) ?? [];

        // Prepend the cover image to the images array if it exists
        if (coverImage) {
          gameImages = [coverImage, ...gameImages];
        }

        if (!coverImage) {
          gameImages.push({
            id: "placeholder",
            url: "/placeholder02c.png",
            smallUrl: "/placeholder02c.png",
          });
        }

        // Process the questions and answers from the response
        const questionsWithAnswers = json.data.attributes.questions.data.map((questionData) => {
          const questionId = questionData.id;
          const questionAttributes = questionData.attributes;
          const answerData = json.data.attributes.answers.data.find((answer) => answer.attributes.question.data.id === questionId);

          return {
            id: questionId,
            content: questionAttributes.Content,
            createdAt: questionAttributes.createdAt,
            updatedAt: questionAttributes.updatedAt,
            publishedAt: questionAttributes.publishedAt,
            answer: answerData
              ? {
                  content: answerData.attributes.Content,
                  createdAt: answerData.attributes.createdAt,
                }
              : null,
          };
        });

        // Set the game state with the processed images
        setGame({
          id: json.data.id,
          statusActive: json.data.attributes.active,
          name: json.data.attributes.Title,
          description: json.data.attributes.Description,
          price: json.data.attributes.Value,
          condition: json.data.attributes.Condition,
          idioma: json.data.attributes.Idioma,
          maiorOferta: json.data.attributes.MaiorOferta,
          images: gameImages,
          questions: questionsWithAnswers,
          bgOwner: json.data.attributes.owner.data,
        });

        setOfferValue(json.data.attributes.Value); // Set the initial offer value to the game price

        // Conditional offer check based on user login status and check if user has 0.00 offer.
        if (token && json.data.attributes.Ofertas && json.data.attributes.Ofertas.data) {
          const userId = localStorage.getItem("userId");
          const hasMadeZeroOffer = json.data.attributes.Ofertas.data.some((offer) => offer.attributes.UsuarioDaOfertaID === parseInt(userId) && offer.attributes.ValorOferta === 0);
          setIsInterestButtonDisabled(hasMadeZeroOffer);
        } else {
          setIsInterestButtonDisabled(false); // Always enable the button if no user is logged in or no offers data
        }

        // Error Catching
      } catch (error) {
        console.error("Failed to load board game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [params.id, refreshPage]);

  // ----- Create a new OFFER -----
  useEffect(() => {
    const createOferta = async () => {
      if (!createOffer) {
        return;
      }

      const { valorOferta, boardGameId } = createOffer;
      setSubmittedOfferValue(valorOferta);
      const token = localStorage.getItem("token");

      // Only disable the offer button if the offer value is greater than zero
      if (valorOferta > 0) {
        setIsOfferButtonDisabled(true);
      }

      if (!token) {
        // User Not Logged In
        setShowToastLogin(true);
        return;
      }

      try {
        setIsCreatingOffer(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/ofertas?populate[board_game]=*`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              ValorOferta: valorOferta,
              board_game: boardGameId,
            },
          }),
        });

        if (!response.ok) {
          const message = `An error has occurred: ${response.status}`;
          throw new Error(message);
        }

        const result = await response.json();
        setIsCreatingOffer(false);
        //router.push("/dashboard"); // Redirect to dashboard after creating the offer
        if (valorOferta === 0) {
          setShowToastInterest(true); // Show interest toast for 0.00 offers
        } else {
          setShowToastOferta(true); // Show offer toast for non-zero offers
        }
        setRefreshPage(true);
        // Handle success (e.g., show a success message or update state)
      } catch (error) {
        console.error("Error creating offer:", error);
        setIsOfferButtonDisabled(false);
        setIsCreatingOffer(false);
        // Handle error (e.g., show an error message)
      }
    };

    createOferta();
  }, [createOffer]); // This effect runs when `createOffer` changes.

  // ----- Create a new QUESTION -----
  useEffect(() => {
    const submitQuestion = async () => {
      if (!createQuestion) {
        return;
      }

      setIsSubmittingQuestion(true);

      const { content, boardGameId } = createQuestion;
      const token = localStorage.getItem("token");
      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        : {
            "Content-Type": "application/json",
          };
      const body = JSON.stringify({ data: { Content: content, board_game: boardGameId, users_permissions_user: currentUser.id } });

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/questions`, {
          method: "POST",
          headers,
          body,
        });

        if (!res.ok) {
          throw new Error(`Failed to submit question: ${res.status}`);
        }

        // Reset the form field and refresh related data
        setShowToastQuestion(true);
        setNewQuestion("");
        setCreateQuestion(null); // Reset trigger state after successful submission
        setRefreshPage((prev) => !prev);
      } catch (error) {
        console.error("Failed to submit question:", error);
      } finally {
        setIsSubmittingQuestion(false); // Set loading false
      }
    };

    submitQuestion();
  }, [createQuestion]); // This effect runs when `createQuestion` changes.

  // ----- Create a new ANSWER -----
  const handleAnswerSubmit = async (questionId, answer) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const body = JSON.stringify({
      data: {
        Content: answer,
        question: questionId,
        board_game: game.id,
        users_permissions_user: currentUser.id,
      },
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/answers`, {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok) {
        throw new Error(`Failed to submit answer: ${res.status}`);
      }

      const answerData = await res.json();
      const newAnswer = {
        id: answerData.data.id,
        content: answerData.data.attributes.Content,
        createdAt: answerData.data.attributes.createdAt,
      };

      // Update the questions in the state with the new answer
      const updatedQuestions = game.questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, answer: newAnswer };
        }
        return q;
      });

      setGame({ ...game, questions: updatedQuestions });
      setAnswers({ ...answers, [questionId]: "" }); // Clear the answer textarea
      setShowToastAnswer(true); // Show a success toast
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  // ----- CHECK BOARDGAME ONWERSHIP -----
  // Fetch the current user data and compare with the game owner ID
  useEffect(() => {
    if (game && game.bgOwner) {
      const fetchCurrentUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("User is not logged in.");
          setIsOwner(false);
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error("Failed to fetch user details");

          const userData = await response.json();
          setCurrentUser(userData);

          // Compare the fetched user ID with the game owner ID

          setIsOwner(userData.id === game.bgOwner.id);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchCurrentUser();
    }
  }, [game]);

  // Button click handler that triggers the offer creation
  const handleOfferSubmit = () => {
    const valorOferta = offerValue;
    const boardGameId = game.id;

    // This will trigger the useEffect above
    setCreateOffer({ valorOferta, boardGameId });
  };

  // Button click handler that triggers the interest creation
  const handleInterestSubmit = () => {
    if (!isLoggedIn) {
      setShowToastLogin(true);
      return;
    }
    // Set up the offer object with the 0 value offer.
    setCreateOffer({
      valorOferta: 0,
      boardGameId: game.id,
    });
  };

  // Check if the data is still loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIndicator /> <span>Carregando Jogo...</span>
      </div>
    );
  }

  // After loading, check if the game data is available
  if (!game && !isLoading) {
    return (
      <div className="text-center py-10">
        <p>Jogo não encontrado!</p>
      </div>
    );
  }

  // Function to increase or decrease offers by 10 and 50
  const decreaseOffer5 = () => {
    setOfferValue((prevValue) => Math.max(prevValue - 5, 0)); // Prevent negative values, adjust as needed
  };
  const decreaseOffer50 = () => {
    setOfferValue((prevValue) => Math.max(prevValue - 50, 0)); // Prevent negative values, adjust as needed
  };
  const increaseOffer5 = () => {
    setOfferValue((prevValue) => prevValue + 5);
  };
  const increaseOffer50 = () => {
    setOfferValue((prevValue) => prevValue + 50);
  };

  const isSingleImage = game.images.length <= 1;
  const NextArrow = ({ onClick }) => (
    <div className="slick-custom-arrow slick-custom-next opacity-40 hover:opacity-60" onClick={onClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 4L16 12L8 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="slick-custom-arrow slick-custom-prev opacity-40 hover:opacity-60" onClick={onClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4L8 12L16 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
  const settings = {
    dots: !isSingleImage,
    infinite: !isSingleImage, // Prevent infinite loop for a single image
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: !isSingleImage, // Disable dragging for a single image
    nextArrow: isSingleImage ? null : <NextArrow />,
    prevArrow: isSingleImage ? null : <PrevArrow />,
    className: "w-[98%] h-[98%] ",
    initialSlide: selectedImageIndex,
  };

  // Inside your ProductPage component before the return statement
  const Modal = ({ isOpen, onClose, images }) => {
    if (!isOpen) return null;

    const handleModalContentClick = (e) => {
      e.stopPropagation();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
        <div className="bg-gray-200 w-[95vw] h-[95vh] flex justify-center items-center rounded-lg py-4 box-border" onClick={handleModalContentClick}>
          <button onClick={onClose} className="absolute top-2 right-2 text-lg font-bold cursor-pointer hover:bg-gray-950 hover:text-gray-200 hover:border-gray-200 w-10 h-10 bg-gray-800 border-2 border-white rounded-full text-white z-20">
            X
          </button>
          {/* Modal Carousel Slider */}
          <Slider {...settings}>
            {images.map((image, index) => (
              <div key={image.id} className="cursor-pointer ">
                <div className="flex justify-center items-center ">
                  <img className="object-contain max-h-[90vh]" src={`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL_IMAGES}${image.url}`} alt={`Slide ${index}`} />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4  sm:px-6 lg:max-w-7xl lg:px-8">
      <main>
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start py-4">
          {/* Image gallery */}
          <div className="lg:col-start-1 lg:col-span-1 shadow-lg bg-gray-100 rounded-lg">
            {/* Main Carousel Slider */}
            <Slider {...settings} className="lg:block">
              {game.images.map((image, index) => (
                <div
                  key={image.id}
                  onMouseDown={(e) => {
                    setDragStart({ x: e.clientX, y: e.clientY });
                    setIsDragging(false);
                  }}
                  onMouseMove={() => {
                    setIsDragging(true);
                  }}
                  onMouseUp={(e) => {
                    if (!isDragging) {
                      setSelectedImageIndex(index);
                      setSelectedImage(image);
                      setIsModalOpen(true);
                    } else {
                      const moveDistance = Math.sqrt(Math.pow(e.clientX - dragStart.x, 2) + Math.pow(e.clientY - dragStart.y, 2));
                      if (moveDistance < 10) {
                        setSelectedImageIndex(index);
                        setSelectedImage(image);
                        setIsModalOpen(true);
                      }
                    }
                    setIsDragging(false);
                  }}
                  className="cursor-pointer"
                >
                  {/* Aspect Ratio Box */}
                  <div className="relative" style={{ paddingBottom: "75%" }}>
                    <img src={`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL_IMAGES}${image.smallUrl}`} alt={`Slide ${index}`} className="absolute w-full h-full object-contain rounded-lg" />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          {/* Product info */}
          <div className="mt-8 px-4 sm:px-0 sm:mt-16 lg:mt-0 lg:col-start-2 lg:col-span-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200">{game.name}</h2>
            <p className="mt-5 text-3xl text-gray-900 dark:text-gray-200">{`R$ ${game.price.toFixed(2)}`}</p>
            <div className="mt-5 flex items-center text-[1.02rem] text-gray-700">
              <span className="mr-2">Idioma:</span> <span className="font-bold mr-2">{game.idioma || "Não especificado"}</span>
              <LanguageFlag idioma={game.idioma} />
            </div>
            <p className="text-[1.02rem] text-gray-700 mt-5">
              Condição: <span className="font-bold">{game.condition}</span>
              <Link href="/condicao-boardgames" className="cursor-pointer hover:bg-gray-950 ml-2 px-[10px] py-1 bg-gray-700 rounded-full text-white">
                ?
              </Link>
            </p>
            <p className="my-5 text-[1.02rem] text-gray-700">
              Melhor Oferta Recebida: <span className="font-bold">{game.maiorOferta ? `R$ ${game.maiorOferta.toFixed(2)}` : "Nenhuma oferta ainda"}</span>
            </p>

            <div className="mt-8">
              <div className="flex items-center gap-[2px]">
                <label className="flex items-center gap-1 whitespace-nowrap">Oferta: R$</label>
                <input type="text" value={`${offerValue.toFixed(2)}`} readOnly className="flex-grow min-w-24 px-4 py-2 border border-gray-300 bg-gray-200 rounded-md text-black font-bold text-center" />
                <div className="flex flex-col gap-[2px] ml-2">
                  <button onClick={increaseOffer5} className="px-1 py-0 bg-gray-700 text-white rounded-md hover:bg-gray-950 whitespace-nowrap">
                    +5
                  </button>
                  <button onClick={decreaseOffer5} className="px-1 py-0 border border-gray-700 text-gray-750 rounded-md hover:bg-gray-300 whitespace-nowrap">
                    -5
                  </button>
                </div>
                <div className="flex flex-col gap-[2px]">
                  <button onClick={increaseOffer50} className="px-1 py-0 bg-gray-700 text-white rounded-md hover:bg-gray-950 whitespace-nowrap">
                    +50
                  </button>
                  <button onClick={decreaseOffer50} className="px-1 py-0 border border-gray-700 text-gray-750 rounded-md hover:bg-gray-300 whitespace-nowrap">
                    -50
                  </button>
                </div>
              </div>
              {!game.statusActive && <p className=" mt-1 font-bold text-center text-2xl text-red-600"> DESATIVADO / VENDIDO </p>}

              <button
                className="mt-2 w-full bg-gray-800 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleOfferSubmit}
                disabled={isLoggedIn && (isOfferButtonDisabled || offerValue <= 0 || !game.statusActive || isCreatingOffer)} // disable the button if offerValue is 0 or negative
              >
                {isCreatingOffer ? (
                  <>
                    <LoadingIndicator /> <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    {moneyIconSvg}
                    Fazer Oferta
                  </>
                )}{" "}
              </button>

              <button
                className="mt-2 w-full bg-red-700 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                onClick={handleInterestSubmit}
                disabled={isInterestButtonDisabled || !game.statusActive || isCreatingOffer} // Disable the button if the user is not logged in or the game is not active.
              >
                {isCreatingOffer ? (
                  <>
                    <LoadingIndicator />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    {heartIconSvg}
                    {isInterestButtonDisabled ? "Já tô de Oio!" : "Tenho Interesse"}
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="mt-6 lg:col-start-1 lg:col-span-2">
            <div className="text-base text-gray-700 space-y-2">
              <p className="text-lg text-gray-700 font-bold">Informações Adicionais:</p>
              <p className="text-md text-gray-700 whitespace-pre-wrap">{game.description}</p>
            </div>
          </div>

          <div className="mt-6 lg:col-start-1 lg:col-span-2 bg-gray-300 p-2 rounded-md">
            <h3 className="text-lg font-semibold">Perguntas e Respostas:</h3>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Prepare the state for the useEffect trigger
                  setCreateQuestion({
                    content: newQuestion,
                    boardGameId: game.id,
                  });
                }}
              >
                <div>
                  <p className=" text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-bold">Importante:</span> Trate o colega com respeito, inclusive sobre os VALORES pedidos. <br></br>Excluindo conteúdos ofensivos, pode perguntar/comentar livremente, inclusive com links externos dos jogos ou dados pessoais (embora esse último seja desaconselhado pois ficarão públicos).
                  </p>
                </div>
                <textarea value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Digite sua pergunta aqui..." className="w-full rounded text-sm bg-white border-gray-300 p-2 mt-2" />
                <button
                  type="submit"
                  className="bg-gray-800 border border-transparent rounded-md py-1 px-2 flex items-center justify-center text-sm text-white hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!newQuestion.trim() || isSubmittingQuestion} // Disable the button if the input is empty or submitting question
                >
                  {isSubmittingQuestion ? <LoadingIndicator /> : "Enviar Pergunta"}
                </button>
              </form>
            </div>

            {game.questions && game.questions.length > 0 ? (
              <div className="space-y-4 mt-6">
                {game.questions.map((q) => (
                  <div key={q.id} className="bg-gray-100 p-2 rounded-md text-sm">
                    <div className="text-[0.65rem] italic text-gray-500">{formatDate(q.createdAt)}</div> {/* Timestamp for the question */}
                    <p className="text-gray-800 font-medium whitespace-pre-wrap">{q.content}</p>
                    {q.answer ? (
                      <div className="ml-6 mt-2 border border-gray-200 p-2 rounded-md">
                        <div className="text-[0.65rem] italic text-gray-500">{formatDate(q.answer.createdAt)}</div> {/* Timestamp for the answer */}
                        <p className="text-gray-800 font-light whitespace-pre-wrap">{q.answer.content}</p>
                      </div>
                    ) : (
                      isOwner && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAnswerSubmit(q.id, answers[q.id]);
                          }}
                        >
                          <textarea value={answers[q.id] || ""} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} className="ml-6 w-11/12 rounded text-sm placeholder-blue-400 bg-gray-200 border-gray-300 p-2 mt-2" placeholder="Digite sua resposta aqui..." />
                          <button type="submit" className="ml-6 bg-gray-800 border border-transparent rounded-md py-1 px-2 flex items-center justify-center text-sm text-white hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!answers[q.id]?.trim()}>
                            Enviar Resposta
                          </button>
                        </form>
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhuma pergunta foi feita ainda.</p>
            )}
          </div>
        </div>
        {/* Image Modal */}
        {selectedImage && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} images={game.images} initialSlide={selectedImageIndex}>
            {/* The images are passed to the Modal and handled inside it */}
          </Modal>
        )}
      </main>
      {showToastInterest && <ToastOferta message={`Agora cê pode vê o contato do Dono em "Minha Conta".`} onDismiss={() => setShowToastOferta(false)} />}
      {showToastOferta && <ToastOferta message={`Sua oferta de R$ ${submittedOfferValue.toFixed(2)} foi realizada com Sucesso!`} onDismiss={() => setShowToastOferta(false)} />}
      {showToastLogin && <ToastLogin message={`Você precisa estar logado para fazer uma oferta! É bem rapidinho.`} onDismiss={() => setShowToastLogin(false)} />}
      {showToastQuestion && <ToastSignin message={`Sua pergunta foi enviada com sucesso.`} onDismiss={() => setShowToastQuestion(false)} />}
      {showToastAnswer && <ToastSignin message={`Sua resposta foi enviada com sucesso.`} onDismiss={() => setShowToastAnswer(false)} />}
    </div>
  );
};

export default ProductPage;
