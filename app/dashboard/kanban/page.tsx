"use client"

import React, { useEffect, useState } from "react"
import { Plus, MoreHorizontal, GripVertical, Trash2, Layout, Calendar, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const priorityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-200 dark:border-blue-900/30",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900/30",
  high: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/30",
}

const priorityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
}

export default function KanbanPage() {
  const { kanbanColumns, addKanbanTask, moveKanbanTask, deleteKanbanTask, user } = useStore()
  const { toast } = useToast()

  const [draggedTask, setDraggedTask] = useState<{ taskId: string; fromColumnId: string } | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [addToColumnId, setAddToColumnId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    module: "",
  })

  const handleDragStart = (e: React.DragEvent, taskId: string, fromColumnId: string) => {
    setDraggedTask({ taskId, fromColumnId })
    e.dataTransfer.effectAllowed = "move"
    // Add visual ghosting
    const target = e.target as HTMLElement
    target.style.opacity = '0.4'
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = '1'
    setDraggedTask(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault()
    if (draggedTask && draggedTask.fromColumnId !== toColumnId) {
      // 1. Optimistic Update in Store
      moveKanbanTask(draggedTask.taskId, draggedTask.fromColumnId, toColumnId)

      // 2. Persistent Sync
      const { error } = await supabase.from('kanban_tasks')
        .update({ column_id: toColumnId })
        .eq('id', draggedTask.taskId)

      if (error) {
        console.error("Failed to sync move:", error)
        toast({ title: "Erro ao sincronizar", description: "A posição não foi salva no servidor.", variant: "destructive" })
        // Rollback? Usually not needed for small moves, but good practice.
      } else {
        toast({
          title: "Tarefa movida",
          description: `Movida para ${kanbanColumns.find(c => c.id === toColumnId)?.title}`,
        })
      }
    }
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !addToColumnId || !user) return
    setIsSubmitting(true)

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      module_tag: newTask.module || "Geral",
      column_id: addToColumnId,
      user_id: user.id
    }

    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .insert(taskData)
        .select()
        .single()

      if (error) throw error

      addKanbanTask(addToColumnId, {
        id: data.id,
        title: data.title,
        description: data.description,
        priority: data.priority as any,
        module: data.module_tag || "Geral",
      })

      toast({ title: "Tarefa criada", description: "Nova tarefa salva no banco de dados." })
      setNewTask({ title: "", description: "", priority: "medium", module: "" })
      setIsAddDialogOpen(false)
      setAddToColumnId(null)
    } catch (err) {
      console.error(err)
      toast({ title: "Erro ao criar", description: "Não foi possível salvar a tarefa.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async (taskId: string, columnId: string) => {
    deleteKanbanTask(taskId, columnId)
    const { error } = await supabase.from('kanban_tasks').delete().eq('id', taskId)

    if (error) {
      toast({ title: "Erro ao deletar", description: "A tarefa pode ainda existir no servidor.", variant: "destructive" })
    } else {
      toast({ title: "Tarefa removida", description: "Excluída com sucesso." })
    }
  }

  const openAddDialog = (columnId: string) => {
    setAddToColumnId(columnId)
    setIsAddDialogOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Layout className="h-8 w-8 text-primary" />
            Kanban de Estudo
          </h1>
          <p className="text-muted-foreground font-medium">
            Gerencie seu fluxo de aprendizado e projetos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1">
            {kanbanColumns.reduce((acc, col) => acc + col.tasks.length, 0)} Tarefas Ativas
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-16rem)] min-h-[500px]">
        {kanbanColumns.map((column) => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className="flex flex-col rounded-2xl bg-muted/40 border border-border/50 p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground">{column.title}</h3>
                <Badge variant="secondary" className="bg-background text-[10px] h-5 min-w-[20px] p-0 flex items-center justify-center font-bold">
                  {column.tasks.length}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => openAddDialog(column.id)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
              {column.tasks.map((task) => (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                  onDragEnd={handleDragEnd}
                  className="group shadow-sm hover:shadow-md transition-all duration-200 border-border cursor-grab active:cursor-grabbing hover:border-primary/30 bg-card"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm leading-tight text-foreground line-clamp-2">{task.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {task.description || "Sem descrição"}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive gap-2" onClick={() => handleDeleteTask(task.id, column.id)}>
                            <Trash2 className="h-3.5 w-3.5" /> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Badge className={cn("text-[10px] py-0 h-5 px-2 border", priorityColors[task.priority as keyof typeof priorityColors])}>
                        {priorityLabels[task.priority as keyof typeof priorityLabels]}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Badge variant="outline" className="text-[9px] py-0 h-4 border-muted-foreground/20 font-normal">
                          {task.module}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {column.tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-30 border-2 border-dashed border-border rounded-xl">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <span className="text-xs font-medium">Vazio</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Adicionar Tarefa</DialogTitle>
            <DialogDescription>
              Crie uma nova atividade para o estágio de {kanbanColumns.find(c => c.id === addToColumnId)?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="title">Título da Atividade</Label>
                <span className={cn("text-[10px] font-bold", newTask.title.length >= 50 ? "text-destructive" : "text-muted-foreground")}>
                  {newTask.title.length}/50
                </span>
              </div>
              <Input
                id="title"
                placeholder="Ex: Estudar Structs"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                maxLength={50}
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <span className={cn("text-[10px] font-bold", newTask.description.length >= 200 ? "text-destructive" : "text-muted-foreground")}>
                  {newTask.description.length}/200
                </span>
              </div>
              <textarea
                id="description"
                className="flex w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                placeholder="Detalhes sobre a tarefa..."
                value={newTask.description}
                maxLength={200}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select value={newTask.priority} onValueChange={(v: any) => setNewTask({ ...newTask, priority: v })}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Tag / Módulo</Label>
                  <span className={cn("text-[10px] font-bold", newTask.module.length >= 15 ? "text-destructive" : "text-muted-foreground")}>
                    {newTask.module.length}/15
                  </span>
                </div>
                <Input
                  placeholder="Ex: Unreal"
                  value={newTask.module}
                  onChange={(e) => setNewTask({ ...newTask, module: e.target.value })}
                  maxLength={15}
                  className="bg-muted/30"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>Cancelar</Button>
            <Button onClick={handleAddTask} disabled={isSubmitting} className="font-bold">
              {isSubmitting ? "Criando..." : "Salvar Tarefa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
