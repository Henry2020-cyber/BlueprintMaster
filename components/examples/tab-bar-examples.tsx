"use client"

import { useState } from "react"
import { TabBar, TabPanel } from "@/components/ui/tab-bar"
import { Home, Search, Bell, User, Settings, LayoutDashboard, BookOpen, Trophy } from "lucide-react"

/**
 * EXEMPLO 1: Tab Bar Padrão (Default)
 * Ideal para navegação interna de páginas
 */
export function TabBarDefaultExample() {
    const [activeTab, setActiveTab] = useState("home")

    const tabs = [
        { id: "home", label: "Início", icon: <Home /> },
        { id: "search", label: "Buscar", icon: <Search /> },
        { id: "notifications", label: "Notificações", icon: <Bell />, badge: 3 },
        { id: "profile", label: "Perfil", icon: <User /> },
    ]

    return (
        <div className="space-y-4">
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="default"
                size="md"
            />

            <TabPanel tabId="home" activeTab={activeTab}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h2 className="text-xl font-bold text-foreground">Início</h2>
                    <p className="mt-2 text-muted-foreground">Bem-vindo à página inicial</p>
                </div>
            </TabPanel>

            <TabPanel tabId="search" activeTab={activeTab}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h2 className="text-xl font-bold text-foreground">Buscar</h2>
                    <p className="mt-2 text-muted-foreground">Encontre o que você procura</p>
                </div>
            </TabPanel>

            <TabPanel tabId="notifications" activeTab={activeTab}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h2 className="text-xl font-bold text-foreground">Notificações</h2>
                    <p className="mt-2 text-muted-foreground">Você tem 3 novas notificações</p>
                </div>
            </TabPanel>

            <TabPanel tabId="profile" activeTab={activeTab}>
                <div className="rounded-lg border border-border bg-card p-6">
                    <h2 className="text-xl font-bold text-foreground">Perfil</h2>
                    <p className="mt-2 text-muted-foreground">Gerencie suas informações</p>
                </div>
            </TabPanel>
        </div>
    )
}

/**
 * EXEMPLO 2: Bottom Navigation (Mobile)
 * Ideal para navegação principal em apps mobile
 */
export function TabBarBottomExample() {
    const [activeTab, setActiveTab] = useState("dashboard")

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard />, ariaLabel: "Ir para Dashboard" },
        { id: "library", label: "Biblioteca", icon: <BookOpen />, ariaLabel: "Ir para Biblioteca" },
        { id: "achievements", label: "Conquistas", icon: <Trophy />, badge: 2, ariaLabel: "Ver Conquistas" },
        { id: "settings", label: "Ajustes", icon: <Settings />, ariaLabel: "Abrir Configurações" },
    ]

    return (
        <div className="relative min-h-[400px] rounded-lg border border-border bg-background p-4">
            {/* Conteúdo da página */}
            <div className="pb-20">
                <TabPanel tabId="dashboard" activeTab={activeTab}>
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground">Visão geral do seu progresso</p>
                    </div>
                </TabPanel>

                <TabPanel tabId="library" activeTab={activeTab}>
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-foreground">Biblioteca</h1>
                        <p className="text-muted-foreground">Seus módulos e aulas</p>
                    </div>
                </TabPanel>

                <TabPanel tabId="achievements" activeTab={activeTab}>
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-foreground">Conquistas</h1>
                        <p className="text-muted-foreground">2 novas conquistas desbloqueadas!</p>
                    </div>
                </TabPanel>

                <TabPanel tabId="settings" activeTab={activeTab}>
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
                        <p className="text-muted-foreground">Personalize sua experiência</p>
                    </div>
                </TabPanel>
            </div>

            {/* Bottom Tab Bar */}
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="minimal"
                position="bottom"
                size="lg"
                fullWidth
            />
        </div>
    )
}

/**
 * EXEMPLO 3: Pills Variant
 * Visual moderno e destacado
 */
export function TabBarPillsExample() {
    const [activeTab, setActiveTab] = useState("overview")

    const tabs = [
        { id: "overview", label: "Visão Geral" },
        { id: "analytics", label: "Análises" },
        { id: "reports", label: "Relatórios" },
        { id: "settings", label: "Configurações" },
    ]

    return (
        <div className="space-y-4">
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="pills"
                size="md"
            />

            <div className="rounded-lg border border-border bg-card p-6">
                <TabPanel tabId="overview" activeTab={activeTab}>
                    <h3 className="font-semibold text-foreground">Visão Geral</h3>
                </TabPanel>
                <TabPanel tabId="analytics" activeTab={activeTab}>
                    <h3 className="font-semibold text-foreground">Análises</h3>
                </TabPanel>
                <TabPanel tabId="reports" activeTab={activeTab}>
                    <h3 className="font-semibold text-foreground">Relatórios</h3>
                </TabPanel>
                <TabPanel tabId="settings" activeTab={activeTab}>
                    <h3 className="font-semibold text-foreground">Configurações</h3>
                </TabPanel>
            </div>
        </div>
    )
}

/**
 * EXEMPLO 4: Underline Variant
 * Estilo clássico e clean
 */
export function TabBarUnderlineExample() {
    const [activeTab, setActiveTab] = useState("code")

    const tabs = [
        { id: "code", label: "Código" },
        { id: "preview", label: "Preview" },
        { id: "console", label: "Console" },
    ]

    return (
        <div className="space-y-4">
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="underline"
                fullWidth
            />

            <div className="rounded-lg border border-border bg-card p-6">
                <TabPanel tabId="code" activeTab={activeTab}>
                    <pre className="text-sm text-muted-foreground">{"// Seu código aqui"}</pre>
                </TabPanel>
                <TabPanel tabId="preview" activeTab={activeTab}>
                    <p className="text-muted-foreground">Preview do resultado</p>
                </TabPanel>
                <TabPanel tabId="console" activeTab={activeTab}>
                    <p className="text-sm text-muted-foreground">Console vazio</p>
                </TabPanel>
            </div>
        </div>
    )
}

/**
 * EXEMPLO 5: Icon Only (Compact)
 * Ideal para espaços reduzidos
 */
export function TabBarIconOnlyExample() {
    const [activeTab, setActiveTab] = useState("home")

    const tabs = [
        { id: "home", icon: <Home />, ariaLabel: "Página Inicial" },
        { id: "search", icon: <Search />, ariaLabel: "Buscar" },
        { id: "notifications", icon: <Bell />, badge: 5, ariaLabel: "Notificações" },
        { id: "profile", icon: <User />, ariaLabel: "Perfil" },
    ]

    return (
        <div className="space-y-4">
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="default"
                iconOnly
            />

            <div className="rounded-lg border border-border bg-card p-6 text-center">
                <p className="text-muted-foreground">Aba ativa: {activeTab}</p>
            </div>
        </div>
    )
}

/**
 * EXEMPLO 6: Full Width com Disabled
 * Demonstra tabs desabilitadas
 */
export function TabBarFullWidthExample() {
    const [activeTab, setActiveTab] = useState("active")

    const tabs = [
        { id: "active", label: "Ativo", icon: <Home /> },
        { id: "disabled", label: "Desabilitado", icon: <Settings />, disabled: true },
        { id: "another", label: "Outro", icon: <User /> },
    ]

    return (
        <div className="space-y-4">
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="default"
                fullWidth
            />

            <div className="rounded-lg border border-border bg-card p-6">
                <TabPanel tabId="active" activeTab={activeTab}>
                    <p className="text-foreground">Conteúdo ativo</p>
                </TabPanel>
                <TabPanel tabId="another" activeTab={activeTab}>
                    <p className="text-foreground">Outro conteúdo</p>
                </TabPanel>
            </div>
        </div>
    )
}
