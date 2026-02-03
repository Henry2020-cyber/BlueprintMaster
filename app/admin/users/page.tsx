"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import {
    MoreHorizontal,
    Search,
    Shield,
    User,
    Copy,
    Check,
    AlertTriangle,
    Eye,
    Ban,
    Lock,
    Package,
    FileText,
    X
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

type Profile = {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: 'user' | 'admin'
    status: 'active' | 'suspended' | 'archived'
    created_at: string
    plan?: string // detailed plan info could be joined, strictly assuming 'Free' or 'Pro' for now
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [roleUpdateValues, setRoleUpdateValues] = useState<Record<string, string>>({})
    const { toast } = useToast()
    const supabase = createClient()

    const fetchUsers = async () => {
        setLoading(true)
        // Adjust query based on your actual schema. 
        // Assuming profiles table has these fields.
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching users:', error)
            toast({ title: "Erro", description: "Falha ao carregar usuários.", variant: "destructive" })
        } else {
            setUsers(data as Profile[] || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const filteredUsers = users.filter(user =>
    (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id)
        toast({ title: "ID copiado!", description: "O ID do usuário foi copiado para a área de transferência." })
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId)

        if (error) {
            toast({ title: "Erro", description: "Não foi possível atualizar a função.", variant: "destructive" })
        } else {
            toast({ title: "Sucesso", description: "Permissões atualizadas com sucesso." })
            fetchUsers()
            if (selectedUser?.id === userId) {
                setSelectedUser(prev => prev ? { ...prev, role: newRole as 'user' | 'admin' } : null)
            }
        }
    }

    const handleStatusChange = async (userId: string, newStatus: string) => {
        const { error } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', userId)

        if (error) {
            toast({ title: "Erro", description: "Não foi possível alterar o status.", variant: "destructive" })
        } else {
            toast({ title: "Sucesso", description: `Usuário ${newStatus === 'active' ? 'ativado' : 'suspenso'}.` })
            fetchUsers()
            if (selectedUser?.id === userId) {
                setSelectedUser(prev => prev ? { ...prev, status: newStatus as any } : null)
            }
        }
    }

    const getInitials = (name?: string | null) => {
        if (!name) return "U"
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }

    const openDetails = (user: Profile) => {
        setSelectedUser(user)
        setRoleUpdateValues({ [user.id]: user.role }) // Initialize role select
        setIsSheetOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
                <p className="text-muted-foreground">Visualize e gerencie todos os usuários da plataforma.</p>
            </div>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle>Todos os Usuários</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar usuários..."
                                className="pl-8 bg-background/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <CardDescription>Lista completa de usuários cadastrados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead>Plano</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Data de Cadastro</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            Carregando...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            Nenhum usuário encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-border">
                                                        <AvatarImage src={user.avatar_url || ""} />
                                                        <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user.full_name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{user.full_name || "Usuário sem nome"}</span>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-background/50">
                                                    {user.plan || "Free"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={`${user.status === 'active'
                                                        ? 'bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20'
                                                        : 'bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/20'
                                                        } uppercase text-[10px] font-bold tracking-wider`}
                                                    variant="secondary"
                                                >
                                                    {user.status || 'active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {user.role === 'admin' && <Shield className="h-3 w-3 text-primary" />}
                                                    <span className="capitalize text-sm">{user.role}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(user.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[180px] bg-card border-border">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleCopyId(user.id)}>
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            Copiar ID
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => openDetails(user)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver Detalhes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openDetails(user)}>
                                                            <Shield className="mr-2 h-4 w-4" />
                                                            Alterar Permissões
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                                            onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                                                        >
                                                            <Ban className="mr-2 h-4 w-4" />
                                                            {user.status === 'active' ? 'Suspender Conta' : 'Reativar Conta'}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-[850px] border-l border-border bg-background p-0 shadow-2xl">
                    {selectedUser && (
                        <div className="flex flex-col h-full overflow-hidden">
                            {/* Header Section */}
                            <div className="px-8 py-8 border-b border-border flex items-center justify-between bg-muted/20">
                                <div className="flex items-center gap-5">
                                    <Avatar className="h-14 w-14 rounded-full border border-border">
                                        <AvatarImage src={selectedUser.avatar_url || ""} />
                                        <AvatarFallback className="bg-muted text-foreground font-semibold">
                                            {getInitials(selectedUser.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            <SheetTitle className="text-xl font-bold text-foreground tracking-tight">
                                                {selectedUser.full_name || "Usuário"}
                                            </SheetTitle>
                                            <Badge className={`${selectedUser.status === 'active'
                                                ? 'bg-green-500/15 text-green-600 dark:text-green-500'
                                                : 'bg-red-500/15 text-red-600 dark:text-red-500'
                                                } border-0 px-2.5 py-0.5 text-xs font-medium`}>
                                                {selectedUser.status}
                                            </Badge>
                                        </div>
                                        <SheetDescription className="text-sm text-muted-foreground font-medium">
                                            {selectedUser.email}
                                        </SheetDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleCopyId(selectedUser.id)} className="h-9 w-9">
                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <SheetClose asChild>
                                        <Button variant="outline" size="icon" className="h-9 w-9">
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </SheetClose>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 bg-background">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                    {/* Left Column */}
                                    <div className="space-y-10">
                                        {/* Dados Pessoais */}
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" /> Dados Pessoais
                                            </h3>
                                            <div className="space-y-5">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-foreground">Nome Completo</Label>
                                                    <Input value={selectedUser.full_name || ""} readOnly className="bg-muted/50 border-input h-10 px-3 text-sm" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-foreground">Endereço de Email</Label>
                                                    <Input value={selectedUser.email} readOnly className="bg-muted/50 border-input h-10 px-3 text-sm" />
                                                    <p className="text-xs text-muted-foreground mt-1">O email está vinculado à conta de autenticação.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-10">
                                        {/* Permissões */}
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-primary" /> Gestão de Acesso
                                            </h3>
                                            <div className="space-y-5">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-foreground">Função na Plataforma</Label>
                                                    <Select
                                                        defaultValue={selectedUser.role}
                                                        onValueChange={(val) => setRoleUpdateValues({ ...roleUpdateValues, [selectedUser.id]: val })}
                                                    >
                                                        <SelectTrigger className="bg-background border-input h-10 px-3 text-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="user">Usuário Comum</SelectItem>
                                                            <SelectItem value="admin">Administrador</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Button
                                                    className="w-full h-10"
                                                    onClick={() => handleRoleChange(selectedUser.id, roleUpdateValues[selectedUser.id] || selectedUser.role)}
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Salvar Alterações
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Metadados */}
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-primary" /> Informações Técnicas
                                            </h3>
                                            <div className="space-y-4 text-sm">
                                                <div className="space-y-2">
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ID do Usuário</span>
                                                    <div className="flex items-center justify-between p-3 rounded-md bg-muted/40 border border-border">
                                                        <span className="font-mono text-xs text-muted-foreground truncate mr-4">
                                                            {selectedUser.id ? `${selectedUser.id.substring(0, 8)}...${selectedUser.id.substring(selectedUser.id.length - 4)}` : "N/A"}
                                                        </span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyId(selectedUser.id)}>
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Membro Desde</span>
                                                    <div className="pl-3 border-l-2 border-primary/20">
                                                        <span className="font-medium text-foreground text-sm">{format(new Date(selectedUser.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Zona de Perigo */}
                                        <div className="space-y-6 pt-6 border-t border-border">
                                            <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4" /> Área Crítica
                                            </h3>
                                            <div className="space-y-3">
                                                <Button
                                                    variant="destructive"
                                                    className="w-full h-10"
                                                    onClick={() => handleStatusChange(selectedUser.id, selectedUser.status === 'active' ? 'suspended' : 'active')}
                                                >
                                                    <Ban className="h-4 w-4 mr-2" />
                                                    {selectedUser.status === 'active' ? 'Suspender Usuário' : 'Reativar Conta'}
                                                </Button>
                                                <p className="text-xs text-muted-foreground text-center">
                                                    Ação registrada nos logs de auditoria.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
