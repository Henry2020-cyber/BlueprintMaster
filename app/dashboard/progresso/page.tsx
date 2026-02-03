"use client"

import React from "react"

import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  Star,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useStore } from "@/lib/store"

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  flame: Flame,
  zap: Zap,
  star: Star,
  clock: Clock,
  award: Award,
  calendar: Calendar,
  "check-circle": CheckCircle,
}

export default function ProgressoPage() {
  const { progress, modules } = useStore()

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons, 0)
  const completedLessons = modules.reduce((acc, m) => acc + Math.floor(m.lessons * ((m.progress || 0) / 100)), 0)
  const overallProgress = Math.round((completedLessons / totalLessons) * 100)
  const earnedBadges = progress.achievements.filter(a => a.unlockedAt !== null).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Progresso</h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe sua evolução e conquistas
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nível Atual</p>
                <p className="text-2xl font-bold text-foreground">Level {progress.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20">
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XP Total</p>
                <p className="text-2xl font-bold text-foreground">{progress.xp.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak Atual</p>
                <p className="text-2xl font-bold text-foreground">{progress.streak} dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                <Trophy className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conquistas</p>
                <p className="text-2xl font-bold text-foreground">{earnedBadges}/{progress.achievements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Module Progress */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Progresso por Módulo</CardTitle>
                  <CardDescription>
                    {completedLessons} de {totalLessons} aulas concluídas
                  </CardDescription>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  {overallProgress}% completo
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modules.map((module) => (
                  <div key={module.id}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{module.title}</span>
                        {module.completed && (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(module.lessons * ((module.progress || 0) / 100))}/{module.lessons} aulas
                      </span>
                    </div>
                    <Progress value={module.progress || 0} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* XP Progress */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Progresso de Nível</CardTitle>
              <CardDescription>
                {progress.xpToNextLevel - progress.xp} XP para o próximo nível
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-4 overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all"
                  style={{ width: `${(progress.xp / progress.xpToNextLevel) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Level {progress.level}</span>
                <span className="font-semibold text-primary">
                  {progress.xp.toLocaleString()} / {progress.xpToNextLevel.toLocaleString()} XP
                </span>
                <span className="text-muted-foreground">Level {progress.level + 1}</span>
              </div>
            </CardContent>
          </Card>

          {/* Study Stats */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Estatísticas de Estudo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{progress.totalHours}</p>
                  <p className="text-sm text-muted-foreground">Horas de Estudo</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{progress.completedLessons}</p>
                  <p className="text-sm text-muted-foreground">Aulas Completas</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{modules.filter(m => m.completed).length}</p>
                  <p className="text-sm text-muted-foreground">Módulos Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        <div>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Conquistas</CardTitle>
              <CardDescription>
                {earnedBadges} de {progress.achievements.length} desbloqueadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {progress.achievements.map((achievement) => {
                  const IconComponent = iconMap[achievement.icon] || Trophy
                  const earned = achievement.unlockedAt !== null
                  
                  const getIconColor = (icon: string) => {
                    switch (icon) {
                      case "flame": return "text-orange-500"
                      case "zap": return "text-blue-500"
                      case "star": return "text-yellow-500"
                      case "clock": return "text-purple-500"
                      case "award": return "text-pink-500"
                      case "calendar": return "text-cyan-500"
                      case "check-circle": return "text-green-500"
                      default: return "text-primary"
                    }
                  }
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`flex flex-col items-center rounded-lg border p-4 text-center transition-all ${
                        earned
                          ? "border-primary/30 bg-primary/5"
                          : "border-border bg-secondary/30 opacity-50"
                      }`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        earned ? "bg-card" : "bg-secondary"
                      }`}>
                        <IconComponent className={`h-6 w-6 ${earned ? getIconColor(achievement.icon) : "text-muted-foreground"}`} />
                      </div>
                      <span className={`mt-2 text-sm font-medium ${
                        earned ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {achievement.title}
                      </span>
                      <span className="mt-1 text-xs text-muted-foreground">
                        {achievement.description}
                      </span>
                      {earned && achievement.unlockedAt && (
                        <span className="mt-2 text-xs text-primary">
                          {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
