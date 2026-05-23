import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Accessibility, Calendar, CheckCircle2, Circle, Clock, Sparkles, Target,
  TrendingUp, Volume2, Send, Bell, Loader2, AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAuth } from "../hooks/use-auth";
import {
  useStudentTasks,
  useStudentAttendance,
  useNotifications,
  useUpdateStudentTaskStatus,
  useUpdateStudent,
  type Student,
  type StudentTask,
} from "../hooks/use-api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export const Route = createFileRoute("/student")({
  component: StudentDashboard,
});

function useStudentByUserId(userId: string) {
  return useQuery({
    queryKey: ["student-by-user", userId],
    queryFn: () =>
      api
        .get<{ students: Student[] }>("/students")
        .then(r => r.students.find(s => s.userId === userId) ?? null),
    enabled: !!userId,
  });
}

const week = [
  { d: "Seg", v: 60 }, { d: "Ter", v: 75 }, { d: "Qua", v: 50 },
  { d: "Qui", v: 85 }, { d: "Sex", v: 72 }, { d: "Sáb", v: 30 }, { d: "Dom", v: 10 },
];

function StudentDashboard() {
  const navigate    = useNavigate();
  const qc          = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/login" }); return; }
    if (user?.role !== "STUDENT") navigate({ to: "/login" });
  }, [isAuthenticated, user, navigate]);

  const { data: student, isLoading: loadingStudent, error: studentError } =
    useStudentByUserId(user?.id ?? "");

  const { data: tasks, isLoading: loadingTasks } = useStudentTasks(student?.id ?? "");
  const { data: attendanceData }                  = useStudentAttendance(student?.id ?? "");
  const { data: notifications }                   = useNotifications(user?.id ?? "");

  const updateTask    = useUpdateStudentTaskStatus();
  const updateStudent = useUpdateStudent();

  const [inclusive, setInclusive] = useState(false);

  useEffect(() => {
    if (student) setInclusive(student.inclusiveMode);
  }, [student]);

  const handleToggleInclusive = async () => {
    const next = !inclusive;
    setInclusive(next);
    if (student) await updateStudent.mutateAsync({ id: student.id, inclusiveMode: next });
  };

  const handleToggleTask = (studentId: string, taskId: string, current: "PENDING" | "DONE") => {
    const next: "PENDING" | "DONE" = current === "DONE" ? "PENDING" : "DONE";
    const key = ["students", studentId, "tasks"];

    qc.setQueryData<StudentTask[]>(key, old =>
      old?.map(t =>
        t.taskId === taskId
          ? { ...t, status: next, completedAt: next === "DONE" ? new Date().toISOString() : null }
          : t
      )
    );

    updateTask.mutate(
      { studentId, taskId, status: next },
      { onError: () => qc.invalidateQueries({ queryKey: key }) }
    );
  };

  if (!isAuthenticated || !user) return null;

  if (loadingStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (studentError || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-muted-foreground">Não foi possível carregar seus dados.</p>
        </div>
      </div>
    );
  }

  const doneTasks            = tasks?.filter(t => t.status === "DONE").length ?? 0;
  const totalTasks           = tasks?.length ?? 0;
  const progress             = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const pendingNotifications = notifications?.length ?? 0;

  return (
    <div className={inclusive ? "inclusive" : ""}>
      <DashboardLayout
        role="student"
        userName={student.user.name}
        rightSlot={
          <button
            onClick={handleToggleInclusive}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition border ${
              inclusive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-muted border-border"
            }`}
          >
            <Accessibility className="w-4 h-4" />
            Modo inclusivo {inclusive ? "ativo" : ""}
          </button>
        }
      >
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard icon={Target}       label="Meta semanal"       value={`${progress}%`} />
          <StatCard icon={CheckCircle2} label="Tarefas concluídas" value={`${doneTasks}/${totalTasks}`} />
          <StatCard icon={Clock}        label="Frequência"          value={attendanceData?.attendanceRate ?? "—"} sub="este período" />
          <StatCard icon={Bell}         label="Notificações"        value={`${pendingNotifications} ${pendingNotifications === 1 ? "nova" : "novas"}`} />
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-5">
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-3xl bg-card border border-border/60 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Tarefas</h2>
              <span className="text-xs text-muted-foreground">{progress}% concluído</span>
            </div>

            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-secondary to-primary"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>

            {loadingTasks ? (
              <div className="mt-6 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : tasks && tasks.length > 0 ? (
              <ul className="mt-5 space-y-2">
                {tasks.map(t => (
                  <li key={`${t.studentId}-${t.taskId}`}>
                    <button
                      type="button"
                      onClick={() => handleToggleTask(t.studentId, t.taskId, t.status)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/60 transition text-left"
                    >
                      {t.status === "DONE"
                        ? <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                        : <Circle       className="w-5 h-5 text-muted-foreground shrink-0" />
                      }
                      <span className={`flex-1 text-sm ${t.status === "DONE" ? "line-through text-muted-foreground" : ""}`}>
                        {t.task?.title ?? "Tarefa"}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {t.task?.dueDate ? new Date(t.task.dueDate).toLocaleDateString("pt-BR") : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground text-center">
                Nenhuma tarefa atribuída ainda.
              </p>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl bg-card border border-border/60 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Notificações</h2>
            </div>
            {notifications && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 4).map(n => (
                  <div key={n.id} className="rounded-2xl p-3 bg-primary/10 text-primary">
                    <div className="text-sm font-semibold">{n.title}</div>
                    <div className="text-xs opacity-80 mt-1">{n.message}</div>
                    <div className="text-[10px] opacity-60 mt-1">
                      {new Date(n.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma notificação.</p>
            )}
          </motion.section>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-5">
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-3xl bg-card border border-border/60 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <h2 className="text-lg font-bold">Desempenho semanal</h2>
              </div>
              <span className="text-xs text-muted-foreground">Histórico de atividade</span>
            </div>
            <div className="flex items-end gap-3 h-44">
              {week.map((w, i) => (
                <div key={w.d} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    className="w-full rounded-t-xl bg-gradient-to-t from-primary to-accent"
                    initial={{ height: 0 }}
                    animate={{ height: `${w.v}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                  />
                  <span className="text-[11px] text-muted-foreground">{w.d}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <AssistantMini />
        </div>

        {student.classroom && (
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-3xl bg-card border border-border/60 p-6"
          >
            <h2 className="text-lg font-bold">Minha turma</h2>
            <p className="text-muted-foreground mt-1">{student.classroom.name}</p>
            {student.learningGoal && (
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Meta de aprendizado:</span>{" "}
                {student.learningGoal}
              </p>
            )}
          </motion.section>
        )}
      </DashboardLayout>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: {
  icon: any; label: string; value: string; sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-5 bg-card border border-border/60"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="w-4 h-4" /> {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </motion.div>
  );
}

function AssistantMini() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 border border-border/60 p-5 flex flex-col"
    >
      <div className="flex items-center gap-2">
        <span className="w-9 h-9 rounded-2xl bg-white grid place-items-center shadow-sm">
          <Sparkles className="w-4 h-4 text-primary" />
        </span>
        <div>
          <div className="font-bold text-sm">Assistente Edi</div>
          <div className="text-[11px] text-muted-foreground">Sempre por aqui ✨</div>
        </div>
      </div>
      <div className="mt-4 space-y-2 flex-1">
        <Bubble who="ai">Vamos organizar suas tarefas?</Bubble>
        <Bubble who="me">Sim, pode me ajudar com matemática?</Bubble>
        <Bubble who="ai">Claro! Vou simplificar os exercícios pra você 💡</Bubble>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="p-2 rounded-xl bg-white border border-border" title="Ouvir em áudio">
          <Volume2 className="w-4 h-4 text-primary" />
        </button>
        <Link
          to="/assistant"
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
        >
          Abrir conversa <Send className="w-4 h-4" />
        </Link>
      </div>
    </motion.section>
  );
}

function Bubble({ who, children }: { who: "ai" | "me"; children: React.ReactNode }) {
  return (
    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs ${
      who === "ai"
        ? "bg-white border border-border"
        : "bg-primary text-primary-foreground ml-auto"
    }`}>
      {children}
    </div>
  );
}