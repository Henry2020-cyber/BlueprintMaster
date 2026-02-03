"use client"

import React, { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  Clock,
  BookOpen,
  Lock,
  CheckCircle2,
  Play,
  ChevronRight,
  ExternalLink,
  Gamepad2,
  Workflow,
  User,
  Swords,
  Brain,
  Layout,
  Package,
  Users,
  Volume2,
  Sparkles,
  Gauge,
  Trophy,
  GraduationCap,
  Target,
  FileText,
  MessageSquare,
  Github,
  Globe,
  Wrench,
  X,
  ShoppingCart,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { professionalModules, globalResources, getTotalStats, type ModuleDetailed, type Resource } from "@/lib/modules-data"
import { useStore } from "@/lib/store"
import { CreditCardProduct } from "@/components/store/credit-card-product"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Gamepad2,
  Workflow,
  User,
  Swords,
  Brain,
  Layout,
  Package,
  Users,
  Volume2,
  Sparkles,
  Gauge,
  Trophy
}

const resourceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  documentation: FileText,
  video: Play,
  forum: MessageSquare,
  github: Github,
  article: Globe,
  tool: Wrench
}

const difficultyColors = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  expert: "bg-red-500/20 text-red-400 border-red-500/30"
}

const difficultyLabels = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
  expert: "Expert"
}

export default function BibliotecaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { completedLessonIds, modules: storeModules, user, myAssets, isLoadingUser } = useStore()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "unlocked" | "completed" | "locked">("all")
  const [selectedModule, setSelectedModule] = useState<ModuleDetailed | null>(null)
  const [showResources, setShowResources] = useState(false)

  const stats = getTotalStats()



  const filteredModules = useMemo(() => {
    // Merge static data with store state for correct filtering
    const mergedModules = professionalModules.map(staticModule => {
      const storeModule = storeModules.find(m => m.id === staticModule.id)
      return {
        ...staticModule,
        progress: storeModule?.progress ?? 0,
        unlocked: storeModule?.unlocked ?? (staticModule.id === 1),
        completed: storeModule?.completed ?? false
      }
    })

    let modules = [...mergedModules]

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      modules = modules.filter(
        m =>
          m.title.toLowerCase().includes(searchLower) ||
          m.description.toLowerCase().includes(searchLower) ||
          m.skills.some(s => s.toLowerCase().includes(searchLower))
      )
    }

    // Apply filter
    if (filter === "unlocked") {
      modules = modules.filter(m => m.unlocked && !m.completed)
    } else if (filter === "completed") {
      modules = modules.filter(m => m.completed)
    } else if (filter === "locked") {
      modules = modules.filter(m => !m.unlocked)
    }

    return modules
  }, [search, filter, storeModules])

  const handleStartModule = (module: ModuleDetailed) => {
    const targetLesson = module.lessons.find(l => !l.completed && !completedLessonIds.includes(l.id)) || module.lessons[0]

    if (targetLesson) {
      setSelectedModule(null)
      router.push(`/dashboard/aula/${module.slug}/${targetLesson.id}`)
    }
  }

  const handleDownload = (link?: string) => {
    if (link) {
      window.open(link, '_blank')
    } else {
      toast({
        title: "Download Indisponível",
        description: "O link de download para este item ainda não foi cadastrado.",
        variant: "destructive"
      })
    }
  }

  const ResourceCard = ({ resource }: { resource: Resource }) => {
    const Icon = resourceIconMap[resource.type] || Globe
    return (
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
      >
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
              {resource.title}
            </span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {resource.description}
          </p>
        </div>
      </a>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Minha Biblioteca</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus cursos e assets adquiridos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowResources(true)}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Recursos de Estudo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="courses" className="gap-2 px-8">
            <BookOpen className="h-4 w-4" />
            Cursos
          </TabsTrigger>
          <TabsTrigger value="assets" className="gap-2 px-8">
            <ShoppingCart className="h-4 w-4" />
            Meus Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6 min-h-[400px]">
          {isLoadingUser ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-7xl">
              {myAssets.length > 0 ? myAssets.map((asset, i) => (
                <CreditCardProduct
                  key={i}
                  title={asset.title}
                  cardNumber={`.... ${1000 + i}`}
                  memberSince={asset.purchasedAt}
                  features={asset.features}
                  cardColor={asset.card_color}
                  isPopular={false}
                  mode="library"
                  onAction={() => handleDownload(asset.drive_link)}
                  stats={[
                    { label: "Versão", value: "1.0", color: "text-white" },
                    { label: "Tamanho", value: "--", color: "text-gray-400" }
                  ]}
                />
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground text-center">Sua biblioteca está vazia</h3>
                  <p className="text-muted-foreground mt-2 mb-8 max-w-lg text-center mx-auto">
                    Você ainda não adquiriu nenhum asset. Explore a loja para encontrar recursos incríveis.
                  </p>
                  <Button onClick={() => router.push('/dashboard/loja')} variant="default" size="lg">
                    Ir para a Loja
                  </Button>
                </div>
              )}

              {/* Discover More Card (Only show if has assets, otherwise the empty state above covers it) */}
              {
                myAssets.length > 0 && (
                  <div className="flex flex-col justify-center items-center border border-dashed border-white/10 rounded-2xl p-8 min-h-[400px] gap-4 text-center hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => router.push('/dashboard/loja')}>
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <ShoppingCart className="h-8 w-8 text-gray-500 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Descobrir Mais</h3>
                      <p className="text-sm text-gray-400 max-w-xs mx-auto">Encontre novos sistemas na loja.</p>
                    </div>
                  </div>
                )
              }
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalModules}</p>
                  <p className="text-xs text-muted-foreground">Módulos</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <GraduationCap className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalLessons}</p>
                  <p className="text-xs text-muted-foreground">Aulas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalHours}h+</p>
                  <p className="text-xs text-muted-foreground">De Conteúdo</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/10">
                  <Target className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalExercises}</p>
                  <p className="text-xs text-muted-foreground">Exercícios</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar módulos, aulas ou skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
              <TabsList className="bg-secondary">
                <TabsTrigger value="all" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Todos
                </TabsTrigger>
                <TabsTrigger value="unlocked">Disponíveis</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
                <TabsTrigger value="locked">Bloqueados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Modules Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((staticModule) => {
              const storeModule = storeModules.find(m => m.id === staticModule.id)
              const module = {
                ...staticModule,
                progress: storeModule?.progress ?? staticModule.progress ?? 0,
                unlocked: storeModule?.unlocked ?? staticModule.unlocked ?? false,
                completed: storeModule?.completed ?? staticModule.completed ?? false
              }

              const Icon = iconMap[module.icon] || BookOpen
              const progress = module.progress || 0

              return (
                <Card
                  key={module.id}
                  className={`bg-card border-border overflow-hidden transition-all hover:border-primary/50 cursor-pointer group ${!module.unlocked ? "opacity-60" : ""}`}
                  onClick={() => module.unlocked && setSelectedModule(module)}
                >
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${module.color}`} />

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${module.color} bg-opacity-20`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={difficultyColors[module.difficulty]}>
                          {difficultyLabels[module.difficulty]}
                        </Badge>
                        {module.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : !module.unlocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : null}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{module.subtitle}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {module.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {module.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {module.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{module.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {module.lessons.length} aulas
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {module.totalDuration}
                      </span>
                    </div>

                    {/* Progress */}
                    {module.unlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="text-foreground font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    )}

                    {/* CTA */}
                    {module.unlocked ? (
                      <Button
                        className="w-full gap-2"
                        variant={module.completed ? "outline" : "default"}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedModule(module)
                        }}
                      >
                        {module.completed ? (
                          <>Revisar Módulo</>
                        ) : progress > 0 ? (
                          <>
                            Continuar
                            <ChevronRight className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Começar
                            <Play className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button className="w-full gap-2" variant="secondary" disabled>
                        <Lock className="h-4 w-4" />
                        Bloqueado
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">Nenhum módulo encontrado</h3>
              <p className="mt-2 text-muted-foreground">
                Tente ajustar seus filtros ou busca.
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearch("")
                  setFilter("all")
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </TabsContent>

      </Tabs>

      {/* Module Detail Dialog */}
      <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 bg-background" aria-describedby={selectedModule ? undefined : "loading-description"}>
          {!selectedModule ? (
            <div className="p-10 flex items-center justify-center">
              <DialogTitle className="sr-only">Carregando...</DialogTitle>
              <DialogDescription id="loading-description" className="sr-only">Carregando detalhes do módulo...</DialogDescription>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className={`p-6 bg-gradient-to-r ${selectedModule.color} bg-opacity-10`}>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={difficultyColors[selectedModule.difficulty]}>
                      {difficultyLabels[selectedModule.difficulty]}
                    </Badge>
                    <Badge variant="outline" className="bg-background/50">
                      {selectedModule.lessons.length} aulas
                    </Badge>
                    <Badge variant="outline" className="bg-background/50">
                      {selectedModule.totalDuration}
                    </Badge>
                  </div>
                  <DialogTitle className="text-2xl">{selectedModule.title}</DialogTitle>
                  <DialogDescription className="text-base">
                    {selectedModule.longDescription}
                  </DialogDescription>
                </DialogHeader>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedModule.skills.map((skill) => (
                    <Badge key={skill} className="bg-background/80 text-foreground">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Content */}
              <ScrollArea className="max-h-[50vh]">
                <div className="p-6 space-y-6">
                  {/* Prerequisites */}
                  {selectedModule.prerequisites.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Pré-requisitos</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedModule.prerequisites.map((prereqId) => {
                          const prereq = professionalModules.find(m => m.id === prereqId)
                          return prereq ? (
                            <Badge key={prereqId} variant="outline" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {prereq.title}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}

                  {/* Lessons */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Conteúdo do Módulo</h3>
                    <div className="space-y-2">
                      {selectedModule.lessons.map((lesson, index) => (
                        <Link
                          key={lesson.id}
                          href={`/dashboard/aula/${selectedModule.slug}/${lesson.id}`}
                          className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${lesson.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                            }`}>
                            {lesson.completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {lesson.title}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {lesson.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {lesson.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-3.5 w-3.5" />
                              {lesson.exercises.length} exercícios
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Module Resources */}
                  {selectedModule.resources.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Recursos do Módulo</h3>
                      <div className="grid gap-2 md:grid-cols-2">
                        {selectedModule.resources.map((resource) => (
                          <ResourceCard key={resource.id} resource={resource} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {selectedModule.projects.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Projetos Práticos</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedModule.projects.map((project) => (
                          <Badge key={project} variant="secondary" className="gap-1 py-1.5">
                            <Wrench className="h-3 w-3" />
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-4 border-t border-border flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {selectedModule.progress || 0}% concluído
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedModule(null)}>
                    Fechar
                  </Button>
                  <Button
                    className="gap-2"
                    onClick={() => selectedModule && handleStartModule(selectedModule)}
                  >
                    {selectedModule.progress && selectedModule.progress > 0 ? "Continuar" : "Iniciar Módulo"}
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Global Resources Dialog */}
      <Dialog open={showResources} onOpenChange={setShowResources}>
        <DialogContent className="max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Recursos de Estudo
            </DialogTitle>
            <DialogDescription>
              Links úteis para complementar seu aprendizado de Unreal Engine
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                Documentação Oficial
              </h4>
              <div className="grid gap-2">
                {globalResources.filter(r => r.type === "documentation").map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-400" />
                Comunidades e Fóruns
              </h4>
              <div className="grid gap-2">
                {globalResources.filter(r => r.type === "forum").map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Play className="h-4 w-4 text-red-400" />
                Vídeos e Tutoriais
              </h4>
              <div className="grid gap-2">
                {globalResources.filter(r => r.type === "video").map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-purple-400" />
                Ferramentas e Assets
              </h4>
              <div className="grid gap-2">
                {globalResources.filter(r => r.type === "tool" || r.type === "github").map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
