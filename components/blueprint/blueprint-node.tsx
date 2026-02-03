"use client"

import React from "react"
import { cn } from "@/lib/utils"

export type PinType = "exec" | "boolean" | "integer" | "float" | "string" | "vector" | "rotator" | "object" | "actor" | "struct"

export interface Pin {
    id: string
    label: string
    type: PinType
    direction: "input" | "output"
    connected?: boolean
    value?: string
}

export interface BlueprintNodeProps {
    id: string
    title: string
    type?: "event" | "function" | "pure" | "macro" | "variable"
    color?: string
    inputs?: Pin[]
    outputs?: Pin[]
    position: { x: number; y: number }
    onDragStart?: (e: React.MouseEvent, nodeId: string) => void
    selected?: boolean
}

const PIN_COLORS: Record<PinType, string> = {
    exec: "#ffffff",
    boolean: "#b71c1c",
    integer: "#00bcd4",
    float: "#4caf50",
    string: "#e91e63",
    vector: "#ffc107",
    rotator: "#9999ff", // Lighter blue for rotator
    object: "#2196f3",
    actor: "#9c27b0",
    struct: "#0055aa"  // Dark blue for structs
}

const NODE_COLORS: Record<string, string> = {
    event: "#c62828",
    function: "#1565c0",
    pure: "#2e7d32",
    macro: "#6a1b9a",
    variable: "#00838f",
    default: "#424242"
}

export function BlueprintNode({
    id,
    title,
    type = "function",
    color,
    inputs = [],
    outputs = [],
    position,
    onDragStart,
    selected = false
}: BlueprintNodeProps) {
    const nodeColor = color || NODE_COLORS[type] || NODE_COLORS.default

    return (
        <div
            className={cn(
                "absolute cursor-move select-none transition-shadow",
                selected && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-transparent"
            )}
            style={{
                left: position.x,
                top: position.y,
            }}
            onMouseDown={(e) => onDragStart?.(e, id)}
        >
            <div className="min-w-[180px] rounded-sm overflow-hidden shadow-2xl border border-black/50">
                {/* Header */}
                <div
                    className="px-3 py-1.5 text-white font-medium text-sm flex items-center justify-between"
                    style={{ backgroundColor: nodeColor }}
                >
                    <span className="truncate">{title}</span>
                    {type === "pure" && (
                        <div className="w-3 h-3 rounded-full bg-white/30 ml-2" />
                    )}
                </div>

                {/* Body */}
                <div className="bg-[#1a1a1a] border-t border-black/50">
                    <div className="flex justify-between">
                        {/* Input Pins */}
                        <div className="flex-1 py-1">
                            {inputs.map((pin) => (
                                <div key={pin.id} className="flex items-center gap-1 py-0.5 pl-1">
                                    <PinComponent pin={pin} />
                                    <span className="text-[11px] text-gray-300 truncate">{pin.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Output Pins */}
                        <div className="flex-1 py-1">
                            {outputs.map((pin) => (
                                <div key={pin.id} className="flex items-center justify-end gap-1 py-0.5 pr-1">
                                    <span className="text-[11px] text-gray-300 truncate">{pin.label}</span>
                                    <PinComponent pin={pin} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PinComponent({ pin }: { pin: Pin }) {
    const color = PIN_COLORS[pin.type]
    const isExec = pin.type === "exec"

    return (
        <div
            className={cn(
                "relative flex items-center justify-center transition-transform hover:scale-125",
                pin.direction === "input" ? "-ml-2" : "-mr-2"
            )}
            style={{ width: 12, height: 12 }}
        >
            {isExec ? (
                // Execution pin (arrow shape)
                <svg width="12" height="12" viewBox="0 0 12 12">
                    <path
                        d={pin.direction === "output" ? "M2,2 L10,6 L2,10 Z" : "M10,2 L2,6 L10,10 Z"}
                        fill={color}
                        stroke="#000"
                        strokeWidth="0.5"
                    />
                </svg>
            ) : (
                // Data pin (circle)
                <div
                    className="w-2.5 h-2.5 rounded-full border border-black/50"
                    style={{ backgroundColor: color }}
                />
            )}
        </div>
    )
}
