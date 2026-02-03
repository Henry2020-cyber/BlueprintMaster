import { Star, Quote } from "lucide-react"

const testimonials = [
    {
        name: "Carlos Mendes",
        role: "Indie Game Developer",
        quote: "A melhor plataforma para aprender Unreal Engine. As aulas diárias tornaram o processo muito mais gerenciável.",
        avatar: "/avatars/carlos.jpg",
    },
    {
        name: "Ana Silva",
        role: "Technical Artist",
        quote: "O sistema de Kanban e Pomodoro me ajudou a organizar meu portfólio e consegui meu primeiro emprego na área.",
        avatar: "/avatars/ana.jpg",
    },
    {
        name: "Pedro Souza",
        role: "Estudante",
        quote: "Nunca pensei que aprender Blueprint seria tão intuitivo. A comunidade é incrível e os professores são ótimos.",
        avatar: "/avatars/pedro.jpg",
    },
]

export function TestimonialsSection() {
    return (
        <section id="depoimentos" className="border-t border-border bg-background py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        O que nossos <span className="text-primary">Alunos</span> dizem
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Histórias reais de quem transformou sua carreira com a BlueprintMaster.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                            <Quote className="h-8 w-8 text-primary/20 mb-4" />
                            <p className="mb-6 flex-1 text-lg text-muted-foreground italic leading-relaxed">
                                "{testimonial.quote}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold text-sm">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-primary">{testimonial.role}</div>
                                </div>
                                <div className="ml-auto flex">
                                    {[1, 2, 3, 4, 5].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
