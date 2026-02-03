"use client"

import { useState } from "react"
import { TabBar, TabPanel } from "@/components/ui/tab-bar"
import {
    TabBarDefaultExample,
    TabBarBottomExample,
    TabBarPillsExample,
    TabBarUnderlineExample,
    TabBarIconOnlyExample,
    TabBarFullWidthExample,
} from "@/components/examples/tab-bar-examples"

export default function TabBarShowcasePage() {
    return (
        <div className="min-h-screen bg-background p-4 sm:p-8">
            <div className="mx-auto max-w-4xl space-y-12">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">Tab Bar Component</h1>
                    <p className="text-lg text-muted-foreground">
                        Componente profissional de navegação por abas, otimizado para mobile e desktop.
                    </p>
                </div>

                {/* Features */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        title="Mobile-First"
                        description="Otimizado para toque e telas pequenas"
                    />
                    <FeatureCard
                        title="Acessível"
                        description="Navegação por teclado e ARIA completo"
                    />
                    <FeatureCard
                        title="Variantes"
                        description="4 estilos diferentes para cada contexto"
                    />
                    <FeatureCard
                        title="Badges"
                        description="Suporte nativo a notificações"
                    />
                    <FeatureCard
                        title="Ícones"
                        description="Modo icon-only ou texto + ícone"
                    />
                    <FeatureCard
                        title="Responsivo"
                        description="Adapta-se perfeitamente a qualquer tela"
                    />
                </div>

                {/* Examples */}
                <div className="space-y-12">
                    <ExampleSection
                        title="1. Default Variant"
                        description="Estilo padrão com fundo e bordas arredondadas. Ideal para navegação interna."
                    >
                        <TabBarDefaultExample />
                    </ExampleSection>

                    <ExampleSection
                        title="2. Bottom Navigation (Mobile)"
                        description="Navegação fixa na parte inferior, perfeita para apps mobile."
                    >
                        <TabBarBottomExample />
                    </ExampleSection>

                    <ExampleSection
                        title="3. Pills Variant"
                        description="Visual moderno com pills destacadas. Ótimo para dashboards."
                    >
                        <TabBarPillsExample />
                    </ExampleSection>

                    <ExampleSection
                        title="4. Underline Variant"
                        description="Estilo minimalista com linha inferior. Comum em editores de código."
                    >
                        <TabBarUnderlineExample />
                    </ExampleSection>

                    <ExampleSection
                        title="5. Icon Only"
                        description="Modo compacto apenas com ícones. Economiza espaço."
                    >
                        <TabBarIconOnlyExample />
                    </ExampleSection>

                    <ExampleSection
                        title="6. Full Width com Disabled"
                        description="Tabs ocupam toda a largura e demonstração de estado desabilitado."
                    >
                        <TabBarFullWidthExample />
                    </ExampleSection>
                </div>

                {/* Usage Guide */}
                <div className="space-y-4 rounded-lg border border-border bg-card p-6">
                    <h2 className="text-2xl font-bold text-foreground">Como Usar</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="mb-2 font-semibold text-foreground">1. Importar o componente</h3>
                            <pre className="overflow-x-auto rounded-md bg-secondary p-4 text-sm">
                                <code>{`import { TabBar, TabPanel } from "@/components/ui/tab-bar"`}</code>
                            </pre>
                        </div>

                        <div>
                            <h3 className="mb-2 font-semibold text-foreground">2. Definir as abas</h3>
                            <pre className="overflow-x-auto rounded-md bg-secondary p-4 text-sm">
                                <code>{`const tabs = [
  { id: "home", label: "Início", icon: <Home /> },
  { id: "search", label: "Buscar", icon: <Search />, badge: 3 },
  { id: "profile", label: "Perfil", icon: <User />, disabled: true },
]`}</code>
                            </pre>
                        </div>

                        <div>
                            <h3 className="mb-2 font-semibold text-foreground">3. Implementar</h3>
                            <pre className="overflow-x-auto rounded-md bg-secondary p-4 text-sm">
                                <code>{`const [activeTab, setActiveTab] = useState("home")

return (
  <>
    <TabBar
      tabs={tabs}
      activeTab={activeTab}
      onChange={setActiveTab}
      variant="default"
    />
    
    <TabPanel tabId="home" activeTab={activeTab}>
      Conteúdo da aba Home
    </TabPanel>
  </>
)`}</code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Props Documentation */}
                <div className="space-y-4 rounded-lg border border-border bg-card p-6">
                    <h2 className="text-2xl font-bold text-foreground">Props</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="pb-2 text-left font-semibold text-foreground">Prop</th>
                                    <th className="pb-2 text-left font-semibold text-foreground">Tipo</th>
                                    <th className="pb-2 text-left font-semibold text-foreground">Padrão</th>
                                    <th className="pb-2 text-left font-semibold text-foreground">Descrição</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <PropRow
                                    prop="tabs"
                                    type="TabItem[]"
                                    required
                                    description="Array de objetos com as abas"
                                />
                                <PropRow
                                    prop="activeTab"
                                    type="string"
                                    required
                                    description="ID da aba ativa"
                                />
                                <PropRow
                                    prop="onChange"
                                    type="(id: string) => void"
                                    required
                                    description="Callback ao trocar de aba"
                                />
                                <PropRow
                                    prop="variant"
                                    type="'default' | 'pills' | 'underline' | 'minimal'"
                                    defaultValue="'default'"
                                    description="Estilo visual"
                                />
                                <PropRow
                                    prop="position"
                                    type="'top' | 'bottom' | 'static'"
                                    defaultValue="'static'"
                                    description="Posicionamento"
                                />
                                <PropRow
                                    prop="size"
                                    type="'sm' | 'md' | 'lg'"
                                    defaultValue="'md'"
                                    description="Tamanho dos botões"
                                />
                                <PropRow
                                    prop="fullWidth"
                                    type="boolean"
                                    defaultValue="false"
                                    description="Ocupar largura total"
                                />
                                <PropRow
                                    prop="iconOnly"
                                    type="boolean"
                                    defaultValue="false"
                                    description="Mostrar apenas ícones"
                                />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Accessibility */}
                <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-6">
                    <h2 className="text-2xl font-bold text-foreground">♿ Acessibilidade</h2>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-primary">✓</span>
                            <span>Navegação por teclado (setas, Home, End)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">✓</span>
                            <span>ARIA roles completos (tablist, tab, tabpanel)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">✓</span>
                            <span>Estados de foco visíveis</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">✓</span>
                            <span>Suporte a leitores de tela</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">✓</span>
                            <span>Área de toque mínima de 44px (WCAG)</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
    )
}

function ExampleSection({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: React.ReactNode
}) {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                <p className="mt-1 text-muted-foreground">{description}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">{children}</div>
        </div>
    )
}

function PropRow({
    prop,
    type,
    defaultValue,
    description,
    required,
}: {
    prop: string
    type: string
    defaultValue?: string
    description: string
    required?: boolean
}) {
    return (
        <tr>
            <td className="py-2 font-mono text-primary">
                {prop}
                {required && <span className="ml-1 text-destructive">*</span>}
            </td>
            <td className="py-2 font-mono text-xs text-muted-foreground">{type}</td>
            <td className="py-2 font-mono text-xs text-muted-foreground">{defaultValue || "-"}</td>
            <td className="py-2 text-muted-foreground">{description}</td>
        </tr>
    )
}
