// project/src/app/product/create/page.js
"use client";
import React, { useState, useEffect, useRef } from "react";
import ToastBG from "../../components/ToastBG";
import ToastBGError from "../../components/ToastBGError";
import Link from "next/link";
import LoadingIndicator from "../../components/LoadingIndicator";

const CreateBoardGamePage = () => {
  const [images, setImages] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showToastError, setShowToastError] = useState(false);
  const [createdGameId, setCreatedGameId] = useState(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipRef = useRef(null); // Referência para o tooltip
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearForm = () => {
    setFormData({
      Title: "",
      Description: "",
      Value: "",
      Condition: "",
      Idioma: "",
    });
    setImages([]);
    setCoverImageIndex(null);
    // Assegure-se de revogar URLs de objetos de todas as imagens para liberar memória
    images.forEach((image) => URL.revokeObjectURL(image.preview));
  };

  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    Value: "",
    Condition: "",
    Idioma: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Value") {
      // Remove all non-digit characters for robustness
      let cleanedValue = value.replace(/\D+/g, "");

      // Pad the string with zeros to ensure it has at least 3 characters
      cleanedValue = cleanedValue.padStart(0, "0");

      // Insert the decimal point two places from the end
      const formattedValue = cleanedValue.slice(0, -2) + "." + cleanedValue.slice(-2);

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: formattedValue,
      }));
    } else {
      // Handle changes for other inputs normally
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    if (images.length === 0) {
      alert("No images were found, please upload at least one image.");
      return; // Stop the form submission
    }

    const token = localStorage.getItem("token");

    const dataToSend = {
      Title: formData.Title,
      Description: formData.Description,
      Value: parseFloat(formData.Value).toFixed(2),
      Condition: formData.Condition,
      Idioma: formData.Idioma,
    };

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(dataToSend));

    // Separar a imagem de capa das outras imagens
    const coverImage = images[coverImageIndex];
    const otherImages = images.filter((_, index) => index !== coverImageIndex);

    // Adicionar imagem de capa ao FormData
    if (coverImage) {
      formDataToSend.append("files.CoverImage", coverImage.file);
    }

    // Adicionar as outras imagens ao FormData
    otherImages.forEach((image) => {
      formDataToSend.append("files.Images", image.file);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FELIZARDOBG_API_URL}/api/board-games`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Resposta de erro:", errorResponse);
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setCreatedGameId(result.id);
      setShowToast(true);
      clearForm();
      // Implemente a lógica de sucesso aqui, como redirecionamento ou exibição de mensagem
    } catch (error) {
      setShowToastError(true);
      console.error("Erro no catch:", error);
    } finally {
      setIsSubmitting(false); // Stop loading regardless of outcome
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    const imageToRemove = images[index];

    // Update state first
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);

    // After that, revoke the object URL of the removed image
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    // Adjust cover logic if necessary
    if (index === coverImageIndex) {
      setCoverImageIndex(null);
    } else if (index < coverImageIndex) {
      setCoverImageIndex((prevIndex) => prevIndex - 1);
    } else if (newImages.length === 0) {
      setCoverImageIndex(null);
    } else if (coverImageIndex === null && newImages.length) {
      setCoverImageIndex(0); // Define the first image as cover if there is no cover
    }
  };

  const makeCover = (index) => {
    setCoverImageIndex(index);
  };

  // // Free memory when component are deleted.
  // useEffect(() => {
  //   return () => {
  //     images.forEach((image) => URL.revokeObjectURL(image.preview));
  //   };
  // }, [images]);

  const handleClickOutside = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setIsTooltipOpen(false); // Fechar o tooltip se o clique foi fora
    }
  };

  useEffect(() => {
    if (images.length > 0 && coverImageIndex === null) {
      setCoverImageIndex(0);
    } else if (images.length === 0) {
      setCoverImageIndex(null);
    }
  }, [images, coverImageIndex]);

  useEffect(() => {
    if (isTooltipOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isTooltipOpen]);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input type="text" minLength="3" maxLength="100" name="Title" id="Title" required value={formData.Title} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="Value" className="block text-sm font-medium text-gray-700">
            Valor (R$)
          </label>
          <input type="number" name="Value" id="Value" required min="5" max="20000" step="0.01" value={formData.Value} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label htmlFor="Idioma" className="block text-sm font-medium text-gray-700">
            Idioma
          </label>
          <select name="Idioma" id="Idioma" required value={formData.Idioma} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Selecione o Idioma</option>
            <option value="Português BR">Português (Brasil)</option>
            <option value="Português PT">Português (Portugal)</option>
            <option value="Inglês">Inglês</option>
            <option value="Espanhol">Espanhol</option>
            <option value="Italiano">Italiano</option>
            <option value="Alemão">Alemão</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div className="relative" ref={tooltipRef}>
          <label htmlFor="Condition" className="block text-sm font-medium text-gray-700">
            Condição
            <button type="button" onClick={() => setIsTooltipOpen(!isTooltipOpen)} className="  hover:bg-gray-950 ml-2 w-6 h-6 bg-gray-700 rounded-full text-white">
              ?
            </button>
          </label>
          <select name="Condition" id="Condition" required onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Selecione uma condição</option>
            <option value="Quinem da loja">Quinem na loja (M)</option>
            <option value="Só abri pá vê">Só abri pá vê (NM)</option>
            <option value="Joguei um tiquim">Joguei um tiquim (SP)</option>
            <option value="Rodou um cado">Rodou um cado (MP)</option>
            <option value="Surradinho">Surradinho (HP)</option>
            <option value="Estrupiado">Estrupiado (DM)</option>
          </select>
          {isTooltipOpen && (
            <div className="absolute z-10 w-80 p-2 mt-2 bg-white rounded-md shadow-lg">
              <table className="min-w-full divide-y divide-gray-200 mb-2">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-1 py-1 text-left text-xs font-semibold text-gray-800 uppercase">
                      Mineirês
                    </th>
                    <th scope="col" className="px-1 py-1 text-left text-xs font-semibold text-gray-800 uppercase">
                      Significado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Quinem da loja</td>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Lacrado</td>
                  </tr>
                  <tr>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Só abri pá vê</td>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Nunca Jogado</td>
                  </tr>
                  <tr>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Joguei um tiquim</td>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Pouco Jogado</td>
                  </tr>
                  <tr>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Rodou um cado</td>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Moderadamente Jogado</td>
                  </tr>
                  <tr>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Surradinho</td>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Muito Jogado</td>
                  </tr>
                  <tr>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Estrupiado</td>
                    <td className="px-1 py-1 whitespace-nowrap text-sm text-gray-500">Danificado</td>
                  </tr>
                </tbody>
              </table>
              <Link href="/condicao-boardgames" className="text-gray-800 font-bold hover:text-gray-950 hover:underline">
                Não conhece esse trem? Clique aqui.
              </Link>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="Description" className="block text-sm font-medium text-gray-700">
            Detalhes da Condição
          </label>
          <textarea name="Description" id="Description" type="text" minLength="4" maxLength="4000" required value={formData.Description} onChange={handleChange} rows="4" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-[#f7f7f7] text-transparent" />
          <p className="">
            Imagens que estão sendo enviadas: <span className="font-semibold">{images.length}</span>
          </p>
          <p className=" text-sm">Até 9 imagens de 1MB cada.</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative cursor-pointer">
              <img src={image.preview} alt="Preview" className={`w-full h-auto rounded-md ${index === coverImageIndex ? "border-4 border-green-500" : ""}`} onClick={() => makeCover(index)} />
              {index === coverImageIndex && <div className="absolute bg-opacity-95 top-2 left-2 bg-green-500 text-white font-bold rounded-full px-2 py-1">Capa</div>}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute bg-opacity-95 top-2 right-2 bg-red-500 text-white font-bold rounded-full p-0 w-8 h-8 flex items-center justify-center"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className="block font-medium">{images.length > 9 && <p className="text-red-600 font-semibold">Você pode enviar no máximo 9 imagens de 1MB cada.</p>}</div>
        <button
          type="submit"
          disabled={images.length === 0 || images.length > 9 || isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${images.length === 0 || images.length > 9 || isSubmitting ? "cursor-not-allowed bg-gray-300 text-gray-800" : "bg-gray-800 hover:bg-gray-950 text-white"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isSubmitting ? (
            <div className="flex justify-center items-center space-x-2">
              <LoadingIndicator />
              <span>Cadastrando BG...</span>
            </div>
          ) : (
            "Cadastrar Anúncio"
          )}
        </button>{" "}
      </form>
      {showToast && <ToastBG message="O BoardGame foi adicionado com sucesso a sua lista de jogos! Clique aqui para ver a postagem." onDismiss={() => setShowToast(false)} gameId={createdGameId} />}
      {showToastError && <ToastBGError message="Erro ao Cadastrar Anúncio! Confira os limites das imagens e tente novamente." onDismiss={() => setShowToastError(false)} />}
    </div>
  );
};

export default CreateBoardGamePage;
