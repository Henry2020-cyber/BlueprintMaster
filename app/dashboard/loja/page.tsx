"use client"

import React, { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { CreditCardProduct } from "@/components/store/credit-card-product"
import { PixCheckoutDialog } from "@/components/payment/pix-checkout-dialog"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AssetProduct {
    id: string
    title: string
    price: number
    description: string
    features: string | string[]
    category: string
    card_color: string
    thumbnail_url?: string
}

export default function LojaPage() {
    const { user, lojaAssets, isLoadingUser } = useStore()
    const [selectedProduct, setSelectedProduct] = useState<AssetProduct | null>(null)
    const [isPixDialogOpen, setIsPixDialogOpen] = useState(false)
    const { toast } = useToast()

    const handleBuyClick = (product: AssetProduct) => {
        // Check if user already owns it
        if (user?.purchasedMechanicIds.includes(product.id)) {
            toast({
                title: "Você já possui este item!",
                description: "Acesse sua biblioteca para baixar.",
                variant: "default"
            })
            return
        }

        // Open PIX checkout dialog
        setSelectedProduct(product)
        setIsPixDialogOpen(true)
    }

    const handleClosePixDialog = () => {
        setIsPixDialogOpen(false)
        setSelectedProduct(null)
    }

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Loja de Assets</h1>
                <p className="text-muted-foreground">
                    Adquira sistemas prontos para estudar ou usar diretamente no seu jogo.
                </p>
            </div>

            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-400">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold flex items-center gap-1">
                        {"</>"} Novo!
                    </span>
                    Todos os assets incluem código fonte completo para estudo e modificação.
                </div>
            </div>

            {isLoadingUser ? (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 items-start">
                    {lojaAssets.map((product, index) => {
                        const isOwned = user?.purchasedMechanicIds.includes(product.id)
                        return (
                            <div key={product.id} className="w-full max-w-sm mx-auto">
                                <CreditCardProduct
                                    title={product.title}
                                    price={product.price === 0 ? "Grátis" : `R$ ${product.price}`}
                                    cardColor={product.card_color}
                                    features={Array.isArray(product.features) ? product.features : []}
                                    cardNumber={`.... ${9000 + index * 15}`}
                                    isPopular={index === 1}
                                    onAction={() => isOwned ? null : handleBuyClick(product)}
                                />
                                {isOwned && (
                                    <div className="text-center mt-2 text-sm text-green-500 font-medium">
                                        Você já possui este item
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* PIX Checkout Dialog */}
            {selectedProduct && (
                <PixCheckoutDialog
                    isOpen={isPixDialogOpen}
                    onClose={handleClosePixDialog}
                    assetId={selectedProduct.id}
                    assetTitle={selectedProduct.title}
                    assetPrice={selectedProduct.price}
                />
            )}
        </div>
    )
}
