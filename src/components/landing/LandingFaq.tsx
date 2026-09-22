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
      a: 'É extremamente simples e sem atrito. Você não precisa brigar ou ter conversas difíceis: nossa equipe cuida de toda a transição, solicitando os livros contábeis, procurações eletrônicas e histórico fiscal diretamente ao seu contador anterior. O processo leva em média de 3 a 5 dias úteis e sua empresa continua operando normalmente.',
    },
    {
      q: 'Como a Inteligência Artificial é utilizada nos documentos da minha empresa?',
      a: 'Quando você envia notas, recibos ou extratos em lote no portal, nosso modelo de IA analisa o layout e texto do arquivo, classificando automaticamente se trata-se de Impostos (Tax), Folha (Payroll), Contábeis ou Legais. Em seguida, contadores habilitados com CRC conferem e aprovam a apuração antes do fechamento, garantindo agilidade com total segurança jurídica.',
    },
    {
      q: 'O que acontece se eu esquecer de pagar uma guia de imposto?',
      a: 'Com o Portal da Golden é praticamente impossível esquecer: nós enviamos notificações no sino do portal, disparamos e-mails com antecedência de 5, 2 e 1 dia(s) com a guia anexada, e caso o prazo expire nosso sistema atualiza o semáforo de status e calcula a guia atualizada com os encargos correspondentes.',
    },
    {
      q: 'Qual é a diferença entre os planos Simples Nacional, Lucro Presumido e Lucro Real?',
      a: 'O Simples Nacional unifica oito impostos em uma só guia (DAS), sendo indicado para faturamentos de até R$ 4,8 milhões/ano com alíquotas progressivas. O Lucro Presumido calcula o IRPJ e a CSLL com base em margens pré-fixadas (geralmente 8% ou 32%) e apuração trimestral, recomendado para comércios e clínicas com margens sólidas. O Lucro Real calcula sobre o lucro líquido contábil efetivo, ideal para indústrias, margens baixas ou faturamento acima de R$ 78 milhões. Nossa equipe faz uma simulação gratuita para enquadrar sua empresa no regime que pague menos impostos legalmente.',
    },
    {
      q: 'Preciso pagar alguma taxa de adesão ou assinatura de fidelidade?',
      a: 'Não cobramos nenhuma taxa de adesão, matrícula ou custo de migração. Nossos planos funcionam no modelo de assinatura mensal ou anual com desconto, sem multas contratuais abusivas. Confiamos na qualidade da nossa entrega para manter você conosco.',
    },
    {
      q: 'Vocês fazem a folha de pagamento e pró-labore?',
      a: 'Sim! Todos os nossos planos incluem o processamento de folha de pagamento, cálculo de pró-labore de sócios, geração de holerites, transmissão de eSocial, DCTFWeb e emissão das guias de FGTS e INSS.',
    },
    {
      q: 'Como funciona o atendimento no dia a dia?',
      a: 'Você tem acesso direto a contadores sêniores através do WhatsApp corporativo da Golden, telefone, e-mail e pelo próprio chat integrado no portal. Além disso, nosso Assistente de IA Contábil fica disponível 24 horas por dia, 7 dias por semana para responder dúvidas pontuais sobre termos, vencimentos e códigos fiscais.',
    },
    {
      q: 'Meus dados e documentos fiscais estão protegidos?',
      a: 'Sim, seguimos rigidamente a LGPD com criptografia em trânsito e em repouso, servidores em nuvem de alta disponibilidade, isolamento estrito de dados por empresa e rate limit para proteção contra acessos automatizados indevidos.',
    },
  ]

  return (
    <section id="faq" className="py-24 bg-slate-950 border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold px-3 py-1">
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-emerald-400 inline" />
            Tire Suas Dúvidas
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Respostas transparentes sobre funcionamento, planos, transição e suporte da Golden
            Contabilidade.
          </p>
        </div>

        {/* Functional Accordion */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm shadow-xl">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-slate-800/80 rounded-xl px-4 py-1 data-[state=open]:border-emerald-500/50 data-[state=open]:bg-slate-900/90 transition-all"
              >
                <AccordionTrigger className="text-left font-bold text-white text-sm sm:text-base hover:text-emerald-400 hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 text-xs sm:text-sm leading-relaxed pb-4 pt-1 border-t border-slate-800/60 mt-1">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions */}
        <div className="text-center pt-4 text-xs sm:text-sm text-slate-400">
          Não encontrou sua dúvida?{' '}
          <a
            href="#contratar"
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline"
          >
            Fale diretamente com um de nossos contadores especialistas &rarr;
          </a>
        </div>
      </div>
    </section>
  )
}
