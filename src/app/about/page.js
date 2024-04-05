// src/app/about.js

import Image from "next/image";

export default function About() {
  return (
    <main>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">Como Funciona a TABUai</h1>

        <div className="my-8">
          <Image src="/bg1.png" alt="Board Game Showcase" className="w-full rounded-lg shadow-md" width={1851} height={892} />
        </div>

        {/* Seção Resumo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resumo</h2>
          <p className="mt-2 text-justify text-gray-700">
            - <span className="font-semibold">Não somos loja</span>, TABUai “Tabulero Uai” é apenas uma plataforma de conexão entre jogadores.
          </p>
          <p className="mt-2 text-justify text-gray-700">
            - <span className="font-semibold">Não é leilão</span> e não existe obrigação do vendedor entregar o produto à maior oferta após certo prazo (nem temos prazos).
          </p>
          <p className="mt-2 text-justify text-gray-700">- Vendedores anunciam o produto com seu preço, compradores fazem ofertas livremente.</p>
          <p className="mt-2 text-justify text-gray-700">- Vendedores podem ver todas as ofertas ativas nos seus respectivos jogos e escolher com quem fechar o negócio.</p>
          <p className="mt-2 text-justify text-gray-700">- Quem fizer oferta em um jogo vai poder ver os dados do vendedor e poderá entrar em contato para tirar dúvidas ou continuar a negociação.</p>
          <p className="mt-2 text-justify text-gray-700">- Recomendamos que finalizem as transações apenas de forma presencial e em locais públicos e movimentados (como eventos especializados).</p>
          <p className="mt-2 text-justify text-gray-700">
            - O comprador deve conferir o produto na frente do vendedor antes de realizar o pagamento. Compras presenciais <span className="font-semibold">não</span> dão o “direito de arrependimento” conforme CDC.
          </p>
          <p className="mt-2 text-justify text-gray-700">- Até a efetivação do pagamento, podem haver desistências de ambos os lados, para evitar essas situações, encorajamos a comunicação clara e com compromisso.</p>
          <p className="mt-2 text-justify text-gray-700">- Imprevistos acontecem, porém, desistências tardias não são bem vistas. Assim, apreciamos a seriedade ao criar um anúncio ou fazer uma oferta.</p>
          <p className="mt-2 text-justify text-gray-700">
            - Reforçamos que nossa plataforma <span className="font-semibold">NÃO</span> solicita pagamentos, depósitos, PIX ou nenhum outro pagamento para reserva de produtos ou finalizar o acordo.
          </p>
          <p className="mt-2 text-justify text-gray-700">- Não coletamos, armazenamos nem solicitamos dados financeiros dos usuários que estão comprando os jogos.</p>
          <p className="mt-2 text-justify text-gray-700">
            <span className="font-semibold"> - Nosso foco está apenas em facilitar a conexão entre entusiastas de board games e promover um ambiente de trocas. </span>
          </p>
        </div>

        <div className="my-8">
          <Image src="/bg2.png" alt="Board Game Showcase" className="w-56 rounded-lg shadow-md" width={338} height={373} />
        </div>

        {/* Seção Versão Completa */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Versão Completa</h2>
          <p className="mt-2 text-justify text-gray-700">Bem-vindo a TABUai, o portal feito por mineiro para conexão entre jogadores de Board Games para compra, venda e troca de jogos!</p>
          <p className="mt-2 text-justify text-gray-700">Nossa plataforma nasceu da paixão compartilhada por board games, com o objetivo de criar uma comunidade vibrante onde colecionadores e entusiastas podem comprar e vender jogos. Aqui, não somos uma loja online, mas sim um espaço de conexão direta entre vendedores e compradores de jogos novos e usados.</p>
          <p className="mt-2 text-justify text-gray-700">Se você tem jogos que deseja passar adiante, nosso site oferece o espaço ideal para fazer isso. Você define o preço que considera justo e espera pelas ofertas dos interessados. É importante ressaltar que você não é obrigado a aceitar qualquer oferta, dando-lhe total liberdade para escolher a melhor proposta para seus itens.</p>
          <p className="mt-2 text-justify text-gray-700">Caso esteja em busca de novas adições para sua coleção ou quer descobrir tesouros escondidos, você pode navegar pelos anúncios e fazer ofertas pelos jogos que desejar. Assim como os vendedores, você tem a flexibilidade de retirar sua oferta a qualquer momento antes da conclusão da venda.</p>

          <p className="mt-2 text-justify text-gray-700">
            Acreditamos na importância da segurança e na satisfação completa tanto do vendedor quanto do comprador. Por isso, incentivamos que as transações sejam realizadas pessoalmente, em locais seguros e movimentados, como lojas de jogos, eventos de board games ou outros pontos de encontro de jogadores. Esta abordagem permite que o comprador inspecione o jogo antes de finalizar a compra,
            garantindo transparência e confiança entre as partes.
          </p>
          <p className="mt-2 text-justify text-gray-700">
            Com o comprador tendo a oportunidade de examinar o item antes da compra, o direito de arrependimento não é aplicável. Se estiver comprando um produto, recomendamos fazer a transferência dos valores apenas após a conferência. Se estiver vendendo, acompanhe a verificação do produto junto ao possível comprador para que seja evitado problemas.
          </p>
          <p className="mt-2 text-justify text-gray-700">
            Entendemos que imprevistos acontecem, e tanto vendedores quanto compradores podem mudar de ideia. Embora desistências não sejam encorajadas, elas são permitidas. Pedimos, no entanto, que todos os usuários tratem as transações e comunicações com o maior respeito e consideração possíveis, mantendo a cordialidade e a boa fé em todas as interações.
          </p>
          <div className="my-8">
            <Image src="/bg3.png" alt="Board Game Showcase" className="w-96 rounded-lg shadow-md" width={590} height={705} />
          </div>
          <p className="mt-2 text-justify text-gray-700">
            Ressaltamos que não entramos em contato com nenhuma das partes para solicitações de pagamentos, depósitos ou qualquer tipo de transação financeira, seja para efetuar uma negociação ou reservar produtos. Também nunca vamos pedir informações confidenciais como senhas por exemplo. Encorajamos fortemente nossos usuários a procederem com cautela e a realizar verificações adequadas antes de
            engajar em qualquer transação. Essa plataforma é destinada a facilitar a conexão entre entusiastas de board games, apenas promovendo um ambiente de trocas. Não solicitamos nem armazenamos informações financeiras de nossos usuários. Qualquer solicitação nesse sentido deve ser considerada suspeita e nos deve ser imediatamente reportada.
          </p>

          <p className="mt-2 text-justify text-gray-700 font-semibold">Nosso propósito é fornecer uma plataforma eficiente, conveniente e amigável para amantes de board games se conectarem e compartilharem sua paixão. Seja vendendo um jogo que já não joga mais, ou encontrando aquele jogo raro para adicionar à sua mesa, esperamos que encontre o que procura. Sejam bem-vindos e boas jogatinas!</p>
          <p className="mt-2 text-justify font-semibold text-gray-700">
            Atenciosamente, <br />
            Equipe TABUai. (por enquanto, eu sozinho)
          </p>
        </div>
      </div>
    </main>
  );
}
