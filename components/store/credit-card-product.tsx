"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Download, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

interface CreditCardProductProps {
    title: string
    price?: string
    period?: string
    cardNumber?: string
    memberSince?: string
    features: string[]
    cardColor: string // Now comes from database
    isPopular?: boolean
    mode?: "store" | "library"
    stats?: {
        label: string
        value: string
        color?: string
    }[]
    onAction?: () => void
}

// Card theme configurations - same as admin panel
const cardThemes: Record<string, { gradient: string; text: string; chip: string; button: string; border?: string }> = {
    black: {
        gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
        text: "text-white",
        chip: "from-yellow-200 to-yellow-500",
        button: "bg-white text-black hover:bg-gray-200"
    },
    white: {
        gradient: "bg-gradient-to-br from-gray-50 to-white",
        text: "text-gray-900",
        chip: "from-yellow-200 to-yellow-500",
        button: "bg-white text-black hover:bg-gray-100",
        border: "border border-gray-200"
    },
    orange: {
        gradient: "bg-gradient-to-br from-[#FF4D4D] via-[#FF6B6B] to-[#FF8E53]",
        text: "text-white",
        chip: "from-yellow-200 to-yellow-500",
        button: "bg-black text-white hover:bg-black/80"
    },
    violet: {
        gradient: "bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef]",
        text: "text-white",
        chip: "from-yellow-200 to-yellow-500",
        button: "bg-black text-white hover:bg-black/80"
    },
    blue: {
        gradient: "bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-900",
        text: "text-white",
        chip: "from-yellow-200 to-yellow-500",
        button: "bg-white text-blue-900 hover:bg-gray-100"
    },
    emerald: {
        gradient: "bg-gradient-to-br from-emerald-500 via-teal-600 to-teal-900",
        text: "text-white",
        chip: "from-yellow-200 to-yellow-500",
        button: "bg-white text-teal-900 hover:bg-emerald-50"
    },
    crimson: {
        gradient: "bg-gradient-to-br from-rose-600 via-red-600 to-red-900",
        text: "text-white",
        chip: "from-yellow-200 to-yellow-500",
        button: "bg-white text-red-900 hover:bg-rose-50"
    },
    gold: {
        gradient: "bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-800",
        text: "text-white",
        chip: "from-white/50 to-white/20",
        button: "bg-black text-amber-500 hover:bg-gray-900",
        border: "border border-yellow-500/30"
    },
    cyan: {
        gradient: "bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-700",
        text: "text-white",
        chip: "from-yellow-200 to-yellow-500",
        button: "bg-white text-cyan-900 hover:bg-cyan-50"
    },
    slate: {
        gradient: "bg-gradient-to-br from-slate-900 to-slate-800",
        text: "text-white",
        chip: "from-yellow-200 to-yellow-500",
        button: "bg-white text-slate-900 hover:bg-gray-100"
    }
}

export function CreditCardProduct({
    title,
    price,
    period = "/vitalício",
    cardNumber = ".... 0000",
    features,
    cardColor,
    isPopular,
    mode = "store",
    stats,
    onAction
}: CreditCardProductProps) {
    const router = useRouter()
    const { user } = useStore()
    const style = cardThemes[cardColor] || cardThemes.black
    const numericPrice = typeof price === 'string'
        ? price.replace('R$', '').trim()
        : typeof price === 'number'
            ? (price as number).toFixed(2).replace('.', ',')
            : "0,00"

    const handlePurchase = () => {
        // If custom action is provided, use it
        if (onAction) {
            onAction()
            return
        }

        // Check if user is authenticated
        if (!user) {
            // Redirect to login with return URL
            const currentPath = window.location.pathname
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
            return
        }

        // User is authenticated - proceed with payment
        // TODO: Implement payment flow here
        console.log('Initiating payment for:', title)
        // This will be implemented when you choose your payment gateway
    }

    return (
        <div className={cn(
            "relative flex flex-col gap-6"
        )}>
            {/* Credit Card Visual - NOW ON TOP */}
            <div
                className="relative z-20 group"
                style={{ perspective: "1000px" }}
            >
                <div className="relative aspect-[1.586/1] w-full [transform-style:preserve-3d] transition-all duration-700 group-hover:[transform:rotateY(180deg)]">
                    {/* FRONT OF CARD */}
                    <div className={cn(
                        "absolute inset-0 rounded-xl px-6 pt-6 pb-10 flex flex-col justify-between shadow-2xl select-none border border-white/5 [backface-visibility:hidden]",
                        style.gradient,
                        style.border
                    )}>
                        {/* Top: Chip & Contactless */}
                        <div className="flex justify-between items-start">
                            <div className={cn("w-12 h-9 rounded-md bg-gradient-to-br flex items-center justify-center overflow-hidden border border-white/10 shadow-inner", style.chip)}>
                                <div className="w-full h-full opacity-40 relative">
                                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/40"></div>
                                    <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-black/40"></div>
                                    <div className="absolute top-0 bottom-0 right-1/3 w-[1px] bg-black/40"></div>
                                    <div className="absolute inset-2 border border-black/20 rounded-[2px]"></div>
                                </div>
                            </div>
                            {/* Contactless Icon */}
                            <Wifi className={cn("h-6 w-6 -rotate-90 opacity-50", style.text)} />
                        </div>

                        {/* Middle: Title & Price */}
                        <div className="mt-4 text-left space-y-1">
                            <p className={cn("text-xl font-mono uppercase tracking-[0.15em] opacity-90 truncate font-semibold drop-shadow-sm", style.text)}>{title}</p>
                            {price && (
                                <div className={cn("flex items-baseline gap-1.5", style.text)}>
                                    <span className="text-sm opacity-60 font-medium">R$</span>
                                    <span className="text-4xl font-bold tracking-tight drop-shadow-md">{numericPrice}</span>
                                    <span className="text-xs opacity-50 font-medium">{period === '/vitalício' ? '' : period}</span>
                                </div>
                            )}
                        </div>

                        {/* Bottom: Number & Logos */}
                        <div className={cn("flex justify-between items-end mt-4", style.text)}>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[9px] opacity-40 uppercase tracking-[0.2em] font-bold">INFO</span>
                                <div className="text-[10px] opacity-70 font-mono tracking-wide">
                                    {features.length > 0 ? `${features.length} Recursos` : 'Acesso Total'}
                                </div>
                                <div className="text-[10px] opacity-50 font-mono pt-1 tracking-widest">{cardNumber}</div>
                            </div>
                            <div className="flex -space-x-3 opacity-90">
                                <div className="w-8 h-8 rounded-full bg-[#EB001B] shadow-sm z-10"></div>
                                <div className="w-8 h-8 rounded-full bg-[#F79E1B] mix-blend-screen shadow-sm z-0"></div>
                            </div>
                        </div>
                    </div>

                    {/* BACK OF CARD */}
                    <div className={cn(
                        "absolute inset-0 rounded-xl shadow-2xl select-none overflow-hidden border border-white/5 [backface-visibility:hidden] [transform:rotateY(180deg)]",
                        style.gradient,
                        style.border
                    )}>
                        {/* Magnetic Stripe */}
                        <div className="absolute top-6 left-0 right-0 h-12 bg-black"></div>

                        {/* Card Content */}
                        <div className="relative h-full p-7 flex flex-col justify-between">
                            {/* Top spacing for magnetic stripe */}
                            <div className="h-12"></div>

                            {/* Signature and CVV Area */}
                            <div className="flex-1 flex flex-col justify-center gap-4">
                                {/* Signature Strip */}
                                <div className="bg-white/90 h-10 rounded flex items-center px-3 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                                    <span className="text-[10px] text-gray-400 italic font-serif">Authorized Signature</span>
                                    <div className="ml-auto flex items-center gap-2 bg-white px-2 py-1 rounded">
                                        <span className="text-[8px] text-gray-500 font-bold">CVV</span>
                                        <span className="text-xs font-mono font-bold text-gray-800">***</span>
                                    </div>
                                </div>

                                {/* Info Text */}
                                <div className={cn("space-y-1", style.text)}>
                                    <p className="text-[8px] opacity-60 leading-relaxed">
                                        Este cartão é propriedade do titular e deve ser devolvido mediante solicitação. O uso não autorizado é proibido por lei.
                                    </p>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-[9px] opacity-50 font-mono">ID: {cardNumber}</span>
                                        <div className="flex gap-1">
                                            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full border-2 border-current opacity-60"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom: Service Info */}
                            <div className={cn("flex justify-between items-end text-[8px] opacity-50", style.text)}>
                                <div>
                                    <p className="font-bold uppercase tracking-wider">Premium Access</p>
                                    <p className="opacity-70">blueprintmaster.com</p>
                                </div>
                                <div className="flex -space-x-2 opacity-70">
                                    <div className="w-6 h-6 rounded-full bg-[#EB001B] shadow-sm z-10"></div>
                                    <div className="w-6 h-6 rounded-full bg-[#F79E1B] mix-blend-screen shadow-sm z-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section (Below Card) - NOW BEHIND */}
            <div className="bg-[#0f0f0f]/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 -mt-16 pt-20 flex flex-col flex-1 shadow-inner relative z-10">
                {mode === "store" ? (
                    <>
                        <ul className="space-y-3 mb-8 flex-1">
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <Check className={cn("h-4 w-4 shrink-0 mt-0.5 transition-colors",
                                        cardColor === "orange" ? "text-orange-500" :
                                            cardColor === "violet" ? "text-violet-500" :
                                                "text-white group-hover:text-emerald-400"
                                    )} />
                                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{feature}</span>
                                </div>
                            ))}
                        </ul>
                        <Button
                            onClick={handlePurchase}
                            className={cn("w-full h-12 rounded-xl font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] tracking-wide", style.button)}
                        >
                            {price === "Grátis" || numericPrice === "0,00" ? "Baixar Agora" : "Comprar Agora"}
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-col gap-6">
                        {stats && (
                            <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-xs text-gray-500 mb-1 uppercase">{stat.label}</div>
                                        <div className={cn("text-lg font-bold", stat.color || "text-white")}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-3">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Recursos Inclusos</p>
                            <div className="flex flex-wrap gap-2">
                                {features.slice(0, 3).map((f, i) => (
                                    <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-300 border border-white/5">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto pt-4 flex gap-3">
                            <Button
                                onClick={onAction}
                                className="flex-1 bg-white text-black hover:bg-gray-200 gap-2 font-bold"
                            >
                                <Download className="h-4 w-4" /> Baixar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
