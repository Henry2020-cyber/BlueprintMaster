"use client"

import { useState, useEffect } from "react"
import { User, Bell, Clock, RotateCcw, Save, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function ConfiguracoesPage() {
  const { user, updateProfile, updateStudySettings, resetProgress } = useStore()
  const { toast } = useToast()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoalMin?.toString() || "30")
  const [pomodoroEnabled, setPomodoroEnabled] = useState(user?.pomodoroEnabled ?? true)
  const [focusTime, setFocusTime] = useState(user?.focusTimeMin?.toString() || "25")
  const [breakTime, setBreakTime] = useState(user?.breakTimeMin?.toString() || "5")
  const [notifications, setNotifications] = useState(true)
  const [emailReminders, setEmailReminders] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingStudy, setIsSavingStudy] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)

  // Sync state when user changes
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setDailyGoal(user.dailyGoalMin?.toString() || "30")
      setPomodoroEnabled(user.pomodoroEnabled ?? true)
      setFocusTime(user.focusTimeMin?.toString() || "25")
      setBreakTime(user.breakTimeMin?.toString() || "5")
    }
  }, [user])

  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    const success = await updateProfile({ name, email })

    if (success) {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      })
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar seu perfil.",
        variant: "destructive"
      })
    }
    setIsSavingProfile(false)
  }

  const handleSaveStudySettings = async () => {
    setIsSavingStudy(true)
    const success = await updateStudySettings({
      dailyGoalMin: parseInt(dailyGoal),
      pomodoroEnabled,
      focusTimeMin: parseInt(focusTime),
      breakTimeMin: parseInt(breakTime)
    })

    if (success) {
      toast({
        title: "Configurações salvas",
        description: `Meta diária: ${dailyGoal}min, Foco: ${focusTime}min, Pausa: ${breakTime}min`,
      })
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar as configurações de estudo.",
        variant: "destructive"
      })
    }
    setIsSavingStudy(false)
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Preferências atualizadas",
      description: "Suas configurações de notificação foram salvas.",
    })
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="mt-1 text-muted-foreground">
          Personalize sua experiência de aprendizado
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Perfil</CardTitle>
            </div>
            <CardDescription>Atualize suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="border-border bg-input text-foreground"
              />
              <p className="text-xs text-muted-foreground">{name.length}/50 caracteres</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="border-border bg-input text-foreground opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
            </div>
            <Button
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Study Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Estudo & Pomodoro</CardTitle>
            </div>
            <CardDescription>Ajuste suas metas e tempos de foco</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Meta Diária (minutos)</Label>
              <Select value={dailyGoal} onValueChange={setDailyGoal}>
                <SelectTrigger className="border-border bg-input text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Timer Pomodoro</Label>
                <p className="text-xs text-muted-foreground">Habilitar timer de foco</p>
              </div>
              <Switch
                checked={pomodoroEnabled}
                onCheckedChange={setPomodoroEnabled}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Foco (min)</Label>
                <Input
                  type="number"
                  value={focusTime}
                  onChange={(e) => setFocusTime(e.target.value)}
                  className="border-border bg-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Pausa (min)</Label>
                <Input
                  type="number"
                  value={breakTime}
                  onChange={(e) => setBreakTime(e.target.value)}
                  className="border-border bg-input text-foreground"
                />
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2 border-border text-foreground hover:bg-muted"
              onClick={handleSaveStudySettings}
              disabled={isSavingStudy}
            >
              {isSavingStudy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Notificações</CardTitle>
            </div>
            <CardDescription>Como você quer ser lembrado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Notificações no Browser</Label>
                <p className="text-xs text-muted-foreground">Alertas durante o estudo</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Lembretes por Email</Label>
                <p className="text-xs text-muted-foreground">Resumo semanal e alertas</p>
              </div>
              <Switch
                checked={emailReminders}
                onCheckedChange={setEmailReminders}
              />
            </div>
            <Button
              variant="outline"
              className="w-full gap-2 border-border text-foreground hover:bg-muted"
              onClick={handleSaveNotifications}
            >
              <Save className="h-4 w-4" />
              Atualizar Preferências
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            </div>
            <CardDescription>Ações irreversíveis na sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ao reiniciar seu progresso, todas as aulas concluídas, XP e conquistas serão apagadas permanentemente.
            </p>
            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2 shadow-lg shadow-destructive/20">
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar Todo o Progresso
                </Button>
              </DialogTrigger>
              <DialogContent className="border-border bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-xl">Você tem certeza?</DialogTitle>
                  <DialogDescription className="text-muted-foreground py-2">
                    Esta ação é irreversível. Todo o seu histórico de estudos será apagado do banco de dados.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="ghost" className="text-foreground" onClick={() => setResetDialogOpen(false)}>Cancelar</Button>
                  <Button variant="destructive" className="font-bold" onClick={handleResetProgress} disabled={isResetting}>
                    {isResetting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sim, reiniciar progresso
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
