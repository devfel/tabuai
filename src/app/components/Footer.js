// project/src/app/components/Footer.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8">
      <div>
        <Link href="/about" className="w-auto text-gray-300 px-2 hover:underline hover:text-gray-400">
          TABUai? Como Funciona?
        </Link>
      </div>
      <div className="w-auto mt-2 font-semibold">
        <span className="mx-2 text-base">Desenvolvido por Felizardo </span>
        <p className="mt-2">
          <a href="https://github.com/devfel" target="_blank" rel="noopener noreferrer" className="border border-white px-2 py-1 rounded-md hover:text-gray-300">
            <FontAwesomeIcon icon={faGithub} className="w-5 inline-block " /> DevFel
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
