"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Gamepad2, Mail, Lock, ArrowLeft, Zap, Users, Eye, EyeOff, Loader2, Fingerprint, Sparkles } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login, socialLogin, biometricLogin, biometricAuthAvailable } = useStore()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido"
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao BlueprintMaster.",
        })

        if (result.role === 'admin') {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      await socialLogin(provider)
      toast({
        title: `Login com ${provider} realizado!`,
        description: "Redirecionando para o dashboard...",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro ao conectar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricLogin = async () => {
    setIsLoading(true)
    try {
      await biometricLogin()
      toast({
        title: "Login biométrico realizado!",
        description: "Bem-vindo de volta!",
      })
      router.push("/dashboard")
    } catch {
      toast({
        title: "Erro na biometria",
        description: "Use email e senha.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form (REVERTED TO ORIGINAL) */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-left-10 duration-700">
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Gamepad2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BlueprintMaster</span>
          </Link>

          {/* Back link */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para página inicial
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Bem-vindo de volta</h1>
            <p className="mt-2 text-muted-foreground">
              Entre com seu email e senha para acessar sua conta.
            </p>
          </div>

          {biometricAuthAvailable && (
            <div className="mb-6">
              <Button
                type="button"
                className="w-full gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                variant="outline"
                onClick={handleBiometricLogin}
                disabled={isLoading}
              >
                <Fingerprint className="h-5 w-5" />
                Entrar com Biometria
              </Button>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>
            </div>
          )}

          {/* Social Login */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full border-border bg-transparent text-foreground hover:bg-secondary"
              onClick={() => handleSocialLogin("Google")}
              disabled={true} // Temporarily disabled
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-border bg-transparent text-foreground hover:bg-secondary"
              onClick={() => handleSocialLogin("GitHub")}
              disabled={true} // Temporarily disabled
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou continue com email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  maxLength={100}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  className={`border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground ${errors.email ? "border-destructive" : ""
                    }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Senha</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  maxLength={50}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  className={`border-border bg-input pl-10 pr-10 text-foreground placeholder:text-muted-foreground ${errors.password ? "border-destructive" : ""
                    }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">
                Lembrar de mim
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar na Plataforma"
              )}
            </Button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-primary hover:text-primary/80">
              Registre-se agora
            </Link>
          </p>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            © 2026 BlueprintMaster. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Right Side - Visual Section (MAINTAINED PREMIUM) */}
      <div className="dark relative hidden lg:block lg:w-1/2 bg-mesh-gradient border-l border-white/5 overflow-hidden">
        {/* Animated grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pulse-soft" />

        {/* Floating gradient orbs */}
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-700/20 rounded-full blur-[100px] animate-pulse delay-1000" />

        <div className="relative flex h-full flex-col items-center justify-center px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center w-full max-w-lg z-10"
          >
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/80">Plataforma Educativa de Elite</span>
            </div>

            <h2 className="text-5xl font-black tracking-tighter text-foreground leading-[1.1] mb-6">
              O Futuro do seu <br />
              <span className="italic bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent">Workflow</span> está aqui
            </h2>

            <p className="text-xl text-muted-foreground/80 font-medium leading-relaxed mb-12">
              Domine Unreal Engine com o método que está transformando a carreira de +2.5k desenvolvedores.
            </p>

            {/* Content Display */}
            <div className="relative perspective-2000 w-full group">
              <motion.div
                className="relative z-20 rounded-3xl border border-white/10 bg-[#0f0f0f]/40 p-8 shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl ring-1 ring-white/10 animate-float"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-primary/50" />
                  </div>
                  <div className="px-3 py-1 rounded bg-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">Atividade Recente</div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 group/item cursor-default">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover/item:bg-primary/20 transition-colors">
                      <Gamepad2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2 text-left">
                      <div className="h-2 w-[40%] bg-foreground/10 rounded-full" />
                      <div className="h-3 w-full bg-foreground/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-emerald-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-primary/20 transition-all">
                      <div className="text-2xl font-black text-foreground mb-1">2.4k</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Estudantes</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:border-primary/20 transition-all">
                      <div className="text-2xl font-black text-primary mb-1">+142%</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Performance</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative elements behind cards */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[60px] animate-pulse" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] animate-pulse delay-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
