"use client"

import { useEffect, useState } from "react"
import { Plus, Workflow, MoreVertical, Trash2, Calendar, Clock, ChevronRight, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Blueprint {
    id: string
    title: string
    created_at: string
    updated_at?: string
    node_count?: number
}

export default function BlueprintsPage() {
    const [blueprints, setBlueprints] = useState<Blueprint[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const { toast } = useToast()
    const router = useRouter()
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        fetchBlueprints()
    }, [])

    const fetchBlueprints = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push("/login")
            return
        }

        const { data, error } = await supabase
            .from('mind_maps')
            .select('*, mind_map_nodes(count)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" })
        } else {
            setBlueprints(data.map((b: any) => ({
                ...b,
                node_count: b.mind_map_nodes[0]?.count || 0
            })))
        }
        setLoading(false)
    }

    const createBlueprint = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('mind_maps')
            .insert({
                title: "Novo Blueprint",
                user_id: user.id
            })
            .select()
            .single()

        if (error) {
            toast({ title: "Erro ao criar", description: error.message, variant: "destructive" })
        } else {
            toast({ title: "Blueprint criado!", description: "Redirecionando para o editor..." })
            router.push(`/dashboard/blueprints/${data.id}`)
        }
    }

    const deleteBlueprint = async (id: string) => {
        const { error } = await supabase
            .from('mind_maps')
            .delete()
            .eq('id', id)

        if (error) {
            toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" })
        } else {
            setBlueprints(prev => prev.filter(b => b.id !== id))
            toast({ title: "Blueprint removido" })
        }
    }

    const filteredBlueprints = blueprints.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Meus Blueprints</h1>
                    <p className="text-muted-foreground mt-1">Crie e gerencie seus mapas mentais e fluxogramas de estudo.</p>
                </div>
                <Button onClick={createBlueprint} className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                    <Plus className="h-5 w-5" /> Adicionar Blueprint
                </Button>
            </div>

            {/* Toolbar Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/50 backdrop-blur-sm border p-4 rounded-xl shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Input
                        placeholder="Buscar por título..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-10 border-border bg-background"
                    />
                    <Workflow className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                    <Button
                        variant={view === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setView('grid')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={view === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setView('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl border" />
                    ))}
                </div>
            ) : filteredBlueprints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed rounded-3xl">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Workflow className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Nenhum blueprint encontrado</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm text-center">Comece criando seu primeiro blueprint para organizar melhor seus estudos.</p>
                    <Button onClick={createBlueprint} variant="outline" className="mt-6 gap-2">
                        <Plus className="h-4 w-4" /> Criar Primeiro
                    </Button>
                </div>
            ) : view === 'grid' ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredBlueprints.map((blueprint) => (
                        <Card key={blueprint.id} className="group overflow-hidden border-border bg-card hover:border-primary/50 hover:shadow-2xl transition-all duration-300 rounded-2xl flex flex-col">
                            <Link href={`/dashboard/blueprints/${blueprint.id}`} className="flex-1">
                                <CardHeader className="pb-3 bg-muted/20">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                            <Workflow className="h-6 w-6 text-primary" />
                                        </div>
                                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                            Beta
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-4 line-clamp-1 group-hover:text-primary transition-colors">{blueprint.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-1.5 mt-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(blueprint.created_at).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 relative">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Itens no mapa</span>
                                            <span className="font-bold text-foreground">{blueprint.node_count}</span>
                                        </div>
                                        {/* Placeholder for a mini preview */}
                                        <div className="h-24 w-full bg-muted/50 rounded-xl relative overflow-hidden flex items-center justify-center group-hover:bg-muted transition-colors border border-dashed">
                                            <Plus className="h-5 w-5 text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Link>
                            <CardFooter className="border-t bg-muted/10 px-4 py-3 flex justify-between items-center group-hover:bg-muted/20 transition-colors">
                                <Link href={`/dashboard/blueprints/${blueprint.id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 gap-2 hover:bg-primary hover:text-white group/btn">
                                        Editar <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem className="text-destructive gap-2 cursor-pointer" onClick={() => deleteBlueprint(blueprint.id)}>
                                            <Trash2 className="h-4 w-4" /> Deletar Blueprint
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredBlueprints.map((blueprint) => (
                        <div key={blueprint.id} className="group bg-card border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all">
                            <Link href={`/dashboard/blueprints/${blueprint.id}`} className="flex items-center gap-4 flex-1">
                                <div className="p-3 rounded-lg bg-primary/10">
                                    <Workflow className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{blueprint.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(blueprint.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><LayoutGrid className="h-3 w-3" /> {blueprint.node_count} nós</span>
                                    </div>
                                </div>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Link href={`/dashboard/blueprints/${blueprint.id}`}>
                                    <Button variant="outline" size="sm">Editar</Button>
                                </Link>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteBlueprint(blueprint.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
