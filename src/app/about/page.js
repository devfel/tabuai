// src/app/about.js

import Image from "next/image";

export default function About() {
  return (
    <main>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-50 mb-10">Como Funciona a TABUai</h1>

        <div className="my-8">
          <Image src="/bg1.png" alt="Board Game Showcase" className="w-full rounded-lg shadow-md" width={1851} height={892} />
        </div>

        {/* Seção Resumo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">Resumo</h2>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            - <span className="font-semibold">Não somos loja</span>, TABUai “Tabulero Uai” é apenas uma plataforma de conexão entre jogadores.
          </p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            - <span className="font-semibold">Não é leilão</span> e não existe obrigação do vendedor entregar o produto à maior oferta após certo prazo (nem temos prazos).
          </p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">- Vendedores anunciam o produto com seu preço, compradores fazem ofertas livremente.</p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">- Vendedores podem ver todas as ofertas ativas nos seus respectivos jogos e escolher com quem fechar o negócio.</p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">- Quem fizer oferta em um jogo vai poder ver os dados do vendedor e poderá entrar em contato para tirar dúvidas ou continuar a negociação.</p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">- Recomendamos que finalizem as transações apenas de forma presencial e em locais públicos e movimentados (como eventos especializados).</p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            - O comprador deve conferir o produto na frente do vendedor antes de realizar o pagamento. Compras presenciais <span className="font-semibold">não</span> dão o “direito de arrependimento” conforme CDC.
          </p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">- Até a efetivação do pagamento, podem haver desistências de ambos os lados, para evitar essas situações, encorajamos a comunicação clara e com compromisso.</p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">- Imprevistos acontecem, porém, desistências tardias não são bem vistas. Assim, apreciamos a seriedade ao criar um anúncio ou fazer uma oferta.</p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            - Reforçamos que nossa plataforma <span className="font-semibold">NÃO</span> solicita pagamentos, depósitos, PIX ou nenhum outro pagamento para reserva de produtos ou finalizar o acordo.
          </p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">- Não coletamos, armazenamos nem solicitamos dados financeiros dos usuários que estão comprando os jogos.</p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            <span className="font-semibold"> - Nosso foco está apenas em facilitar a conexão entre entusiastas de board games e promover um ambiente de trocas. </span>
          </p>
        </div>

        <div className="my-8">
          <Image src="/bg2.png" alt="Board Game Showcase" className="w-56 rounded-lg shadow-md" width={338} height={373} />
        </div>

        {/* Seção Versão Completa */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">Versão Completa</h2>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">Bem-vindo a TABUai, o portal feito por mineiro para conexão entre jogadores de Board Games para compra, venda e troca de jogos!</p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">Nossa plataforma nasceu da paixão compartilhada por board games, com o objetivo de criar uma comunidade vibrante onde colecionadores e entusiastas podem comprar e vender jogos. Aqui, não somos uma loja online, mas sim um espaço de conexão direta entre vendedores e compradores de jogos novos e usados.</p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            Se você tem jogos que deseja passar adiante, nosso site oferece o espaço ideal para fazer isso. Você define o preço que considera justo e espera pelas ofertas dos interessados. É importante ressaltar que você não é obrigado a aceitar qualquer oferta, dando-lhe total liberdade para escolher a melhor proposta para seus itens.
          </p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">Caso esteja em busca de novas adições para sua coleção ou quer descobrir tesouros escondidos, você pode navegar pelos anúncios e fazer ofertas pelos jogos que desejar. Assim como os vendedores, você tem a flexibilidade de retirar sua oferta a qualquer momento antes da conclusão da venda.</p>

          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            Acreditamos na importância da segurança e na satisfação completa tanto do vendedor quanto do comprador. Por isso, incentivamos que as transações sejam realizadas pessoalmente, em locais seguros e movimentados, como lojas de jogos, eventos de board games ou outros pontos de encontro de jogadores. Esta abordagem permite que o comprador inspecione o jogo antes de finalizar a compra,
            garantindo transparência e confiança entre as partes.
          </p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            Com o comprador tendo a oportunidade de examinar o item antes da compra, o direito de arrependimento não é aplicável. Se estiver comprando um produto, recomendamos fazer a transferência dos valores apenas após a conferência. Se estiver vendendo, acompanhe a verificação do produto junto ao possível comprador para que seja evitado problemas.
          </p>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            Entendemos que imprevistos acontecem, e tanto vendedores quanto compradores podem mudar de ideia. Embora desistências não sejam encorajadas, elas são permitidas. Pedimos, no entanto, que todos os usuários tratem as transações e comunicações com o maior respeito e consideração possíveis, mantendo a cordialidade e a boa fé em todas as interações.
          </p>
          <div className="my-8">
            <Image src="/bg3.png" alt="Board Game Showcase" className="w-96 rounded-lg shadow-md" width={590} height={705} />
          </div>
          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200">
            Ressaltamos que não entramos em contato com nenhuma das partes para solicitações de pagamentos, depósitos ou qualquer tipo de transação financeira, seja para efetuar uma negociação ou reservar produtos. Também nunca vamos pedir informações confidenciais como senhas por exemplo. Encorajamos fortemente nossos usuários a procederem com cautela e a realizar verificações adequadas antes de
            engajar em qualquer transação. Essa plataforma é destinada a facilitar a conexão entre entusiastas de board games, apenas promovendo um ambiente de trocas. Não solicitamos nem armazenamos informações financeiras de nossos usuários. Qualquer solicitação nesse sentido deve ser considerada suspeita e nos deve ser imediatamente reportada.
          </p>

          <p className="mt-2 text-justify text-gray-700 dark:text-gray-200 font-semibold">
            Nosso propósito é fornecer uma plataforma eficiente, conveniente e amigável para amantes de board games se conectarem e compartilharem sua paixão. Seja vendendo um jogo que já não joga mais, ou encontrando aquele jogo raro para adicionar à sua mesa, esperamos que encontre o que procura. Sejam bem-vindos e boas jogatinas!
          </p>
          <p className="mt-2 text-justify font-semibold text-gray-700 dark:text-gray-200">
            Atenciosamente, <br />
            Equipe TABUai. (por enquanto, eu sozinho)
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">Condições dos Board Games</h1>
        <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">Neste espaço, valorizamos a transparência e a honestidade. Por isso, criamos com carinho um padrão de descrição do estado de conservação e condições dos jogos que reflete também nossas origens. &quot;Eu sou mineiro uai!&quot;.</p>
        <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">Pensamos em uma forma de facilitar a comunicação e garantir a satisfação de todos os envolvidos. As condições listadas aqui foram adaptadas de um consenso bastante utilizado por colecionadores de outros itens, inclusive de Trading Card Games.</p>
        <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">Então, antes de comprar, e especialmente antes de fazer o anúncio do seu jogo, dê uma olhada em nosso guia abaixo. E assim que pegar um jogo já confira tudo, preferencialmente na frente do vendedor e antes de fazer o pagamento. </p>
        <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">
          A gente aqui só faz a ponte pra vocês trocarem contato, não interferimos em nada nas negociações ou eventuais problemas. Tudo é feito diretamente entre comprador e vendedor, inclusive recomendamos a efetivação apenas de forma presencial em lugares movimentados ou especializados, como eventos de board games. Não somos loja e não recebemos nada por negociações concluídas.
        </p>

        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">Tradução </h2>

          <div className="overflow-x-auto relative shadow-md sm:rounded-lg mb-8">
            <table className="w-full text-xs md:text-sm text-left text-gray-500">
              <thead className=" text-gray-700 dark:text-gray-400 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="py-3 px-3">
                    Mineirês
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Português
                  </th>
                  <th scope="col" className="py-3 px-3">
                    Inglês
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b ">
                  <td className="py-3 px-3 ">Quinem da loja</td>
                  <td className="py-3 px-3">Lacrado</td>
                  <td className="py-3 px-3">(M) Mint</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-3">Só abri pá vê</td>
                  <td className="py-3 px-3">Nunca Jogado</td>
                  <td className="py-3 px-3">(NM) Near Mint</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-3">Joguei um tiquim</td>
                  <td className="py-3 px-3">Pouco Jogado</td>
                  <td className="py-3 px-3">(SP) Slightly Played</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-3">Rodou um cado</td>
                  <td className="py-3 px-3">Moderadamente Jogado</td>
                  <td className="py-3 px-3">(MP) Moderately Played</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-3">Surradinho</td>
                  <td className="py-3 px-3">Muito Jogado</td>
                  <td className="py-3 px-3">(HP) Heavily Played</td>
                </tr>
                <tr>
                  <td className="py-3 px-3">Estrupiado</td>
                  <td className="py-3 px-3">Danificado</td>
                  <td className="py-3 px-3">(DM) Damaged</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Seção de Descrição */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">Entenda as Condições dos Jogos</h2>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Quinem da loja (Lacrado - M)</h3>
            <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">&quot;Quinem da loja&quot; é como se o jogo nunca tivesse visto a luz do dia. Tá lacrado, com aquele cheirinho de novo (ou, parafraseando o Paulo &quot;Aquele cheirinho de board game novo que a gente tanto gosta!&quot;) e sem nenhum arranhão. É o sonho de consumo.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Só abri pá vê (Nunca Jogado - NM)</h3>
            <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">Já abri a caixa, mas juro que foi &quot;só pá vê&quot;. O jogo tá novo, sem marcas de uso e com todos os componentes brilhando. Pode ter sido tocado algumas vezes, mas com muito amor e nem chegou a ser jogado. </p>
            <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">Também são os casos dos jogos que não estão mais lacrados mas estão intactos, até com os &quot;punch boards&quot; não destacados, por exemplo.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Joguei um tiquim (Pouco Jogado - SP)</h3>
            <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">Quer dizer que o jogo viu ação, mas só um cadiquim. Pode não ter sinais de uso, ou no máximo, alguns sinais bem leves (detalhe, se for o caso). O jogo sempre foi bem protegido e bem cuidado. Ainda tá firme e forte para muitas jogatinas.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Rodou um cado (Moderadamente Jogado - MP)</h3>
            <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">
              Esse aqui &quot;rodou um cado&quot;. Mostra que viveu boas histórias, com sinais de uso mais evidentes, componentes que podem estar um pouco mais desgastados ou superfície de cartas e outros &quot;trem&quot; que já viram dias melhores. Mas ó, ainda tá valendo a pena para muita diversão. Claro, tudo com um preço mais camarada né!?
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Surradinho (Muito Jogado - HP)</h3>
            <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">&quot;Surradinho&quot; é para os bravos. Tem história para contar, com marcas de uso bem visíveis ou mofo leve, talvez até uns defeitos maiorzim aqui e ali. </p>
            <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">Pode conter inclusive componentes faltando ou um pouco avariado, desde que não interfira em nada no jogo. Ideal para quem não liga para a aparência e só quer jogar.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Estrupiado (Danificado - DM)</h3>
            <p className="mt-2 text-justify text-gray-700 dark:text-gray-400">Esses já tão batidos viu. Tem danos sérios, tipo rasgos ou marcas de água ou mofo graves, esse jogo já passou por muita coisa e por muito adulto (ou criança e até animais).</p>
            <p className="mt-2 text-justify text-gray-700 dark:text-gray-400"> Também pode ter peças quebradas, ou até faltando, as vezes até peças importantes pra jogatina. Se você ta vendendo, detalhe bem os defeitos. Se for comprar, saiba o que tá levando e confira bem, junto com o vendedor, assim que pegar.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
