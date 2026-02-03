"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  Layout,
  Timer,
  TrendingUp,
  Library,
  Settings,
  LogOut,
  Gamepad2,
  Search,
  Bell,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  ShoppingBag,
  User,
  Workflow // Imported Workflow icon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/dashboard/estudo", icon: BookOpen, label: "Estudo Diário" },
  { href: "/dashboard/blueprints", icon: Workflow, label: "Blueprints", badge: "Beta" }, // Added Blueprints link
  { href: "/dashboard/kanban", icon: Layout, label: "Kanban" },
  { href: "/dashboard/pomodoro", icon: Timer, label: "Pomodoro" },
  { href: "/dashboard/progresso", icon: TrendingUp, label: "Progresso" },
  { href: "/dashboard/biblioteca", icon: Library, label: "Biblioteca" },
  { href: "/dashboard/loja", icon: ShoppingBag, label: "Loja", badge: "NEW" },
]

const bottomLinks = [
  { href: "/dashboard/profile", icon: User, label: "Perfil" },
  { href: "/dashboard/configuracoes", icon: Settings, label: "Configurações" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, notifications, progress, isInitialized, isLoadingUser } = useStore()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  React.useEffect(() => {
    if (isInitialized && !isLoadingUser && !user) {
      router.push("/login")
    }
  }, [isInitialized, isLoadingUser, user, router])

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If we are initialized but no user, we are redirecting (useEffect handles it), return null or skeleton
  if (!user) return null

  const handleLogout = () => {
    logout()
    toast({
      title: "Logout realizado",
      description: "Até a próxima!",
    })
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Busca",
        description: `Buscando por "${searchQuery}"...`,
      })
      // In real app, this would navigate to search results
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen bg-background">
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-sidebar transition-transform lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Gamepad2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">BlueprintMaster</span>
            </Link>
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{user?.name || "Usuário"}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary text-xs">Level {progress.level}</Badge>
                  <span className="text-xs text-muted-foreground">{progress.xp} XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                  {(link as any).badge && (
                    <Badge className="ml-auto bg-green-500 text-white text-[10px] px-1.5 py-0">
                      {(link as any).badge}
                    </Badge>
                  )}
                  {isActive && !((link as any).badge) && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Links */}
          <div className="border-t border-border px-3 py-4">
            {bottomLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              )
            })}

            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Top Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search */}
              <form onSubmit={handleSearch} className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 border-border bg-card">
                  <div className="p-2 font-semibold text-foreground">Notificações</div>
                  <DropdownMenuSeparator />
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhuma notificação
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                        <span className="font-medium text-foreground">{notification.title}</span>
                        <span className="text-sm text-muted-foreground">{notification.message}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Messages */}
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <MessageSquare className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-foreground md:inline-block">{user?.name || "Usuário"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-border bg-card">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/configuracoes">Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </Suspense>
  )
}
