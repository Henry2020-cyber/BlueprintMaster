"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gamepad2, Menu, X, Download } from "lucide-react"
import { useState } from "react"
import { ModeToggle } from "@/components/mode-toggle"

const navLinks = [
  { href: "/#loja", label: "Loja" },
  { href: "/#beneficios", label: "Benefícios" },
  { href: "/#como-funciona", label: "Como Funciona" },
  { href: "/#recursos", label: "Recursos" },
  { href: "/#depoimentos", label: "Depoimentos" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Gamepad2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">BlueprintMaster</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <ModeToggle />
          <Link href="/download">
            <Button variant="secondary" className="gap-2 rounded-full shadow-sm hover:bg-secondary/80">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Começar Agora
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-4 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <div className="flex justify-end px-2">
                <ModeToggle />
              </div>
              <Link href="/download">
                <Button variant="secondary" className="w-full justify-center gap-2 rounded-full">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="w-full justify-center">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
