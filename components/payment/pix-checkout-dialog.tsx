"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Check, Loader2, X, AlertCircle, Wifi } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { createBrowserClient } from "@supabase/ssr"
import { cn } from "@/lib/utils"

// Card Themes Configuration (Copied from CreditCardProduct)
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
        button: "bg-black text-white hover:bg-gray-800",
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

interface PixCheckoutDialogProps {
    isOpen: boolean
    onClose: () => void
    assetId: string
    assetTitle: string
    assetPrice: number
}

export function PixCheckoutDialog({
    isOpen,
    onClose,
    assetId,
    assetTitle,
    assetPrice,
}: PixCheckoutDialogProps) {
    const [loading, setLoading] = useState(false)
    const [pixData, setPixData] = useState<any>(null)
    const [copied, setCopied] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed'>('pending')
    const [assetDetails, setAssetDetails] = useState<any>(null)
    const fetchLock = useRef<string | null>(null) // Lock to prevent duplicate requests
    const { toast } = useToast()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Fetch Asset Details (Color, Features) & Generate PIX
    useEffect(() => {
        if (isOpen) {
            // Prevent double-fetch in Strict Mode or rapid updates
            if (fetchLock.current === assetId) return
            fetchLock.current = assetId

            setIsFlipped(false)
            setPaymentStatus('pending')
            setLoading(true)

            // 1. Fetch Asset Details
            const fetchDetails = async () => {
                const { data } = await supabase
                    .from('assets')
                    .select('card_color, features')
                    .eq('id', assetId)
                    .single()

                setAssetDetails(data || { card_color: 'black', features: [] })

                // 2. Generate PIX if not exists
                // Note: We don't check !pixData here because we want fresh PIX on new session
                try {
                    const response = await fetch('/api/payment/create-pix', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ assetId }),
                    })

                    const pixtResponse = await response.json()
                    if (!response.ok) throw new Error(pixtResponse.error || 'Erro ao gerar PIX')
                    setPixData(pixtResponse.pix)
                } catch (error: any) {
                    toast({ title: "Erro", description: error.message, variant: "destructive" })
                } finally {
                    setLoading(false)
                }
            }

            fetchDetails()
        } else {
            fetchLock.current = null // Reset lock when closed
            setPixData(null)
            setAssetDetails(null)
        }
    }, [isOpen, assetId])

    // Polling Logic
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isOpen && pixData?.id && paymentStatus === 'pending') {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/payment/check-status?transactionId=${pixData.id}`)
                    const data = await res.json()
                    if (data.completed) {
                        handlePaymentSuccess()
                        clearInterval(interval)
                    }
                } catch (e) { console.error(e) }
            }, 5000)
        }
        return () => clearInterval(interval)
    }, [isOpen, pixData, paymentStatus])

    const handlePaymentSuccess = () => {
        setPaymentStatus('completed')
        setIsFlipped(true)
        toast({
            title: "Sucesso!",
            description: "Pagamento confirmado.",
            className: "bg-green-600 text-white"
        })
    }

    const handleCopyPixCode = () => {
        if (pixData?.qrCode) {
            navigator.clipboard.writeText(pixData.qrCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    // Get Theme Style
    const themeColor = assetDetails?.card_color || 'black'
    const style = cardThemes[themeColor] || cardThemes.black
    const numericPrice = assetPrice.toFixed(2).replace('.', ',')

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Removido overflow-hidden e aumentado tamanho para evitar clipping no giro 3D */}
            <DialogContent showCloseButton={false} className="sm:max-w-none w-full h-full sm:h-auto sm:w-auto bg-transparent border-none shadow-none p-0 flex items-center justify-center overflow-visible">
                <DialogTitle className="sr-only">Checkout PIX - {assetTitle}</DialogTitle>
                <DialogDescription className="sr-only">
                    Escaneie o QR Code para pagar R$ {numericPrice} e liberar o acesso ao asset.
                </DialogDescription>

                <div className="relative w-[400px] h-[252px] group" style={{ perspective: "1200px" }}> {/* Perspectiva aumentada */}

                    {/* Botão Fechar */}
                    <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        onClick={onClose}
                        className="absolute -top-12 right-0 text-white hover:bg-white/10 p-2 rounded-full z-50 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>

                    <motion.div
                        className="relative w-full h-full text-left" // Removido preserve-3d daqui e aplicado via style para garantir
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }} // Suavizado
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* === FRENTE DO CARTÃO (QR CODE) === */}
                        <div className={cn(
                            "absolute inset-0 rounded-2xl shadow-2xl p-6 flex flex-col justify-between border border-white/10", // Removidio overflow-hidden
                            style.gradient, style.border
                        )} style={{ backfaceVisibility: "hidden" }}>

                            {/* Topo: Chip e Wifi apenas */}
                            <div className="flex justify-between items-start relative z-10">
                                <div className={cn("w-12 h-9 rounded-md bg-gradient-to-br flex items-center justify-center overflow-hidden border border-white/10 shadow-inner", style.chip)}>
                                    <div className="w-full h-full opacity-40 relative">
                                        <div className="absolute top-1/2 w-full h-[1px] bg-black/40"></div>
                                        <div className="absolute left-1/3 h-full w-[1px] bg-black/40"></div>
                                        <div className="absolute right-1/3 h-full w-[1px] bg-black/40"></div>
                                    </div>
                                </div>
                                <Wifi className={cn("h-6 w-6 -rotate-90 opacity-50", style.text)} />
                            </div>

                            {/* REMOVIDO: Título e Preço centrais que estavam poluindo */}

                            {/* === QR CODE OVERLAY (Centralizado e Limpo) === */}
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-4">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                ) : pixData ? (
                                    <div className="flex flex-col items-center gap-3 w-full px-8 animate-in zoom-in duration-300">

                                        <p className="text-[10px] text-white/90 font-medium uppercase tracking-wider text-center drop-shadow-md">
                                            Aponte a câmera para pagar
                                        </p>

                                        <div className="bg-white p-2 rounded-lg shadow-2xl relative group">
                                            {pixData.qrCodeImage && (
                                                <Image
                                                    src={pixData.qrCodeImage}
                                                    alt="QR Code"
                                                    width={100}
                                                    height={100}
                                                    className="object-contain"
                                                />
                                            )}
                                        </div>

                                        <div className="flex gap-2 w-full justify-center">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-7 text-[10px] bg-white/90 hover:bg-white text-black font-bold shadow-lg w-24 rounded-full"
                                                onClick={handleCopyPixCode}
                                            >
                                                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                                {copied ? "COPIADO" : "COPIAR"}
                                            </Button>

                                            {/* Botão Fake Success para DevMode */}
                                            {pixData.qrCode.includes("DevMode") && (
                                                <Button
                                                    size="sm"
                                                    className="h-7 w-7 p-0 bg-yellow-500/80 hover:bg-yellow-500 text-black border-none rounded-full"
                                                    onClick={() => handlePaymentSuccess()}
                                                    title="Simular Sucesso (Modo Teste)"
                                                >
                                                    <Check className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-white text-xs">Erro ao carregar PIX</p>
                                )}
                            </div>

                            {/* Bottom: Info Minimalista */}
                            <div className="flex justify-between items-end mt-auto relative z-10">
                                <div className="text-white">
                                    <p className="text-[10px] opacity-70 font-mono tracking-widest">R$ {numericPrice}</p>
                                </div>
                                <div className="flex -space-x-3 opacity-90">
                                    <div className="w-8 h-8 rounded-full bg-[#EB001B] shadow-sm z-10"></div>
                                    <div className="w-8 h-8 rounded-full bg-[#F79E1B] mix-blend-screen shadow-sm z-0"></div>
                                </div>
                            </div>
                        </div>

                        {/* === VERSO DO CARTÃO (SUCESSO) === */}
                        <div className={cn(
                            "absolute inset-0 rounded-2xl shadow-2xl overflow-hidden border border-white/5", // Removido backface-hidden do classname e aplicado no style
                            style.gradient, style.border
                        )} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                            <div className="absolute top-6 left-0 right-0 h-10 bg-black"></div>

                            <div className="relative h-full p-6 flex flex-col justify-between pt-20">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg shadow-white/20"
                                    >
                                        <Check className="w-6 h-6 stroke-[4]" />
                                    </motion.div>
                                    <div className="text-center">
                                        <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">
                                            Compra Aprovada!
                                        </h3>
                                        <p className="text-[10px] text-white/70 mt-1">Obrigado pela preferência</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="text-[8px] opacity-60 text-white">
                                        <p className="font-serif italic">Authorized Signature</p>
                                        <p className="font-mono mt-1 opacity-70">CODE: {pixData?.id?.slice(0, 8) || '####'}</p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-white text-black hover:bg-gray-200 text-xs font-bold shadow-lg"
                                        onClick={onClose}
                                    >
                                        ACESSAR
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
