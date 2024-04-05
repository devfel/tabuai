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
import { useAuth } from "../../../context/AuthContext";

const ProductPage = ({ params }) => {
  const [game, setGame] = useState(null);
  const [isOfferButtonDisabled, setIsOfferButtonDisabled] = useState(false);
  const [offerValue, setOfferValue] = useState(0);
  const [submittedOfferValue, setSubmittedOfferValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [createOffer, setCreateOffer] = useState(null);
  const [showToastOferta, setShowToastOferta] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { isLoggedIn } = useAuth();
  const [showToastLogin, setShowToastLogin] = useState(false);

  React.useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/board-games/${params.id}?populate=*`);
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
        });

        setOfferValue(json.data.attributes.Value); // Set the initial offer value to the game price
      } catch (error) {
        console.error("Failed to load board game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [params.id, refreshPage]);

  useEffect(() => {
    const createOferta = async () => {
      setIsOfferButtonDisabled(true);
      if (!createOffer) {
        // Habilita o botão se createOffer for nulo
        setIsOfferButtonDisabled(false);
        return;
      }

      const { valorOferta, boardGameId } = createOffer;
      setSubmittedOfferValue(valorOferta);
      const token = localStorage.getItem("token");

      if (!token) {
        // User Not Logged In
        setShowToastLogin(true);
        return;
      }

      try {
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
        //router.push("/dashboard"); // Redirect to dashboard after creating the offer
        setShowToastOferta(true);
        setRefreshPage(true);
        // Handle success (e.g., show a success message or update state)
      } catch (error) {
        console.error("Error creating offer:", error);
        setIsOfferButtonDisabled(false);
        // Handle error (e.g., show an error message)
      }
    };

    createOferta();
  }, [createOffer]); // This effect runs when `createOffer` changes.

  // Example button click handler that triggers the offer creation
  const handleOfferSubmit = () => {
    const valorOferta = offerValue;
    const boardGameId = game.id;

    // This will trigger the useEffect above
    setCreateOffer({ valorOferta, boardGameId });
  };

  // AFTER LOADING GAME DATA
  if (isLoading) {
    return <></>; // Return nothing for now while loading
  }
  if (!game) {
    return <p>Jogo não encontrado!</p>;
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
          <button onClick={onClose} className="absolute top-2 right-2 text-lg font-bold cursor-pointer hover:bg-gray-950 hover:text-gray-200 hover:border-gray-200 w-10 h-10 bg-gray-800 border-2 border-white rounded-full text-white">
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
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">{game.name}</h2>
            <p className="mt-5 text-3xl text-gray-900">{`R$ ${game.price.toFixed(2)}`}</p>
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
                disabled={isLoggedIn && (isOfferButtonDisabled || offerValue <= 0 || !game.statusActive)} // disable the button if offerValue is 0 or negative
              >
                Fazer Oferta
              </button>
            </div>
          </div>
          <div className="mt-6 lg:col-start-1 lg:col-span-2">
            <div className="text-base text-gray-700 space-y-2">
              <p className="text-lg text-gray-700 font-bold">Informações Adicionais:</p>
              <p className="text-md text-gray-700 whitespace-pre-wrap">{game.description}</p>
            </div>
          </div>
        </div>
        {/* Image Modal */}
        {selectedImage && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} images={game.images} initialSlide={selectedImageIndex}>
            {/* The images are passed to the Modal and handled inside it */}
          </Modal>
        )}
      </main>
      {showToastOferta && <ToastOferta message={`Sua oferta de R$ ${submittedOfferValue.toFixed(2)} foi realizada com Sucesso!`} onDismiss={() => setShowToastOferta(false)} />}
      {showToastLogin && <ToastLogin message={`Você precisa estar logado para fazer uma oferta! É bem rapidinho.`} onDismiss={() => setShowToastLogin(false)} />}
    </div>
  );
};

export default ProductPage;
