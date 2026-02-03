import { Calendar, Layout, Timer, TrendingUp, Gamepad2, Trophy } from "lucide-react"

const benefits = [
  {
    icon: Calendar,
    title: "Estudo Diário Guiado",
    description: "Receba um cronograma personalizado com tarefas diárias para manter a constância nos estudos.",
  },
  {
    icon: Layout,
    title: "Organização com Kanban",
    description: "Visualize seu progresso e organize suas tarefas com um sistema Kanban integrado.",
  },
  {
    icon: Timer,
    title: "Foco com Pomodoro",
    description: "Maximize sua produtividade com sessões de estudo cronometradas e pausas estratégicas.",
  },
  {
    icon: TrendingUp,
    title: "Evolução Real em Blueprint",
    description: "Progrida do básico ao avançado com projetos práticos e desafios progressivos.",
  },
  {
    icon: Gamepad2,
    title: "Projetos de Jogos Reais",
    description: "Aprenda criando jogos de verdade, não apenas tutoriais isolados.",
  },
  {
    icon: Trophy,
    title: "Sistema de Gamificação",
    description: "Ganhe XP, conquiste badges e mantenha seu streak para se manter motivado.",
  },
]

export function BenefitsSection() {
  return (
    <section id="recursos" className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Por que escolher a{" "}
            <span className="text-primary">BlueprintMaster</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Uma plataforma completa projetada para você dominar Blueprint com eficiência.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
