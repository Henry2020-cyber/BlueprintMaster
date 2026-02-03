"use client"

import Link from "next/link"
import { ShoppingCart, Loader2 } from "lucide-react"
import { CreditCardProduct } from "@/components/store/credit-card-product"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

const supabase = createClient()

type Asset = {
    id: string
    title: string
    price: number
    features: any
    card_color: string
}

export function StoreSection() {
    const [products, setProducts] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase
                .from('assets')
                .select('*')
                .eq('is_active', true)
                .order('price', { ascending: true })
                .limit(3)

            if (data) {
                setProducts(data)
            }
            setLoading(false)
        }
        fetchProducts()
    }, [])

    return (
        <section id="loja" className="bg-background py-24 border-t border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 mb-6">
                        <ShoppingCart className="h-3 w-3 text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">Marketplace Premium</span>
                    </div>

                    <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                        Escolha o nível do seu <span className="text-primary">Projeto</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Comece com nossos assets profissionais diretamente do banco de dados.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-3 items-start max-w-6xl mx-auto">
                        {products.length > 0 ? (
                            products.map((product, index) => {
                                const features = typeof product.features === 'string'
                                    ? JSON.parse(product.features)
                                    : (Array.isArray(product.features) ? product.features : [])

                                return (
                                    <CreditCardProduct
                                        key={product.id}
                                        title={product.title}
                                        price={product.price === 0 ? "Grátis" : `R$ ${product.price}`}
                                        features={features}
                                        cardColor={product.card_color || 'black'}
                                        isPopular={index === 1} // Highlight the middle one
                                        cardNumber={`.... ${product.id.substring(0, 4)}`}
                                        mode="store"
                                    />
                                )
                            })
                        ) : (
                            <div className="col-span-3 text-center text-muted-foreground">
                                Nenhhum produto disponível no momento.
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-20 flex justify-center">
                    <Link href="/dashboard/loja" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                        Ver todos os produtos da loja <span className="text-primary font-bold">→</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}
