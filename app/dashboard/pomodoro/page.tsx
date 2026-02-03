"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, RotateCcw, Coffee, Brain, CheckCircle, Settings, Volume2, VolumeX } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useStore, TimerMode } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function PomodoroPage() {
  const {
    user,
    pomodoroSessions,
    todayFocusTime,
    completePomodoroSession,
    updateStudySettings,
    pomodoro,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    setPomodoroMode,
    setPomodoroTime
  } = useStore()

  const { toast } = useToast()

  // Local state for settings form only
  const [focusDuration, setFocusDuration] = useState(user?.focusTimeMin || 25)
  const [breakDuration, setBreakDuration] = useState(user?.breakTimeMin || 5)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  // Sync settings form with user settings from DB on load
  useEffect(() => {
    if (user) {
      setFocusDuration(user.focusTimeMin || 25)
      setBreakDuration(user.breakTimeMin || 5)
    }
  }, [user])

  // Initial Sync of Timer if not running and at default state
  useEffect(() => {
    // If timer is pristine (full duration) and not running, update it if settings changed
    // But only if we are not in the middle of a session
    if (!pomodoro.isRunning && pomodoro.timeLeft === pomodoro.initialDuration) {
      const expectedDuration = (pomodoro.mode === 'focus' ? (user?.focusTimeMin || 25) : (user?.breakTimeMin || 5)) * 60
      if (Math.abs(pomodoro.initialDuration - expectedDuration) > 1) {
        setPomodoroTime(expectedDuration)
      }
    }
  }, [user, pomodoro.mode, pomodoro.isRunning, pomodoro.initialDuration, pomodoro.timeLeft, setPomodoroTime])


  // Handle Timer Completion
  const handleTimerComplete = useCallback(() => {
    if (soundEnabled) {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"
      gainNode.gain.value = 0.3

      oscillator.start()
      setTimeout(() => {
        oscillator.stop()
        audioContext.close()
      }, 500)
    }

    if (pomodoro.mode === "focus") {
      // Use the DURATION set in settings or initialDuration for record keeping
      const durationMin = Math.floor(pomodoro.initialDuration / 60)
      completePomodoroSession(durationMin, "focus")
      toast({
        title: "Sessão de foco concluída!",
        description: `+10 XP ganhos.`,
      })
      // User requested to invert logic (likely wants to stay on Focus or user perception of modes is swapped)
      // Swapping behavior: Focus End -> Ready for Focus (Reset)
      setPomodoroMode("focus")
      setPomodoroTime((user?.focusTimeMin || 25) * 60)
    } else {
      const durationMin = Math.floor(pomodoro.initialDuration / 60)
      completePomodoroSession(durationMin, "break")
      toast({
        title: "Pausa concluída!",
        description: "Pausa finalizada.",
      })
      // Swapping behavior: Break End -> Ready for Break (Reset)
      setPomodoroMode("break")
      setPomodoroTime((user?.breakTimeMin || 5) * 60)
    }
  }, [pomodoro.mode, pomodoro.initialDuration, soundEnabled, completePomodoroSession, toast, setPomodoroMode, setPomodoroTime, user])

  // Watch for completion (timeLeft === 0)
  useEffect(() => {
    if (pomodoro.timeLeft === 0 && !hasCompleted && pomodoro.initialDuration > 0) {
      setHasCompleted(true)
      handleTimerComplete()
    } else if (pomodoro.timeLeft > 0) {
      setHasCompleted(false)
    }
  }, [pomodoro.timeLeft, pomodoro.initialDuration, hasCompleted, handleTimerComplete])


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    if (!pomodoro.isRunning) {
      if (pomodoro.timeLeft === 0) {
        // Restart current mode
        setPomodoroTime(pomodoro.initialDuration)
      }
      startPomodoro()
      toast({
        title: pomodoro.mode === "focus" ? "Foco iniciado!" : "Pausa iniciada!",
        description: pomodoro.mode === "focus" ? "Concentre-se na sua tarefa." : "Relaxe e descanse.",
      })
    } else {
      pausePomodoro()
    }
  }

  const resetTimerAction = () => {
    resetPomodoro()
    toast({
      title: "Timer resetado",
      description: "O timer foi reiniciado.",
    })
  }

  const switchMode = (newMode: TimerMode) => {
    setPomodoroMode(newMode)
    const newTime = newMode === 'focus' ? (user?.focusTimeMin || 25) * 60 : (user?.breakTimeMin || 5) * 60
    setPomodoroTime(newTime)
  }

  const handleSettingsSave = async () => {
    const success = await updateStudySettings({
      focusTimeMin: focusDuration,
      breakTimeMin: breakDuration
    })

    if (success) {
      if (!pomodoro.isRunning && pomodoro.mode === 'focus') {
        setPomodoroTime(focusDuration * 60)
      } else if (!pomodoro.isRunning && pomodoro.mode === 'break') {
        setPomodoroTime(breakDuration * 60)
      }

      setSettingsOpen(false)
      toast({
        title: "Configurações salvas",
        description: `Foco: ${focusDuration}min, Pausa: ${breakDuration}min`,
      })
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível sincronizar com o banco de dados.",
        variant: "destructive"
      })
    }
  }

  const progress = ((pomodoro.initialDuration - pomodoro.timeLeft) / pomodoro.initialDuration) * 100

  const sessions = [
    ...pomodoroSessions.filter(s => {
      const today = new Date().toDateString()
      return new Date(s.timestamp).toDateString() === today
    }).slice(-5).reverse()
  ]

  const todaySessionsCount = pomodoroSessions.filter(s => {
    const today = new Date().toDateString()
    return new Date(s.timestamp).toDateString() === today && s.type === "focus"
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pomodoro</h1>
          <p className="mt-1 text-muted-foreground">
            Mantenha o foco com sessões de estudo cronometradas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary">
            {todaySessionsCount} sessões hoje
          </Badge>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="border-border bg-transparent text-foreground hover:bg-secondary">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-foreground">Configurações do Timer</DialogTitle>
                <DialogDescription className="sr-only">Ajuste os tempos de foco e pausa do seu timer pomodoro.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Tempo de Foco</Label>
                    <span className="text-sm text-muted-foreground">{focusDuration} min</span>
                  </div>
                  <Slider
                    value={[focusDuration]}
                    onValueChange={([value]) => setFocusDuration(value)}
                    min={5}
                    max={60}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Tempo de Pausa</Label>
                    <span className="text-sm text-muted-foreground">{breakDuration} min</span>
                  </div>
                  <Slider
                    value={[breakDuration]}
                    onValueChange={([value]) => setBreakDuration(value)}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Som de notificação</Label>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="border-border bg-transparent text-foreground hover:bg-secondary"
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>
                <Button onClick={handleSettingsSave} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Salvar Configurações
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardContent className="p-8">
              {/* Mode Selector */}
              <div className="mx-auto flex max-w-xs gap-2 rounded-lg bg-secondary p-1">
                <Button
                  variant={pomodoro.mode === "focus" ? "default" : "ghost"}
                  className={`flex-1 gap-2 ${pomodoro.mode === "focus"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                  onClick={() => switchMode("focus")}
                >
                  <Brain className="h-4 w-4" />
                  Foco
                </Button>
                <Button
                  variant={pomodoro.mode === "break" ? "default" : "ghost"}
                  className={`flex-1 gap-2 ${pomodoro.mode === "break"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                  onClick={() => switchMode("break")}
                >
                  <Coffee className="h-4 w-4" />
                  Pausa
                </Button>
              </div>

              {/* Timer Display */}
              <div className="mt-12 text-center">
                <div className="relative mx-auto h-64 w-64">
                  {/* Progress Ring */}
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-secondary"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 120}
                      strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                      strokeLinecap="round"
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  {/* Time Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-bold tabular-nums text-foreground">
                      {formatTime(pomodoro.timeLeft)}
                    </span>
                    <span className="mt-2 text-sm text-muted-foreground">
                      {pomodoro.mode === "focus" ? "Tempo de Foco" : "Tempo de Pausa"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-border bg-transparent text-foreground hover:bg-secondary"
                  onClick={resetTimerAction}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  className={`h-16 w-16 rounded-full ${pomodoro.isRunning
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-primary hover:bg-primary/90"
                    } text-primary-foreground`}
                  onClick={toggleTimer}
                >
                  {pomodoro.isRunning ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="ml-1 h-6 w-6" />
                  )}
                </Button>
                <div className="h-12 w-12" /> {/* Spacer for symmetry */}
              </div>

              {/* Keyboard shortcut hint */}
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Dica: Concentre-se em uma única tarefa durante a sessão
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Estatísticas de Hoje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sessões de Foco</span>
                <span className="font-semibold text-foreground">{todaySessionsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tempo Total</span>
                <span className="font-semibold text-foreground">{todayFocusTime} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">XP Ganho</span>
                <span className="font-semibold text-primary">+{todaySessionsCount * 10} XP</span>
              </div>
            </CardContent>
          </Card>

          {/* Session History */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Histórico de Sessões</CardTitle>
              <CardDescription>Suas sessões de hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    Nenhuma sessão concluída hoje. Comece agora!
                  </p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3"
                    >
                      <div className="flex items-center gap-3">
                        {session.type === "focus" ? (
                          <Brain className="h-4 w-4 text-primary" />
                        ) : (
                          <Coffee className="h-4 w-4 text-primary" />
                        )}
                        <span className="text-foreground">
                          {session.type === "focus" ? "Foco" : "Pausa"} - {session.duration}min
                        </span>
                      </div>
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <h4 className="font-semibold text-foreground">Dica do Dia</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Durante as pausas, levante-se e alongue-se. Isso ajuda a manter o foco nas próximas sessões.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
