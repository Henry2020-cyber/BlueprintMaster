import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search } from "lucide-react"
import { CreditCardProduct, CardVariant } from "@/components/store/credit-card-product"

const products = [
    {
        id: 1,
        title: "Starter Kit",
        price: "Grátis",
        period: "/vitalício",
        features: [
            "Sistema de Movimentação",
            "Inventário Básico",
            "Sistemas de Interação",
            "Documentação em PT-BR",
            "Suporte Comunitário"
        ],
        popular: false,
        variant: "start" as CardVariant,
        cardNumber: ".... 8842",
        memberSince: "2024"
    },
    {
        id: 2,
        title: "RPG Ultimate",
        price: "R$ 197",
        period: "/vitalício",
        features: [
            "Sistema de Quest Completo",
            "Combate Action RPG",
            "Sistema de Save/Load",
            "IA de Inimigos Avançada",
            "Sistema de Level e XP",
            "Inventário Grid System",
            "Suporte Prioritário"
        ],
        popular: true,
        variant: "pro" as CardVariant,
        cardNumber: ".... 9953",
        memberSince: "2024"
    },
    {
        id: 3,
        title: "FPS Pro",
        price: "R$ 129",
        period: "/vitalício",
        features: [
            "Movimentação AAA",
            "Sistema de Armas",
            "Parkour System",
            "Recuo Procedural",
            "Multiplayer Ready"
        ],
        popular: false,
        variant: "enterprise" as CardVariant,
        cardNumber: ".... 9053",
        memberSince: "2024"
    },
    {
        id: 4,
        title: "Horror Template",
        price: "R$ 149",
        period: "/vitalício",
        features: [
            "Lanterna Dinâmica",
            "Jumpscare Manager",
            "Inventory Resident Evil",
            "Puzzles Logicos base"
        ],
        popular: false,
        variant: "pro" as CardVariant,
        cardNumber: ".... 7721",
        memberSince: "2024"
    }
]

export default function StorePage() {
    return (
        <div className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30">
            <Header />

            <main className="pt-32 pb-20">
                {/* Hero Store */}
                <section className="relative px-4 sm:px-6 lg:px-8 mb-20 text-center">

                    <div className="mx-auto max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6 backdrop-blur-sm">
                            <ShoppingCart className="h-4 w-4 text-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Marketplace Oficial</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
                            Assets <span className="text-primary">Premium</span>
                        </h1>

                        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                            Projetos completos e sistemas prontos para você não reinventar a roda.
                        </p>

                        <div className="flex max-w-md mx-auto relative group">
                            <div className="relative flex w-full items-center gap-2 bg-[#0A0A0A] border border-white/10 rounded-xl p-2 focus-within:border-primary/50 transition-colors">
                                <Search className="h-5 w-5 text-gray-500 ml-2" />
                                <input
                                    type="text"
                                    placeholder="Buscar assets..."
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-sm h-10"
                                />
                                <Button size="sm" className="h-9 rounded-lg bg-white/10 text-white hover:bg-white/20">Buscar</Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                <section className="px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide justify-center">
                            <Button variant="secondary" className="rounded-full px-6 bg-white text-black hover:bg-gray-200 font-medium">Todos</Button>
                            <Button variant="ghost" className="rounded-full px-6 text-gray-400 hover:text-white hover:bg-white/5">Sistemas</Button>
                            <Button variant="ghost" className="rounded-full px-6 text-gray-400 hover:text-white hover:bg-white/5">Templates</Button>
                            <Button variant="ghost" className="rounded-full px-6 text-gray-400 hover:text-white hover:bg-white/5">VFX</Button>
                        </div>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
                        {products.map((product) => (
                            <CreditCardProduct
                                key={product.id}
                                {...product}
                                mode="store"
                            />
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
