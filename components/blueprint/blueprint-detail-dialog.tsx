import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlueprintCanvas } from "./blueprint-canvas"
import { BlueprintExample } from "@/lib/blueprint-examples"
import { Mechanic } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Eye, FileCode, Layers, PlayCircle, X, Download, ExternalLink, Code2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface BlueprintDetailDialogProps {
    mechanic: Mechanic
    blueprint: BlueprintExample
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function BlueprintDetailDialog({ mechanic, blueprint, trigger, open, onOpenChange }: BlueprintDetailDialogProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent side="right" className="w-full sm:w-[90vw] sm:max-w-[1400px] p-0 gap-0 bg-[#0f0f0f] border-l border-[#2a2a2a] text-foreground flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-[#2a2a2a] bg-[#1a1a1a] flex-shrink-0">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold flex items-center gap-3">
                            {mechanic.title}
                            {mechanic.purchased && <Badge className="bg-green-600">Adquirido</Badge>}
                        </SheetTitle>
                        <SheetDescription className="text-gray-400">
                            {mechanic.description}
                        </SheetDescription>
                    </SheetHeader>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="visual" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a] flex-shrink-0">
                        <TabsList className="bg-[#2a2a2a]">
                            <TabsTrigger value="visual" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Eye className="w-4 h-4 mr-2" /> Visualizador
                            </TabsTrigger>
                            <TabsTrigger value="implementation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <FileCode className="w-4 h-4 mr-2" /> Guia de Implementação
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Visual Tab */}
                    <TabsContent value="visual" className="flex-1 p-6 m-0 overflow-hidden">
                        <BlueprintCanvas
                            nodes={blueprint.nodes}
                            connections={blueprint.connections}
                            title={mechanic.title}
                            className="h-full w-full shadow-none border-0"
                            enableCopy={true}
                            manualCopyCode={blueprint.copyString}
                        />
                    </TabsContent>

                    {/* Implementation Tab */}
                    <TabsContent value="implementation" className="flex-1 p-0 m-0 overflow-hidden">
                        <ScrollArea className="h-full">
                            <div className="p-8 max-w-5xl mx-auto space-y-8">
                                {/* Introduction */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                                        <PlayCircle className="w-5 h-5" />
                                        Como Usar Este Sistema
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {mechanic.purchased ? (
                                            <>
                                                Você já possui este sistema! Siga o guia abaixo para baixar o projeto completo do Google Drive
                                                e começar a usar no Unreal Engine.
                                            </>
                                        ) : (
                                            <>
                                                Após adquirir este sistema, você terá acesso ao projeto completo no Google Drive.
                                                Este guia mostrará como baixar e implementar o {mechanic.title} no seu projeto.
                                            </>
                                        )}
                                    </p>
                                </div>

                                <Separator className="bg-[#2a2a2a]" />

                                {/* Download Instructions - Only show if purchased */}
                                {mechanic.purchased && (
                                    <>
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                                <Download className="w-5 h-5 text-green-400" />
                                                1. Baixar o Projeto do Google Drive
                                            </h3>
                                            <div className="bg-green-900/20 border border-green-900/50 rounded-lg p-4 space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-white text-sm">
                                                        1
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium mb-2">Acesse o Google Drive</p>
                                                        <p className="text-sm text-gray-300 mb-3">
                                                            Clique no botão verde "Baixar do Google Drive" na página da loja para acessar os arquivos.
                                                        </p>
                                                        <Button
                                                            className="bg-green-600 hover:bg-green-700"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a href={mechanic.driveLink} target="_blank" rel="noopener noreferrer">
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Abrir Google Drive
                                                                <ExternalLink className="ml-2 h-3 w-3" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-white text-sm">
                                                        2
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium mb-2">Baixe a pasta do projeto</p>
                                                        <p className="text-sm text-gray-300">
                                                            No Google Drive, clique com o botão direito na pasta do projeto e selecione
                                                            <strong className="text-white"> "Fazer download"</strong>.
                                                            O arquivo será baixado como <code className="bg-black/30 px-2 py-1 rounded text-yellow-400">.zip</code>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-white text-sm">
                                                        3
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium mb-2">Extraia os arquivos</p>
                                                        <p className="text-sm text-gray-300">
                                                            Extraia o arquivo <code className="bg-black/30 px-2 py-1 rounded text-yellow-400">.zip</code>
                                                            {" "}em uma pasta de sua preferência (ex: <code className="bg-black/30 px-2 py-1 rounded text-blue-400">C:\UnrealProjects\</code>)
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-white text-sm">
                                                        4
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium mb-2">Abra o projeto no Unreal Engine</p>
                                                        <p className="text-sm text-gray-300 mb-2">
                                                            Localize o arquivo <code className="bg-black/30 px-2 py-1 rounded text-purple-400">.uproject</code>
                                                            {" "}na pasta extraída e dê um duplo clique para abrir no Unreal Engine.
                                                        </p>
                                                        <div className="bg-yellow-900/20 border border-yellow-900/50 rounded p-3 mt-2">
                                                            <p className="text-xs text-yellow-200">
                                                                <strong>💡 Dica:</strong> Se o projeto pedir para recompilar, clique em "Yes".
                                                                Isso é normal e pode levar alguns minutos na primeira vez.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="bg-[#2a2a2a]" />
                                    </>
                                )}

                                {/* Implementation Instructions */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                        <Code2 className="w-5 h-5 text-purple-400" />
                                        {mechanic.purchased ? "2" : "1"}. Implementação Manual (Opcional)
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Se preferir implementar o blueprint manualmente no seu próprio projeto, siga as instruções abaixo:
                                    </p>
                                </div>

                                <Separator className="bg-[#2a2a2a]" />

                                {/* Components */}
                                {blueprint.instructions?.components && blueprint.instructions.components.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-blue-400" />
                                            1. Componentes Necessários
                                        </h3>
                                        <div className="grid gap-4">
                                            {blueprint.instructions.components.map((comp, i) => (
                                                <div key={i} className="flex flex-col p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-mono text-blue-300 font-bold">{comp.name}</span>
                                                        <Badge variant="outline" className="border-blue-900 text-blue-400">{comp.type}</Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-400">{comp.details}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Variables */}
                                {blueprint.instructions?.variables && blueprint.instructions.variables.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                            <FileCode className="w-5 h-5 text-purple-400" />
                                            {blueprint.instructions?.components && blueprint.instructions.components.length > 0 ? '2' : '1'}. Variáveis para Criar
                                        </h3>
                                        <div className="rounded-md border border-[#2a2a2a] overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-[#1a1a1a] text-gray-400">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium">Nome da Variável</th>
                                                        <th className="px-4 py-3 font-medium">Tipo</th>
                                                        <th className="px-4 py-3 font-medium">Valor Padrão</th>
                                                        <th className="px-4 py-3 font-medium">Descrição</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#2a2a2a] bg-[#0f0f0f]">
                                                    {blueprint.instructions.variables.map((v, i) => (
                                                        <tr key={i} className="hover:bg-[#151515]">
                                                            <td className="px-4 py-3 font-mono text-purple-300">{v.name}</td>
                                                            <td className="px-4 py-3 text-gray-300">{v.type}</td>
                                                            <td className="px-4 py-3 font-mono text-yellow-500">{v.default}</td>
                                                            <td className="px-4 py-3 text-gray-500">{v.tooltip}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Steps */}
                                {blueprint.instructions?.steps && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-white flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                            {(() => {
                                                let stepNum = 1;
                                                if (blueprint.instructions?.components && blueprint.instructions.components.length > 0) stepNum++;
                                                if (blueprint.instructions?.variables && blueprint.instructions.variables.length > 0) stepNum++;
                                                return stepNum;
                                            })()}. Passo a Passo
                                        </h3>
                                        <div className="space-y-4">
                                            {blueprint.instructions.steps.map((step, i) => (
                                                <div key={i} className="flex gap-4 p-4 rounded-lg bg-[#1a1a1a]/50 border border-[#2a2a2a]">
                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center font-bold text-gray-400">
                                                        {i + 1}
                                                    </div>
                                                    <p className="pt-1 text-gray-300">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
