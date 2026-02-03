"use client"

import React, { useState, useRef, useCallback } from "react"
import { BlueprintNode, Pin } from "./blueprint-node"
import { Button } from "@/components/ui/button"
import { Copy, Download, Maximize, Minimize, ZoomIn, ZoomOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface BlueprintNodeData {
    id: string
    title: string
    type?: "event" | "function" | "pure" | "macro" | "variable"
    color?: string
    inputs?: Pin[]
    outputs?: Pin[]
    position: { x: number; y: number }
}

export interface Connection {
    from: { nodeId: string; pinId: string }
    to: { nodeId: string; pinId: string }
}

interface BlueprintCanvasProps {
    nodes: BlueprintNodeData[]
    connections?: Connection[]
    title?: string
    className?: string
    enableCopy?: boolean
    manualCopyCode?: string
}

export function BlueprintCanvas({
    nodes,
    connections = [],
    title = "Event Graph",
    className = "",
    enableCopy = true,
    manualCopyCode
}: BlueprintCanvasProps) {
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 400, y: 200 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [selectedNode, setSelectedNode] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('[data-node]')) return
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            const delta = e.deltaY > 0 ? -0.1 : 0.1
            const newScale = Math.min(Math.max(scale + delta, 0.2), 3)
            setScale(newScale)
        }
    }

    const generateGUID = () => {
        const hex = () => Math.floor(Math.random() * 16).toString(16).toUpperCase()
        const segment = (length: number) => Array.from({ length }, hex).join('')
        return segment(32)
    }

    const getPinCategory = (type: string): string => {
        const categoryMap: Record<string, string> = {
            'exec': 'exec',
            'boolean': 'bool',
            'integer': 'int',
            'float': 'real',
            'string': 'string',
            'vector': 'struct',
            'rotator': 'struct',
            'object': 'object',
            'actor': 'object'
        }
        return categoryMap[type] || 'exec'
    }

    const getPinSubCategory = (type: string): string => {
        const subCategoryMap: Record<string, string> = {
            'float': 'float',
            'integer': '',
            'vector': '',
            'rotator': ''
        }
        return subCategoryMap[type] || ''
    }

    const generateBlueprintCode = useCallback(() => {
        let code = ''

        nodes.forEach((node, index) => {
            const nodeClass = node.type === 'event' ? 'K2Node_Event' :
                node.type === 'pure' ? 'K2Node_CallFunction' :
                    'K2Node_CallFunction'

            const fullClass = `/Script/BlueprintGraph.${nodeClass}`
            const nodeName = `${nodeClass}_${index}`

            code += `Begin Object Class=${fullClass} Name="${nodeName}" ExportPath="${fullClass}'/Game/Blueprints/BP_Blueprint.BP_Blueprint:EventGraph.${nodeName}'"\n`

            // Function/Event Reference
            if (node.type === 'event') {
                code += `   EventReference=(MemberName="${node.title}",bSelfContext=True)\n`
            } else if (node.type === 'function' || node.type === 'pure') {
                code += `   FunctionReference=(MemberName="${node.title}",bSelfContext=True)\n`
            }

            if (node.type === 'pure') {
                code += `   bDefaultsToPureFunc=True\n`
            }

            // Position
            code += `   NodePosX=${node.position.x}\n`
            code += `   NodePosY=${node.position.y}\n`

            // Error Type (optional)
            if (node.type !== 'pure') {
                code += `   ErrorType=1\n`
            }

            // GUID
            code += `   NodeGuid=${generateGUID()}\n`

            // Generate Pins
            const allPins = [...(node.inputs || []), ...(node.outputs || [])]

            allPins.forEach(pin => {
                const pinId = generateGUID()
                const category = getPinCategory(pin.type)
                const subCategory = getPinSubCategory(pin.type)
                const direction = pin.direction === 'output' ? 'Direction="EGPD_Output",' : ''

                code += `   CustomProperties Pin (`
                code += `PinId=${pinId},`
                code += `PinName="${pin.label || pin.id}",`

                if (pin.direction === 'output') {
                    code += `Direction="EGPD_Output",`
                }

                code += `PinType.PinCategory="${category}",`
                code += `PinType.PinSubCategory="${subCategory}",`
                code += `PinType.PinSubCategoryObject=None,`
                code += `PinType.PinSubCategoryMemberReference=(),`
                code += `PinType.PinValueType=(),`
                code += `PinType.ContainerType=None,`
                code += `PinType.bIsReference=False,`
                code += `PinType.bIsConst=False,`
                code += `PinType.bIsWeakPointer=False,`
                code += `PinType.bIsUObjectWrapper=False,`
                code += `PinType.bSerializeAsSinglePrecisionFloat=False,`

                // LinkedTo (connections)
                const linkedPins = connections
                    .filter(conn =>
                        (conn.from.nodeId === node.id && conn.from.pinId === pin.id) ||
                        (conn.to.nodeId === node.id && conn.to.pinId === pin.id)
                    )

                if (linkedPins.length > 0) {
                    const links = linkedPins.map(conn => {
                        const targetNode = conn.from.nodeId === node.id ?
                            nodes.find(n => n.id === conn.to.nodeId) :
                            nodes.find(n => n.id === conn.from.nodeId)
                        const targetIndex = nodes.indexOf(targetNode!)
                        return `K2Node_CallFunction_${targetIndex} ${generateGUID()}`
                    }).join(',')
                    code += `LinkedTo=(${links}),`
                }

                // Default values
                if (category === 'real' || category === 'int') {
                    code += `DefaultValue="0.0",`
                    code += `AutogeneratedDefaultValue="0.0",`
                } else if (category === 'bool') {
                    code += `DefaultValue="false",`
                    code += `AutogeneratedDefaultValue="false",`
                } else if (category === 'struct') {
                    code += `DefaultValue="0, 0, 0",`
                    code += `AutogeneratedDefaultValue="0, 0, 0",`
                }

                code += `PersistentGuid=00000000000000000000000000000000,`
                code += `bHidden=False,`
                code += `bNotConnectable=False,`
                code += `bDefaultValueIsReadOnly=False,`
                code += `bDefaultValueIsIgnored=False,`
                code += `bAdvancedView=False,`
                code += `bOrphanedPin=False,`
                code += `)\n`
            })

            code += `End Object\n`

            if (index < nodes.length - 1) {
                code += '\n'
            }
        })

        return code
    }, [nodes, connections])

    const copyToClipboard = () => {
        const code = manualCopyCode || generateBlueprintCode()
        navigator.clipboard.writeText(code).then(() => {
            toast({
                title: "Código Copiado!",
                description: manualCopyCode
                    ? "Código T3D profissional copiado. Cole no Unreal Engine (Ctrl+V)."
                    : "Código visual copiado. Cole no Unreal Engine.",
            })
        })
    }

    const downloadAsText = () => {
        const code = manualCopyCode || generateBlueprintCode()
        const blob = new Blob([code], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace(/\s/g, '_')}.txt`
        a.click()
        URL.revokeObjectURL(url)

        toast({
            title: "Blueprint Baixado!",
            description: "Abra o arquivo e copie o conteúdo para o Unreal Engine",
        })
    }

    return (
        <div className={`flex flex-col h-[600px] border border-[#2a2a2a] rounded-lg overflow-hidden shadow-2xl bg-[#1a1a1a] ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#202020] border-b border-[#333]">
                <div className="flex items-center gap-4">
                    <span className="text-[#a0a0a0] font-bold text-sm tracking-wide">BLUEPRINT</span>
                    <div className="h-4 w-[1px] bg-[#444]"></div>
                    <span className="text-[#eee] text-sm font-medium">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    {enableCopy && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[#aaa] hover:bg-[#333] hover:text-white gap-2"
                                onClick={copyToClipboard}
                            >
                                <Copy className="h-4 w-4" />
                                Copiar Código
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[#aaa] hover:bg-[#333] hover:text-white gap-2"
                                onClick={downloadAsText}
                            >
                                <Download className="h-4 w-4" />
                                Baixar
                            </Button>
                            <div className="h-4 w-[1px] bg-[#444]"></div>
                        </>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#aaa] hover:bg-[#333] hover:text-white" onClick={() => setScale(s => Math.min(s + 0.1, 3))}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#aaa] hover:bg-[#333] hover:text-white" onClick={() => setScale(s => Math.max(s - 0.1, 0.2))}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Canvas */}
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{
                    backgroundImage: `
            linear-gradient(to right, #2a2a2a 1px, transparent 1px),
            linear-gradient(to bottom, #2a2a2a 1px, transparent 1px)
          `,
                    backgroundSize: `${20 * scale}px ${20 * scale}px`,
                    backgroundColor: "#151515"
                }}
            >
                <div
                    className="absolute origin-top-left"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    }}
                >
                    {/* Render Connections */}
                    <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        {connections.map((conn, idx) => {
                            const fromNode = nodes.find(n => n.id === conn.from.nodeId)
                            const toNode = nodes.find(n => n.id === conn.to.nodeId)

                            if (!fromNode || !toNode) return null

                            const x1 = fromNode.position.x + 180
                            const y1 = fromNode.position.y + 30
                            const x2 = toNode.position.x
                            const y2 = toNode.position.y + 30

                            const midX = (x1 + x2) / 2

                            return (
                                <path
                                    key={idx}
                                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                    fill="none"
                                    opacity="0.8"
                                />
                            )
                        })}
                    </svg>

                    {/* Render Nodes */}
                    {nodes.map((node) => (
                        <div key={node.id} data-node onClick={() => setSelectedNode(node.id)}>
                            <BlueprintNode
                                {...node}
                                selected={selectedNode === node.id}
                                onDragStart={(e, nodeId) => {
                                    e.stopPropagation()
                                    setSelectedNode(nodeId)
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-4 left-4 pointer-events-none space-y-1">
                    <div className="text-[10px] text-[#555] font-mono">
                        ZOOM: {Math.round(scale * 100)}%
                    </div>
                    <div className="text-[10px] text-[#555] font-mono">
                        NODES: {nodes.length}
                    </div>
                    {enableCopy && (
                        <div className="text-[10px] text-[#888] font-mono mt-2 flex items-center gap-1">
                            {manualCopyCode ? (
                                <><span className="text-green-500 font-bold">●</span> Código Validado (T3D)</>
                            ) : (
                                <>💡 Clique em "Copiar Código"</>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
