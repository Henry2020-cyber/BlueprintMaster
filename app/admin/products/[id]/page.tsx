"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, Plus, Save, Trash, Video } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function ProductEditorPage({ params }: { params: { id: string } }) {
    const [activeTab, setActiveTab] = useState("details")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Editar Produto</h1>
                        <p className="text-muted-foreground">Gerencie os detalhes e o conteúdo do curso.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button>
                        <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="details">Detalhes do Produto</TabsTrigger>
                    <TabsTrigger value="content">Conteúdo (Módulos e Aulas)</TabsTrigger>
                    <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Básicas</CardTitle>
                            <CardDescription>
                                Título, descrição e preço do seu produto.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Título do Produto</Label>
                                <Input id="title" placeholder="Ex: Curso de Marketing Digital" defaultValue="Curso Mestre dos Agentes" maxLength={100} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea id="description" placeholder="Descreva o que o aluno irá aprender..." className="min-h-[100px]" maxLength={1000} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Preço (R$)</Label>
                                    <Input id="price" type="number" placeholder="0.00" defaultValue="297.00" min="0" max="999999.99" step="0.01" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Imagem de Capa</Label>
                                    <Button variant="outline" className="w-full">Upload Imagem</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                    <div className="flex justify-end">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Módulo
                        </Button>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {/* Mock Module 1 */}
                        <AccordionItem value="module-1" className="border rounded-lg px-4 bg-card/50">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <span className="font-semibold">Módulo 01: Introdução</span>
                                    <span className="text-sm text-muted-foreground font-normal">3 aulas</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div className="space-y-2">
                                    {/* Mock Lesson 1 */}
                                    <div className="flex items-center gap-3 p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors">
                                        <div className="h-8 w-8 rounded flex items-center justify-center bg-primary/10 text-primary">
                                            <Video className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Aula 01: Bem-vindo</p>
                                            <p className="text-xs text-muted-foreground">Video • 05:00</p>
                                        </div>
                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                    </div>
                                    {/* Mock Lesson 2 */}
                                    <div className="flex items-center gap-3 p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors">
                                        <div className="h-8 w-8 rounded flex items-center justify-center bg-primary/10 text-primary">
                                            <Video className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Aula 02: Configurando o ambiente</p>
                                            <p className="text-xs text-muted-foreground">Video • 12:30</p>
                                        </div>
                                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full border-dashed">
                                    <Plus className="mr-2 h-3 w-3" /> Adicionar Aula
                                </Button>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Mock Module 2 */}
                        <AccordionItem value="module-2" className="border rounded-lg px-4 bg-card/50">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <span className="font-semibold">Módulo 02: Fundamentos</span>
                                    <span className="text-sm text-muted-foreground font-normal">0 aulas</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    Nenhuma aula neste módulo ainda.
                                </div>
                                <Button variant="outline" size="sm" className="w-full border-dashed mt-2">
                                    <Plus className="mr-2 h-3 w-3" /> Adicionar Aula
                                </Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Visibilidade e Acesso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Produto Ativo</Label>
                                    <p className="text-sm text-muted-foreground">Se desativado, o produto não aparecerá na loja.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Permitir Comentários</Label>
                                    <p className="text-sm text-muted-foreground">Alunos podem comentar nas aulas.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
