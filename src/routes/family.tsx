// src/routes/family.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { CalendarCheck, HeartHandshake, Bell, BookOpen, Smile, Loader2, AlertCircle } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAuth } from "../hooks/use-auth";
import { useGuardian, useStudentAttendance, useStudentTasks, useNotifications } from "../hooks/use-api";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Guardian } from "../hooks/use-api";

export const Route = createFileRoute("/family")({
  component: FamilyDashboard,
});

// Busca o Guardian pelo userId do usuário logado
function useGuardianByUserId(userId: string) {
  return useQuery({
    queryKey: ["guardian-by-user", userId],
    queryFn: () =>
      api
        .get<{ guardians: Guardian[] }>("/guardians")
        .then(r => r.guardians.find(g => g.userId === userId) ?? null),
    enabled: !!userId,
  });
}

function FamilyDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/login" }); return; }
    if (user?.role !== "GUARDIAN") { navigate({ to: "/login" }); }
  }, [isAuthenticated, user, navigate]);

  const { data: guardian, isLoading: loadingGuardian, error: guardianError } = useGuardianByUserId(user?.id ?? "");

  // Pega o primeiro estudante vinculado (foco principal)
  const firstStudentLink = guardian?.students?.[0];
  const firstStudent = firstStudentLink?.student;

  const { data: tasks, isLoading: loadingTasks } = useStudentTasks(firstStudent?.id ?? "");
  const { data: attendance, isLoading: loadingAttendance } = useStudentAttendance(firstStudent?.id ?? "");
  const { data: notifications } = useNotifications(user?.id ?? "");

  if (!isAuthenticated || !user) return null;

  if (loadingGuardian) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (guardianError || !guardian) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-muted-foreground">Não foi possível carregar seus dados.</p>
        </div>
      </div>
    );
  }

  const pendingTasks = tasks?.filter(t => t.status === "PENDING") ?? [];
  const doneTasks = tasks?.filter(t => t.status === "DONE") ?? [];
  const totalTasks = tasks?.length ?? 0;

  // Nomes das matérias das tarefas pendentes
  const pendingSubjects = pendingTasks
    .map(t => t.task?.title?.split("—")[0]?.trim() ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join(" · ");

  // Engajamento baseado no % de tasks concluídas
  const engagementPct = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;
  const engagementLabel =
    engagementPct >= 80 ? "Ótimo" :
    engagementPct >= 50 ? "Regular" :
    "Precisa de atenção";

  const studentName = firstStudent?.user?.name ?? "—";
  const classroomName = firstStudent?.classroom?.name ?? "";

  return (
    <DashboardLayout role="family" userName={guardian.user.name}>
      {/* Hero card do estudante */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-7 bg-gradient-to-br from-accent/40 via-primary/15 to-secondary/20 border border-border/60"
      >
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-white grid place-items-center shadow-sm">
            <Smile className="w-7 h-7 text-primary" />
          </span>
          <div>
            <div className="text-sm text-muted-foreground">Acompanhando</div>
            <div className="text-2xl font-extrabold">
              {studentName}{classroomName ? ` · ${classroomName}` : ""}
            </div>
          </div>
        </div>
        {firstStudent ? (
          <p className="mt-4 text-muted-foreground max-w-2xl">
            {studentName} concluiu{" "}
            <span className="font-semibold text-foreground">{doneTasks.length} de {totalTasks}</span>{" "}
            atividades atribuídas.{" "}
            {engagementPct >= 80
              ? "Continue incentivando — está indo muito bem! 💙"
              : engagementPct >= 50
              ? "Ainda tem atividades pendentes, mas está progredindo."
              : "Algumas atividades precisam de atenção. Vale conversar! 💬"}
          </p>
        ) : (
          <p className="mt-4 text-muted-foreground">Nenhum estudante vinculado ainda.</p>
        )}
      </motion.div>

      {/* Stats */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Stat
          icon={CalendarCheck}
          label="Frequência este período"
          value={loadingAttendance ? "…" : (attendance?.attendanceRate ?? "—")}
          tint="from-secondary/30 to-primary/10"
        />
        <Stat
          icon={BookOpen}
          label="Tarefas pendentes"
          value={loadingTasks ? "…" : String(pendingTasks.length)}
          sub={pendingSubjects || undefined}
          tint="from-primary/10 to-accent/30"
        />
        <Stat
          icon={HeartHandshake}
          label="Engajamento"
          value={loadingTasks ? "…" : engagementLabel}
          tint="from-accent/30 to-secondary/20"
        />
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-5">
        {/* Tarefas */}
        <section className="lg:col-span-2 rounded-3xl border border-border/60 bg-card p-6">
          <h2 className="text-lg font-bold">Tarefas de {studentName}</h2>
          {loadingTasks ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : !firstStudent ? (
            <p className="mt-4 text-sm text-muted-foreground">Nenhum estudante vinculado.</p>
          ) : tasks && tasks.length > 0 ? (
            <div className="mt-5 space-y-3">
              {tasks.slice(0, 6).map(t => (
                <div key={`${t.studentId}-${t.taskId}`} className="flex items-center gap-3 p-3 rounded-2xl border border-border/60">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.status === "DONE" ? "bg-secondary" : "bg-amber-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{t.task?.title ?? "Tarefa"}</div>
                    {t.task?.dueDate && (
                      <div className="text-xs text-muted-foreground">
                        Entrega · {new Date(t.task.dueDate).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${
                    t.status === "DONE"
                      ? "bg-secondary/20 text-secondary-foreground"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {t.status === "DONE" ? "Concluída" : "Pendente"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Nenhuma tarefa atribuída ainda.</p>
          )}
        </section>

        {/* Notificações da escola */}
        <section className="rounded-3xl border border-border/60 bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Notificações</h2>
          </div>
          {notifications && notifications.length > 0 ? (
            <ul className="space-y-3">
              {notifications.slice(0, 5).map((n, i) => {
                const tints = [
                  "bg-primary/10 text-primary",
                  "bg-secondary/30 text-secondary-foreground",
                  "bg-accent/40 text-accent-foreground",
                ];
                return (
                  <li key={n.id} className={`rounded-2xl p-3 ${tints[i % tints.length]}`}>
                    <div className="text-sm font-semibold">{n.title}</div>
                    <div className="text-xs opacity-80 mt-1">{n.message}</div>
                    <div className="text-[10px] opacity-60 mt-1">
                      {new Date(n.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma notificação recebida.</p>
          )}
        </section>
      </div>

      {/* Histórico de presença */}
      {firstStudent && attendance && (
        <section className="mt-6 rounded-3xl border border-border/60 bg-card p-6">
          <h2 className="text-lg font-bold">Frequência escolar</h2>
          <div className="mt-4 grid md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-secondary/15 p-4">
              <div className="text-2xl font-extrabold text-secondary-foreground">{attendance.attendanceRate}</div>
              <div className="text-xs text-muted-foreground mt-1">Taxa de presença</div>
            </div>
            <div className="rounded-2xl bg-primary/10 p-4">
              <div className="text-2xl font-extrabold">{attendance.total}</div>
              <div className="text-xs text-muted-foreground mt-1">Dias registrados</div>
            </div>
            <div className="rounded-2xl bg-accent/30 p-4">
              <div className="text-2xl font-extrabold">{attendance.present}</div>
              <div className="text-xs text-muted-foreground mt-1">Presenças</div>
            </div>
            <div className="rounded-2xl bg-destructive/10 p-4">
              <div className="text-2xl font-extrabold text-destructive">{attendance.absent}</div>
              <div className="text-xs text-muted-foreground mt-1">Faltas</div>
            </div>
          </div>
        </section>
      )}

      {/* Outros filhos vinculados */}
      {guardian.students.length > 1 && (
        <section className="mt-6 rounded-3xl border border-border/60 bg-card p-6">
          <h2 className="text-lg font-bold">Outros estudantes vinculados</h2>
          <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {guardian.students.slice(1).map(({ student: s }) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border/60">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-white text-xs font-bold shrink-0">
                  {s.user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                </span>
                <div>
                  <div className="text-sm font-semibold">{s.user.name}</div>
                  <div className="text-xs text-muted-foreground">{s.classroom?.name ?? "Sem turma"}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}

function Stat({ icon: Icon, label, value, sub, tint }: {
  icon: any; label: string; value: string; sub?: string; tint: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-5 bg-gradient-to-br ${tint} border border-border/60`}
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="w-4 h-4" />{label}
      </div>
      <div className="mt-2 text-3xl font-extrabold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </motion.div>
  );
}