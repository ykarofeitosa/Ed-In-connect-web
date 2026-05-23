import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Users, BookOpen, FileText, Plus, TrendingUp, MoreHorizontal,
  GraduationCap, Loader2, AlertCircle, X, UserPlus, School,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAuth } from "../hooks/use-auth";
import {
  useClassrooms,
  useCreateTask,
  useCreateClassroom,
  useRegisterStudent,
  useStudents,
  type Classroom,
  type Student,
} from "../hooks/use-api";
import { api } from "../lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/teacher")({
  component: TeacherDashboard,
});

function useTeacherByUserId(userId: string) {
  return useQuery({
    queryKey: ["teacher-by-user", userId],
    queryFn: () =>
      api
        .get<{
          teachers: Array<{
            id: string;
            userId: string;
            user: { id: string; name: string; email: string };
            classes: Classroom[];
          }>;
        }>("/teachers")
        .then(r => r.teachers.find(t => t.userId === userId) ?? null),
    enabled: !!userId,
  });
}

// ─── Modal de Confirmação de Delete ─────────────────────────────────────────

function DeleteConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Excluindo...</>
            ) : (
              "Sim, excluir"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Helpers de validação ─────────────────────────────────────────────────────

function validateStudentForm(name: string, email: string, password: string): string | null {
  if (name.trim().length < 3) return "Nome deve ter pelo menos 3 caracteres.";
  if (!email.includes("@") || !email.includes(".")) return "E-mail inválido.";
  if (password.length < 6) return "Senha deve ter pelo menos 6 caracteres.";
  return null;
}

function validateClassroomForm(name: string): string | null {
  if (name.trim().length < 2) return "Nome da turma deve ter pelo menos 2 caracteres.";
  return null;
}

// ─── Modal: Criar Turma ───────────────────────────────────────────────────────

function CreateClassroomModal({
  teacherId,
  onClose,
}: {
  teacherId: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createClassroom = useCreateClassroom();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateClassroomForm(name);
    if (validationError) { setError(validationError); return; }
    setError(null);
    try {
      await createClassroom.mutateAsync({ name: name.trim(), teacherId });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar turma.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary to-primary grid place-items-center text-white">
              <School className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold">Nova Turma</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome da turma *</label>
            <input
              required
              value={name}
              onChange={e => { setName(e.target.value); setError(null); }}
              placeholder="Ex: 6º A — Matemática"
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">Mínimo 2 caracteres.</p>
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createClassroom.isPending}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {createClassroom.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Criando...</>
                : "Criar turma"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Modal: Cadastrar Aluno ───────────────────────────────────────────────────

function RegisterStudentModal({
  classrooms,
  defaultClassId,
  onClose,
}: {
  classrooms: Classroom[];
  defaultClassId?: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState(defaultClassId ?? classrooms[0]?.id ?? "");
  const [inclusiveMode, setInclusiveMode] = useState(false);
  const [learningGoal, setLearningGoal] = useState("");
  const [error, setError] = useState<string | null>(null);

  const registerStudent = useRegisterStudent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateStudentForm(name, email, password);
    if (validationError) { setError(validationError); return; }
    setError(null);
    try {
      await registerStudent.mutateAsync({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        classId: classId || undefined,
        inclusiveMode,
        learningGoal: learningGoal.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar aluno.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-white">
              <UserPlus className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold">Cadastrar Aluno</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nome completo *</label>
            <input
              required
              value={name}
              onChange={e => { setName(e.target.value); setError(null); }}
              placeholder="Ex: Ana Beatriz Silva"
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">Mínimo 3 caracteres.</p>
          </div>

          <div>
            <label className="text-sm font-medium">E-mail *</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(null); }}
              placeholder="aluno@escola.com"
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Senha inicial *</label>
            <input
              required
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(null); }}
              placeholder="Mínimo 6 caracteres"
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">O aluno poderá alterar depois.</p>
          </div>

          <div>
            <label className="text-sm font-medium">Turma</label>
            <select
              value={classId}
              onChange={e => setClassId(e.target.value)}
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Sem turma</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Meta de aprendizado</label>
            <input
              value={learningGoal}
              onChange={e => setLearningGoal(e.target.value)}
              placeholder="Ex: Melhorar em leitura"
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
            <button
              type="button"
              onClick={() => setInclusiveMode(v => !v)}
              className={`w-10 h-6 rounded-full transition-colors shrink-0 ${
                inclusiveMode ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${
                  inclusiveMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <div>
              <div className="text-sm font-medium">Modo inclusivo</div>
              <div className="text-xs text-muted-foreground">Interface adaptada para o aluno</div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={registerStudent.isPending}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {registerStudent.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Cadastrando...</>
                : "Cadastrar aluno"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Modal: Criar Tarefa ──────────────────────────────────────────────────────

function CreateTaskModal({
  classrooms,
  teacherUserId,
  onClose,
  onCreate,
}: {
  classrooms: Classroom[];
  teacherUserId: string;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description?: string;
    dueDate: string;
    classId: string;
    createdBy: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [classId, setClassId] = useState(classrooms[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) { setError("Título deve ter pelo menos 3 caracteres."); return; }
    if (!dueDate) { setError("Selecione a data de entrega."); return; }
    if (new Date(dueDate) <= new Date()) { setError("A data de entrega deve ser no futuro."); return; }
    if (!classId) { setError("Selecione uma turma."); return; }
    setError(null);
    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: new Date(dueDate).toISOString(),
      classId,
      createdBy: teacherUserId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card rounded-3xl border border-border p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-white">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold">Nova Tarefa</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título *</label>
            <input
              required
              value={title}
              onChange={e => { setTitle(e.target.value); setError(null); }}
              placeholder="Ex: Lista de exercícios — Frações"
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detalhes da tarefa..."
              rows={3}
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Turma *</label>
            <select
              required
              value={classId}
              onChange={e => { setClassId(e.target.value); setError(null); }}
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Data de entrega *</label>
            <input
              required
              type="datetime-local"
              value={dueDate}
              min={new Date().toISOString().slice(0, 16)}
              onChange={e => { setDueDate(e.target.value); setError(null); }}
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
            >
              Criar tarefa
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStudentStatus(pct: number): { label: string; style: string } {
  if (pct >= 80) return { label: "Em dia",  style: "bg-secondary/20 text-secondary-foreground" };
  if (pct >= 50) return { label: "Atenção", style: "bg-accent/40 text-accent-foreground" };
  return             { label: "Apoio",   style: "bg-destructive/15 text-destructive" };
}

type ModalType = "task" | "classroom" | "student" | null;
type DeleteType = { type: "classroom" | "student" | "task"; id: string; name: string } | null;

// ─── Dashboard ────────────────────────────────────────────────────────────────

function TeacherDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [modal, setModal] = useState<ModalType>(null);
  const [defaultClassForStudent, setDefaultClassForStudent] = useState<string | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteType>(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate({ to: "/login" }); return; }
    if (user?.role !== "TEACHER") navigate({ to: "/login" });
  }, [isAuthenticated, user, navigate]);

  const { data: teacher, isLoading: loadingTeacher, error: teacherError } =
    useTeacherByUserId(user?.id ?? "");
  const { data: allClassrooms, isLoading: loadingClassrooms } = useClassrooms();
  const { data: allStudents,   isLoading: loadingStudents }   = useStudents();
  const createTask = useCreateTask();

  // ─── Mutations de Delete ──────────────────────────────────────────────────
  const deleteClassroom = useMutation({
    mutationFn: (id: string) => api.delete(`/classrooms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      setDeleteConfirm(null);
    },
  });

  const deleteStudent = useMutation({
    mutationFn: (id: string) => api.delete(`/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setDeleteConfirm(null);
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      setDeleteConfirm(null);
    },
  });

  if (!isAuthenticated || !user) return null;

  if (loadingTeacher || loadingClassrooms || loadingStudents) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (teacherError || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-muted-foreground">Não foi possível carregar seus dados.</p>
        </div>
      </div>
    );
  }

  const myClassrooms   = allClassrooms?.filter(c => c.teacherId === teacher.id) ?? [];
  const myStudents: Student[] = allStudents?.filter(s =>
    s.classId && myClassrooms.some(c => c.id === s.classId)
  ) ?? [];
  const totalStudents  = myStudents.length;
  const totalClasses   = myClassrooms.length;
  const allTasks       = myClassrooms.flatMap(c => c.tasks ?? []);
  const avgPerformance = myStudents.length > 0
    ? Math.round(
        myStudents.reduce((acc, s) => {
          const st   = s.tasks ?? [];
          const done = st.filter(t => t.status === "DONE").length;
          return acc + (st.length > 0 ? (done / st.length) * 100 : 0);
        }, 0) / myStudents.length
      )
    : 0;

  const openStudentModal = (classId?: string) => {
    setDefaultClassForStudent(classId);
    setModal("student");
  };

  return (
    <>
      <AnimatePresence>
        {modal === "classroom" && (
          <CreateClassroomModal teacherId={teacher.id} onClose={() => setModal(null)} />
        )}
        {modal === "student" && (
          <RegisterStudentModal
            classrooms={myClassrooms}
            defaultClassId={defaultClassForStudent}
            onClose={() => setModal(null)}
          />
        )}
        {modal === "task" && (
          <CreateTaskModal
            classrooms={myClassrooms}
            teacherUserId={user.id}
            onClose={() => setModal(null)}
            onCreate={data => createTask.mutateAsync(data)}
          />
        )}

        {deleteConfirm && (
          <DeleteConfirmModal
            isOpen={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            title={`Excluir ${deleteConfirm.type === "classroom" ? "turma" : deleteConfirm.type === "student" ? "aluno" : "tarefa"}`}
            message={`Tem certeza que deseja excluir "${deleteConfirm.name}"? Esta ação não pode ser desfeita.`}
            onConfirm={() => {
              if (deleteConfirm.type === "classroom") deleteClassroom.mutate(deleteConfirm.id);
              if (deleteConfirm.type === "student") deleteStudent.mutate(deleteConfirm.id);
              if (deleteConfirm.type === "task") deleteTask.mutate(deleteConfirm.id);
            }}
            isLoading={
              deleteClassroom.isPending || deleteStudent.isPending || deleteTask.isPending
            }
          />
        )}
      </AnimatePresence>

      <DashboardLayout role="teacher" userName={`Prof. ${teacher.user.name}`}>

        <div className="grid md:grid-cols-3 gap-4">
          <Stat icon={Users}      label="Alunos"           value={String(totalStudents)} />
          <Stat icon={BookOpen}   label="Turmas ativas"    value={String(totalClasses)} />
          <Stat icon={TrendingUp} label="Desempenho médio" value={`${avgPerformance}%`} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setModal("classroom")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-medium hover:opacity-90 transition shadow-sm"
          >
            <School className="w-4 h-4" /> Nova turma
          </button>
          <button
            onClick={() => openStudentModal()}
            disabled={myClassrooms.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 text-white text-sm font-medium hover:opacity-90 transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" /> Cadastrar aluno
          </button>
          <button
            onClick={() => setModal("task")}
            disabled={myClassrooms.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card border border-border text-sm font-medium hover:bg-muted transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Nova tarefa
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Minhas turmas</h2>
          <button
            onClick={() => setModal("classroom")}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Nova
          </button>
        </div>

        {myClassrooms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center">
            <School className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma turma criada ainda.</p>
            <button
              onClick={() => setModal("classroom")}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Criar primeira turma
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {myClassrooms.map((c, i) => {
              const classStudents = myStudents.filter(s => s.classId === c.id);
              const classTasks    = c.tasks ?? [];
              const avgDone = classStudents.length > 0
                ? Math.round(
                    classStudents.reduce((acc, s) => {
                      const done  = (s.tasks ?? []).filter(t => t.status === "DONE").length;
                      const total = (s.tasks ?? []).length;
                      return acc + (total > 0 ? (done / total) * 100 : 0);
                    }, 0) / classStudents.length
                  )
                : 0;
              const colors = ["from-primary to-accent", "from-secondary to-primary", "from-accent to-secondary"];

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-3xl border border-border/60 bg-card p-5 hover:-translate-y-1 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} text-white grid place-items-center`}>
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openStudentModal(c.id)}
                        className="opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1 text-xs text-primary border border-primary/30 px-2.5 py-1 rounded-full hover:bg-primary/5"
                      >
                        <UserPlus className="w-3 h-3" /> Aluno
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: "classroom", id: c.id, name: c.name })}
                        className="opacity-0 group-hover:opacity-100 transition text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 font-bold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {classStudents.length} alunos · {classTasks.length} tarefas
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-secondary to-primary"
                      initial={{ width: 0 }} animate={{ width: `${avgDone}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">Desempenho médio · {avgDone}%</div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-8 grid lg:grid-cols-3 gap-5">
          <section className="lg:col-span-2 rounded-3xl border border-border/60 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Alunos & progresso</h2>
              <button
                onClick={() => openStudentModal()}
                disabled={myClassrooms.length === 0}
                className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition disabled:opacity-40"
              >
                <UserPlus className="w-3.5 h-3.5" /> Cadastrar
              </button>
            </div>

            {myStudents.length === 0 ? (
              <div className="py-10 text-center">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {myClassrooms.length === 0
                    ? "Crie uma turma primeiro para cadastrar alunos."
                    : "Nenhum aluno cadastrado ainda."}
                </p>
                {myClassrooms.length > 0 && (
                  <button
                    onClick={() => openStudentModal()}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                  >
                    <UserPlus className="w-4 h-4" /> Cadastrar primeiro aluno
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground border-b border-border">
                    <tr>
                      <th className="text-left py-2 font-medium">Aluno</th>
                      <th className="text-left py-2 font-medium">Turma</th>
                      <th className="text-left py-2 font-medium">Progresso</th>
                      <th className="text-left py-2 font-medium">Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {myStudents.slice(0, 8).map(s => {
                      const done  = (s.tasks ?? []).filter(t => t.status === "DONE").length;
                      const total = (s.tasks ?? []).length;
                      const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                      const { label, style } = getStudentStatus(pct);
                      const classroom = myClassrooms.find(c => c.id === s.classId);

                      return (
                        <tr key={s.id} className="border-b border-border/40 last:border-0 hover:bg-muted/40 transition">
                          <td className="py-3 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-white text-xs font-bold shrink-0">
                              {s.user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                            </span>
                            <span className="font-medium">{s.user.name}</span>
                          </td>
                          <td className="text-muted-foreground">{classroom?.name ?? "—"}</td>
                          <td className="w-44">
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-secondary to-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-1">{pct}%</div>
                          </td>
                          <td>
                            <span className={`text-xs px-2.5 py-1 rounded-full ${style}`}>{label}</span>
                          </td>
                          <td>
                            <button 
                              onClick={() => setDeleteConfirm({ type: "student", id: s.id, name: s.user.name })}
                              className="p-1.5 rounded-lg hover:bg-muted text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-border/60 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Atividades</h2>
              <button
                onClick={() => setModal("task")}
                disabled={myClassrooms.length === 0}
                className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" /> Nova
              </button>
            </div>
            {allTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma tarefa criada ainda.</p>
            ) : (
              <ul className="space-y-3">
                {allTasks.slice(0, 6).map(task => {
                  const classroom = myClassrooms.find(c => c.tasks?.some(t => t.id === task.id));
                  return (
                    <motion.li
                      key={task.id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      className="rounded-2xl border border-border p-3 flex justify-between items-start"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FileText className="w-3.5 h-3.5" /> {classroom?.name ?? "—"}
                        </div>
                        <div className="font-semibold text-sm mt-1">{task.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Entrega · {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm({ type: "task", id: task.id, name: task.title })}
                        className="text-destructive hover:text-destructive/80 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <section className="mt-8 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10 border border-border/60 p-6">
          <h2 className="text-lg font-bold">Relatório pedagógico</h2>
          <p className="text-sm text-muted-foreground mt-1">Resumo gerado com base nos dados atuais.</p>
          <div className="mt-5 grid md:grid-cols-3 gap-3 text-sm">
            {[
              [
                `${myStudents.filter(s => {
                  const done  = (s.tasks ?? []).filter(t => t.status === "DONE").length;
                  const total = (s.tasks ?? []).length;
                  return total > 0 && (done / total) * 100 < 50;
                }).length} alunos`,
                "precisam de apoio individualizado",
              ],
              [
                `${allTasks.length} atividades`,
                `distribuídas entre ${totalClasses} ${totalClasses === 1 ? "turma" : "turmas"}`,
              ],
              [
                `${myStudents.filter(s => s.inclusiveMode).length} alunos`,
                "com modo inclusivo ativo",
              ],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white/70 backdrop-blur p-4 border border-border/40">
                <div className="text-xl font-extrabold text-primary">{n}</div>
                <div className="text-xs text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </section>
      </DashboardLayout>
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border/60 bg-card p-5"
    >
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="w-4 h-4" />{label}
      </div>
      <div className="mt-2 text-3xl font-extrabold">{value}</div>
    </motion.div>
  );
}