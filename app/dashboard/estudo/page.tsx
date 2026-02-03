"use client"

import { useRouter } from "next/navigation"
import {
  BookOpen,
  Clock,
  CheckCircle,
  Trophy,
  ArrowRight,
  Play,
  Flame
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { professionalModules } from "@/lib/modules-data"
import { useEffect, useState } from "react"

export default function EstudoDiarioPage() {
  const { dailyTasks, toggleDailyTask, completeDailyStudy, addXP, progress, currentModule } = useStore()
  const { toast } = useToast()
  const router = useRouter()

  const [activeLesson, setActiveLesson] = useState<any>(null)

  // Find the current active module and lesson
  useEffect(() => {
    if (currentModule) {
      const moduleData = professionalModules.find(m => m.id === currentModule)
      if (moduleData) {
        // Find first incomplete lesson
        const nextLesson = moduleData.lessons.find(l => !l.completed) || moduleData.lessons[0]
        setActiveLesson(nextLesson)
      }
    }
  }, [currentModule])


  const completedTasks = dailyTasks.filter(t => t.completed).length
  const progressPercent = (completedTasks / dailyTasks.length) * 100

  const handleTaskToggle = (taskId: string) => {
    const task = dailyTasks.find(t => t.id === taskId)
    if (!task) return

    // If the task is already completed, do nothing (checkbox is disabled anyway)
    // This prevents accidental un-completion and XP removal.
    if (task.completed) {
      return
    }

    const isCompleting = !task.completed // This will always be true here if we proceed

    toggleDailyTask(taskId) // This calls the store function to mark it complete

    // Since we only allow completing tasks here, we only need the 'isCompleting' branch
    if (isCompleting) {
      if (completedTasks + 1 === dailyTasks.length) {
        completeDailyStudy()
        toast({
          title: "Meta Diária Concluída!",
          description: "Você ganhou +100 XP por completar todas as tarefas de hoje.",
        })
      } else {
        toast({
          title: "Tarefa Concluída",
          description: "+10 XP",
        })
      }
    } else {
      toast({
        title: "Tarefa Desmarcada",
        description: "-10 XP",
      })
    }
  }

  const handleStartLesson = () => {
    if (currentModule && activeLesson) {
      const moduleData = professionalModules.find(m => m.id === currentModule)
      if (moduleData) {
        router.push(`/dashboard/aula/${moduleData.slug}/${activeLesson.id}`)
      }
    } else {
      // Fallback if no current module
      router.push('/dashboard/biblioteca')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estudo Diário</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso e mantenha a consistência.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Progress */}
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/5 to-background border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <Flame className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Ofensiva: {progress.streak} dias</h2>
                  <p className="text-muted-foreground">
                    {progress.streak >= 7
                      ? "Você está em uma sequência lendária! 🔥"
                      : progress.streak >= 3
                        ? "Você está pegando fogo! Continue assim."
                        : "Comece sua sequência de estudos hoje!"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{progress.xp}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total XP</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{progress.level}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Nível</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Tarefas de Hoje
            </CardTitle>
            <CardDescription>Complete para bater sua meta diária</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso Diário</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            <div className="space-y-4">
              {dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
                >
                  <Checkbox
                    id={task.id.toString()}
                    checked={task.completed}
                    onCheckedChange={() => handleTaskToggle(task.id)}
                    disabled={task.completed}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={task.id.toString()}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {task.title}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Ganhe XP concluindo esta tarefa
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Focus */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Continuar Estudando
            </CardTitle>
            <CardDescription>Retome de onde você parou</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between gap-6">
            {currentModule && activeLesson ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs bg-background">
                      Módulo Atual
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activeLesson.duration}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{activeLesson.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {/* We don't have description readily available here without more lookup, keeping simple */}
                    Continue sua jornada de aprendizado.
                  </p>
                </div>

                <Button className="w-full gap-2" onClick={handleStartLesson}>
                  <Play className="h-4 w-4" />
                  Começar Aula
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="p-3 bg-secondary rounded-full">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Nenhum módulo ativo</p>
                  <p className="text-sm text-muted-foreground mt-1">Vá para a biblioteca para escolher um novo curso.</p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/biblioteca')}>
                  Ir para Biblioteca
                </Button>
              </div>
            )}

            <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-background rounded-full border border-border shadow-sm">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Dica do dia</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estudar 15 minutos por dia é mais eficiente do que 2 horas uma vez por semana.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
