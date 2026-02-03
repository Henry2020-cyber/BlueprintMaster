"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Plus, Edit2, Trash2, Loader2, Wifi, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Initialize Supabase client
const supabase = createClient()

type Asset = {
    id: string
    title: string
    description: string | null
    price: number
    thumbnail_url: string | null
    blueprint_image_url: string | null
    drive_link: string | null
    category: string | null
    is_active: boolean
    message_limit: number
    agent_limit: number
    whatsapp_access: boolean
    card_color: string
    features: any
}

// Card theme configurations - mapped from database
const cardThemes: Record<string, { gradient: string; text: string; border?: string }> = {
    black: { gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-black", text: "text-white" },
    white: { gradient: "bg-gradient-to-br from-gray-50 to-white", text: "text-gray-900", border: "border border-gray-200" },
    orange: { gradient: "bg-gradient-to-br from-[#FF4D4D] via-[#FF6B6B] to-[#FF8E53]", text: "text-white" },
    violet: { gradient: "bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef]", text: "text-white" },
    blue: { gradient: "bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-900", text: "text-white" },
    emerald: { gradient: "bg-gradient-to-br from-emerald-500 via-teal-600 to-teal-900", text: "text-white" },
    crimson: { gradient: "bg-gradient-to-br from-rose-600 via-red-600 to-red-900", text: "text-white" },
    gold: { gradient: "bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-800", text: "text-white" },
    cyan: { gradient: "bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-700", text: "text-white" },
}

export default function AdminAssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        title: "",
        price: "0",
        colorTheme: "black",
        drive_link: ""
    })

    const fetchAssets = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
            toast({ title: "Erro", description: "Falha ao carregar assets", variant: "destructive" })
        } else {
            setAssets(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchAssets()
    }, [])

    const handleOpenDialog = (asset?: Asset) => {
        if (asset) {
            setEditingAsset(asset)
            setFormData({
                title: asset.title,
                price: asset.price.toString(),
                colorTheme: asset.card_color || "black",
                drive_link: asset.drive_link || ""
            })
        } else {
            setEditingAsset(null)
            setFormData({
                title: "",
                price: "0",
                colorTheme: "black",
                drive_link: ""
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const payload = {
                title: formData.title,
                price: parseFloat(formData.price),
                card_color: formData.colorTheme,
                drive_link: formData.drive_link,
                is_active: true
            }

            if (editingAsset) {
                await supabase.from('assets').update(payload).eq('id', editingAsset.id)
                toast({ title: "Ativo atualizado!" })
            } else {
                await supabase.from('assets').insert(payload)
                toast({ title: "Ativo criado!" })
            }

            setIsDialogOpen(false)
            fetchAssets()
        } catch (e) {
            console.error(e)
            toast({ title: "Erro ao salvar", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    const toggleActive = async (id: string, currentState: boolean) => {
        await supabase.from('assets').update({ is_active: !currentState }).eq('id', id)
        fetchAssets()
    }

    const deleteAsset = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este item?")) {
            await supabase.from('assets').delete().eq('id', id)
            fetchAssets()
            toast({ title: "Item excluído" })
        }
    }

    const getCardTheme = (cardColor: string) => {
        return cardThemes[cardColor] || cardThemes.black
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Gerenciar Produtos</h1>
                <p className="text-muted-foreground">Produtos disponíveis na loja.</p>
            </div>

            {loading ? (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Asset Cards */}
                    {assets.map((asset) => {
                        const theme = getCardTheme(asset.card_color)
                        return (
                            <div key={asset.id} className="relative group">
                                {/* Credit Card with 3D Flip */}
                                <div
                                    className="relative z-20"
                                    style={{ perspective: "1000px" }}
                                >
                                    <div className="relative aspect-[1.586/1] w-full [transform-style:preserve-3d] transition-all duration-700 group-hover:[transform:rotateY(180deg)]">
                                        {/* FRONT OF CARD */}
                                        <div className={cn(
                                            "absolute inset-0 rounded-xl p-7 flex flex-col justify-between shadow-2xl select-none overflow-hidden [backface-visibility:hidden]",
                                            theme.gradient,
                                            theme.text,
                                            theme.border || "border border-white/10"
                                        )}>
                                            {/* Header: Chip & Wifi */}
                                            <div className="flex justify-between items-start">
                                                <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center overflow-hidden shadow-inner border border-white/10 relative">
                                                    <div className="w-full h-full opacity-40 relative">
                                                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/40"></div>
                                                        <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-black/40"></div>
                                                        <div className="absolute top-0 bottom-0 right-1/3 w-[1px] bg-black/40"></div>
                                                        <div className="absolute inset-2 border border-black/20 rounded-[2px]"></div>
                                                    </div>
                                                </div>
                                                <Wifi className="h-6 w-6 opacity-50 -rotate-90" />
                                            </div>

                                            {/* Content: Title & Price */}
                                            <div className="mt-4 space-y-1">
                                                <div className="font-mono text-lg uppercase tracking-[0.15em] opacity-90 truncate font-semibold drop-shadow-sm">{asset.title}</div>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-sm opacity-60 font-medium">R$</span>
                                                    <span className="text-4xl font-bold tracking-tight drop-shadow-md">{asset.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                                    <span className="text-xs opacity-50 font-medium">/mês</span>
                                                </div>
                                            </div>

                                            {/* Footer: Limits & Circles */}
                                            <div className="flex justify-between items-end mt-4">
                                                <div className="space-y-1.5">
                                                    <div className="text-[9px] opacity-40 uppercase tracking-[0.2em] font-bold">DETALHES</div>
                                                    <div className="text-[10px] opacity-70 font-mono tracking-wide">
                                                        <span>Acesso Imediato</span>
                                                    </div>
                                                    <div className="text-[10px] opacity-50 font-mono pt-1 tracking-widest">•••• {asset.id.slice(0, 4)}</div>
                                                </div>

                                                <div className="flex -space-x-3 opacity-90">
                                                    <div className="w-8 h-8 rounded-full bg-[#EB001B] shadow-sm z-10"></div>
                                                    <div className="w-8 h-8 rounded-full bg-[#F79E1B] mix-blend-screen shadow-sm z-0"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* BACK OF CARD */}
                                        <div className={cn(
                                            "absolute inset-0 rounded-xl shadow-2xl select-none overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]",
                                            theme.gradient,
                                            theme.text,
                                            theme.border || "border border-white/10"
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
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] opacity-60 leading-relaxed">
                                                            Este cartão é propriedade do titular e deve ser devolvido mediante solicitação. O uso não autorizado é proibido por lei.
                                                        </p>
                                                        <div className="flex items-center justify-between pt-2">
                                                            <span className="text-[9px] opacity-50 font-mono">ID: •••• {asset.id.slice(0, 4)}</span>
                                                            <div className="flex gap-1">
                                                                <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                                                                    <div className="w-3 h-3 rounded-full border-2 border-current opacity-60"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom: Service Info */}
                                                <div className="flex justify-between items-end text-[8px] opacity-50">
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

                                {/* Action Bar Below Card */}
                                <div className="mt-3 flex items-center justify-between bg-card/50 backdrop-blur-sm text-card-foreground rounded-lg p-2 border border-border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-2 px-2">
                                        <Switch
                                            checked={asset.is_active}
                                            onCheckedChange={() => toggleActive(asset.id, asset.is_active)}
                                            className="scale-75 data-[state=checked]:bg-green-500"
                                        />
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                            {asset.is_active ? "Ativo" : "Inativo"}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
                                            onClick={() => handleOpenDialog(asset)}
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                            onClick={() => deleteAsset(asset.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Add New Card */}
                    <div
                        className="relative rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50 aspect-[1.586/1] flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden"
                        onClick={() => handleOpenDialog()}
                    >
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-muted-foreground group-hover:text-primary border border-border">
                            <Plus className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-widest">Novo Produto</h3>
                    </div>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    className="sm:max-w-[440px] bg-card border-border text-foreground p-0 overflow-hidden gap-0 shadow-2xl"
                >
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-lg font-bold">
                            {editingAsset ? "Editar Produto" : "Novo Produto"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-xs text-balance">
                            Configure os detalhes do ativo digital.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 pt-4 space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Nome do Produto</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ex: Starter Kit"
                                maxLength={30}
                                className="bg-input border-border text-foreground focus-visible:ring-ring h-10 rounded-lg"
                            />
                            <p className="text-[10px] text-muted-foreground">{formData.title.length}/30 caracteres</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="drive_link" className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Link do Drive (Download)</Label>
                            <div className="relative">
                                <Input
                                    id="drive_link"
                                    value={formData.drive_link}
                                    onChange={(e) => setFormData({ ...formData, drive_link: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                    maxLength={500}
                                    className="bg-input border-border text-foreground focus-visible:ring-ring h-10 rounded-lg pl-9"
                                />
                                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="grid grid-cols-[1fr_120px] gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Preço (R$)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="999999.99"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="bg-input border-border text-foreground focus-visible:ring-ring h-10 rounded-lg"
                                />
                                <p className="text-[10px] text-muted-foreground">Máx: R$ 999.999,99</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Status</Label>
                                <div className="flex items-center justify-between h-10 bg-input rounded-lg px-3 border border-border">
                                    <span className="text-xs text-muted-foreground font-medium">Ativo</span>
                                    <Switch
                                        checked={true}
                                        disabled
                                        className="scale-75 data-[state=checked]:bg-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Cor do Cartão</Label>
                            <div className="flex gap-3 flex-wrap">
                                {Object.keys(cardThemes).map((key) => {
                                    const theme = cardThemes[key]
                                    const isSelected = formData.colorTheme === key
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => setFormData({ ...formData, colorTheme: key })}
                                            className={cn(
                                                "w-10 h-8 rounded-[6px] cursor-pointer transition-all relative overflow-hidden",
                                                theme.gradient,
                                                isSelected ? "ring-2 ring-foreground ring-offset-2 ring-offset-background shadow-lg scale-105" : "hover:opacity-80 opacity-50 border border-border"
                                            )}
                                        >
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="bg-muted/50 p-4 flex gap-2 sm:gap-0 border-t border-border">
                        <div className="flex w-full gap-2">
                            <Button variant="ghost" className="flex-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg h-10" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                                Cancelar
                            </Button>
                            <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-lg h-10" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Salvando...
                                    </>
                                ) : (
                                    "Salvar"
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
