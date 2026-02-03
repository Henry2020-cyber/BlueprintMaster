import { Zap, Users, Shield, Briefcase, GraduationCap, ShoppingBag } from "lucide-react"

const values = [
    {
        icon: Zap,
        title: "Acelere seu Aprendizado",
        description: "Metodologia focada na prática que corta 80% do tempo de aprendizado tradicional.",
    },
    {
        icon: ShoppingBag,
        title: "Loja de Projetos Premium",
        description: "Acesse projetos completos e profissionais na nossa loja para acelerar seus próprios jogos.",
    },
    {
        icon: Briefcase,
        title: "Pronto para o Mercado",
        description: "Aprenda as técnicas e padrões usados pelos estúdios AAA e indies de sucesso.",
    },
    {
        icon: GraduationCap,
        title: "Certificado Verificado",
        description: "Receba um certificado reconhecido ao completar cada módulo e o curso completo.",
    },
    {
        icon: Users,
        title: "Comunidade Ativa",
        description: "Junte-se a milhares de desenvolvedores trocando conhecimento e feedback diariamente.",
    },
    {
        icon: Shield,
        title: "Garantia de Qualidade",
        description: "Conteúdo 100% gratuito e atualizado constantemente com as últimas versões da Unreal Engine.",
    },
]

export function ValuePropositionSection() {
    return (
        <section id="beneficios" className="bg-secondary/20 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Plataforma Completa & <span className="text-primary">Gratuita</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Aprenda sem custos e turbine seus projetos com assets premium da nossa loja.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {values.map((value, index) => (
                        <div key={index} className="flex gap-4 group">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <value.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

