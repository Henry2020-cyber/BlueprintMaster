"use client"


import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    Trophy,
    Star,
    Zap,
    Flame,
    Target,
    BookOpen,
    Settings,
    Mail,
    Package,
    Loader2,
    ShoppingCart,
    GraduationCap,
    RotateCcw
} from "lucide-react"
import { CreditCardProduct } from "@/components/store/credit-card-product"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"

export default function ProfilePage() {
    const { user, progress, myAssets, isLoadingUser, resetProgress } = useStore()
    const { toast } = useToast()
    const [isResetting, setIsResetting] = useState(false)
    const [resetDialogOpen, setResetDialogOpen] = useState(false)

    const unlockedAchievements = progress.achievements.filter(a => a.unlockedAt !== null)

    const handleResetProgress = async () => {
        setIsResetting(true)
        try {
            await resetProgress()
            toast({
                title: "Progresso resetado",
                description: "Todo o seu histórico de estudo foi apagado.",
            })
        } catch (err) {
            toast({
                title: "Erro ao resetar",
                description: "Não foi possível resetar seu progresso.",
                variant: "destructive"
            })
        } finally {
            setIsResetting(false)
            setResetDialogOpen(false)
        }
    }

    const handleDownload = (link?: string) => {
        if (link) {
            window.open(link, '_blank')
        } else {
            toast({
                title: "Download Indisponível",
                description: "O link de download para este item ainda não foi cadastrado.",
                variant: "destructive"
            })
        }
    }

    const router = useRouter()

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Cabeçalho Limpo e Profissional */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-sm">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                {user?.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {user?.plan === "pro" && (
                            <div className="absolute -right-1 -bottom-1 bg-primary text-primary-foreground p-1 rounded-full border-2 border-card shadow-sm">
                                <Star className="h-3 w-3 fill-current" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                            <Badge variant={user?.plan === "pro" ? "default" : "secondary"} className="h-5 px-2 text-[10px] font-bold uppercase tracking-wider">
                                {user?.plan === "pro" ? "Plano Pro Ativo" : "Versão Gratuita"}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1.5 font-medium">
                            <Mail className="h-3.5 w-3.5" /> {user?.email}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" size="sm" className="gap-2 border-border bg-background shadow-xs h-9" onClick={() => router.push('/dashboard/configuracoes')}>
                            <Settings className="h-4 w-4" />
                            Configurações
                        </Button>
                    </div>
                </div>
            </div>

            {/* Estatísticas Principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatSimple icon={Zap} label="Pontos XP" value={progress.xp.toLocaleString()} />
                <StatSimple icon={Flame} label="Streak Diário" value={`${progress.streak}d`} />
                <StatSimple icon={GraduationCap} label="Aulas" value={progress.completedLessons} />
                <StatSimple icon={Trophy} label="Conquistas" value={unlockedAchievements.length} />
            </div>

            <Tabs defaultValue="assets" className="space-y-6">
                <TabsList className="bg-muted/40 p-1 rounded-xl h-11 w-fit border border-border">
                    <TabsTrigger value="assets" className="gap-2 px-6 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs text-xs font-semibold">
                        <Package className="h-3.5 w-3.5" />
                        Sistemas & Assets
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="gap-2 px-6 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs text-xs font-semibold">
                        <Trophy className="h-3.5 w-3.5" />
                        Conquistas
                    </TabsTrigger>
                </TabsList>

                {/* Aba de Assets - Foco Principal */}
                <TabsContent value="assets" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {isLoadingUser ? (
                        <div className="flex h-60 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {myAssets.length > 0 ? myAssets.map((asset, i) => (
                                <CreditCardProduct
                                    key={asset.id || i}
                                    title={asset.title}
                                    cardNumber={`ID: ${asset.id?.substring(0, 8).toUpperCase()}`}
                                    features={asset.features}
                                    cardColor={asset.card_color}
                                    mode="library"
                                    onAction={() => handleDownload(asset.drive_link)}
                                    stats={[
                                        { label: "Versão", value: "1.0", color: "text-white" },
                                        { label: "Engine", value: "UE5", color: "text-gray-400" }
                                    ]}
                                />
                            )) : (
                                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-border rounded-2xl bg-muted/20">
                                    <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center shadow-xs">
                                        <ShoppingCart className="h-8 w-8 text-muted-foreground opacity-20" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold">Sua biblioteca está vazia</h3>
                                        <p className="text-muted-foreground max-w-xs mx-auto text-xs font-medium">
                                            Visite a loja para adquirir blueprints e assets profissionais.
                                        </p>
                                    </div>
                                    <Button onClick={() => router.push('/dashboard/loja')} size="sm" className="font-bold">
                                        Ir para Loja
                                    </Button>
                                </div>
                            )}

                            {myAssets.length > 0 && (
                                <div
                                    onClick={() => router.push('/dashboard/loja')}

                                    className="border border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/30 transition-colors group"
                                >
                                    <div className="h-12 w-12 rounded-full bg-background border border-border flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                        <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <h4 className="mt-3 text-sm font-bold text-foreground">Adquirir Mais</h4>
                                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">Visitar loja oficial</p>
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                {/* Aba de Conquistas */}
                <TabsContent value="achievements" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {progress.achievements.map((achievement) => {
                        const isUnlocked = !!achievement.unlockedAt
                        return (
                            <Card key={achievement.id} className={cn("border-border overflow-hidden transition-all", isUnlocked ? "bg-card shadow-xs" : "bg-muted/30 grayscale opacity-40")}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border border-border shadow-inner text-xl",
                                        isUnlocked ? "bg-primary/5 text-primary" : "bg-muted text-muted-foreground"
                                    )}>
                                        <AchievementSmall icon={achievement.icon} className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 truncate">
                                            {achievement.title}
                                            {isUnlocked && <Star className="h-2.5 w-2.5 fill-current text-primary" />}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground font-medium leading-tight line-clamp-2">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </TabsContent>
            </Tabs>

            {/* Opção de Reset Sutil */}
            <div className="pt-6 border-t border-border mt-8 flex justify-center">
                <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors opacity-50 hover:opacity-100">
                            <RotateCcw className="h-3 w-3" />
                            Reiniciar Progresso
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="border-border bg-card">
                        <DialogHeader>
                            <DialogTitle className="text-foreground text-xl">Resetar todo o progresso?</DialogTitle>
                            <DialogDescription className="text-muted-foreground py-2 text-sm italic">
                                Isso apagará permanentemente seu histórico, XP e conquistas. Assets comprados CONTINUARÃO na sua conta.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0 mt-4">
                            <Button variant="ghost" size="sm" className="text-foreground" onClick={() => setResetDialogOpen(false)}>Cancelar</Button>
                            <Button variant="destructive" size="sm" className="font-bold" onClick={handleResetProgress} disabled={isResetting}>
                                {isResetting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : null}
                                Sim, resetar meus dados
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

function StatSimple({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
    return (
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                <Icon className="h-4 w-4" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-base font-bold text-foreground leading-tight">{value}</p>
            </div>
        </div>
    )
}

function AchievementSmall({ icon, className }: { icon: string, className?: string }) {
    switch (icon) {
        case "zap": return <Zap className={className} />
        case "book": return <BookOpen className={className} />
        case "flame": return <Flame className={className} />
        case "trophy": return <Trophy className={className} />
        case "star": return <Star className={className} />
        case "award": return <Star className={className} />
        case "medal": return <Trophy className={className} />
        default: return <Star className={className} />
    }
}
