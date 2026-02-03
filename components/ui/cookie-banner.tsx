"use client"

import { useState, useEffect, useRef } from "react"
import { X, Cookie, Shield, BarChart3, Target, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [showPreferences, setShowPreferences] = useState(false)
    const constraintsRef = useRef(null)

    // Cookie preferences state
    const [preferences, setPreferences] = useState({
        essential: true, // Always true, can't be disabled
        analytics: false,
        marketing: false,
    })

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent")
        if (!consent) {
            setIsVisible(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted")
        localStorage.setItem("cookie-preferences", JSON.stringify({
            essential: true,
            analytics: true,
            marketing: true,
        }))
        setIsVisible(false)
        setShowPreferences(false)
    }

    const handleSavePreferences = () => {
        localStorage.setItem("cookie-consent", "custom")
        localStorage.setItem("cookie-preferences", JSON.stringify(preferences))
        setIsVisible(false)
        setShowPreferences(false)
    }

    const handleDeclineAll = () => {
        localStorage.setItem("cookie-consent", "declined")
        localStorage.setItem("cookie-preferences", JSON.stringify({
            essential: true,
            analytics: false,
            marketing: false,
        }))
        setIsVisible(false)
        setShowPreferences(false)
    }

    const togglePreference = (key: keyof typeof preferences) => {
        if (key === 'essential') return // Can't disable essential cookies
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    if (!isVisible) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[9997]"
                        onClick={() => !showPreferences && setIsVisible(false)}
                    />

                    {/* Invisible constraints container */}
                    <div
                        ref={constraintsRef}
                        className="fixed inset-0 pointer-events-none z-[9998]"
                    />

                    {/* Main Cookie Banner */}
                    {!showPreferences ? (
                        <motion.div
                            drag
                            dragMomentum={false}
                            dragElastic={0.05}
                            dragConstraints={constraintsRef}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                            className="fixed bottom-6 right-6 z-[9999] w-full max-w-[440px] cursor-move"
                        >
                            <Card className="relative overflow-hidden bg-white dark:bg-[#0f0f0f] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl">
                                {/* Subtle accent */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" />

                                {/* Close button */}
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="absolute top-4 right-4 p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </button>

                                {/* Cookie Icon */}
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="relative">
                                        <div className="relative h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-gray-800">
                                            <Cookie className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Usamos Cookies</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Seus dados, sua escolha</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                    Usamos cookies para melhorar sua experiência de navegação e analisar o uso do site. Leia nossa{" "}
                                    <button className="text-primary hover:underline font-medium">
                                        Política de Cookies
                                    </button>{" "}
                                    e{" "}
                                    <button className="text-primary hover:underline font-medium">
                                        Política de Privacidade
                                    </button>.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleAccept}
                                        className="flex-1 h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                    >
                                        Aceitar Tudo
                                    </Button>
                                    <Button
                                        onClick={() => setShowPreferences(true)}
                                        variant="outline"
                                        className="h-11 px-6 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold rounded-xl transition-all"
                                    >
                                        Personalizar
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        /* Preferences Modal */
                        <motion.div
                            drag
                            dragMomentum={false}
                            dragElastic={0.05}
                            dragConstraints={constraintsRef}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                            className="fixed bottom-6 right-6 z-[9999] w-full max-w-[480px] cursor-move"
                        >
                            <Card className="relative overflow-hidden bg-white dark:bg-[#0f0f0f] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl max-h-[85vh] overflow-y-auto">
                                {/* Subtle accent */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/30" />

                                {/* Close button */}
                                <button
                                    onClick={() => setShowPreferences(false)}
                                    className="absolute top-4 right-4 p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors z-10"
                                >
                                    <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </button>

                                {/* Header */}
                                <div className="mb-4 pr-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações de Privacidade</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. Configure suas preferências abaixo ou aceite tudo para continuar.
                                    </p>
                                </div>

                                {/* Cookie Options */}
                                <div className="space-y-3 mb-6">
                                    {/* Essential Cookies */}
                                    <div className="bg-gray-50 dark:bg-white/[0.02] border-2 border-primary/30 rounded-xl p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Shield className="h-4 w-4 text-primary" />
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Essenciais</h4>
                                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase">
                                                        Obrigatório
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    Funcionalidade básica e segurança
                                                </p>
                                            </div>
                                            <div className="shrink-0 h-6 w-11 bg-primary rounded-full flex items-center justify-end px-0.5 opacity-60 cursor-not-allowed">
                                                <div className="h-5 w-5 bg-white rounded-full shadow-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analytics Cookies */}
                                    <div className={`bg-gray-50 dark:bg-white/[0.02] border-2 rounded-xl p-4 transition-all ${preferences.analytics
                                        ? 'border-primary/30'
                                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                                        }`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Análise</h4>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    Estatísticas de uso e desempenho
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => togglePreference('analytics')}
                                                className={`shrink-0 h-6 w-11 rounded-full flex items-center transition-all ${preferences.analytics
                                                    ? 'bg-primary justify-end'
                                                    : 'bg-gray-300 dark:bg-gray-700 justify-start'
                                                    } px-0.5`}
                                            >
                                                <div className="h-5 w-5 bg-white rounded-full shadow-md" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Marketing Cookies */}
                                    <div className={`bg-gray-50 dark:bg-white/[0.02] border-2 rounded-xl p-4 transition-all ${preferences.marketing
                                        ? 'border-primary/30'
                                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                                        }`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Target className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Publicidade</h4>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    Anúncios direcionados e marketing
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => togglePreference('marketing')}
                                                className={`shrink-0 h-6 w-11 rounded-full flex items-center transition-all ${preferences.marketing
                                                    ? 'bg-primary justify-end'
                                                    : 'bg-gray-300 dark:bg-gray-700 justify-start'
                                                    } px-0.5`}
                                            >
                                                <div className="h-5 w-5 bg-white rounded-full shadow-md" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Privacy Policy Link */}
                                <div className="flex items-center justify-center gap-1 mb-6 text-xs text-gray-500 dark:text-gray-400">
                                    <Info className="h-3.5 w-3.5" />
                                    <button className="hover:text-primary hover:underline font-medium transition-colors">
                                        Política de Privacidade
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={handleSavePreferences}
                                        className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                                    >
                                        Salvar Preferências
                                    </Button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            onClick={handleDeclineAll}
                                            variant="outline"
                                            className="h-10 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 font-medium rounded-xl transition-all text-sm"
                                        >
                                            Recusar Tudo
                                        </Button>
                                        <Button
                                            onClick={handleAccept}
                                            variant="outline"
                                            className="h-10 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 font-medium rounded-xl transition-all text-sm"
                                        >
                                            Aceitar Tudo
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </>
            )}
        </AnimatePresence>
    )
}
