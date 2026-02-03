import { Construction } from "lucide-react"

export default function AdminAIMonitorPage() {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
                <Construction className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Monitorar IA</h1>
            <p className="text-muted-foreground mt-2 max-w-md">
                O painel de monitoramento de agentes IA está em desenvolvimento.
            </p>
        </div>
    )
}
