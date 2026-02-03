"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Line, LineChart, ResponsiveContainer, XAxis, Tooltip } from "recharts"
import { Users, Bot, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState({
        users: 0,
        agents: 0,
        alerts: 0
    })
    const [recentUsers, setRecentUsers] = useState<any[]>([])
    const [financeData, setFinanceData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // 1. Fetch KPI Counts
            const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
            const { count: assetsCount } = await supabase.from('assets').select('*', { count: 'exact', head: true }).eq('is_active', true)

            // Fetch alerts (logs with level error or warning in last 24h)
            const yesterday = new Date(Date.now() - 86400000).toISOString()
            const { count: alertsCount } = await supabase
                .from('system_logs')
                .select('*', { count: 'exact', head: true })
                .or('level.eq.error,level.eq.warning')
                .gt('created_at', yesterday)

            // 2. Fetch Recent Users
            const { data: usersData } = await supabase
                .from('profiles')
                .select('id, full_name, email, avatar_url, created_at')
                .order('created_at', { ascending: false })
                .limit(4)

            // 3. Fetch Revenue Data (Last 7 Days)
            const today = new Date()
            const sevenDaysAgo = new Date(today)
            sevenDaysAgo.setDate(today.getDate() - 7)

            const { data: transactions } = await supabase
                .from('transactions')
                .select('amount, created_at, status')
                .or('status.eq.completed,status.eq.paid,status.eq.pago')
                .gte('created_at', sevenDaysAgo.toISOString())
                .order('created_at', { ascending: true })

            // Process revenue for chart (Last 7 Days)
            const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
            const chartDataArray: { date: string; name: string; value: number }[] = []

            for (let i = 6; i >= 0; i--) {
                const d = new Date()
                d.setDate(d.getDate() - i)
                const dayLabel = days[d.getDay()]
                // Simplified date matching
                chartDataArray.push({
                    date: d.toISOString().split('T')[0],
                    name: dayLabel,
                    value: 0
                })
            }

            if (transactions) {
                transactions.forEach((t: any) => {
                    const tDate = t.created_at.split('T')[0]
                    const dayEntry = chartDataArray.find(d => d.date === tDate)
                    if (dayEntry) {
                        dayEntry.value += Number(t.amount) || 0
                    }
                })
            }

            setCounts(prev => ({
                ...prev,
                users: usersCount || 0,
                agents: assetsCount || 0,
                alerts: alertsCount || 0
            }))

            setRecentUsers(usersData || [])
            setFinanceData(chartDataArray)
            setLoading(false)
        }

        fetchData()
    }, [])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral do sistema e métricas principais.</p>
            </div>

            {/* Top KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total de Usuários
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{counts.users}</div>
                        <p className="text-xs text-green-500 font-medium">
                            +100% <span className="text-muted-foreground font-normal">total cadastrado</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Agentes Ativos
                        </CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{counts.agents}</div>
                        <p className="text-xs text-green-500 font-medium">
                            +100% <span className="text-muted-foreground font-normal">agentes criados</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Alertas do Sistema
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{counts.alerts}</div>
                        <p className="text-xs text-muted-foreground font-medium">
                            {counts.alerts === 0 ? (
                                <span className="text-green-500">Normal <span className="text-muted-foreground font-normal">sem erros recentes</span></span>
                            ) : (
                                <span className="text-yellow-500 font-bold">{counts.alerts} <span className="text-muted-foreground font-normal">erros nas últimas 24h</span></span>
                            )}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Middle Charts */}
            <div className="grid gap-4 md:grid-cols-1">
                {/* Revenue Chart - Clean Line Chart */}
                <Card className="bg-card border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Visão Geral de Receita</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={financeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px", color: "var(--foreground)" }}
                                        itemStyle={{ color: "#10b981" }}
                                        formatter={(value: number) => [`R$ ${value}`, "Receita"]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, fill: "#10b981", stroke: "var(--background)", strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid gap-4 md:grid-cols-1">
                {/* Recent Users - Full Width */}
                <Card className="bg-card border-border shadow-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Usuários Recentes</CardTitle>
                        <CardDescription>Novos cadastros na plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/20">
                                        <Avatar className="h-10 w-10 border border-border">
                                            <AvatarImage src={user.avatar_url || ""} />
                                            <AvatarFallback className="bg-muted text-xs font-bold text-foreground">
                                                {user.full_name?.substring(0, 2).toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1 overflow-hidden">
                                            <p className="text-sm font-medium leading-none text-foreground truncate">{user.full_name || "Usuário"}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            <span className="text-[10px] text-muted-foreground/70 font-medium mt-1">
                                                {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Nenhum usuário recente.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
