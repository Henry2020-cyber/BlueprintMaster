"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    DollarSign,
    LogOut,
    ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Usuários", href: "/admin/users" },
    { icon: Package, label: "Assets", href: "/admin/assets" },
    { icon: FileText, label: "Logs do Sistema", href: "/admin/logs" },
    { icon: DollarSign, label: "Financeiro", href: "/admin/financial" },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/login")
    }

    return (
        <div className="flex flex-col w-64 border-r border-border bg-card/50 h-screen sticky top-0">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <ShieldAlert className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="font-bold text-lg leading-none">Admin</h1>
                        <p className="text-xs text-muted-foreground">SaaS Seguro</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href)
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        isActive ? "bg-white text-black hover:bg-white/90" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </Button>
            </div>
        </div>
    )
}
