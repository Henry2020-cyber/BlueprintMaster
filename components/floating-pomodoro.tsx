"use client"

import { useStore } from "@/lib/store"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Play, Pause, X, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function FloatingPomodoro() {
    const { pomodoro, startPomodoro, pausePomodoro } = useStore()
    const pathname = usePathname()
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(false)

    // Show only if running AND not on the pomodoro page
    useEffect(() => {
        // If we are on the pomodoro page, hide this widget
        if (pathname === '/dashboard/pomodoro') {
            setIsVisible(false)
            return
        }

        // Auto-redirect if timer hits 0
        if (pomodoro.timeLeft === 0 && pomodoro.initialDuration > 0) {
            router.push('/dashboard/pomodoro')
            return
        }

        // If timer is running or has time left but paused, show it.
        if (pomodoro.isRunning) {
            setIsVisible(true)
        } else {
            if (pomodoro.timeLeft < pomodoro.initialDuration && pomodoro.timeLeft > 0) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }
    }, [pathname, pomodoro.isRunning, pomodoro.timeLeft, pomodoro.initialDuration, router])

    if (!isVisible) return null

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing"
        >
            <Card className="w-64 shadow-2xl border-primary/20 backdrop-blur-md bg-background/80 supports-[backdrop-filter]:bg-background/60">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground select-none">
                            {pomodoro.mode === 'focus' ? 'Foco' : 'Pausa'}
                        </span>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => router.push('/dashboard/pomodoro')}
                                title="Expandir"
                            >
                                <Maximize2 className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:text-destructive"
                                onClick={() => setIsVisible(false)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold tabular-nums text-primary select-none pointer-events-none">
                            {formatTime(pomodoro.timeLeft)}
                        </span>

                        <Button
                            size="icon"
                            className={`h-10 w-10 rounded-full ${pomodoro.isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary'}`}
                            onClick={(e) => {
                                e.stopPropagation() // Prevent drag start when clicking button
                                pomodoro.isRunning ? pausePomodoro() : startPomodoro()
                            }}
                            onPointerDown={(e) => e.stopPropagation()} // Prevent drag initiation
                        >
                            {pomodoro.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
