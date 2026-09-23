import { HelpCircle, Sparkles } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

export function LandingFaq() {
  const faqs = [
    {
      q: 'Como funciona a troca de contador para a Golden?',
      a: 'O processo é conduzido integralmente pela nossa equipe técnica, sem atritos com seu prestador anterior. Solicitamos o termo de transferência de responsabilidade técnica, livros diários, balancetes e procurações eletrônicas diretamente ao responsável anterior. A transição costuma ser concluída em poucos dias úteis sem qualquer interrupção nas rotinas da sua empresa.',
    },
    {
      q: 'Como a tecnologia e a triagem por IA auxiliam a rotina?',
      a: 'Ao carregar guias, notas ou extratos no portal, o sistema identifica se o arquivo corresponde a Tributos, Folha de Pagamento, Demonstrações Contábeis ou Documentos Legais. Em seguida, nossos contadores habilitados no CRC-SP revisam e validam os lançamentos antes do fechamento, unindo rapidez de processamento à segurança técnica de contadores experientes.',
    },
    {
      q: 'Como a Golden atua para evitar atrasos e multas fiscais?',
      a: 'Trabalhamos com controle preventivo e triplo alerta: semáforo de vencimentos no portal, notificações automáticas com antecedência de 5, 2 e 1 dia(s) com a guia anexada, e acompanhamento ativo por parte do contador responsável pela sua conta.',
    },
    {
      q: 'Qual a diferença entre Simples Nacional, Lucro Presumido e Lucro Real?',
      a: 'O Simples Nacional consolida os principais tributos em guia única (DAS) para empresas até R$ 4,8 milhões/ano. O Lucro Presumido trabalha com margens de presunção fixadas pela legislação para IRPJ e CSLL, sendo vantajoso para certas faixas de rentabilidade. O Lucro Real apura os tributos sobre o resultado contábil efetivo, obrigatório acima de R$ 78 milhões/ano ou altamente recomendável para empresas com margens menores e créditos tributários significativos. Realizamos um diagnóstico tributário sem custos para orientar a melhor escolha.',
    },
    {
      q: 'Há cobrança de taxa de adesão ou contrato de fidelidade com multa abusiva?',
      a: 'Não cobramos taxa de adesão, honorários de migração ou multas abusivas de fidelidade. O relacionamento com nossos clientes é pautado pela qualidade técnica contínua e pela pontualidade das entregas.',
    },
    {
      q: 'A folha de pagamento e o pró-labore estão incluídos?',
      a: 'Sim. Nossos planos abrangem o cálculo de pró-labore dos sócios, holerites de colaboradores, transmissão das obrigações ao eSocial, DCTFWeb e emissão das guias FGTS Digital e previdenciárias.',
    },
    {
      q: 'Como funciona o atendimento com os contadores?',
      a: 'Você conta com canais diretos e ágeis: WhatsApp corporativo, telefone fixo, e-mail e chat integrado. Dúvidas conceituais ou operacionais são tratadas por profissionais experientes com tempo médio de resposta inferior a 15 minutos em horário comercial.',
    },
    {
      q: 'Como é garantida a segurança e conformidade dos dados (LGPD)?',
      a: 'Adotamos infraestrutura em nuvem criptografada, com isolamento estrito de dados por empresa, políticas de rate limit e trilhas de auditoria para cada documento emitido ou consultado.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-[#faf8f5] border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <Badge className="bg-white text-amber-900 border-amber-600/30 text-xs font-semibold px-3 py-1">
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-700 inline" />
            Dúvidas Frequentes
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            Respostas claras e transparentes sobre metodologia, transição, planos e suporte da
            Golden Contabilidade.
          </p>
        </div>

        {/* Functional Accordion com estilo sóbrio */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-stone-200 rounded-xl px-4 py-1 data-[state=open]:border-amber-400/60 data-[state=open]:bg-[#faf8f5] transition-all"
              >
                <AccordionTrigger className="text-left font-bold text-slate-950 text-base sm:text-lg hover:text-amber-800 hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 text-sm sm:text-base leading-relaxed pb-4 pt-1 border-t border-stone-200/80 mt-1">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions */}
        <div className="text-center pt-2 text-sm text-slate-700">
          Precisa de uma orientação específica para o seu negócio?{' '}
          <a
            href="#contratar"
            className="text-amber-800 hover:text-amber-900 font-bold underline ml-1"
          >
            Fale diretamente com um de nossos contadores seniores &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
