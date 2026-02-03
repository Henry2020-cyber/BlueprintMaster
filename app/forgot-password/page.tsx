"use client"

import React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gamepad2, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = () => {
    if (!email) {
      setError("Email é obrigatório")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)

    toast({
      title: "Email enviado",
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Gamepad2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">BlueprintMaster</span>
        </Link>

        <div className="rounded-xl border border-border bg-card p-8">
          {/* Back link */}
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para login
          </Link>

          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Email enviado!</h1>
              <p className="mt-2 text-muted-foreground">
                Enviamos um link de recuperação para <strong className="text-foreground">{email}</strong>.
                Verifique sua caixa de entrada e siga as instruções.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Não recebeu o email? Verifique a pasta de spam ou{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:text-primary/80"
                >
                  tente novamente
                </button>
              </p>
              <Link href="/login">
                <Button className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Voltar para Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Esqueceu sua senha?</h1>
                <p className="mt-2 text-muted-foreground">
                  Não se preocupe! Digite seu email e enviaremos instruções para redefinir sua senha.
                </p>
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
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError("")
                      }}
                      className={`border-border bg-input pl-10 text-foreground placeholder:text-muted-foreground ${error ? "border-destructive" : ""
                        }`}
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </Button>
              </form>

              {/* Register link */}
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Lembrou sua senha?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80">
                  Faça login
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © 2026 BlueprintMaster. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
