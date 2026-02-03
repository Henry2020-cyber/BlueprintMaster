import Link from "next/link"
import { Gamepad2 } from "lucide-react"

const footerLinks = {
  produto: [
    { label: "Recursos", href: "#recursos" },
    { label: "Preços", href: "#precos" },
    { label: "Tutorial", href: "#tutorial" },
    { label: "Changelog", href: "#changelog" },
  ],
  empresa: [
    { label: "Sobre", href: "#sobre" },
    { label: "Blog", href: "#blog" },
    { label: "Carreiras", href: "#carreiras" },
    { label: "Contato", href: "#contato" },
  ],
  legal: [
    { label: "Privacidade", href: "#privacidade" },
    { label: "Termos de Uso", href: "#termos" },
    { label: "Cookies", href: "#cookies" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Gamepad2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">BlueprintMaster</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A plataforma definitiva para aprender Unreal Engine Blueprint com constância e organização.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Produto</h3>
              <ul className="space-y-3">
                {footerLinks.produto.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Empresa</h3>
              <ul className="space-y-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 BlueprintMaster. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
