import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Flame, Target, Zap, ShoppingBag } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-40"></div>
        {/* Curved lines similar to reference */}
        <svg
          className="absolute left-0 top-1/4 h-[600px] w-full opacity-30"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 400 Q 300 100, 600 300 T 1300 200"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M-100 450 Q 350 150, 650 350 T 1300 250"
            stroke="url(#gradient2)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:flex-row lg:gap-12 lg:px-8">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Plataforma 100% Gratuita</span>
          </div>

          {/* Headline */}
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Domine{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Blueprint
            </span>
            <br />
            Sem Custos
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0">
            Aprenda Unreal Engine com nossa metodologia completa gratuitamente.
            Acesse nossa <span className="text-foreground font-semibold">Loja Premium</span> apenas quando quiser acelerar seus projetos com assets exclusivos.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link href="/register">
              <Button size="lg" className="h-12 gap-2 bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 transition-all">
                Começar Grátis Agora
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#store-preview">
              <Button size="lg" variant="outline" className="h-12 gap-2 border-border bg-background/50 px-8 text-base text-foreground backdrop-blur-sm hover:bg-secondary/80">
                <ShoppingBag className="h-5 w-5" />
                Conhecer a Loja
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 lg:justify-start border-t border-border/50 pt-8">
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-foreground">Free</div>
              <div className="text-sm text-muted-foreground">Acesso às Aulas</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-foreground">Loja</div>
              <div className="text-sm text-muted-foreground">Assets Premium</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold text-foreground">PRO</div>
              <div className="text-sm text-muted-foreground">Qualidade AAA</div>
            </div>
          </div>
        </div>

        {/* Right Content - Dashboard Preview */}
        <div className="mt-12 flex-1 lg:mt-0 perspective-1000">
          <div className="relative transform transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-6">
            <div className="absolute -inset-1 blur-2xl bg-gradient-to-r from-primary/30 to-emerald-600/30 opacity-50"></div>

            {/* Main Dashboard Card */}
            <div className="relative rounded-2xl border border-border/50 bg-card/90 p-6 shadow-2xl backdrop-blur-xl">
              {/* Window dots */}
              <div className="mb-4 flex gap-2 border-b border-border/50 pb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>

              {/* Dashboard content preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Plano Atual</div>
                    <div className="text-xl font-bold text-primary">Gratuito</div>
                  </div>
                  <div className="rounded-full bg-primary/20 px-3 py-1 text-xs text-primary font-medium">Ativo</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso do Curso</span>
                    <span className="text-foreground font-medium">Level 12</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-2 w-3/4 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-secondary/50 p-4 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-xs font-medium text-muted-foreground">Streak</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">15 dias</div>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">Loja</span>
                    </div>
                    <div className="text-sm font-medium text-foreground">Visualizar Projetos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification card */}
            <div className="animate-float absolute -right-6 top-10 rounded-xl border border-border/50 bg-card/95 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Novo Asset Disponível</div>
                  <div className="text-xs text-muted-foreground">Loja de Blueprint</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

