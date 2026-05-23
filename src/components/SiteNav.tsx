import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-9 h-9 rounded-lg bg-blue-600 grid place-items-center text-white">
            <GraduationCap className="w-5 h-5" />
          </span>
          <span>EdInConnect</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-gray-600">
          <a href="#problemas" className="hover:text-gray-900">Problemas</a>
          <a href="#features" className="hover:text-gray-900">Funcionalidades</a>
          <a href="#impacto" className="hover:text-gray-900">Impacto</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            to="/login" 
            className="text-sm px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Entrar
          </Link>
          <Link 
            to="/login" 
            className="text-sm px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Conhecer plataforma
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 mt-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="w-8 h-8 rounded-lg bg-blue-600 grid place-items-center text-white">
              <GraduationCap className="w-4 h-4" />
            </span>
            EdInConnect
          </div>
          <p className="mt-3 text-gray-600">
            Educação inclusiva, acolhedora e conectada.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Plataforma</h4>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/student" className="hover:text-gray-900">Estudante</Link></li>
            <li><Link to="/teacher" className="hover:text-gray-900">Professor</Link></li>
            <li><Link to="/family" className="hover:text-gray-900">Família</Link></li>
            <li><Link to="/assistant" className="hover:text-gray-900">Assistente IA</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Sobre</h4>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:text-gray-900 cursor-pointer">Inclusão</li>
            <li className="hover:text-gray-900 cursor-pointer">Acessibilidade</li>
            <li className="hover:text-gray-900 cursor-pointer">Impacto social</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Contato</h4>
          <p className="text-gray-600">contato@edinconnect.app</p>
        </div>
      </div>

      <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} EdInConnect — Feito com carinho para a educação.
      </div>
    </footer>
  );
}