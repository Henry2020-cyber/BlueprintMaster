"use client"

import {
  Zap,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Trophy,
  Clock,
  BookOpen,
  CheckCircle,
  Star,
  Award,
  Book,
  Medal,
  Play
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import Link from "next/link"

export default function DashboardPage() {
  const { progress, dailyTasks, user, todayFocusTime } = useStore()

  const completedTasks = dailyTasks.filter(t => t.completed).length
  const totalTasks = dailyTasks.length
  const dailyProgress = (completedTasks / totalTasks) * 100

  const stats = [
    {
      title: "Aulas Concluídas",
      value: progress.completedLessons.toString(),
      change: "+12%",
      trend: "up" as const,
      icon: BookOpen,
    },
    {
      title: "Streak Atual",
      value: `${progress.streak} dias`,
      change: "+24%",
      trend: "up" as const,
      icon: Flame,
    },
    {
      title: "Taxa de Conclusão",
      value: `${progress.totalLessons > 0 ? Math.round((progress.completedLessons / progress.totalLessons) * 100) : 0}%`,
      change: "-2%",
      trend: "down" as const,
      icon: Target,
    },
  ]

  const recentActivities = [
    { title: "Aula: Variáveis em Blueprint", time: "Há 2 horas", completed: true },
    { title: "Desafio: Sistema de Inventário", time: "Há 5 horas", completed: true },
    { title: "Aula: Funções e Eventos", time: "Ontem", completed: true },
    { title: "Projeto: Menu Principal", time: "2 dias atrás", completed: false },
  ]

  const unlockedAchievements = progress.achievements.filter(a => a.unlockedAt !== null)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              Olá, {user?.name || "Desenvolvedor"}!
            </h1>
            <Badge className="bg-primary text-primary-foreground">
              {user?.plan === "pro" ? "Pro" : "Free"}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Renova em 28/02/2026</span>
            <span className="text-primary">Restam 30 dias</span>
          </div>
        </div>
        <Link href="/dashboard/estudo">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Continuar Estudando
          </Button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Stats and Chart */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.title} className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="flex items-center text-xs">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-primary" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-destructive" />
                    )}
                    <span className={stat.trend === "up" ? "text-primary" : "text-destructive"}>
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Chart Card */}
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Visão Geral de Progresso</CardTitle>
                <CardDescription>Evolução mensal do seu aprendizado</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                No caminho certo
              </Badge>
            </CardHeader>
            <CardContent>
              {/* Simple chart visualization */}
              <div className="flex h-48 items-end justify-between gap-2">
                {[40, 55, 35, 70, 50, 85, 60].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/20 transition-all hover:bg-primary/40"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Jan</span>
                <span>Fev</span>
                <span>Mar</span>
                <span>Abr</span>
                <span>Mai</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* XP Total */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Nível {progress.level}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{progress.xp.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">XP</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {progress.xpToNextLevel - progress.xp} XP para o nível {progress.level + 1}
                </div>
                <Progress value={(progress.xp / progress.xpToNextLevel) * 100} className="mt-3 h-2" />
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {progress.achievements.map((achievement) => {
                    const isUnlocked = !!achievement.unlockedAt
                    return (
                      <div
                        key={achievement.id}
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${isUnlocked ? "bg-primary/20" : "bg-muted/50 grayscale opacity-40"
                          }`}
                        title={`${achievement.title}: ${achievement.description}${isUnlocked ? '' : ' (Bloqueado)'}`}
                      >
                        {achievement.icon === "trophy" && <Trophy className={`h-6 w-6 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />}
                        {achievement.icon === "flame" && <Flame className={`h-6 w-6 ${isUnlocked ? 'text-orange-500' : 'text-muted-foreground'}`} />}
                        {achievement.icon === "zap" && <Zap className={`h-6 w-6 ${isUnlocked ? 'text-blue-500' : 'text-muted-foreground'}`} />}
                        {achievement.icon === "star" && <Star className={`h-6 w-6 ${isUnlocked ? 'text-yellow-500' : 'text-muted-foreground'}`} />}
                        {achievement.icon === "award" && <Award className={`h-6 w-6 ${isUnlocked ? 'text-purple-500' : 'text-muted-foreground'}`} />}
                        {achievement.icon === "book" && <Book className={`h-6 w-6 ${isUnlocked ? 'text-green-500' : 'text-muted-foreground'}`} />}
                        {achievement.icon === "medal" && <Medal className={`h-6 w-6 ${isUnlocked ? 'text-amber-500' : 'text-muted-foreground'}`} />}
                      </div>
                    )
                  })}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {progress.achievements.filter(a => a.unlockedAt).length} de {progress.achievements.length} conquistas desbloqueadas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Agent Health / Study Status */}
          <Card className="border-primary/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Status de Estudo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {progress.streak >= 7 ? "Excelente" : progress.streak >= 3 ? "Bom" : "Regular"}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {progress.streak >= 7
                  ? "Você está em uma sequência incrível!"
                  : "Continue estudando para manter seu ritmo"
                }
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-foreground">{progress.streak} dias de streak</span>
              </div>
            </CardContent>
          </Card>

          {/* General Progress */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-foreground">Progresso Geral</CardTitle>
              </div>
              <CardDescription>Resumo das suas metas de aprendizado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    Aulas
                  </span>
                  <span className="text-foreground">{progress.completedLessons} / {progress.totalLessons}</span>
                </div>
                <Progress value={(progress.completedLessons / progress.totalLessons) * 100} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    Desafios
                  </span>
                  <span className="text-foreground">{progress.completedExercises} / {progress.totalExercises}</span>
                </div>
                <Progress value={(progress.completedExercises / (progress.totalExercises || 1)) * 100} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Horas de Estudo
                  </span>
                  <span className="text-foreground">{Math.round(todayFocusTime)} / {user?.dailyGoalMin || 30}</span>
                </div>
                <Progress value={(todayFocusTime / (user?.dailyGoalMin || 30)) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Today's Progress */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Progresso de Hoje</CardTitle>
              <CardDescription>
                {completedTasks}/{totalTasks} tarefas concluídas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={dailyProgress} className="h-3 mb-4" />
              <Link href="/dashboard/estudo">
                <Button variant="outline" className="w-full border-border bg-transparent text-foreground hover:bg-secondary">
                  Ver Tarefas do Dia
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Atividade Recente</CardTitle>
              <CardDescription>Seu histórico de estudos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${activity.completed ? "bg-primary/20" : "bg-muted"
                      }`}>
                      {activity.completed ? (
                        <CheckCircle className="h-3 w-3 text-primary" />
                      ) : (
                        <Clock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
