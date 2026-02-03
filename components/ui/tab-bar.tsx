"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// ============================================================================
// TAB BAR VARIANTS
// ============================================================================

const tabBarVariants = cva(
    "flex items-center gap-1 bg-secondary/30 backdrop-blur-sm border border-border/50",
    {
        variants: {
            variant: {
                default: "rounded-lg p-1",
                pills: "rounded-full p-1",
                underline: "bg-transparent border-0 border-b border-border gap-0 p-0",
                minimal: "bg-transparent border-0 gap-2 p-0",
            },
            position: {
                top: "sticky top-0 z-40",
                bottom: "fixed bottom-0 left-0 right-0 z-50 safe-area-bottom",
                static: "relative",
            },
            size: {
                sm: "h-9 text-xs",
                md: "h-11 text-sm",
                lg: "h-14 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            position: "static",
            size: "md",
        },
    }
)

const tabItemVariants = cva(
    "relative flex items-center justify-center gap-2 font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "rounded-md px-4 py-2 hover:bg-secondary/50",
                pills: "rounded-full px-4 py-2 hover:bg-secondary/50",
                underline: "rounded-none px-4 py-3 border-b-2 border-transparent hover:border-muted-foreground/20",
                minimal: "rounded-md px-3 py-2 hover:bg-secondary/30",
            },
            active: {
                true: "",
                false: "text-muted-foreground",
            },
            size: {
                sm: "min-h-[32px] min-w-[32px]",
                md: "min-h-[44px] min-w-[44px]",
                lg: "min-h-[56px] min-w-[56px]",
            },
        },
        compoundVariants: [
            {
                variant: "default",
                active: true,
                className: "bg-background text-foreground shadow-sm",
            },
            {
                variant: "pills",
                active: true,
                className: "bg-primary text-primary-foreground shadow-md",
            },
            {
                variant: "underline",
                active: true,
                className: "border-primary text-foreground",
            },
            {
                variant: "minimal",
                active: true,
                className: "bg-primary/10 text-primary",
            },
        ],
        defaultVariants: {
            variant: "default",
            active: false,
            size: "md",
        },
    }
)

// ============================================================================
// TYPES
// ============================================================================

export interface TabItem {
    id: string
    label?: string
    icon?: React.ReactNode
    badge?: string | number
    disabled?: boolean
    ariaLabel?: string
}

export interface TabBarProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof tabBarVariants> {
    tabs: TabItem[]
    activeTab: string
    onChange: (tabId: string) => void
    fullWidth?: boolean
    iconOnly?: boolean
}

// ============================================================================
// TAB BAR COMPONENT
// ============================================================================

export const TabBar = React.forwardRef<HTMLDivElement, TabBarProps>(
    (
        {
            tabs,
            activeTab,
            onChange,
            variant = "default",
            position = "static",
            size = "md",
            fullWidth = false,
            iconOnly = false,
            className,
            ...props
        },
        ref
    ) => {
        const handleKeyDown = (e: React.KeyboardEvent, tabId: string, index: number) => {
            const enabledTabs = tabs.filter((t) => !t.disabled)
            const currentIndex = enabledTabs.findIndex((t) => t.id === tabId)

            let nextIndex = currentIndex

            switch (e.key) {
                case "ArrowLeft":
                case "ArrowUp":
                    e.preventDefault()
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1
                    break
                case "ArrowRight":
                case "ArrowDown":
                    e.preventDefault()
                    nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0
                    break
                case "Home":
                    e.preventDefault()
                    nextIndex = 0
                    break
                case "End":
                    e.preventDefault()
                    nextIndex = enabledTabs.length - 1
                    break
                default:
                    return
            }

            onChange(enabledTabs[nextIndex].id)
            // Focus the next tab
            const nextTabElement = document.querySelector(
                `[data-tab-id="${enabledTabs[nextIndex].id}"]`
            ) as HTMLButtonElement
            nextTabElement?.focus()
        }

        return (
            <div
                ref={ref}
                role="tablist"
                aria-orientation="horizontal"
                className={cn(
                    tabBarVariants({ variant, position, size }),
                    fullWidth && "w-full",
                    position === "bottom" && "pb-safe",
                    className
                )}
                {...props}
            >
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab.id
                    const hasLabel = !iconOnly && tab.label

                    return (
                        <button
                            key={tab.id}
                            role="tab"
                            type="button"
                            data-tab-id={tab.id}
                            aria-selected={isActive}
                            aria-controls={`tabpanel-${tab.id}`}
                            aria-label={tab.ariaLabel || tab.label}
                            tabIndex={isActive ? 0 : -1}
                            disabled={tab.disabled}
                            onClick={() => !tab.disabled && onChange(tab.id)}
                            onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
                            className={cn(
                                tabItemVariants({ variant, active: isActive, size }),
                                fullWidth && "flex-1",
                                iconOnly && "aspect-square px-0"
                            )}
                        >
                            {tab.icon && (
                                <span className={cn("flex-shrink-0", hasLabel && "text-lg")}>
                                    {tab.icon}
                                </span>
                            )}

                            {hasLabel && (
                                <span className="truncate font-medium">{tab.label}</span>
                            )}

                            {tab.badge !== undefined && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                                    {tab.badge}
                                </span>
                            )}

                            {/* Active indicator for underline variant */}
                            {variant === "underline" && isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    )
                })}
            </div>
        )
    }
)

TabBar.displayName = "TabBar"

// ============================================================================
// TAB PANEL COMPONENT
// ============================================================================

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    tabId: string
    activeTab: string
    keepMounted?: boolean
}

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
    ({ tabId, activeTab, keepMounted = false, className, children, ...props }, ref) => {
        const isActive = activeTab === tabId

        if (!isActive && !keepMounted) {
            return null
        }

        return (
            <div
                ref={ref}
                role="tabpanel"
                id={`tabpanel-${tabId}`}
                aria-labelledby={`tab-${tabId}`}
                hidden={!isActive}
                className={cn(
                    "outline-none",
                    !isActive && "hidden",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)

TabPanel.displayName = "TabPanel"
