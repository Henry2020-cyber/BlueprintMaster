"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { DollarSign, TrendingUp, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Initialize local client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Transaction = {
    id: string
    amount: number
    status: string
    created_at: string
    asset_id: string | null
    user_id: string | null
}

export default function AdminFinancialPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    // Stats
    const [stats, setStats] = useState({
        mrr: 0,
        totalRevenue: 0,
        averageTicket: 0,
    })

    // Chart Data
    const [chartData, setChartData] = useState<any[]>([])

    const fetchData = async () => {
        setLoading(true)

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Erro ao buscar transações:', error)
            setLoading(false)
            return
        }

        const txs = (data as Transaction[] || []).map(t => ({
            ...t,
            amount: Number(t.amount) || 0
        }))

        setTransactions(txs)

        // 1. Calcular faturamento total (Apenas pagos/completados)
        const paidTxs = txs.filter(t =>
            t.status?.toLowerCase() === 'completed' ||
            t.status?.toLowerCase() === 'paid' ||
            t.status?.toLowerCase() === 'pago'
        )

        const totalRevenue = paidTxs.reduce((acc, curr) => acc + curr.amount, 0)

        // 2. Calcular Ticket Médio
        const averageTicket = paidTxs.length > 0 ? totalRevenue / paidTxs.length : 0

        // 3. Calcular MRR (Receita dos últimos 30 dias como proxy de recorrência)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const mrr = paidTxs
            .filter(t => new Date(t.created_at) >= thirtyDaysAgo)
            .reduce((acc, curr) => acc + curr.amount, 0)

        setStats({
            mrr,
            totalRevenue,
            averageTicket
        })

        // 4. Processar dados para o gráfico (Últimos 12 meses)
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        const monthlyData: Record<string, number> = {}

        // Inicializar os últimos 6 meses com 0 (ou use 12 se preferir como na imagem)
        const now = new Date()
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthLabel = months[d.getMonth()]
            monthlyData[monthLabel] = 0
        }

        paidTxs.forEach(t => {
            const date = new Date(t.created_at)
            const monthLabel = months[date.getMonth()]
            // Apenas somar se o mês estiver no nosso range visualizado
            if (monthlyData[monthLabel] !== undefined) {
                monthlyData[monthLabel] += t.amount
            }
        })

        const chart = Object.keys(monthlyData).map(month => ({
            name: month,
            value: monthlyData[month]
        }))

        setChartData(chart)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground animate-pulse font-black uppercase tracking-widest text-xs">Carregando Dados Financeiros...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Financeiro</h1>
                    <p className="text-muted-foreground">Dados reais sincronizados diretamente do banco de dados.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                MRR (Recorrência)
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.mrr)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Baseado nos últimos 30 dias
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Receita Real
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Soma de todas as vendas pagas
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Ticket Médio
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.averageTicket)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Valor médio por transação
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-5">
                    {/* Chart - Spans 3 columns */}
                    <div className="md:col-span-3 rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg text-foreground">Fluxo de Caixa Mensal</h3>
                        </div>
                        <div className="h-[350px] w-full">
                            {chartData.some(d => d.value > 0) ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            stroke="#888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `R$${value}`}
                                            dx={-10}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(128,128,128,0.1)' }}
                                            contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px", color: "var(--foreground)" }}
                                            itemStyle={{ color: "var(--primary)", fontWeight: "bold" }}
                                            labelStyle={{ color: "var(--foreground)" }}
                                            formatter={(value: any) => [formatCurrency(value), "Receita"]}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="var(--primary)"
                                            radius={[4, 4, 0, 0]}
                                            barSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                                    <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground font-medium">Sem movimentação financeira nos últimos meses</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions - Spans 2 columns */}
                    <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col">
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg text-foreground">Últimas Transações</h3>
                        </div>
                        <div className="overflow-hidden flex-1">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead className="w-[40%]">Produto</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Data</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length > 0 ? (
                                        transactions.slice(0, 10).map((t) => (
                                            <TableRow key={t.id} className="border-border hover:bg-muted/50">
                                                <TableCell className="font-medium text-foreground">
                                                    {t.asset_id ? 'Asset Individual' : 'Plano Assinatura'}
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground">
                                                    {formatCurrency(t.amount)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge
                                                        className={`${t.status === 'completed' || t.status === 'paid' || t.status === 'pago'
                                                            ? 'bg-green-500/15 text-green-600 dark:text-green-400 hover:bg-green-500/25'
                                                            : 'bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25'
                                                            } border-0 rounded-md font-medium text-xs`}
                                                    >
                                                        {t.status === 'completed' || t.status === 'paid' || t.status === 'pago' ? 'Pago' : t.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground text-xs">
                                                    {formatDate(t.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-40 text-center">
                                                <p className="text-sm text-muted-foreground font-medium">Nenhuma transação registrada</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
