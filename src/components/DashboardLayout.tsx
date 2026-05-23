import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LayoutDashboard, Users, Home, Sparkles, BookOpen, Settings, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/use-auth";

type NavItem = { to: string; label: string; icon: typeof Home };

const navItems: Record<string, NavItem[]> = {
  student: [
    { to: "/student", label: "Meu painel", icon: LayoutDashboard },
    { to: "/assistant", label: "Assistente IA", icon: Sparkles },
  ],
  teacher: [
    { to: "/teacher", label: "Painel", icon: LayoutDashboard },
    { to: "/assistant", label: "Assistente IA", icon: Sparkles },
  ],
  family: [
    { to: "/family", label: "Painel da família", icon: Home },
    { to: "/assistant", label: "Assistente IA", icon: Sparkles },
  ],
};

const roleMeta = {
  student: { title: "Estudante", icon: BookOpen },
  teacher: { title: "Professor", icon: Users },
  family: { title: "Família", icon: Home },
};

export function DashboardLayout({
  role,
  userName,
  children,
  rightSlot,
}: {
  role: "student" | "teacher" | "family";
  userName: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}) {
  const loc = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const meta = roleMeta[role];
  const RoleIcon = meta.icon;

  const handleLogout = () => {
    signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-gray-200 px-4 py-6">
        <Link to="/" className="flex items-center gap-2 font-bold px-2 mb-8">
          EdInConnect
        </Link>

        {/* Role Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <RoleIcon className="w-4 h-4" />
            {meta.title}
          </div>
          <div className="font-semibold mt-1 text-gray-900 truncate">{userName}</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems[role].map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-1 mt-6 pt-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition">
            <Settings className="w-4 h-4" /> Preferências
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500">Olá, bem-vindo(a) de volta</div>
              <div className="font-semibold text-gray-900">{userName}</div>
            </div>
            <div className="flex items-center gap-2">{rightSlot}</div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}