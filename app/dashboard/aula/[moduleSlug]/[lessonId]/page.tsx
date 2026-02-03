"use client"

import { useParams, useRouter } from "next/navigation"
import { professionalModules, ModuleDetailed, Lesson } from "@/lib/modules-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BlueprintCanvas } from "@/components/blueprint/blueprint-canvas"
import { lessonBlueprints } from "@/lib/blueprint-examples"
import {
    ChevronLeft,
    ChevronRight,
    Play,
    CheckCircle,
    FileText,
    Trophy,
    MessageSquare,
    ArrowLeft,
    Menu,
    X,
    Code2
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function AulaPage() {
    const params = useParams()
    const router = useRouter()
    const moduleSlug = params.moduleSlug as string
    const lessonId = params.lessonId as string
    const { toast } = useToast()
    const { addXP, completeLesson, updateModuleProgress, completeModule, completedLessonIds, completeExercise, completedExerciseIds, completedModuleIds } = useStore()

    const [module, setModule] = useState<ModuleDetailed | null>(null)
    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [activeTab, setActiveTab] = useState("content")

    useEffect(() => {
        if (moduleSlug && lessonId) {
            const foundModule = professionalModules.find(m => m.slug === moduleSlug)
            if (foundModule) {
                setModule(foundModule)
                const foundLesson = foundModule.lessons.find(l => l.id === lessonId)
                if (foundLesson) {
                    setLesson(foundLesson)
                } else {
                    console.error("Lesson not found", lessonId)
                }
            }
        }
    }, [moduleSlug, lessonId])

    if (!module || !lesson) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando aula...</p>
                </div>
            </div>
        )
    }

    const currentLessonIndex = module.lessons.findIndex(l => l.id === lesson.id)
    const nextLesson = module.lessons[currentLessonIndex + 1]
    const prevLesson = module.lessons[currentLessonIndex - 1]

    // Get blueprint for this lesson
    const currentBlueprint = lessonBlueprints[lesson.id]

    const handleCompleteLesson = () => {
        // 1. Mark lesson as complete
        completeLesson(lesson.id)

        // 2. Calculate new module progress
        const totalLessons = module.lessons.length

        const uniqueCompleted = new Set([...completedLessonIds, lesson.id])
        const completedCountInModule = module.lessons.filter(l => uniqueCompleted.has(l.id)).length

        const percent = Math.round((completedCountInModule / totalLessons) * 100)
        updateModuleProgress(module.id, percent)

        const isFirstTimeLesson = !completedLessonIds.includes(lesson.id)
        const isFirstTimeModule = !completedModuleIds.includes(module.id)

        if (percent === 100) {
            completeModule(module.id)
            if (isFirstTimeModule) {
                toast({ title: "Módulo Concluído!", description: "Parabéns! +200 XP Bônus!" })
            } else {
                toast({ title: "Módulo Finalizado", description: "Você revisitou todas as aulas deste módulo." })
            }
        } else {
            if (isFirstTimeLesson) {
                toast({
                    title: "Aula concluída!",
                    description: "+100 XP ganhos. Continue assim!",
                })
            } else {
                toast({
                    title: "Aula assistida",
                    description: "Bom rever este conteúdo!",
                })
            }
        }

        // addXP(50) - Handled by store on completion

        if (nextLesson) {
            router.push(`/dashboard/aula/${module.slug}/${nextLesson.id}`)
        } else {
            router.push('/dashboard/biblioteca')
        }
    }

    const handleCompleteExercise = (exerciseId: string) => {
        if (completedExerciseIds.includes(exerciseId)) {
            toast({
                title: "Exercício já concluído",
                description: "Você já completou este desafio anteriormente.",
            })
            return
        }

        completeExercise(exerciseId)
        toast({
            title: "Exercício Concluído!",
            description: "+50 XP ganhos. Excelente trabalho!",
        })
    }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            {/* Top Bar / Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/biblioteca">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{module.title}</Badge>
                            <span className="text-sm text-muted-foreground">Aula {currentLessonIndex + 1}/{module.lessons.length}</span>
                        </div>
                        <h1 className="text-xl font-bold mt-1">{lesson.title}</h1>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video w-full rounded-xl bg-black/90 flex items-center justify-center relative group overflow-hidden border border-border">
                        {lesson.videoUrl ? (
                            // In a real app this would be an iframe or video player
                            <div className="text-center p-4">
                                <Play className="h-16 w-16 text-primary mx-auto mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                                <p className="font-medium text-white">Vídeo da aula ({lesson.duration})</p>
                                <p className="text-sm text-gray-400 mt-2">Simulação do Player de Vídeo</p>
                            </div>
                        ) : (
                            <div className="text-center p-4">
                                <Play className="h-16 w-16 text-primary mx-auto mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                                <p className="font-medium text-white">Vídeo da aula ({lesson.duration})</p>
                            </div>
                        )}

                        {/* Play Button Overlay (Functional Mock) */}
                        <button className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors" onClick={() => toast({ title: "Iniciando vídeo...", description: "O vídeo seria reproduzido aqui." })}>
                        </button>
                    </div>

                    {/* Lesson Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="content" className="gap-2">
                                <FileText className="h-4 w-4" />
                                Conteúdo
                            </TabsTrigger>
                            {currentBlueprint && (
                                <TabsTrigger value="blueprint" className="gap-2">
                                    <Code2 className="h-4 w-4" />
                                    Blueprint
                                </TabsTrigger>
                            )}
                            <TabsTrigger value="exercises" className="gap-2">
                                <Trophy className="h-4 w-4" />
                                Exercícios ({lesson.exercises.length})
                            </TabsTrigger>
                            <TabsTrigger value="resources" className="gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Recursos
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 mt-4">
                            <TabsContent value="content" className="mt-0 h-full">
                                <Card className="h-full border-border bg-card">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">Sobre esta aula</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {lesson.content}
                                        </p>

                                        <h4 className="font-medium mt-6 mb-3 text-foreground">Objetivos de Aprendizado</h4>
                                        <ul className="space-y-2">
                                            {lesson.objectives.map((obj, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                    <span>{obj}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <h4 className="font-medium mt-6 mb-3 text-foreground">Dicas Pro</h4>
                                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                                            {lesson.tips.map((tip, i) => (
                                                <p key={i} className="text-sm text-muted-foreground flex gap-2">
                                                    <span className="text-primary">•</span>
                                                    {tip}
                                                </p>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {currentBlueprint && (
                                <TabsContent value="blueprint" className="mt-0 h-full">
                                    <div className="space-y-4">
                                        <Card className="border-border bg-card">
                                            <CardContent className="p-4">
                                                <h3 className="text-lg font-semibold mb-2">Visualização do Blueprint</h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Abaixo está a estrutura visual do blueprint desta aula.
                                                    <strong className="block mt-2 text-primary">
                                                        💡 Clique em "Copiar Código" para colar diretamente no Unreal Engine!
                                                    </strong>
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <div className="h-[500px] border border-border rounded-xl overflow-hidden shadow-sm">
                                            <BlueprintCanvas
                                                title={lesson.title}
                                                nodes={currentBlueprint.nodes}
                                                connections={currentBlueprint.connections}
                                                enableCopy={true}
                                                manualCopyCode={currentBlueprint.copyString}
                                            />
                                        </div>

                                        <Card className="border-border bg-card">
                                            <CardContent className="p-4">
                                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                                    <Code2 className="h-5 w-5 text-primary" />
                                                    Como Usar no Unreal Engine
                                                </h4>

                                                {currentBlueprint.instructions ? (
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        {currentBlueprint.instructions.variables && (
                                                            <div className="bg-secondary/30 p-3 rounded-lg">
                                                                <h5 className="text-xs font-bold uppercase text-muted-foreground mb-2">Variáveis Necessárias</h5>
                                                                <ul className="space-y-1">
                                                                    {currentBlueprint.instructions.variables.map((v, i) => (
                                                                        <li key={i} className="text-sm text-foreground flex justify-between">
                                                                            <span className="font-mono text-purple-400">{v.name}</span>
                                                                            <span className="text-xs text-muted-foreground">{v.type}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        <div className="bg-secondary/30 p-3 rounded-lg">
                                                            <h5 className="text-xs font-bold uppercase text-muted-foreground mb-2">Passos</h5>
                                                            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                                                                {currentBlueprint.instructions.steps.map((step, i) => (
                                                                    <li key={i}>{step}</li>
                                                                ))}
                                                            </ol>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground">
                                                        Cole o código diretamente no Event Graph do seu Blueprint.
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                            )}

                            <TabsContent value="exercises" className="mt-0 h-full">
                                <div className="grid gap-4">
                                    {lesson.exercises.map((ex) => {
                                        const isCompleted = completedExerciseIds.includes(ex.id)
                                        return (
                                            <Card key={ex.id} className={cn("border-border bg-card", isCompleted && "border-green-500/50 bg-green-500/5")}>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                                                            <h4 className="font-medium text-foreground">{ex.title}</h4>
                                                        </div>
                                                        <Badge variant="outline">{ex.difficulty}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        {ex.description}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">Tempo estimado: {ex.estimatedTime}</span>
                                                        <Button
                                                            size="sm"
                                                            variant={isCompleted ? "outline" : "secondary"}
                                                            onClick={() => handleCompleteExercise(ex.id)}
                                                            disabled={isCompleted}
                                                        >
                                                            {isCompleted ? "Concluído" : "Concluir Exercício"}
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </TabsContent>

                            <TabsContent value="resources" className="mt-0 h-full">
                                <div className="grid gap-4">
                                    {lesson.resources.map((res) => (
                                        <a
                                            key={res.id}
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Card className="border-border bg-card hover:border-primary/50 transition-colors">
                                                <CardContent className="p-4 flex items-center gap-3">
                                                    <div className="p-2 rounded bg-secondary text-primary">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{res.title}</p>
                                                        <p className="text-xs text-muted-foreground">{res.description}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </a>
                                    ))}
                                    {lesson.resources.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            Nenhum recurso adicional para esta aula.
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>

                    {/* Actions Footer */}
                    <div className="flex justify-between items-center py-4 mt-auto">
                        <Button
                            variant="outline"
                            disabled={!prevLesson}
                            onClick={() => prevLesson && router.push(`/dashboard/aula/${module.slug}/${prevLesson.id}`)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Anterior
                        </Button>

                        <Button
                            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[200px]"
                            onClick={handleCompleteLesson}
                        >
                            {nextLesson ? "Concluir e Próxima" : "Concluir Módulo"}
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Sidebar Lesson List */}
                <div className={cn(
                    "fixed inset-y-0 right-0 z-20 w-80 bg-background border-l border-border transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:w-80 lg:block flex flex-col h-full",
                    sidebarOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="p-4 border-b border-border flex items-center justify-between lg:hidden">
                        <span className="font-medium">Conteúdo do Módulo</span>
                        <Button size="icon" variant="ghost" onClick={() => setSidebarOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-2">
                            {module.lessons.map((l, index) => {
                                const isActive = l.id === lesson.id
                                const isCompleted = completedLessonIds.includes(l.id)
                                return (
                                    <Link key={l.id} href={`/dashboard/aula/${module.slug}/${l.id}`}>
                                        <div className={cn(
                                            "p-3 rounded-lg text-sm transition-colors border",
                                            isActive
                                                ? "bg-primary/10 border-primary/20 text-primary font-medium"
                                                : "bg-card border-transparent hover:bg-secondary text-muted-foreground hover:text-foreground"
                                        )}>
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                                                    isActive ? "border-primary bg-primary text-primary-foreground" :
                                                        isCompleted ? "border-green-500 bg-green-500 text-white" : "border-border"
                                                )}>
                                                    {isCompleted ? <CheckCircle className="h-3 w-3" /> : index + 1}
                                                </div>
                                                <span className="line-clamp-2">{l.title}</span>
                                                <span className="text-xs opacity-70 ml-auto shrink-0">{l.duration}</span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </ScrollArea>

                </div>
            </div>
        </div>
    )
}
