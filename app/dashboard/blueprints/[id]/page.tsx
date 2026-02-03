"use client"

import { useCallback, useState, useRef, useEffect, useMemo } from "react"
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
    Panel,
    NodeTypes,
    Handle,
    Position,
    NodeToolbar,
    MarkerType,
    ReactFlowInstance,
    useReactFlow,
    ReactFlowProvider,
    OnConnectStart,
    OnConnectEnd,
    SelectionMode
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    MousePointer2,
    Hand,
    Square,
    Circle,
    StickyNote,
    Type,
    Diamond,
    Undo2,
    Redo2,
    Share2,
    Download,
    Plus,
    Trash2,
    Copy,
    LayoutGrid,
    MessageSquare,
    ChevronLeft,
    FilePlus,
    Layout as LayoutIcon,
    PenTool as PenIcon,
    Frame as FrameIcon,
    Smile,
    Workflow,
    CreditCard,
    X,
    Image as ImageIcon,
    Star,
    Heart,
    ThumbsUp,
    Zap,
    Target,
    Flag,
    Settings,
    Hash,
    Pencil,
    Highlighter,
    Eraser,
    MousePointerSquareDashed,
    Shapes as ShapesIcon,
    CircleSlash,
    Triangle,
    Hexagon,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "@/hooks/use-toast"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useTheme } from "next-themes"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toPng, toJpeg } from 'html-to-image';
// @ts-ignore
import download from 'downloadjs';
import { getStroke } from 'perfect-freehand'

// --- Constants & Styles ---

const NODES_COLORS = {
    light: [
        { name: 'White', bg: '#ffffff', border: '#cbd5e1', text: '#1e293b' },
        { name: 'Blue', bg: '#dbeafe', border: '#60a5fa', text: '#1e3a8a' },
        { name: 'Yellow', bg: '#fef9c3', border: '#facc15', text: '#854d0e' },
        { name: 'Green', bg: '#dcfce7', border: '#4ade80', text: '#14532d' },
        { name: 'Red', bg: '#fee2e2', border: '#f87171', text: '#7f1d1d' },
    ],
    dark: [
        { name: 'Gray', bg: '#1e293b', border: '#475569', text: '#f8fafc' },
        { name: 'Blue', bg: '#172554', border: '#1d4ed8', text: '#dbeafe' },
        { name: 'Yellow', bg: '#422006', border: '#a16207', text: '#fef9c3' },
        { name: 'Green', bg: '#052e16', border: '#15803d', text: '#dcfce7' },
        { name: 'Red', bg: '#450a0a', border: '#b91c1c', text: '#fee2e2' },
    ]
}

const STICKY_COLORS = [
    '#fef3c7', // Yellow
    '#bfdbfe', // Blue
    '#bbf7d0', // Green
    '#fbcfe8', // Pink
    '#e5e7eb', // Gray
    '#c084fc', // Purple
]

const DRAWING_COLORS = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#ef4444', // Red
    '#f59e0b', // Yellow
    '#000000', // Black
    '#ffffff', // White
]

const PEN_SIZES = [2, 5, 12] // Finer, Medium, Thick

// --- Helper Functions for Drawing ---

function getSvgPathFromStroke(stroke: any) {
    if (!stroke.length) return ''
    const d = stroke.reduce(
        (acc: any, [x0, y0]: any, i: any, arr: any) => {
            if (i === 0) {
                acc.push('M', x0, y0, 'Q')
            } else {
                const [x1, y1] = arr[i - 1]
                acc.push(x1, y1, (x0 + x1) / 2, (y0 + y1) / 2)
            }
            return acc
        },
        []
    )
    d.push('Z')
    return d.join(' ')
}

// --- Custom Components ---

const NodeTools = ({ id, data, dark }: any) => {
    return (
        <NodeToolbar isVisible={data.toolbarVisible} position={Position.Top} className="flex items-center gap-1 bg-white dark:bg-zinc-800 shadow-xl border dark:border-zinc-700 rounded-md p-1.5 px-2 z-50">
            <div className="flex gap-1.5 mr-2 border-r dark:border-zinc-600 pr-2">
                {(data.isSticky ? STICKY_COLORS : (dark ? NODES_COLORS.dark : NODES_COLORS.light)).map((c: any) => (
                    <button
                        key={typeof c === 'string' ? c : c.name}
                        className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10 hover:scale-110 transition-transform ring-1 ring-transparent hover:ring-primary"
                        style={{ backgroundColor: typeof c === 'string' ? c : c.bg }}
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onChangeColor?.(
                                typeof c === 'string' ? c : c.bg,
                                typeof c === 'string' ? undefined : c.border,
                                typeof c === 'string' ? undefined : c.text
                            )
                        }}
                    />
                ))}
            </div>
            <button
                className="text-muted-foreground hover:text-red-500 p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                onClick={(e) => { e.stopPropagation(); data.onDelete?.(id) }}
                title="Deletar"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            <button
                className="text-muted-foreground hover:text-blue-500 p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                onClick={(e) => { e.stopPropagation(); data.onCopy?.(id) }}
                title="Duplicar"
            >
                <Copy className="h-4 w-4" />
            </button>
        </NodeToolbar>
    )
}

// --- Custom Nodes ---

const DoodleNode = ({ id, data, selected }: any) => {
    return (
        <div className={cn("relative group", selected ? "ring-2 ring-blue-500 ring-offset-2" : "")} style={{ width: data.width, height: data.height }}>
            {selected && (
                <NodeToolbar isVisible={true} position={Position.Top}>
                    <div className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg p-1.5 shadow-2xl flex gap-1 pointer-events-auto">
                        <button className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors" onClick={() => data.onDelete(id)}>
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </NodeToolbar>
            )}
            <svg
                style={{ overflow: 'visible', pointerEvents: 'none' }}
                width={data.width} height={data.height}
            >
                <path
                    d={data.path}
                    fill={data.color || 'black'}
                    style={{ opacity: data.type === 'highlighter' ? 0.4 : 1 }}
                />
            </svg>
        </div>
    )
}

const StickyNode = ({ id, data, selected }: any) => {
    return (
        <div className="relative group">
            <NodeTools id={id} data={{ ...data, toolbarVisible: selected, isSticky: true }} />
            <div
                className={cn(
                    "shadow-lg transition-all group relative flex items-center justify-center p-6",
                    selected ? "ring-2 ring-blue-500/50 scale-[1.01]" : ""
                )}
                style={{
                    backgroundColor: data.color || '#fef3c7',
                    width: '200px',
                    height: '200px',
                    fontFamily: '"Kalam", "Comic Sans MS", cursive',
                    transform: 'rotate(-1deg)'
                }}
            >
                <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-transparent border-none" />
                <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-transparent border-none" />

                <textarea
                    className="w-full h-full bg-transparent resize-none border-none focus:outline-none text-center text-xl placeholder:text-black/20 text-black/80 leading-snug"
                    placeholder="Sua ideia aqui..."
                    defaultValue={data.label}
                    onChange={(evt) => data.onChangeLabel?.(evt.target.value)}
                    style={{ fontFamily: 'inherit' }}
                    onKeyDown={(e) => e.stopPropagation()}
                />

                <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-transparent border-none" />
                <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-transparent border-none" />
            </div>
        </div>
    )
}

const ShapeNode = ({ id, data, selected }: any) => {
    const isDiamond = data.shape === 'diamond'
    const isRound = data.shape === 'round-rect'
    const isCircle = data.shape === 'circle'
    const isTriangle = data.shape === 'triangle'
    const isHexagon = data.shape === 'hexagon'

    const bgColor = data.bgColor || '#ffffff'
    const borderColor = data.borderColor || '#94a3b8'
    const textColor = data.textColor || '#1e293b'

    let shapeClass = "rounded-lg"
    let clipPath = undefined

    if (isRound) shapeClass = "rounded-3xl"
    if (isCircle) shapeClass = "rounded-full"
    if (isDiamond) {
        shapeClass = ""
        clipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
    }
    if (isTriangle) {
        shapeClass = ""
        clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)"
    }
    if (isHexagon) {
        shapeClass = ""
        clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"
    }

    const handleZIndex = 50
    const handleBaseStyle = "!bg-blue-500 border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all hover:scale-125 hover:shadow-blue-500/50 cursor-crosshair rounded-full"

    // Calculate precise handles position to touch the visual boundaries of each shape
    // w-32 = 128px, w-48 = 192px. Handle radius is 7px (w-3.5 = 14px)
    let leftOffset = -7
    let rightOffset = -7
    let topOffset = -7
    let bottomOffset = -7

    if (isTriangle) {
        // Slanted edges at middle height are at 25% and 75% of width
        leftOffset = 25
        rightOffset = 25
    }

    return (
        <div className={cn("relative group", isDiamond || isCircle || isTriangle || isHexagon ? "w-32 h-32" : "w-48 h-24")}>
            <NodeTools id={id} data={{ ...data, toolbarVisible: selected }} />
            <div
                className={cn(
                    "flex items-center justify-center text-center border-2 transition-all shadow-xl backdrop-blur-md overflow-hidden",
                    shapeClass,
                    "w-full h-full",
                    selected ? "ring-2 ring-blue-500 ring-offset-4 dark:ring-offset-zinc-950 scale-[1.02]" : "hover:border-blue-400/50"
                )}
                style={{
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    clipPath,
                    background: `linear-gradient(145deg, ${bgColor}ee, ${bgColor}aa)`,
                }}
            >
                <div className={cn(
                    "w-full px-4 flex items-center justify-center h-full",
                    isTriangle ? "pt-8" : ""
                )}>
                    <textarea
                        className="w-full bg-transparent text-center focus:outline-none text-sm font-bold placeholder:text-slate-400/70 resize-none overflow-hidden"
                        style={{ color: textColor }}
                        placeholder="Novo Nó..."
                        defaultValue={data.label}
                        onChange={(e) => data.onChangeLabel?.(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        rows={1}
                    />
                </div>
            </div>

            {/* Side Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className={cn("w-3.5 h-3.5", handleBaseStyle)}
                style={{ left: leftOffset, zIndex: handleZIndex }}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={cn("w-3.5 h-3.5", handleBaseStyle)}
                style={{ right: rightOffset, zIndex: handleZIndex }}
            />

            {/* Vertical Handles */}
            <Handle
                type="target"
                position={Position.Top}
                className={cn("w-3.5 h-3.5", handleBaseStyle)}
                style={{ top: topOffset, zIndex: handleZIndex }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className={cn("w-3.5 h-3.5", handleBaseStyle)}
                style={{ bottom: bottomOffset, zIndex: handleZIndex }}
            />
        </div>
    )
}

const TextNode = ({ id, data, selected }: any) => {
    return (
        <div className={cn("relative p-2 min-w-[100px]", selected ? "border-dashed border-2 border-blue-400 rounded-md" : "")}>
            <NodeTools id={id} data={{ ...data, toolbarVisible: selected }} />
            <input
                className="w-full bg-transparent text-xl font-bold bg-none border-none focus:outline-none dark:text-zinc-100"
                placeholder="Digite algo..."
                defaultValue={data.label || "Texto Livre"}
                onChange={(e) => data.onChangeLabel?.(e.target.value)}
                autoFocus
            />
        </div>
    )
}

const FrameNode = ({ id, data, selected }: any) => {
    const isBrowser = data.preset === 'desktop' || data.preset === '16:9';
    const isMobile = data.preset === 'mobile';
    const isTablet = data.preset === 'tablet';

    return (
        <div className={cn(
            "w-full h-full border rounded-xl border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-0 relative group shadow-sm transition-all",
            selected ? "ring-2 ring-blue-500 border-transparent shadow-xl" : ""
        )}
            style={{ width: data.width || 400, height: data.height || 300 }}
        >
            {/* Title above Frame */}
            <div className="absolute -top-7 left-0 bg-transparent text-xs font-semibold text-slate-500 dark:text-zinc-500 flex items-center gap-1 uppercase tracking-wider">
                {data.label || "Quadro"}
            </div>

            {/* Frame Headers (Device specific) */}
            {isBrowser && (
                <div className="w-full h-6 border-b border-slate-100 dark:border-zinc-800 flex items-center gap-1.5 px-3 bg-slate-50/50 dark:bg-zinc-800/30 rounded-t-xl">
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-700" />
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-700" />
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-700" />
                </div>
            )}

            {(isMobile || isTablet) && (
                <div className="w-full h-8 flex items-center justify-center px-4">
                    <div className="w-16 h-1 rounded-full bg-slate-200 dark:bg-zinc-800 mt-2" />
                </div>
            )}

            {/* Content Area */}
            <div className="w-full h-full flex flex-col pointer-events-none p-4">
                {/* Visual placeholder content common in wireframes */}
                {!data.label && <div className="space-y-4 pt-10 px-10">
                    <div className="h-4 w-3/4 bg-slate-100 dark:bg-zinc-800/50 rounded animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-50 dark:bg-zinc-800/30 rounded" />
                        <div className="h-2 w-5/6 bg-slate-50 dark:bg-zinc-800/30 rounded" />
                    </div>
                </div>}
            </div>

            {/* Bottom Bar for Mobile/Tablet */}
            {(isMobile || isTablet) && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 rounded-full bg-slate-100 dark:bg-zinc-800/50" />
            )}
        </div>
    )
}

const CommentNode = ({ id, data, selected }: any) => {
    return (
        <div className={cn(
            "rounded-tr-xl rounded-bl-xl rounded-tl-xl p-3 shadow-lg bg-white dark:bg-zinc-800 border dark:border-zinc-700 max-w-[200px] flex gap-2",
            selected ? "ring-2 ring-blue-500" : ""
        )}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shrink-0 flex items-center justify-center text-white text-xs font-bold">U</div>
            <textarea
                className="w-full text-xs bg-transparent border-none resize-none focus:outline-none dark:text-zinc-300"
                defaultValue={data.label || "Comentário..."}
                onChange={(e) => data.onChangeLabel?.(e.target.value)}
            />
        </div>
    )
}

const ImageNode = ({ id, data, selected }: any) => {
    return (
        <div className={cn("relative group", selected ? "ring-2 ring-blue-500" : "")}>
            <NodeTools id={id} data={{ ...data, toolbarVisible: selected }} />
            <img src={data.url} className="max-w-[400px] rounded-lg shadow-md" alt="Uploaded" />
        </div>
    )
}

const StickerNode = ({ id, data, selected }: any) => {
    const Icon = data.icon || Smile;
    return (
        <div className={cn("relative p-2 group", selected ? "ring-2 ring-blue-500 rounded-lg" : "")}>
            <NodeTools id={id} data={{ ...data, toolbarVisible: selected }} />
            <Icon className="w-12 h-12 text-blue-500" />
        </div>
    )
}

// Define nodeTypes outside or memoize them to prevent React Flow warnings
const NODE_TYPES = {
    sticky: StickyNode,
    shape: ShapeNode,
    text: TextNode,
    frame: FrameNode,
    comment: CommentNode,
    image: ImageNode,
    sticker: StickerNode,
    doodle: DoodleNode
}

// --- Editor Context & Provider ---

function EditorContent() {
    const { id } = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const { theme, resolvedTheme } = useTheme()
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const isDark = resolvedTheme === 'dark'

    // Refs
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isSavingRef = useRef(false)
    const pendingSaveRef = useRef(false)
    const firstLoadRef = useRef(true)
    const isInternalUpdate = useRef(false)
    const currentSavePromise = useRef<Promise<boolean> | null>(null)
    const lastSavedDataRef = useRef<string>("")
    const connectingNodeId = useRef<string | null>(null)
    const drawingPoints = useRef<number[][]>([])

    // Flow State
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [title, setTitle] = useState("Carregando...")
    const [saving, setSaving] = useState(false)
    const [activeTool, setActiveTool] = useState<'move' | 'select' | 'pen' | 'eraser' | 'frame' | 'shape' | 'sticky' | 'text'>('select')
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
    const [dbNodesIds, setDbNodesIds] = useState<Set<string>>(new Set())

    const nodeTypes = useMemo(() => NODE_TYPES, [])

    // UI/Interaction State
    const [connectionMenu, setConnectionMenu] = useState<{ isOpen: boolean, x: number, y: number, source: string | null, handleType: string | null }>({
        isOpen: false, x: 0, y: 0, source: null, handleType: null
    })

    // Pen State
    const [penConfig, setPenConfig] = useState({
        type: 'pen' as 'pen' | 'highlighter' | 'laser',
        size: 5,
        color: '#10b981'
    })
    const [currentPath, setCurrentPath] = useState<any[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [isSpacePressed, setIsSpacePressed] = useState(false)

    // Undo/Redo State
    const [history, setHistory] = useState<{ nodes: Node[], edges: Edge[] }[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)

    // --- Core Node Manipulation (Hoisted) ---
    function updateNodeLabel(nodeId: string, newVal: string) {
        setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, label: newVal } } : n))
        setTimeout(() => saveGraph(), 500);
    }

    function updateNodeColor(nodeId: string, bgColor: string, borderColor?: string, textColor?: string) {
        setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, color: bgColor, bgColor, borderColor, textColor } } : n))
        setTimeout(() => saveGraph(), 100);
    }

    function deleteNode(nodeId: string) {
        takeSnapshot();
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        setTimeout(() => saveGraph(), 100);
    }

    function bindNodeMethods(node: Node, dark: boolean) {
        return {
            ...node,
            data: {
                ...node.data,
                toolbarVisible: node.selected,
                onChangeLabel: (val: string) => updateNodeLabel(node.id, val),
                onChangeColor: (bg: string, border: string, text: string) => updateNodeColor(node.id, bg, border, text),
                onDelete: (id: string) => deleteNode(id),
                onCopy: (id: string) => duplicateNode(node.id)
            }
        }
    }

    function duplicateNode(nodeId: string) {
        setNodes((nds) => {
            const node = nds.find(n => n.id === nodeId)
            if (!node) return nds
            const newNodeId = crypto.randomUUID()
            const newNode = {
                ...node,
                id: newNodeId,
                position: { x: node.position.x + 50, y: node.position.y + 50 },
                data: { ...node.data },
            }
            return nds.concat(bindNodeMethods(newNode, isDark))
        })
        setTimeout(() => saveGraph(), 100);
    }

    // --- Undo/Redo Logic ---
    const takeSnapshot = useCallback(() => {
        if (isInternalUpdate.current) return;
        setHistory(prev => {
            const next = prev.slice(0, historyIndex + 1);
            return [...next, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }].slice(-50);
        });
        setHistoryIndex(prev => prev + 1);
    }, [nodes, edges, historyIndex]);

    // --- Core Saving Logic (Optimized) ---
    const getNormalizedDataString = useCallback((nodes: Node[], edges: Edge[], mapTitle: string) => {
        return JSON.stringify({
            t: mapTitle,
            n: nodes.map((n: any) => ({
                id: n.id,
                pos: n.position,
                data: { ...n.data, onChangeLabel: undefined, onChangeColor: undefined, onDelete: undefined, onCopy: undefined },
                w: n.width || n.style?.width || n.data?.width,
                h: n.height || n.style?.height || n.data?.height,
                parent: n.parentNode,
                type: n.type
            })).sort((a, b) => a.id.localeCompare(b.id)),
            e: edges.map((e: any) => ({ id: e.id, s: e.source, t: e.target, type: e.type, label: e.label })).sort((a, b) => a.id.localeCompare(b.id))
        });
    }, []);

    const saveGraph = useCallback(async (): Promise<boolean> => {
        if (!id || !rfInstance) return false;

        // If already saving, flag it as pending and return the current promise
        if (isSavingRef.current) {
            pendingSaveRef.current = true;
            return currentSavePromise.current || false;
        }

        const runSave = async (): Promise<boolean> => {
            const nodes = rfInstance.getNodes();
            const edges = rfInstance.getEdges();

            const currentDataString = getNormalizedDataString(nodes, edges, title);

            if (currentDataString === lastSavedDataRef.current && !firstLoadRef.current) {
                return true;
            }

            setSaving(true);
            isSavingRef.current = true;
            pendingSaveRef.current = false;

            const nodesDB = nodes.map((n: Node) => {
                const { onChangeLabel, onChangeColor, onDelete, onCopy, ...cleanData } = n.data;
                const width = n.width || n.style?.width || n.data?.width;
                const height = n.height || n.style?.height || n.data?.height;

                return {
                    id: n.id,
                    map_id: id,
                    type: n.type || 'default',
                    position_x: n.position.x,
                    position_y: n.position.y,
                    data: { ...cleanData, parentNode: n.parentNode, width, height },
                    width: width ? Number(width) : null,
                    height: height ? Number(height) : null
                };
            });

            const edgesDB = edges.map((e: Edge) => ({
                id: e.id,
                map_id: id,
                source: e.source,
                target: e.target,
                type: e.type || 'smoothstep',
                animated: e.animated,
                label: e.label
            }));

            try {
                // 1. Update Map Metadata
                const { error: mapError } = await supabase.from('mind_maps').update({ title, updated_at: new Date().toISOString() }).eq('id', id);
                if (mapError) throw mapError;

                // 2. Sync Nodes (Upsert current, Delete removed)
                if (nodesDB.length > 0) {
                    const { error: upsertError } = await supabase.from('mind_map_nodes').upsert(nodesDB);
                    if (upsertError) throw upsertError;

                    const currentNodeIds = nodes.map(n => n.id);
                    const { error: deleteError } = await supabase.from('mind_map_nodes')
                        .delete()
                        .eq('map_id', id)
                        .not('id', 'in', `(${currentNodeIds.map(id => `'${id.replace(/'/g, "''")}'`).join(',')})`);
                    if (deleteError) throw deleteError;
                } else {
                    await supabase.from('mind_map_nodes').delete().eq('map_id', id);
                }

                // 3. Sync Edges (Upsert current, Delete removed)
                if (edgesDB.length > 0) {
                    const { error: upsertError } = await supabase.from('mind_map_edges').upsert(edgesDB);
                    if (upsertError) throw upsertError;

                    const currentEdgeIds = edges.map(e => e.id);
                    const { error: deleteError } = await supabase.from('mind_map_edges')
                        .delete()
                        .eq('map_id', id)
                        .not('id', 'in', `(${currentEdgeIds.map(id => `'${id.replace(/'/g, "''")}'`).join(',')})`);
                    if (deleteError) throw deleteError;
                } else {
                    await supabase.from('mind_map_edges').delete().eq('map_id', id);
                }

                lastSavedDataRef.current = currentDataString;
                firstLoadRef.current = false;
                console.log("Graph saved successfully");
                return true;
            } catch (error) {
                console.error("Save error:", error);
                pendingSaveRef.current = true;
                return false;
            } finally {
                setSaving(false);
                isSavingRef.current = false;

                // If another save was requested during this one, run it
                if (pendingSaveRef.current) {
                    currentSavePromise.current = saveGraph();
                    await currentSavePromise.current;
                } else {
                    currentSavePromise.current = null;
                }
            }
        };

        currentSavePromise.current = runSave();
        return currentSavePromise.current;
    }, [id, rfInstance, title, supabase, getNormalizedDataString]);

    const undo = useCallback(() => {
        if (historyIndex <= 0 || !history[historyIndex - 1]) return;
        isInternalUpdate.current = true;
        const prev = history[historyIndex - 1];
        setNodes(prev.nodes.map((n: Node) => bindNodeMethods(n, isDark)));
        setEdges(prev.edges);
        setHistoryIndex(historyIndex - 1);
        setTimeout(() => { isInternalUpdate.current = false; saveGraph(); }, 100);
    }, [history, historyIndex, isDark, setNodes, setEdges, saveGraph]);

    const redo = useCallback(() => {
        if (historyIndex >= history.length - 1) return;
        isInternalUpdate.current = true;
        const next = history[historyIndex + 1];
        setNodes(next.nodes.map(n => bindNodeMethods(n, isDark)));
        setEdges(next.edges);
        setHistoryIndex(historyIndex + 1);
        setTimeout(() => { isInternalUpdate.current = false; saveGraph(); }, 100);
    }, [history, historyIndex, isDark, setNodes, setEdges, saveGraph]);

    // --- Interaction Handlers ---
    const onConnectStart = useCallback((_: any, { nodeId }: any) => {
        connectingNodeId.current = nodeId
    }, [])

    const onConnectEnd = useCallback((event: any) => {
        if (!connectingNodeId.current || !rfInstance) return
        const targetIsPane = (event.target as Element).classList.contains('react-flow__pane')
        if (targetIsPane) {
            const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
            const bounds = reactFlowWrapper.current?.getBoundingClientRect();
            if (bounds) {
                setConnectionMenu({
                    isOpen: true,
                    x: clientX - bounds.left,
                    y: clientY - bounds.top,
                    source: connectingNodeId.current,
                    handleType: 'source'
                })
            }
        }
        connectingNodeId.current = null
    }, [rfInstance])

    const onNodeDragStop = useCallback((_: any, node: Node) => {
        // Prevent frames from nesting inside themselves or creating circular dependencies
        const frame = nodes.find(n =>
            n.id !== node.id &&
            n.type === 'frame' &&
            node.position.x >= n.position.x &&
            node.position.x <= n.position.x + (Number(n.style?.width || n.data?.width) || 400) &&
            node.position.y >= n.position.y &&
            node.position.y <= n.position.y + (Number(n.style?.height || n.data?.height) || 300)
        );

        if (frame) {
            if (node.parentNode !== frame.id) {
                setNodes(nds => nds.map(n => n.id === node.id ? {
                    ...n, parentNode: frame.id, extent: 'parent' as const,
                    position: { x: node.position.x - frame.position.x, y: node.position.y - frame.position.y }
                } : n));
            }
        } else if (node.parentNode) {
            // Dragged OUT of any frame
            const parent = nodes.find(n => n.id === node.parentNode);
            if (parent) {
                setNodes(nds => nds.map(n => n.id === node.id ? {
                    ...n, parentNode: undefined, extent: undefined,
                    position: { x: node.position.x + parent.position.x, y: node.position.y + parent.position.y }
                } : n));
            }
        }

        // Use a small timeout to ensure state has updated before saving
        setTimeout(() => saveGraph(), 100);
    }, [nodes, setNodes, saveGraph]);

    const handleMenuSelection = (type: string, subType?: string) => {
        if (!rfInstance || !connectionMenu.source) return;
        const position = rfInstance.screenToFlowPosition({ x: connectionMenu.x, y: connectionMenu.y });
        const newNodeId = crypto.randomUUID()
        const newNode = {
            id: newNodeId,
            type,
            position: { x: position.x - 75, y: position.y - 25 },
            data: { label: subType === 'diamond' ? 'Decisão' : 'Processo', shape: subType }
        }
        setNodes((nds) => nds.concat(bindNodeMethods(newNode, isDark)))
        setEdges((eds) => addEdge({ id: `e${connectionMenu.source}-${newNodeId}`, source: connectionMenu.source!, target: newNodeId, type: 'smoothstep', animated: true }, eds))
        setConnectionMenu({ isOpen: false, x: 0, y: 0, source: null, handleType: null })
        setTimeout(() => saveGraph(), 100);
    }

    const onPointerDown = useCallback((event: React.PointerEvent) => {
        if (activeTool !== 'pen' || !rfInstance) return;
        if (event.button !== 0) return; // Only left click

        const target = event.target as HTMLElement;
        if (target.closest('.react-flow__panel') || target.closest('button')) return;

        event.stopPropagation();
        const bounds = reactFlowWrapper.current?.getBoundingClientRect();
        if (!bounds) return;

        const { x, y, zoom } = rfInstance.getViewport();
        const stageX = (event.clientX - bounds.left - x) / zoom;
        const stageY = (event.clientY - bounds.top - y) / zoom;

        setIsDrawing(true);
        drawingPoints.current = [[stageX, stageY, 0.5]];
        setCurrentPath([[stageX, stageY, 0.5]]);
    }, [activeTool, rfInstance]);

    const onPointerMove = useCallback((event: React.PointerEvent) => {
        if (!isDrawing || !rfInstance) return;
        event.stopPropagation();

        const bounds = reactFlowWrapper.current?.getBoundingClientRect();
        if (!bounds) return;

        const { x, y, zoom } = rfInstance.getViewport();
        const stageX = (event.clientX - bounds.left - x) / zoom;
        const stageY = (event.clientY - bounds.top - y) / zoom;

        const lastPoint = drawingPoints.current[drawingPoints.current.length - 1];
        if (lastPoint && lastPoint[0] === stageX && lastPoint[1] === stageY) return;

        drawingPoints.current.push([stageX, stageY, 0.5]);
        setCurrentPath([...drawingPoints.current]);
    }, [isDrawing, rfInstance]);

    const onPointerUp = useCallback(() => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const points = drawingPoints.current;
        if (points.length < 2) {
            setCurrentPath([]);
            drawingPoints.current = [];
            return;
        }

        const xs = points.map(p => p[0]);
        const ys = points.map(p => p[1]);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        const maxX = Math.max(...xs);
        const maxY = Math.max(...ys);

        const width = Math.max(maxX - minX, 10);
        const height = Math.max(maxY - minY, 10);
        const localizedPoints = points.map(p => [p[0] - minX, p[1] - minY, p[2]]);

        const isHighlighter = penConfig.type === 'highlighter';
        const stroke = getStroke(localizedPoints, {
            size: penConfig.size,
            thinning: isHighlighter ? 0.5 : 0,
            smoothing: 0.5,
            streamline: 0.4,
            simulatePressure: false
        });
        const pathData = getSvgPathFromStroke(stroke);

        const newNodeId = crypto.randomUUID();
        const newNode = {
            id: newNodeId,
            type: 'doodle',
            position: { x: minX, y: minY },
            data: {
                path: pathData,
                color: penConfig.color,
                type: penConfig.type,
                width,
                height,
                onDelete: (id: string) => deleteNode(id)
            }
        };

        setNodes(nds => nds.concat(bindNodeMethods(newNode, isDark)));
        setCurrentPath([]);
        drawingPoints.current = [];
        setTimeout(() => saveGraph(), 200);
    }, [isDrawing, penConfig, isDark, deleteNode, bindNodeMethods, saveGraph]);

    const onNodeClick = useCallback((_: any, node: Node) => {
        if (activeTool === 'eraser') {
            setNodes((nds) => nds.filter((n) => n.id !== node.id))
            setTimeout(() => saveGraph(), 100);
        }
    }, [activeTool, setNodes, saveGraph])

    // Aggressive Auto-save logic
    useEffect(() => {
        if (!rfInstance || title === "Carregando...") return;

        const timer = setTimeout(() => {
            saveGraph();
        }, 1200);

        return () => clearTimeout(timer);
    }, [nodes, edges, title, rfInstance, saveGraph]);

    // Save on browser close/tab navigation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isSavingRef.current || pendingSaveRef.current) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    useEffect(() => {
        const handleBlur = () => saveGraph();
        window.addEventListener('blur', handleBlur);
        return () => window.removeEventListener('blur', handleBlur);
    }, [saveGraph]);

    useEffect(() => {
        if (activeTool !== 'pen') {
            setIsDrawing(false);
            setCurrentPath([]);
            drawingPoints.current = [];
        }
    }, [activeTool]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

            if (e.code === 'Space') {
                setIsSpacePressed(true);
                if (activeTool !== 'move') e.preventDefault();
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                setNodes(nds => nds.map(n => ({ ...n, selected: true })));
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                undo();
            }

            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
                e.preventDefault();
                redo();
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                const selectedNodes = rfInstance?.getNodes().filter(n => n.selected);
                const selectedEdges = rfInstance?.getEdges().filter(e => e.selected);
                if (selectedNodes?.length || selectedEdges?.length) {
                    e.preventDefault();
                    if (selectedNodes?.length) setNodes(nds => nds.filter(n => !n.selected));
                    if (selectedEdges?.length) setEdges(eds => eds.filter(e => !e.selected));
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') setIsSpacePressed(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [undo, redo, rfInstance, setNodes, setEdges, activeTool]);

    useEffect(() => {
        const loadMap = async () => {
            if (!id) return
            const { data: map, error } = await supabase.from('mind_maps').select('*').eq('id', id).single()
            if (error) {
                router.push('/dashboard/blueprints')
                return
            }
            setTitle(map.title)
            const [nodesRes, edgesRes] = await Promise.all([
                supabase.from('mind_map_nodes').select('*').eq('map_id', id),
                supabase.from('mind_map_edges').select('*').eq('map_id', id)
            ])
            if (nodesRes.data) {
                const loadedNodes = nodesRes.data.map(n => ({
                    id: n.id,
                    type: n.type,
                    position: { x: Number(n.position_x), y: Number(n.position_y) },
                    data: { ...n.data },
                    width: n.width ? Number(n.width) : undefined,
                    height: n.height ? Number(n.height) : undefined,
                    parentNode: n.data?.parentNode || n.parentNode
                }));

                const loadedEdges = (edgesRes.data || []).map(e => ({
                    id: e.id,
                    source: e.source,
                    target: e.target,
                    type: e.type || 'smoothstep',
                    animated: e.animated,
                    label: e.label
                }));

                setNodes(loadedNodes.map((n: any) => bindNodeMethods(n, isDark)));
                setEdges(loadedEdges.map(e => ({ ...e, markerEnd: { type: MarkerType.ArrowClosed } })));
                lastSavedDataRef.current = getNormalizedDataString(loadedNodes as any, loadedEdges as any, map.title);
                firstLoadRef.current = false;
                setHistory([{ nodes: loadedNodes as any, edges: loadedEdges as any }]);
                setHistoryIndex(0);
            }
        }
        loadMap()
    }, [id, supabase, router, isDark, getNormalizedDataString]);

    // Final save on unmount if needed
    useEffect(() => {
        return () => {
            if (lastSavedDataRef.current !== "" && !isSavingRef.current) {
                // This is a bit tricky with async, but the aggressive auto-save (2s) 
                // handles most cases. For unmount, we rely on the last successful auto-save.
            }
        };
    }, []);

    useEffect(() => {
        setNodes((nds) => nds.map((n) => bindNodeMethods(n, isDark)))
    }, [resolvedTheme])


    const onConnect = useCallback((params: Connection) => {
        takeSnapshot();
        setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, animated: true }, eds))
        setTimeout(() => saveGraph(), 100);
    }, [setEdges, takeSnapshot, saveGraph]);

    const onEdgeClick = useCallback((evt: React.MouseEvent, edge: Edge) => {
        if (evt.altKey) {
            setEdges((eds) => eds.filter(e => e.id !== edge.id))
        }
    }, [setEdges])

    const layoutNodes = useCallback(() => {
        if (!rfInstance) return;
        const currentNodes = rfInstance.getNodes();
        const currentEdges = rfInstance.getEdges();
        const levelMap = new Map();
        const incomingCount = new Map();
        currentNodes.forEach(n => incomingCount.set(n.id, 0));
        currentEdges.forEach(e => incomingCount.set(e.target, (incomingCount.get(e.target) || 0) + 1));
        const roots = currentNodes.filter(n => incomingCount.get(n.id) === 0);
        const visited = new Set();
        const setLevel = (nodeId: string, level: number) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            levelMap.set(nodeId, level);
            currentEdges.filter(e => e.source === nodeId).forEach(e => setLevel(e.target, level + 1));
        };
        roots.forEach(r => setLevel(r.id, 0));
        currentNodes.forEach(n => { if (!levelMap.has(n.id)) levelMap.set(n.id, 0); });
        const levelY = new Map();
        const newNodes = currentNodes.map(n => {
            const level = levelMap.get(n.id) || 0;
            const x = level * 300 + 100;
            const y = (levelY.get(level) || 0) * 150 + 100;
            levelY.set(level, (levelY.get(level) || 0) + 1);
            return { ...n, position: { x, y } };
        });
        setNodes(newNodes.map(n => bindNodeMethods(n, isDark)));
        rfInstance.fitView({ duration: 800 });
    }, [rfInstance, isDark]);

    const addNode = (type: string, dataExtras?: any) => {
        takeSnapshot();
        const newNodeId = crypto.randomUUID()
        const center = rfInstance?.screenToFlowPosition({
            x: window.innerWidth / 2 - 100,
            y: window.innerHeight / 2 - 50
        }) || { x: 0, y: 0 };

        let width = 0, height = 0, preset = '';
        let finalData: any = {};

        if (type === 'frame') {
            if (dataExtras === 'mobile') { width = 375; height = 667; preset = 'mobile'; }
            else if (dataExtras === 'tablet') { width = 768; height = 1024; preset = 'tablet'; }
            else if (dataExtras === 'a4') { width = 794; height = 1123; preset = 'a4'; }
            else { width = 800; height = 600; preset = 'desktop'; }
            finalData = {
                label: preset.charAt(0).toUpperCase() + preset.slice(1),
                width,
                height,
                preset
            };
        } else if (type === 'shape') {
            finalData = { shape: dataExtras || 'square', label: '' };
        } else if (typeof dataExtras === 'object') {
            finalData = { ...dataExtras };
        } else {
            finalData = { label: '' };
        }

        const newNode = {
            id: newNodeId,
            type,
            position: center,
            data: finalData
        }
        setNodes((nds) => nds.concat(bindNodeMethods(newNode, isDark)))
        setTimeout(() => saveGraph(), 100);
    }

    const applyTemplate = (templateId: string) => {
        if (!rfInstance) return;
        const center = rfInstance.screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        if (templateId === 'kanban') {
            const id1 = crypto.randomUUID();
            const id2 = crypto.randomUUID();
            const id3 = crypto.randomUUID();
            const newNodes = [
                { id: id1, type: 'frame', position: { x: center.x - 450, y: center.y - 150 }, data: { label: 'A Fazer', width: 280, height: 400 } },
                { id: id2, type: 'frame', position: { x: center.x - 140, y: center.y - 150 }, data: { label: 'Em Progresso', width: 280, height: 400 } },
                { id: id3, type: 'frame', position: { x: center.x + 170, y: center.y - 150 }, data: { label: 'Concluído', width: 280, height: 400 } },
            ];
            setNodes(nds => [...nds, ...newNodes.map(n => bindNodeMethods(n as any, isDark))]);
            setTimeout(() => saveGraph(), 100);
        }
    }

    const exportImage = useCallback((format: 'png' | 'jpeg') => {
        const element = document.querySelector('.react-flow__viewport') as HTMLElement;
        if (!element) return;
        const promise = format === 'png' ? toPng(element, { backgroundColor: isDark ? '#09090b' : '#ffffff' }) : toJpeg(element, { backgroundColor: isDark ? '#09090b' : '#ffffff' });
        promise.then((dataUrl) => download(dataUrl, `mindmap-${title.replace(/\s+/g, '-').toLowerCase()}.${format}`));
    }, [title, isDark]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => addNode('image', { url: event.target?.result });
        reader.readAsDataURL(file);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger className="w-full h-full">
                <div className="h-[calc(100vh)] w-full relative flex flex-col overflow-hidden bg-background text-foreground">

                    {/* Header */}
                    <div className="absolute top-4 left-6 right-6 z-[60] flex items-center justify-between pointer-events-none">
                        <div className="pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur border dark:border-zinc-800 rounded-lg shadow-sm px-4 py-2 flex items-center gap-3">
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 border-none font-bold text-lg bg-transparent focus-visible:ring-0 w-48 shadow-none" />
                            <button
                                onClick={async () => {
                                    if (saving) return;
                                    await saveGraph();
                                }}
                                disabled={saving}
                                className="px-2 py-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                            >
                                <span className={cn("w-1.5 h-1.5 rounded-full", saving ? "bg-amber-500 animate-pulse" : "bg-emerald-500")} />
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{saving ? 'Salvando...' : 'Salvo'}</span>
                            </button>
                        </div>

                        <div className="pointer-events-auto flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={saving}
                                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur border text-xs gap-2"
                                onClick={async () => {
                                    setSaving(true);
                                    const success = await saveGraph();
                                    if (success) {
                                        router.push('/dashboard/blueprints');
                                    } else {
                                        setSaving(false);
                                        toast({ title: "Erro ao salvar", description: "Houve um problema ao salvar. Tente sair novamente.", variant: "destructive" });
                                    }
                                }}
                            >
                                <ChevronLeft className="h-4 w-4" /> {saving ? "Salvando..." : "Voltar"}
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild><Button size="sm" className="bg-[#0052CC] hover:bg-[#0747a6] text-white gap-2 font-medium">Exportar <Download className="h-4 w-4" /></Button></PopoverTrigger>
                                <PopoverContent className="w-40 p-1">
                                    <Button variant="ghost" size="sm" className="w-full justify-start select-none" onClick={() => exportImage('png')}>PNG</Button>
                                    <Button variant="ghost" size="sm" className="w-full justify-start select-none" onClick={() => exportImage('jpeg')}>JPEG</Button>
                                </PopoverContent>
                            </Popover>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 bg-transparent select-none"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast({ title: "Link copiado!", description: "O link deste blueprint foi copiado para sua área de transferência." });
                                }}
                            >
                                Compartilhar <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Left Sidebar (Toolbar) */}
                    <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-center z-50 pointer-events-none">
                        <div className="pointer-events-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-black/5 dark:border-zinc-800 flex flex-col p-1.5 gap-1.5 w-[52px] items-center">

                            <ToolButton icon={MousePointer2} label="Seleção (V)" active={activeTool === 'select'} onClick={() => setActiveTool('select')} />

                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className={cn(
                                        "p-2.5 rounded-xl transition-all relative group flex items-center justify-center w-11 h-11",
                                        activeTool === 'frame' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                    )}>
                                        <FrameIcon className="h-5.5 w-5.5" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent side="right" className="w-64 p-3 bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 rounded-2xl" align="start">
                                    <div className="grid grid-cols-3 gap-3">
                                        <button onClick={() => addNode('frame')} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <div className="w-10 h-10 border-2 border-slate-300 dark:border-zinc-600 rounded flex items-center justify-center group-hover:border-blue-500"><FrameIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-500" /></div>
                                            <span className="text-[10px] font-medium text-slate-500 text-center">Personalizar</span>
                                        </button>
                                        <button onClick={() => addNode('frame', 'a4')} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <div className="w-10 h-10 border-2 border-slate-300 dark:border-zinc-600 rounded flex items-center justify-center group-hover:border-blue-500 px-2 pt-1"><div className="w-full h-full bg-slate-100 dark:bg-zinc-800 border-2 border-slate-300 dark:border-zinc-700" /></div>
                                            <span className="text-[10px] font-medium text-slate-500 text-center">A4</span>
                                        </button>
                                        <button onClick={() => addNode('frame', 'carta')} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <div className="w-10 h-10 border-2 border-slate-300 dark:border-zinc-600 rounded flex items-center justify-center group-hover:border-blue-500 px-1 pt-1"><div className="w-full h-full bg-slate-100 dark:bg-zinc-800 border-2 border-slate-300 dark:border-zinc-700" /></div>
                                            <span className="text-[10px] font-medium text-slate-500 text-center">Carta</span>
                                        </button>
                                        <button onClick={() => addNode('frame', '16:9')} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <div className="w-10 h-6 border-2 border-slate-300 dark:border-zinc-600 rounded-sm mt-2 flex items-center justify-center group-hover:border-blue-500 pt-1 px-1">
                                                <div className="w-full h-full bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700" />
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-500 pt-1">16 : 9</span>
                                        </button>
                                        <button onClick={() => addNode('frame', '4:3')} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <div className="w-10 h-8 border-2 border-slate-300 dark:border-zinc-600 rounded-sm mt-1 flex items-center justify-center group-hover:border-blue-500 pt-1 px-1">
                                                <div className="w-full h-full bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700" />
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-500 pt-1">4 : 3</span>
                                        </button>
                                        <button onClick={() => addNode('frame', '1:1')} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <div className="w-8 h-8 border-2 border-slate-300 dark:border-zinc-600 rounded-sm mt-1 flex items-center justify-center group-hover:border-blue-500 pt-1 px-1">
                                                <div className="w-full h-full bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700" />
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-500 pt-1">1 : 1</span>
                                        </button>
                                    </div>
                                    <div className="h-px bg-slate-100 dark:bg-zinc-800 my-4" />
                                    <div className="grid grid-cols-3 gap-3">
                                        <button onClick={() => addNode('frame', 'mobile')} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <div className="w-6 h-10 border-2 border-slate-300 dark:border-zinc-600 rounded-lg flex items-center justify-center group-hover:border-blue-500 px-0.5 pt-0.5"><div className="w-full h-full bg-slate-100 dark:bg-zinc-800 rounded-md" /></div>
                                            <span className="text-[10px] font-medium text-slate-500 text-center leading-tight">Móvel</span>
                                        </button>
                                        <button onClick={() => addNode('frame', 'tablet')} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <div className="w-9 h-11 border-2 border-slate-300 dark:border-zinc-600 rounded-lg flex items-center justify-center group-hover:border-blue-500 px-1 pt-1"><div className="w-full h-full bg-slate-100 dark:bg-zinc-800 rounded-md" /></div>
                                            <span className="text-[10px] font-medium text-slate-500 text-center leading-tight">Tablet</span>
                                        </button>
                                        <button onClick={() => addNode('frame', 'desktop')} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group">
                                            <div className="w-12 h-9 border-2 border-slate-300 dark:border-zinc-600 rounded-sm mt-1 flex items-center justify-center group-hover:border-blue-500 px-1 pt-1"><div className="w-full h-full bg-slate-100 dark:bg-zinc-800 rounded-t-sm" /></div>
                                            <span className="text-[10px] font-medium text-slate-500 pt-1">Desktop</span>
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <ToolButton icon={StickyNote} label="Nota Adesiva (N)" active={activeTool === 'sticky'} onClick={() => addNode('sticky')} />
                            <ToolButton icon={Type} label="Texto (T)" active={activeTool === 'text'} onClick={() => addNode('text')} />

                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className={cn("p-2.5 rounded-xl transition-all relative group flex items-center justify-center w-11 h-11", activeTool === 'shape' ? "bg-slate-100 dark:bg-zinc-800" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800")}>
                                        <ShapesIcon className="h-5.5 w-5.5" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent side="right" className="w-48 p-2 grid grid-cols-3 gap-2 bg-white dark:bg-zinc-900 shadow-2xl border" align="center">
                                    <ToolButton icon={Square} label="Quadrado" onClick={() => addNode('shape', 'square')} />
                                    <ToolButton icon={Circle} label="Círculo" onClick={() => addNode('shape', 'circle')} />
                                    <ToolButton icon={Diamond} label="Losango" onClick={() => addNode('shape', 'diamond')} />
                                    <ToolButton icon={Triangle} label="Triângulo" onClick={() => addNode('shape', 'triangle')} />
                                    <ToolButton icon={Hexagon} label="Hexágono" onClick={() => addNode('shape', 'hexagon')} />
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className={cn(
                                        "p-2.5 rounded-xl transition-all relative group flex items-center justify-center w-11 h-11",
                                        activeTool === 'pen' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                    )}>
                                        <Pencil className="h-5.5 w-5.5" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent side="right" className="w-14 p-1.5 flex flex-col gap-1.5 items-center bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800" align="center">
                                    <ToolButton icon={Pencil} label="Caneta" active={penConfig.type === 'pen' && activeTool === 'pen'} onClick={() => { setActiveTool('pen'); setPenConfig(p => ({ ...p, type: 'pen' })) }} />
                                    <ToolButton icon={Highlighter} label="Marca-texto" active={penConfig.type === 'highlighter' && activeTool === 'pen'} onClick={() => { setActiveTool('pen'); setPenConfig(p => ({ ...p, type: 'highlighter' })) }} />
                                    <ToolButton icon={ShapesIcon} label="Forma Inteligente" active={penConfig.type === 'laser' && activeTool === 'pen'} onClick={() => { setActiveTool('pen'); setPenConfig(p => ({ ...p, type: 'laser' })) }} />
                                    <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800 my-1" />
                                    <ToolButton icon={Eraser} label="Borracha" active={activeTool === 'eraser'} onClick={() => setActiveTool('eraser')} />
                                </PopoverContent>
                            </Popover>

                            <ToolButton icon={Hand} label="Mão (H)" active={activeTool === 'move'} onClick={() => setActiveTool('move')} />

                            <Popover>
                                <PopoverTrigger asChild><button className="p-2.5 rounded-xl transition-all text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 w-11 h-11 flex items-center justify-center"><ImageIcon className="h-5.5 w-5.5" /></button></PopoverTrigger>
                                <PopoverContent side="right" className="w-56 p-2 bg-white dark:bg-zinc-900 shadow-2xl border">
                                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-2 border-dashed" onClick={() => fileInputRef.current?.click()}>
                                        <Plus className="w-4 h-4" /> Upload Imagem
                                    </Button>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                                </PopoverContent>
                            </Popover>

                            <ToolButton icon={MessageSquare} label="Comentar" onClick={() => addNode('comment')} />
                            <ToolButton icon={LayoutGrid} label="Layout Automático" onClick={() => layoutNodes()} />

                            <div className="h-px w-8 bg-slate-100 dark:bg-zinc-800 my-1" />

                            <ToolButton icon={Star} label="Mais" onClick={() => { }} />

                        </div>
                    </div>

                    {/* Bottom-Left Controls (Undo/Redo) */}
                    <div className="pointer-events-auto absolute bottom-6 left-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex items-center p-1.5 gap-1 z-50">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400 transition-colors" title="Desfazer (Ctrl+Z)" onClick={undo}><Undo2 className="h-5 w-5" /></button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-400 transition-colors" title="Refazer (Ctrl+Y)" onClick={redo}><Redo2 className="h-5 w-5" /></button>
                    </div>

                    {/* Main Canvas Area */}
                    <div
                        className={cn(
                            "flex-1 w-full h-full relative overflow-hidden",
                            activeTool === 'pen' && "cursor-crosshair",
                            (activeTool === 'move' || isSpacePressed) && "cursor-grab active:cursor-grabbing",
                            isDrawing && "select-none"
                        )}
                        ref={reactFlowWrapper}
                        onPointerDownCapture={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerUp}
                    >
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onConnectStart={onConnectStart}
                            onConnectEnd={onConnectEnd}
                            onEdgeClick={onEdgeClick}
                            onNodeClick={onNodeClick}
                            onNodeDragStop={onNodeDragStop}
                            onNodesDelete={() => setTimeout(() => saveGraph(), 100)}
                            onEdgesDelete={() => setTimeout(() => saveGraph(), 100)}
                            nodeTypes={nodeTypes}
                            onInit={setRfInstance}
                            fitView
                            minZoom={0.05}
                            selectionOnDrag={activeTool === 'select' && !isSpacePressed}
                            panOnDrag={activeTool === 'move' || isSpacePressed ? true : [1, 2]}
                            selectionMode={activeTool === 'select' ? SelectionMode.Full : SelectionMode.Partial}
                            zoomOnScroll={true}
                            panOnScroll={false}
                        >
                            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color={isDark ? "#3f3f46" : "#cbd5e1"} className="bg-background" />
                            <Controls position="bottom-right" className="!bg-white dark:!bg-zinc-900 !rounded-lg" />

                            {/* Temp Path Rendering while drawing */}
                            {isDrawing && currentPath.length > 1 && rfInstance && (
                                <Panel position="top-left" style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>
                                    <svg style={{
                                        overflow: 'visible',
                                        position: 'absolute',
                                        top: 0, left: 0,
                                        transform: `translate(${rfInstance.getViewport().x}px, ${rfInstance.getViewport().y}px) scale(${rfInstance.getViewport().zoom})`,
                                        transformOrigin: '0 0'
                                    }}>
                                        <path
                                            d={getSvgPathFromStroke(getStroke(currentPath, {
                                                size: penConfig.size,
                                                thinning: penConfig.type === 'highlighter' ? 0.5 : 0,
                                                simulatePressure: false
                                            }))}
                                            fill={penConfig.color}
                                            style={{ opacity: penConfig.type === 'highlighter' ? 0.4 : 1 }}
                                        />
                                    </svg>
                                </Panel>
                            )}
                        </ReactFlow>
                    </div>

                    {/* Connection Menu */}
                    {connectionMenu.isOpen && (
                        <div className="absolute z-50 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border dark:border-zinc-700 p-2 flex gap-2 animate-in fade-in zoom-in-95 duration-100" style={{ left: connectionMenu.x, top: connectionMenu.y }}>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleMenuSelection('shape')}><Square className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleMenuSelection('shape', 'circle')}><Circle className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleMenuSelection('sticky')}><StickyNote className="h-4 w-4" /></Button>
                            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700 mx-1" />
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-red-500" onClick={() => setConnectionMenu(prev => ({ ...prev, isOpen: false }))}><X className="h-4 w-4" /></Button>
                        </div>
                    )}
                </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-64">
                <ContextMenuItem inset onSelect={() => addNode('sticky')}>Nota Adesiva</ContextMenuItem>
                <ContextMenuItem inset onSelect={() => addNode('shape')}>Forma</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem inset onClick={layoutNodes}>Organizar</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

function ToolButton({ icon: Icon, label, active, onClick }: any) {
    return (
        <button className={cn("p-2 rounded-md transition-all relative group flex items-center justify-center w-10 h-10", active ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" : "text-slate-700 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800")} onClick={onClick}>
            <Icon className="h-5 w-5 stroke-[1.5]" />
            <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap">{label}</div>
        </button>
    )
}

export default function BlueprintPage() {
    return (
        <ReactFlowProvider>
            <EditorContent />
        </ReactFlowProvider>
    )
}
