import { UserPlus, CalendarDays, BookOpen, Rocket } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crie sua Conta",
    description: "Registre-se gratuitamente e configure seu perfil de estudante.",
  },
  {
    icon: CalendarDays,
    step: "02",
    title: "Receba seu Cronograma",
    description: "Obtenha um plano de estudos personalizado baseado em seus objetivos.",
  },
  {
    icon: BookOpen,
    step: "03",
    title: "Estude Diariamente",
    description: "Siga as lições diárias, complete desafios e pratique com projetos reais.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Evolua de Fase",
    description: "Progrida do iniciante ao avançado, desbloqueando novos conteúdos.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="border-t border-border bg-secondary/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Como <span className="text-primary">funciona</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Um processo simples e eficiente para você evoluir constantemente.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />

          <div className="grid gap-12 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {/* Step number circle */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                
                {/* Step badge */}
                <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  Passo {item.step}
                </div>
                
                <h3 className="mb-2 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
