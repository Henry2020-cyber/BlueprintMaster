"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { professionalModules } from "@/lib/modules-data"

// --- Types ---
interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: "user" | "admin"
  plan?: "free" | "pro"
  purchasedMechanicIds: string[]
  createdAt: string
  dailyGoalMin?: number
  pomodoroEnabled?: boolean
  focusTimeMin?: number
  breakTimeMin?: number
}

export type TimerMode = "focus" | "break"

interface PomodoroState {
  isRunning: boolean
  mode: TimerMode
  timeLeft: number
  initialDuration: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string | null
}

interface Progress {
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  totalLessons: number
  completedLessons: number
  totalExercises: number
  completedExercises: number
  totalHours: number
  achievements: Achievement[]
}

export interface Mechanic {
  id: string
  title: string
  description: string
  price: number
  thumbnail?: string
  driveLink?: string
  blueprintImage?: string
  moduleId?: number
  purchased: boolean
}

interface DailyTask {
  id: string
  title: string
  completed: boolean
}

interface KanbanTask {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  module: string
}

interface KanbanColumn {
  id: string
  title: string
  tasks: KanbanTask[]
}

interface PomodoroSession {
  id: number
  duration: number
  completed: boolean
  type: "focus" | "break"
  timestamp: string
}

interface Module {
  id: number
  slug: string
  title: string
  description: string
  lessons: number
  duration: string
  completed: boolean
  unlocked: boolean
  progress?: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "info" | "warning" | "error"
  timestamp: string
  read: boolean
}

interface StoreState {
  user: User | null
  isAuthenticated: boolean
  isLoadingUser: boolean
  progress: Progress
  dailyTasks: DailyTask[]
  currentModule: number
  currentLesson: number
  completedLessonIds: string[]
  completedExerciseIds: string[]
  completedModuleIds: number[]
  kanbanColumns: KanbanColumn[]
  pomodoroSessions: PomodoroSession[]
  todayFocusTime: number
  modules: Module[]
  lojaAssets: any[]
  myAssets: any[]
  notifications: Notification[]
  sidebarCollapsed: boolean
  theme: "dark" | "light"
  isInitialized: boolean
  pomodoro: PomodoroState
}

interface StoreActions {
  login: (email: string, password: string) => Promise<{ success: boolean, role: string | null }>
  register: (name: string, email: string, password: string) => Promise<boolean>
  socialLogin: (provider: 'google' | 'github') => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { name?: string, email?: string }) => Promise<boolean>
  updateStudySettings: (settings: { dailyGoalMin?: number, pomodoroEnabled?: boolean, focusTimeMin?: number, breakTimeMin?: number }) => Promise<boolean>
  addXP: (amount: number) => Promise<void>
  unlockAchievement: (achievementId: string) => Promise<void>
  toggleDailyTask: (taskId: string) => Promise<void>
  completeDailyStudy: () => Promise<void>
  completeLesson: (lessonId: string) => Promise<void>
  completeExercise: (exerciseId: string) => Promise<void>
  addKanbanTask: (columnId: string, task: Omit<KanbanTask, "id"> & { id?: string }) => void
  moveKanbanTask: (taskId: string, fromColumn: string, toColumn: string) => void
  deleteKanbanTask: (taskId: string, columnId: string) => void
  completePomodoroSession: (duration: number, type: "focus" | "break") => Promise<void>
  updateModuleProgress: (moduleId: number, progress: number) => Promise<void>
  completeModule: (moduleId: number) => Promise<void>
  purchaseMechanic: (mechanicId: string) => Promise<void>
  toggleSidebar: () => void
  setTheme: (theme: "dark" | "light") => void
  resetProgress: () => Promise<void>
  // Pomodoro Actions
  startPomodoro: () => void
  pausePomodoro: () => void
  resetPomodoro: () => void
  setPomodoroMode: (mode: TimerMode) => void
  setPomodoroTime: (seconds: number) => void
}

type Store = StoreState & StoreActions

// --- Constants ---
const ACHIEVEMENTS_LIST: Omit<Achievement, 'unlockedAt'>[] = [
  { id: 'first_login', title: 'Primeiro Passo', description: 'Realizou seu primeiro login na plataforma', icon: 'zap' },
  { id: 'first_lesson', title: 'Aprendiz', description: 'Concluiu sua primeira aula', icon: 'book' },
  { id: 'streak_3', title: 'Consistência', description: 'Manteve um streak de 3 dias', icon: 'flame' },
  { id: 'level_5', title: 'Veterano', description: 'Alcançou o nível 5', icon: 'trophy' },
  { id: 'module_1_complete', title: 'Fundamentos Master', description: 'Concluiu o módulo de Fundamentos', icon: 'star' },
  { id: 'first_purchase', title: 'Investidor', description: 'Adquiriu seu primeiro asset na Loja', icon: 'award' },
  { id: 'kanban_master', title: 'Organizado', description: 'Criou sua primeira tarefa no Kanban', icon: 'zap' },
  { id: 'pomodoro_warrior', title: 'Foco Total', description: 'Completou 5 sessões de Pomodoro', icon: 'flame' },
  { id: 'study_marathon', title: 'Maratonista', description: 'Completou 10 horas de estudo', icon: 'medal' },
]

const defaultProgress: Progress = {
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  streak: 0,
  totalLessons: 0,
  completedLessons: 0,
  totalExercises: 0,
  completedExercises: 0,
  totalHours: 0,
  achievements: ACHIEVEMENTS_LIST.map(a => ({ ...a, unlockedAt: null })),
}

const defaultPomodoroState: PomodoroState = {
  isRunning: false,
  mode: "focus",
  timeLeft: 25 * 60,
  initialDuration: 25 * 60
}

const defaultKanbanColumns: KanbanColumn[] = [
  { id: "todo", title: "A Fazer", tasks: [] },
  { id: "progress", title: "Em Progresso", tasks: [] },
  { id: "done", title: "Concluído", tasks: [] },
]

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [progress, setProgress] = useState<Progress>(defaultProgress)
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    { id: "task_blueprint_vars", title: "Ler sobre variáveis em Blueprint", completed: false },
    { id: "task_create_vars", title: "Criar 3 variáveis diferentes no projeto", completed: false },
  ])
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([])
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([])
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(defaultKanbanColumns)
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([])
  const [todayFocusTime, setTodayFocusTime] = useState(0)
  const [modules, setModules] = useState<Module[]>([])
  const [lojaAssets, setLojaAssets] = useState<any[]>([])
  const [myAssets, setMyAssets] = useState<any[]>([])
  const [notifications] = useState<Notification[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setThemeState] = useState<"dark" | "light">("dark")
  const [isInitialized, setIsInitialized] = useState(false)

  // Pomodoro State
  const [pomodoro, setPomodoro] = useState<PomodoroState>(defaultPomodoroState)

  const pendingAchievements = useRef<Set<string>>(new Set())

  // --- Helpers ---
  const calculateModulesProgress = useCallback((completedIds: string[], currentLevel: number, completedModuleIds: number[]) => {
    return professionalModules.map(module => {
      const totalLessons = module.lessons.length
      const completedCount = module.lessons.filter(l => completedIds.includes(l.id)).length
      const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
      const isCompleted = progressPercent === 100 || completedModuleIds.includes(module.id)

      let isUnlocked = module.id === 1 // First module always unlocked
      if (module.id > 1) {
        const levelMet = currentLevel >= module.id
        const prevModule = professionalModules.find(m => m.id === module.id - 1)
        const prereqsMet = prevModule ? (completedModuleIds.includes(prevModule.id) || prevModule.lessons.every(l => completedIds.includes(l.id))) : true
        isUnlocked = levelMet && prereqsMet
      }

      return {
        id: module.id,
        slug: module.slug,
        title: module.title,
        description: module.description,
        lessons: totalLessons,
        duration: module.totalDuration,
        progress: progressPercent,
        completed: isCompleted,
        unlocked: isUnlocked
      } as Module
    })
  }, [])

  // --- Main Data Fetching ---
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Track login and update streak via RPC
      const { error: rpcError } = await supabase.rpc('track_user_login')
      if (rpcError) {
        console.error("Error tracking login:", rpcError)
      }

      const today = new Date().toLocaleDateString('en-CA')
      const [pResult, aResult, tResult, clResult, ceResult, cmResult, achResult, lojaResult, dtResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('user_assets').select('*, assets(*)').eq('user_id', userId),
        supabase.from('kanban_tasks').select('*').eq('user_id', userId),
        supabase.from('user_completed_lessons').select('lesson_id').eq('user_id', userId),
        supabase.from('user_completed_exercises').select('exercise_id').eq('user_id', userId),
        supabase.from('user_completed_modules').select('module_id').eq('user_id', userId),
        supabase.from('user_achievements').select('*').eq('user_id', userId),
        supabase.from('assets').select('*').order('price', { ascending: true }),
        supabase.from('user_daily_task_completions').select('task_id').eq('user_id', userId).eq('completed_at', today)
      ])

      let profile = pResult.data
      if (pResult.error && (pResult.error.code === 'PGRST116')) {
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          const { data, error } = await supabase.from('profiles').insert({
            id: userData.user.id,
            email: userData.user.email,
            full_name: userData.user.user_metadata?.full_name || "Usuário",
            xp: 10, level: 1, streak: 1, last_login_at: new Date().toISOString()
          }).select().single()
          if (!error) {
            profile = data
            // Also unlock first_login achievement
            await supabase.from('user_achievements').insert({ user_id: userData.user.id, achievement_id: 'first_login' })
          }
        }
      }

      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || "Usuário",
          email: profile.email || "",
          avatar: profile.avatar_url || "",
          role: profile.role || "user",
          plan: profile.plan || "free",
          purchasedMechanicIds: aResult.data?.map(ua => ua.asset_id) || [],
          createdAt: profile.created_at,
          dailyGoalMin: profile.daily_goal_min || 30,
          pomodoroEnabled: profile.pomodoro_enabled !== false,
          focusTimeMin: profile.focus_time_min || 25,
          breakTimeMin: profile.break_time_min || 5
        })

        const clIds = clResult.data?.map(cl => cl.lesson_id) || []
        const ceIds = ceResult.data?.map(ce => ce.exercise_id) || []
        const cmIds = cmResult.data?.map(cm => cm.module_id) || []
        const achs = achResult.data || []

        setCompletedLessonIds(clIds)
        setCompletedExerciseIds(ceIds)
        setCompletedModuleIds(cmIds)

        const totalLessons = professionalModules.reduce((acc, m) => acc + m.lessons.length, 0)
        const totalExercises = professionalModules.reduce((acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.exercises.length, 0), 0)

        setProgress({
          xp: profile.xp || 0,
          level: profile.level || 1,
          xpToNextLevel: (profile.level || 1) * 1000,
          streak: profile.streak || 0,
          totalLessons,
          completedLessons: clIds.length,
          totalExercises,
          completedExercises: ceIds.length,
          totalHours: profile.total_hours_study || 0,
          achievements: ACHIEVEMENTS_LIST.map(a => ({
            ...a,
            unlockedAt: achs.find(ua => ua.achievement_id === a.id)?.unlocked_at || null
          }))
        })

        if (tResult.data) {
          setKanbanColumns(defaultKanbanColumns.map(col => ({
            ...col,
            tasks: tResult.data.filter(t => t.column_id === col.id).map(t => ({
              id: t.id, title: t.title, description: t.description, priority: t.priority, module: t.module_tag || "Geral"
            }))
          })))
        }

        setLojaAssets(lojaResult.data?.map(p => ({
          ...p, features: typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || [])
        })) || [])

        setMyAssets(aResult.data?.filter(ua => ua.assets).map(ua => ({
          ...ua.assets, purchased_at: ua.purchased_at, features: typeof ua.assets.features === 'string' ? JSON.parse(ua.assets.features) : (ua.assets.features || [])
        })) || [])
        if (dtResult.data) {
          const completedIds = dtResult.data.map(d => d.task_id)
          setDailyTasks(prev => prev.map(task => ({
            ...task,
            completed: completedIds.includes(task.id)
          })))
        }
      }
    } catch (err) {
      console.error("Fetch user data error:", err)
    } finally {
      setIsLoadingUser(false)
      setIsInitialized(true)
    }
  }, [])

  // --- Auth Initialization ---
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) await fetchUserData(session.user.id)
      else {
        setIsLoadingUser(false)
        setIsInitialized(true)
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) fetchUserData(session.user.id)
      else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProgress(defaultProgress)
        setCompletedLessonIds([])
        setKanbanColumns(defaultKanbanColumns)
      }
    })
    return () => subscription.unsubscribe()
  }, [fetchUserData])

  useEffect(() => {
    if (isInitialized) {
      setModules(calculateModulesProgress(completedLessonIds, progress.level, completedModuleIds))
    }
  }, [completedLessonIds, progress.level, completedModuleIds, calculateModulesProgress, isInitialized])

  // --- Actions ---
  const unlockAchievement = useCallback(async (id: string) => {
    if (!user || pendingAchievements.current.has(id)) return
    if (progress.achievements.find(a => a.id === id)?.unlockedAt) return

    pendingAchievements.current.add(id)
    const now = new Date().toISOString()

    setProgress(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => a.id === id ? { ...a, unlockedAt: now } : a)
    }))

    await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_id: id }, { onConflict: 'user_id,achievement_id' })
  }, [user, progress.achievements])

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, role: null }
    if (data.user) {
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      return { success: true, role: prof?.role || 'user' }
    }
    return { success: true, role: 'user' }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    return !error && !!data.user
  }, [])

  const socialLogin = useCallback(async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } })
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }, [router])

  const updateProfile = useCallback(async (data: { name?: string, email?: string }) => {
    if (!user) return false
    const { error } = await supabase.from('profiles').update({ full_name: data.name, email: data.email }).eq('id', user.id)
    if (!error) {
      setUser(prev => prev ? { ...prev, name: data.name || prev.name, email: data.email || prev.email } : null)
      return true
    }
    return false
  }, [user])

  const updateStudySettings = useCallback(async (settings: any) => {
    if (!user) return false
    const { error } = await supabase.from('profiles').update({
      daily_goal_min: settings.dailyGoalMin,
      pomodoro_enabled: settings.pomodoroEnabled,
      focus_time_min: settings.focusTimeMin,
      break_time_min: settings.breakTimeMin
    }).eq('id', user.id)
    if (!error) {
      setUser(prev => prev ? { ...prev, ...settings } : null)
      return true
    }
    return false
  }, [user])

  const addXP = useCallback(async (amount: number) => {
    if (!user) return

    // Get current XP directly to calculate new value
    const { data: currentProf } = await supabase.from('profiles').select('xp, level').eq('id', user.id).single()
    if (!currentProf) return

    const newXp = Math.max(0, (currentProf.xp || 0) + amount)

    const { error } = await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id)

    if (!error) {
      // Refresh to get potentially computed results (like triggers for level-up)
      const { data: prof } = await supabase.from('profiles').select('xp, level').eq('id', user.id).single()
      if (prof) {
        setProgress(p => ({ ...p, xp: prof.xp, level: prof.level, xpToNextLevel: prof.level * 1000 }))
      }
    }
  }, [user])

  const toggleDailyTask = useCallback(async (taskId: string) => {
    if (!user) return

    setDailyTasks(prev => {
      const task = prev.find(t => t.id === taskId)
      if (!task || task.completed) return prev

      const isNowCompleted = !task.completed // Always true here

      // Async side effect
      const updateTask = async () => {
        const today = new Date().toLocaleDateString('en-CA')
        if (isNowCompleted) {
          const { error } = await supabase.from('user_daily_task_completions').insert({
            user_id: user.id,
            task_id: taskId,
            completed_at: today
          })
          if (!error) await addXP(10)
        }
      }
      updateTask()

      return prev.map(t => t.id === taskId ? { ...t, completed: isNowCompleted } : t)
    })
  }, [user, addXP])

  const completeDailyStudy = useCallback(async () => {
    if (!user) return
    const today = new Date().toLocaleDateString('en-CA')

    const { data: profile } = await supabase.from('profiles').select('last_daily_bonus_at').eq('id', user.id).single()
    if (profile?.last_daily_bonus_at === today) return

    const { error } = await supabase.from('profiles').update({ last_daily_bonus_at: today }).eq('id', user.id)
    if (!error) {
      await addXP(100);
      unlockAchievement('daily_goal_reached');
    }
  }, [user, addXP, unlockAchievement])

  const completeLesson = useCallback(async (lessonId: string) => {
    if (!user || completedLessonIds.includes(lessonId)) return
    setCompletedLessonIds(prev => [...prev, lessonId])
    await addXP(100)
    await supabase.from('user_completed_lessons').insert({ user_id: user.id, lesson_id: lessonId })
    const { data } = await supabase.from('profiles').select('xp, level').eq('id', user.id).single()
    if (data) setProgress(p => ({ ...p, xp: data.xp, level: data.level, completedLessons: p.completedLessons + 1 }))
  }, [user, completedLessonIds, addXP])

  const completeExercise = useCallback(async (exerciseId: string) => {
    if (!user || completedExerciseIds.includes(exerciseId)) return
    setCompletedExerciseIds(prev => [...prev, exerciseId])
    await addXP(50)
    await supabase.from('user_completed_exercises').insert({ user_id: user.id, exercise_id: exerciseId })
    const { data } = await supabase.from('profiles').select('xp, level').eq('id', user.id).single()
    if (data) setProgress(p => ({ ...p, xp: data.xp, level: data.level, completedExercises: p.completedExercises + 1 }))
  }, [user, completedExerciseIds, addXP])

  const addKanbanTask = useCallback((columnId: string, task: any) => {
    const newTask = { ...task, id: task.id || Math.random().toString() }
    setKanbanColumns(prev => prev.map(col => col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col))
    unlockAchievement('kanban_master')
  }, [unlockAchievement])

  const moveKanbanTask = useCallback((taskId: string, from: string, to: string) => {
    setKanbanColumns(prev => {
      const source = prev.find(c => c.id === from)
      const task = source?.tasks.find(t => t.id === taskId)
      if (!task) return prev
      return prev.map(col => {
        if (col.id === from) return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
        if (col.id === to) return { ...col, tasks: [...col.tasks, task] }
        return col
      })
    })
  }, [])

  const deleteKanbanTask = useCallback((taskId: string, columnId: string) => {
    setKanbanColumns(prev => prev.map(col => col.id === columnId ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) } : col))
  }, [])

  const completePomodoroSession = useCallback(async (duration: number, type: "focus" | "break") => {
    if (!user) return
    if (type === "focus") setTodayFocusTime(p => p + duration)
    await supabase.from('user_pomodoro_sessions').insert({ user_id: user.id, duration_min: duration, session_type: type })
    setPomodoroSessions(prev => [...prev, { id: Date.now(), duration, type, completed: true, timestamp: new Date().toISOString() }])
  }, [user])

  const updateModuleProgress = useCallback(async (moduleId: number, progress: number) => {
    // This could also be persisted if needed
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, progress } : m))
  }, [])

  const completeModule = useCallback(async (moduleId: number) => {
    if (!user || completedModuleIds.includes(moduleId)) return
    setCompletedModuleIds(prev => [...prev, moduleId])
    await addXP(200);
    await supabase.from('user_completed_modules').insert({ user_id: user.id, module_id: moduleId })
    const { data } = await supabase.from('profiles').select('xp, level').eq('id', user.id).single()
    if (data) setProgress(p => ({ ...p, xp: data.xp, level: data.level, xpToNextLevel: data.level * 1000 }))
  }, [user, completedModuleIds, addXP])

  const purchaseMechanic = useCallback(async (mechanicId: string) => {
    if (!user) return
    const asset = lojaAssets.find(a => a.id === mechanicId)
    if (asset) {
      setMyAssets(prev => [...prev, { ...asset, purchased_at: new Date().toISOString() }])
      setUser(prev => prev ? { ...prev, purchasedMechanicIds: [...prev.purchasedMechanicIds, mechanicId] } : null)
    }
    await supabase.from('user_assets').insert({ user_id: user.id, asset_id: mechanicId })
  }, [user, lojaAssets])

  const toggleSidebar = useCallback(() => setSidebarCollapsed(p => !p), [])
  const setTheme = useCallback((t: "dark" | "light") => setThemeState(t), [])

  // --- Pomodoro Logic ---
  const startPomodoro = useCallback(() => setPomodoro(p => ({ ...p, isRunning: true })), [])
  const pausePomodoro = useCallback(() => setPomodoro(p => ({ ...p, isRunning: false })), [])

  const resetPomodoro = useCallback(() => {
    setPomodoro(p => ({ ...p, isRunning: false, timeLeft: p.initialDuration }))
  }, [])

  const setPomodoroMode = useCallback((mode: TimerMode) => {
    // When changing mode, we normally reset to default times, but we need connected user persistence for that.
    // For now we rely on the component calling setPomodoroTime after mode switch or we infer default.
    // However, to keep it simple, we just switch mode and stop. Ideally page logic handles duration update.
    setPomodoro(p => ({ ...p, mode, isRunning: false }))
  }, [])

  const setPomodoroTime = useCallback((seconds: number) => {
    setPomodoro(p => ({ ...p, timeLeft: seconds, initialDuration: seconds }))
  }, [])

  // Global Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (pomodoro.isRunning && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => {
          if (prev.timeLeft <= 1) {
            // Timer finished
            // We can optionally auto-complete here or just stop. 
            // Ideally we trigger a completion event or let the UI handle it. 
            // Let's just stop at 0 to avoid loops.
            return { ...prev, timeLeft: 0, isRunning: false }
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        })
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [pomodoro.isRunning, pomodoro.timeLeft])


  const storeValue: Store = {
    user, isAuthenticated: !!user, isLoadingUser, progress, dailyTasks,
    completedLessonIds, completedExerciseIds, completedModuleIds, kanbanColumns,
    pomodoroSessions, todayFocusTime, modules, lojaAssets, myAssets,
    notifications, sidebarCollapsed, theme, isInitialized,
    login, register, socialLogin, logout, updateProfile, updateStudySettings,
    addXP, unlockAchievement, toggleDailyTask, completeDailyStudy, completeLesson, completeExercise,
    addKanbanTask, moveKanbanTask, deleteKanbanTask, completePomodoroSession,
    updateModuleProgress, completeModule, purchaseMechanic, toggleSidebar, setTheme,
    resetProgress: async () => {
      if (!user) return

      try {
        await Promise.all([
          supabase.from('user_completed_lessons').delete().eq('user_id', user.id),
          supabase.from('user_completed_exercises').delete().eq('user_id', user.id),
          supabase.from('user_completed_modules').delete().eq('user_id', user.id),
          supabase.from('user_achievements').delete().eq('user_id', user.id),
          supabase.from('profiles').update({ xp: 0, level: 1, streak: 0 }).eq('id', user.id)
        ])

        // Refresh data
        await fetchUserData(user.id)
      } catch (err) {
        console.error("Error resetting progress:", err)
        throw err
      }
    },
    currentModule: 1, currentLesson: 1,
    pomodoro, startPomodoro, pausePomodoro, resetPomodoro, setPomodoroMode, setPomodoroTime
  }

  return <StoreContext.Provider value={storeValue}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error("useStore must be used within a StoreProvider")
  return context
}
