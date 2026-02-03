"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, MoreVertical, Package } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const products = [
    {
        id: "1",
        title: "Curso Mestre dos Agentes",
        price: "R$ 297,00",
        status: "active",
        modules: 12,
        image: "https://placehold.co/600x400/1e293b/white?text=Curso+Agentes"
    },
    {
        id: "2",
        title: "Mentoria Elite",
        price: "R$ 997,00",
        status: "active",
        modules: 4,
        image: "https://placehold.co/600x400/1e293b/white?text=Mentoria"
    },
    {
        id: "3",
        title: "Ebook: 100 Prompts",
        price: "R$ 47,00",
        status: "draft",
        modules: 1,
        image: "https://placehold.co/600x400/1e293b/white?text=Ebook"
    }
]

export default function ProductsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                    <p className="text-muted-foreground">Gerencie seus cursos, mentorias e produtos digitais.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Novo Produto
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden bg-card/50">
                        <div className="aspect-video w-full bg-muted relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.image} alt={product.title} className="object-cover w-full h-full" />
                            <Badge className={`absolute top-2 right-2 ${product.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                {product.status === 'active' ? 'Ativo' : 'Rascunho'}
                            </Badge>
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-start justify-between">
                                <span className="truncate">{product.title}</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-500">Excluir</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Package className="mr-1 h-4 w-4" />
                                    {product.modules} Módulos
                                </div>
                                <div className="font-bold text-foreground">{product.price}</div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/admin/products/${product.id}`} className="w-full">
                                <Button variant="outline" className="w-full">
                                    <Edit className="mr-2 h-4 w-4" /> Gerenciar Conteúdo
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
