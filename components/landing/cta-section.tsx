import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="border-t border-border bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-emerald-900/10 p-8 sm:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Comece sua jornada hoje</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Plataforma Gratuita.
              <br />
              <span className="text-primary">Evolução Garantida.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Acesse todas as aulas e ferramentas de aprendizado sem pagar nada. Invista apenas se quiser acelerar seus resultados com nossa loja.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                  Criar Conta Gratuita
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-border bg-transparent px-8 text-foreground hover:bg-secondary">
                  Já tenho conta
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Não é necessário cartão de crédito para se registrar.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

