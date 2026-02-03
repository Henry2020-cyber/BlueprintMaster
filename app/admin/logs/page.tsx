"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlertCircle, CheckCircle, Info, Search, AlertTriangle, Loader2 } from "lucide-react"

type SystemLog = {
    id: string
    created_at: string
    level: 'info' | 'warning' | 'error' | 'success' | 'critical' | 'audit' // Added critical and audit
    message: string
    category: string // Was source
    action: string   // New
    metadata?: any
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<SystemLog[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [levelFilter, setLevelFilter] = useState<string>("all")

    const supabase = createClient()

    const fetchLogs = async () => {
        setLoading(true)
        let query = supabase
            .from('system_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100) // Limit for performance

        if (levelFilter !== "all") {
            query = query.eq('level', levelFilter)
        }

        if (searchQuery) {
            // Search in message, action or category
            query = query.or(`message.ilike.%${searchQuery}%,action.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        }

        const { data, error } = await query

        if (!error && data) {
            setLogs(data as SystemLog[])
        } else {
            console.error("Error fetching logs:", error)
            setLogs([])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchLogs()
    }, [levelFilter]) // Refetch when filter changes

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogs()
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    const getLevelBadge = (level: string) => {
        switch (level) {
            case 'critical':
                return <Badge variant="destructive" className="bg-red-900 text-red-100 border-red-800 uppercase text-[10px] tracking-wider font-bold animate-pulse">Crítico</Badge>
            case 'error':
                return <Badge variant="destructive" className="uppercase text-[10px] tracking-wider font-bold">Erro</Badge>
            case 'warning':
                return <Badge className="bg-yellow-500/15 text-yellow-600 dark:text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/25 border-0 uppercase text-[10px] tracking-wider font-bold">Aviso</Badge>
            case 'success':
                return <Badge className="bg-green-500/15 text-green-600 dark:text-green-500 border-green-500/20 hover:bg-green-500/25 border-0 uppercase text-[10px] tracking-wider font-bold">Sucesso</Badge>
            case 'audit':
                return <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/25 border-0 uppercase text-[10px] tracking-wider font-bold">Audit</Badge>
            default:
                return <Badge variant="secondary" className="uppercase text-[10px] tracking-wider font-bold">Info</Badge>
        }
    }

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'critical':
                return <AlertTriangle className="h-4 w-4 text-red-600" />
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'audit':
                return <Search className="h-4 w-4 text-purple-500" />
            default:
                return <Info className="h-4 w-4 text-blue-500" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Logs do Sistema</h1>
                <p className="text-muted-foreground">Monitoramento robusto de eventos, auditoria e erros da plataforma.</p>
            </div>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <CardTitle>Histórico de Eventos</CardTitle>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar logs..."
                                    className="pl-8 bg-background/50 h-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-[130px] h-9 bg-background/50">
                                    <SelectValue placeholder="Nível" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                    <SelectItem value="audit">Auditoria</SelectItem>
                                    <SelectItem value="warning">Aviso</SelectItem>
                                    <SelectItem value="error">Erro</SelectItem>
                                    <SelectItem value="critical">Crítico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Mensagem</TableHead>
                                    <TableHead>Categoria / Ação</TableHead>
                                    <TableHead>Nível</TableHead>
                                    <TableHead className="text-right">Data / Hora</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Carregando logs...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            Nenhum log encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="text-center">
                                                {getLevelIcon(log.level)}
                                            </TableCell>
                                            <TableCell className="font-medium text-sm text-foreground">
                                                <span>{log.message}</span>
                                                {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                    <div className="mt-1 text-xs text-muted-foreground font-mono truncate max-w-[300px]">
                                                        {JSON.stringify(log.metadata)}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-foreground/80 lowercase bg-muted px-1.5 py-0.5 rounded-sm w-fit">{log.category}</span>
                                                    <span className="text-muted-foreground font-mono">{log.action}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getLevelBadge(log.level)}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">
                                                {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
