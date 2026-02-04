"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Apple, Download, Monitor, Terminal, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DownloadPage() {
    // Configuração do GitHub Release
    const GITHUB_REPO = "Henry2020-cyber/BlueprintMaster";
    const RELEASE_VERSION = "latest"; // ou especifique uma versão como "v1.0.0"

    const handleDownload = (fileType: 'exe' | 'zip') => {
        const fileName = fileType === 'zip'
            ? 'BlueprintMaster-Setup.zip'
            : 'BlueprintMaster-Setup.exe';

        // URL do GitHub Releases
        const downloadUrl = `https://github.com/${GITHUB_REPO}/releases/${RELEASE_VERSION}/download/${fileName}`;

        // Abrir em nova aba para iniciar o download
        window.open(downloadUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Header />

            {/* Main Content with Mesh/Grid Background */}
            <main className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
                            Baixe o BlueprintMaster <br className="hidden lg:block" /> para Windows
                        </h1>
                        <Button variant="outline" className="rounded-full px-6 py-6 text-base font-medium hover:bg-secondary/80 bg-background/50 backdrop-blur-sm border-border">
                            Ver versões anteriores
                        </Button>
                    </div>


                    {/* Download Grid Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-backwards">
                        {/* Label Column */}
                        <div className="lg:col-span-1">
                            <p className="text-lg font-medium text-muted-foreground">Selecione o download</p>
                        </div>

                        {/* MacOS Column */}
                        <div className="lg:col-span-1 flex flex-col gap-8 border-l border-border/40 pl-8 lg:pl-10 opacity-50 grayscale select-none pointer-events-none">
                            <div className="flex items-center gap-3 text-xl font-bold text-foreground">
                                <Apple className="w-6 h-6" />
                                <span>macOS</span>
                                <span className="text-xs font-normal border border-border px-2 py-0.5 rounded-full whitespace-nowrap">Em breve</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="flex items-center gap-2.5 text-muted-foreground group cursor-not-allowed">
                                    <Download className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Download para Apple Silicon</span>
                                </span>
                                <span className="flex items-center gap-2.5 text-muted-foreground group cursor-not-allowed">
                                    <Download className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Download para Intel</span>
                                </span>
                            </div>

                            <div className="mt-4 space-y-2">
                                <p className="font-semibold text-xs text-foreground uppercase tracking-wider">Requisitos Mínimos</p>
                                <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                                    Versões do macOS com suporte a atualizações de segurança da Apple. Isso geralmente inclui a versão atual e as duas anteriores. Versão mínima 12 (Monterey). x86 não é suportado.
                                </p>
                            </div>
                        </div>

                        {/* Windows Column */}
                        <div className="lg:col-span-1 flex flex-col gap-8 border-l border-border/40 pl-8 lg:pl-10">
                            <div className="flex items-center gap-3 text-xl font-bold text-foreground">
                                <Monitor className="w-6 h-6" />
                                <span>Windows</span>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="space-y-1">
                                    <p className="text-xl font-medium text-foreground">Download</p>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleDownload('exe')}
                                            className="flex items-center gap-1 text-foreground hover:text-emerald-500 transition-all group text-left"
                                        >
                                            <Download className="w-4 h-4 text-emerald-500 group-hover:translate-y-0.5 transition-transform" />
                                            <div className="flex flex-col leading-none">
                                                <span className="text-xl font-bold group-hover:text-emerald-500 transition-colors">.EXE</span>
                                                <span className="text-xs font-medium text-muted-foreground group-hover:text-emerald-500/80 transition-colors ml-1">(Instalador)</span>
                                            </div>
                                        </button>
                                        <span className="text-[10px] font-bold uppercase tracking-wider border border-emerald-500/50 text-emerald-500 px-2 py-0.5 rounded-full">Recomendado</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 space-y-2">
                                <p className="font-bold text-[10px] text-foreground uppercase tracking-widest">Requisitos Mínimos</p>
                                <p className="text-sm text-muted-foreground leading-relaxed opacity-60">
                                    Windows 10 (64 bit) ou superior.
                                </p>
                            </div>

                            <div className="mt-4 p-5 bg-[#0A0A0A] border border-emerald-900/40 rounded-xl space-y-3 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20"></div>
                                <p className="font-bold text-[10px] text-foreground uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                    Sobre avisos do Windows
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    O Windows pode mostrar um aviso de segurança. Isso é normal para apps sem certificado digital pago. Clique em "Mais informações" → "Executar assim mesmo" para instalar.
                                </p>
                            </div>
                        </div>

                        {/* Linux Column */}
                        <div className="lg:col-span-1 flex flex-col gap-8 border-l border-border/40 pl-8 lg:pl-10 opacity-50 grayscale select-none pointer-events-none">
                            <div className="flex items-center gap-3 text-xl font-bold text-foreground">
                                <Terminal className="w-6 h-6" />
                                <span>Linux</span>
                                <span className="text-xs font-normal border border-border px-2 py-0.5 rounded-full whitespace-nowrap">Em breve</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="flex items-center gap-2.5 text-muted-foreground group cursor-not-allowed">
                                    <Download className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Download</span>
                                </span>
                            </div>

                            <div className="mt-4 space-y-2">
                                <p className="font-semibold text-xs text-foreground uppercase tracking-wider">Requisitos Mínimos</p>
                                <p className="text-sm text-muted-foreground leading-relaxed opacity-80">
                                    glibc {'>='} 2.28, glibcxx {'>='} 3.4.25 (ex: Ubuntu 20, Debian 10, Fedora 36, RHEL 8)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
