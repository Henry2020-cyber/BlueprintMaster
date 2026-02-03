"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Plus, Edit2, Trash2, Loader2, Wifi } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Initialize local client
const supabase = createClient()

type Plan = {
    id: string
    name: string
    price: number
    interval: string
    features: string[] | string
    color_theme: string
    is_active: boolean
    description?: string
}

const themeStyles: Record<string, { gradient: string; text: string; chip: string; border?: string }> = {
    slate: { gradient: "bg-gradient-to-br from-slate-900 to-slate-800", text: "text-white", chip: "from-yellow-200 to-yellow-500" },
    black: { gradient: "bg-gradient-to-br from-gray-900 via-gray-800 to-black", text: "text-white", chip: "from-yellow-200 to-yellow-500" },
    white: { gradient: "bg-gradient-to-br from-gray-50 to-white", text: "text-gray-900", chip: "from-yellow-200 to-yellow-500", border: "border border-gray-200" },
    orange: { gradient: "bg-gradient-to-br from-[#FF4D4D] via-[#FF6B6B] to-[#FF8E53]", text: "text-white", chip: "from-yellow-200 to-yellow-500" },
    violet: { gradient: "bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef]", text: "text-white", chip: "from-yellow-200 to-yellow-500" },
    blue: { gradient: "bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-900", text: "text-white", chip: "from-yellow-200 to-yellow-500" },
    emerald: { gradient: "bg-gradient-to-br from-emerald-500 via-teal-600 to-teal-900", text: "text-white", chip: "from-yellow-200 to-yellow-500" },
    crimson: { gradient: "bg-gradient-to-br from-rose-600 via-red-600 to-red-900", text: "text-white", chip: "from-yellow-200 to-yellow-500" },
    gold: { gradient: "bg-gradient-to-br from-yellow-500 via-amber-600 to-yellow-800", text: "text-white", chip: "from-white/50 to-white/20" },
    cyan: { gradient: "bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-700", text: "text-white", chip: "from-yellow-200 to-yellow-500" },
}

const defaultFeatures = ["Acesso à plataforma", "Suporte básico"]

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "0",
        interval: "month",
        description: "",
        color_theme: "black",
        featuresText: ""
    })

    const fetchPlans = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .order('price', { ascending: true })

        if (error) {
            console.error(error)
            toast({ title: "Erro", description: "Falha ao carregar planos", variant: "destructive" })
        } else {
            setPlans(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    const handleOpenDialog = (plan?: Plan) => {
        if (plan) {
            setEditingPlan(plan)
            const features = typeof plan.features === 'string'
                ? JSON.parse(plan.features)
                : (Array.isArray(plan.features) ? plan.features : [])

            setFormData({
                name: plan.name,
                price: plan.price.toString(),
                interval: plan.interval || "month",
                description: plan.description || "",
                color_theme: plan.color_theme || "black",
                featuresText: features.join('\n')
            })
        } else {
            setEditingPlan(null)
            setFormData({
                name: "",
                price: "0",
                interval: "month",
                description: "",
                color_theme: "black",
                featuresText: defaultFeatures.join('\n')
            })
        }
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const featuresArray = formData.featuresText.split('\n').filter(f => f.trim() !== "")

            const payload = {
                name: formData.name,
                price: parseFloat(formData.price),
                interval: formData.interval,
                description: formData.description,
                color_theme: formData.color_theme,
                features: JSON.stringify(featuresArray)
            }

            if (editingPlan) {
                await supabase.from('plans').update(payload).eq('id', editingPlan.id)
                toast({ title: "Plano atualizado!" })
            } else {
                await supabase.from('plans').insert(payload)
                toast({ title: "Plano criado!" })
            }

            setIsDialogOpen(false)
            fetchPlans()
        } catch (e) {
            toast({ title: "Erro ao salvar", variant: "destructive" })
        } finally {
            setIsSaving(false)
        }
    }

    const toggleActive = async (id: string, currentState: boolean) => {
        await supabase.from('plans').update({ is_active: !currentState }).eq('id', id)
        fetchPlans()
    }

    const deletePlan = async (id: string) => {
        if (confirm("Tem certeza? Usuários neste plano podem ser afetados.")) {
            await supabase.from('plans').delete().eq('id', id)
            fetchPlans()
        }
    }

    const getTheme = (color: string) => themeStyles[color] || themeStyles.black

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Planos e Limites</h1>
                <p className="text-muted-foreground">Configure os planos disponíveis e seus recursos.</p>
            </div>

            {loading ? (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {plans.map((plan) => {
                        const style = getTheme(plan.color_theme)
                        const features = typeof plan.features === 'string'
                            ? JSON.parse(plan.features)
                            : (Array.isArray(plan.features) ? plan.features : [])

                        return (
                            <div key={plan.id} className="relative group">
                                {/* Credit Card Visual */}
                                <div className={cn(
                                    "relative rounded-xl p-7 shadow-2xl aspect-[1.586/1] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:scale-[1.02] select-none border border-white/5",
                                    style.gradient,
                                    style.text
                                )}>
                                    {/* Header */}
                                    <div className="flex justify-between items-start">
                                        <div className={cn("w-12 h-9 rounded-md bg-gradient-to-br flex items-center justify-center overflow-hidden shadow-inner border border-white/10", style.chip)}>
                                            <div className="w-full h-full opacity-40 relative">
                                                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/40"></div>
                                                <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-black/40"></div>
                                                <div className="absolute top-0 bottom-0 right-1/3 w-[1px] bg-black/40"></div>
                                                <div className="absolute inset-2 border border-black/20 rounded-[2px]"></div>
                                            </div>
                                        </div>
                                        <Wifi className="h-6 w-6 opacity-50 -rotate-90" />
                                    </div>

                                    {/* Content */}
                                    <div className="mt-4 space-y-1">
                                        <div className="font-mono text-xl uppercase tracking-[0.15em] opacity-90 truncate font-semibold drop-shadow-sm">{plan.name}</div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-sm opacity-60 font-medium">R$</span>
                                            <span className="text-4xl font-bold tracking-tight drop-shadow-md">{plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                            <span className="text-xs opacity-50 font-medium">/mês</span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="space-y-1.5">
                                            <div className="text-[9px] opacity-40 uppercase tracking-[0.2em] font-bold">DETALHES</div>
                                            <div className="text-[10px] opacity-70 font-mono tracking-wide truncate max-w-[140px] flex items-center gap-2">
                                                <span>{features.length} Recursos</span>
                                                <span className="opacity-30">•</span>
                                                <span>Acesso Total</span>
                                            </div>
                                            <div className="text-[10px] opacity-50 font-mono pt-1 tracking-widest">•••• {plan.id.substring(0, 4)}</div>
                                        </div>

                                        <div className="flex -space-x-3 opacity-90">
                                            <div className="w-8 h-8 rounded-full bg-[#EB001B]"></div>
                                            <div className="w-8 h-8 rounded-full bg-[#F79E1B] mix-blend-screen"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className="mt-3 flex items-center justify-between bg-card/50 backdrop-blur-sm text-card-foreground rounded-lg p-2 border border-white/5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-2 px-2">
                                        <Switch
                                            checked={plan.is_active}
                                            onCheckedChange={() => toggleActive(plan.id, plan.is_active)}
                                            className="scale-75 data-[state=checked]:bg-green-500"
                                        />
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                                            {plan.is_active ? "Ativo" : "Inativo"}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5" onClick={() => handleOpenDialog(plan)}>
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={() => deletePlan(plan.id)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {/* Add New Plan Card */}
                    <div
                        className="relative rounded-xl border border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 aspect-[1.586/1] flex flex-col items-center justify-center cursor-pointer transition-all group"
                        onClick={() => handleOpenDialog()}
                    >
                        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-white/40 group-hover:text-white/80 border border-white/5">
                            <Plus className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">Novo Plano</h3>
                    </div>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[440px] bg-[#09090b] border-white/10 text-zinc-100 p-0 overflow-hidden gap-0 shadow-2xl">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle className="text-lg font-bold">Editar Plano</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs text-balance">
                            Configure os detalhes, preços e limites do plano.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 pt-4 space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Nome do Plano</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Free Trial"
                                maxLength={30}
                                className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-zinc-700 h-10 rounded-lg"
                            />
                        </div>

                        <div className="grid grid-cols-[1fr_120px] gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Preço (R$)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="999999.99"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-zinc-700 h-10 rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Status</Label>
                                <div className="flex items-center justify-between h-10 bg-zinc-900 rounded-lg px-3 border border-zinc-800">
                                    <span className="text-xs text-zinc-400 font-medium">Ativo</span>
                                    <Switch
                                        checked={true}
                                        disabled
                                        className="scale-75 data-[state=checked]:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Cor do Cartão</Label>
                            <div className="flex gap-3 flex-wrap">
                                {Object.keys(themeStyles).filter(k => k !== 'slate').map((color) => {
                                    const theme = themeStyles[color]
                                    const isSelected = formData.color_theme === color
                                    return (
                                        <div
                                            key={color}
                                            onClick={() => setFormData({ ...formData, color_theme: color })}
                                            className={cn(
                                                "w-10 h-8 rounded-[6px] cursor-pointer transition-all relative overflow-hidden",
                                                theme.gradient,
                                                isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-[#09090b] shadow-lg scale-105" : "hover:opacity-80 opacity-50 border border-white/10"
                                            )}
                                        >
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400 text-[10px] uppercase tracking-wider font-bold">Recursos</Label>
                            <Textarea
                                value={formData.featuresText}
                                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                                maxLength={500}
                                className="min-h-[100px] bg-zinc-900 border-zinc-800 text-white focus-visible:ring-zinc-700 resize-none text-xs rounded-lg"
                                placeholder="- Recurso 1&#10;- Recurso 2"
                            />
                        </div>
                    </div>
                    <DialogFooter className="bg-zinc-900/50 p-4 flex gap-2 sm:gap-0 border-t border-white/5">
                        <div className="flex w-full gap-2">
                            <Button variant="ghost" className="flex-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg h-10" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                                Cancelar
                            </Button>
                            <Button className="flex-1 bg-white text-black hover:bg-zinc-200 font-bold rounded-lg h-10" onClick={handleSave} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
