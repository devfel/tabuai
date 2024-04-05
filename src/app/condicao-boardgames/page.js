// src/app/condicao-boardgames.js
import Head from "next/head";

export default function CondicaoBoardGames() {
  return (
    <main>
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Condições dos Board Games</h1>
        <p className="mt-2 text-justify text-gray-700">Neste espaço, valorizamos a transparência e a honestidade. Por isso, criamos com carinho um padrão de descrição do estado de conservação e condições dos jogos que reflete também nossas origens. "Eu sou mineiro uai!".</p>
        <p className="mt-2 text-justify text-gray-700">Pensamos em uma forma de facilitar a comunicação e garantir a satisfação de todos os envolvidos. As condições listadas aqui foram adaptadas de um consenso bastante utilizado por colecionadores de outros itens, inclusive de Trading Card Games.</p>
        <p className="mt-2 text-justify text-gray-700">Então, antes de comprar, e especialmente antes de fazer o anúncio do seu jogo, dê uma olhada em nosso guia abaixo. E assim que pegar um jogo já confira tudo, preferencialmente na frente do vendedor e antes de fazer o pagamento. </p>
        <p className="mt-2 text-justify text-gray-700">
          A gente aqui só faz a ponte pra vocês trocarem contato, não interferimos em nada nas negociações ou eventuais problemas. Tudo é feito diretamente entre comprador e vendedor, inclusive recomendamos a efetivação apenas de forma presencial em lugares movimentados ou especializados, como eventos de board games. Não somos loja e não recebemos nada por negociações concluídas.
        </p>

        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-bold text-gray-900">Tradução </h2>

          <div className="overflow-x-auto relative shadow-md sm:rounded-lg mb-8">
            <table className="w-full text-xs md:text-sm text-left text-gray-500">
              <thead className=" text-gray-700 uppercase bg-gray-50">
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
          <h2 className="text-xl font-bold text-gray-900">Entenda as Condições dos Jogos</h2>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">Quinem da loja (Lacrado - M)</h3>
            <p className="mt-2 text-justify text-gray-700">"Quinem da loja" é como se o jogo nunca tivesse visto a luz do dia. Tá lacrado, com aquele cheirinho de novo (ou, parafraseando o Paulo "Aquele cheirinho de board game novo que a gente tanto gosta!") e sem nenhum arranhão. É o sonho de consumo.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">Só abri pá vê (Nunca Jogado - NM)</h3>
            <p className="mt-2 text-justify text-gray-700">Já abri a caixa, mas juro que foi "só pá vê". O jogo tá novo, sem marcas de uso e com todos os componentes brilhando. Pode ter sido tocado algumas vezes, mas com muito amor e nem chegou a ser jogado. </p>
            <p className="mt-2 text-justify text-gray-700">Também são os casos dos jogos que não estão mais lacrados mas estão intactos, até com os "punch boards" não destacados, por exemplo.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">Joguei um tiquim (Pouco Jogado - SP)</h3>
            <p className="mt-2 text-justify text-gray-700">Quer dizer que o jogo viu ação, mas só um cadiquim. Pode não ter sinais de uso, ou no máximo, alguns sinais bem leves (detalhe, se for o caso). O jogo sempre foi bem protegido e bem cuidado. Ainda tá firme e forte para muitas jogatinas.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">Rodou um cado (Moderadamente Jogado - MP)</h3>
            <p className="mt-2 text-justify text-gray-700">Esse aqui "rodou um cado". Mostra que viveu boas histórias, com sinais de uso mais evidentes, componentes que podem estar um pouco mais desgastados ou superfície de cartas e outros "trem" que já viram dias melhores. Mas ó, ainda tá valendo a pena para muita diversão. Claro, tudo com um preço mais camarada né!?</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">Surradinho (Muito Jogado - HP)</h3>
            <p className="mt-2 text-justify text-gray-700">"Surradinho" é para os bravos. Tem história para contar, com marcas de uso bem visíveis ou mofo leve, talvez até uns defeitos maiorzim aqui e ali. </p>
            <p className="mt-2 text-justify text-gray-700">Pode conter inclusive componentes faltando ou um pouco avariado, desde que não interfira em nada no jogo. Ideal para quem não liga para a aparência e só quer jogar.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">Estrupiado (Danificado - DM)</h3>
            <p className="mt-2 text-justify text-gray-700">Esses já tão batidos viu. Tem danos sérios, tipo rasgos ou marcas de água ou mofo graves, esse jogo já passou por muita coisa e por muito adulto (ou criança e até animais).</p>
            <p className="mt-2 text-justify text-gray-700"> Também pode ter peças quebradas, ou até faltando, as vezes até peças importantes pra jogatina. Se você ta vendendo, detalhe bem os defeitos. Se for comprar, saiba o que tá levando e confira bem, junto com o vendedor, assim que pegar.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
