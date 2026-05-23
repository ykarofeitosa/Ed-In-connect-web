import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, Users, Home, GraduationCap, ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { roleToDashboard } from "../lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type Role = "student" | "teacher" | "family";

const roles: { id: Role; label: string; desc: string; icon: typeof BookOpen }[] = [
  { id: "student", label: "Estudante", desc: "Tarefas, metas e progresso", icon: BookOpen },
  { id: "teacher", label: "Professor", desc: "Turmas, atividades e relatórios", icon: Users },
  { id: "family", label: "Responsável", desc: "Acompanhe seu filho(a)", icon: Home },
];

function LoginPage() {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await signIn(email, password);
      const dashboard = roleToDashboard(user.role);
      navigate({ to: dashboard });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="hidden lg:flex bg-blue-600 text-white p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="w-9 h-9 rounded-lg bg-white grid place-items-center text-blue-600">
            <GraduationCap className="w-5 h-5" />
          </span>
          EdInConnect
        </Link>

        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Bem-vindo de volta à sua jornada de aprender.
          </h2>
          <p className="mt-4 text-blue-100 max-w-md">
            Escolha seu perfil e entre na plataforma.
          </p>
        </div>

        <div className="text-xs text-blue-200">© {new Date().getFullYear()} EdInConnect</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 font-bold mb-8">
            <span className="w-9 h-9 rounded-lg bg-blue-600 grid place-items-center text-white">
              <GraduationCap className="w-5 h-5" />
            </span>
            EdInConnect
          </Link>

          <h1 className="text-3xl font-bold">Entrar na plataforma</h1>
          <p className="text-gray-600 mt-2">Insira seu e-mail e senha para continuar.</p>

          {/* Role selector */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {roles.map(r => {
              const active = r.id === role;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-4 border rounded-lg text-left transition ${
                    active 
                      ? "border-blue-600 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <r.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="mt-3 text-sm font-medium">{r.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{r.desc}</div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <div className="mt-1.5 relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="voce@escola.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="mt-1.5 relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
              ) : (
                <>Entrar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              Não tem uma conta? Fale com a administração da escola.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}