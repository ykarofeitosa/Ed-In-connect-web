import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Student {
  id: string;
  userId: string;
  classId: string | null;
  inclusiveMode: boolean;
  learningGoal: string | null;
  user: { id: string; name: string; email: string; role: string; createdAt: string };
  classroom: Classroom | null;
  tasks?: StudentTask[];
  attendances?: Attendance[];
}

export interface Teacher {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
  classes: Classroom[];
}

export interface Guardian {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
  students: { student: Student }[];
}

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  teacher?: { id: string; user: { id: string; name: string } };
  students?: Student[];
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  classId: string;
  createdBy: string;
  assignments?: StudentTask[];
}

export interface StudentTask {
  studentId: string;
  taskId: string;
  status: "PENDING" | "DONE";
  completedAt: string | null;
  task?: Task;
  student?: Student;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  present: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  userId: string;
  createdAt: string;
}

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => api.get<{ students: Student[] }>("/students").then(r => r.students),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => api.get<{ student: Student }>(`/students/${id}`).then(r => r.student),
    enabled: !!id,
  });
}

export function useStudentTasks(studentId: string) {
  return useQuery({
    queryKey: ["students", studentId, "tasks"],
    queryFn: () =>
      api.get<{ tasks: StudentTask[] }>(`/students/${studentId}/tasks`).then(r => r.tasks),
    enabled: !!studentId,
  });
}

export function useUpdateStudentTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      studentId,
      taskId,
      status,
    }: {
      studentId: string;
      taskId: string;
      status: "PENDING" | "DONE";
    }) =>
      api.patch<{ studentTask: StudentTask }>(`/students/${studentId}/tasks/${taskId}`, { status }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students", vars.studentId, "tasks"] });
    },
    onError: err => {
      console.error("Erro ao atualizar tarefa:", err);
    },
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      classId?: string;
      inclusiveMode?: boolean;
      learningGoal?: string;
    }) => api.put(`/students/${id}`, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["students", vars.id] });
      qc.invalidateQueries({ queryKey: ["student-by-user"] });
    },
  });
}

export function useRegisterStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      password: string;
      classId?: string;
      inclusiveMode?: boolean;
      learningGoal?: string;
    }) => api.post<{ user: { student: Student } }>("/students", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: () => api.get<{ teachers: Teacher[] }>("/teachers").then(r => r.teachers),
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => api.get<{ teacher: Teacher }>(`/teachers/${id}`).then(r => r.teacher),
    enabled: !!id,
  });
}

export function useGuardian(id: string) {
  return useQuery({
    queryKey: ["guardians", id],
    queryFn: () => api.get<{ guardian: Guardian }>(`/guardians/${id}`).then(r => r.guardian),
    enabled: !!id,
  });
}

export function useClassroom(id: string) {
  return useQuery({
    queryKey: ["classrooms", id],
    queryFn: () =>
      api.get<{ classroom: Classroom }>(`/classrooms/${id}`).then(r => r.classroom),
    enabled: !!id,
  });
}

export function useClassrooms() {
  return useQuery({
    queryKey: ["classrooms"],
    queryFn: () =>
      api.get<{ classrooms: Classroom[] }>("/classrooms").then(r => r.classrooms),
  });
}

export function useCreateClassroom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; teacherId: string }) =>
      api.post<{ classroom: Classroom }>("/classrooms", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classrooms"] });
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      dueDate: string;
      classId: string;
      createdBy: string;
    }) => api.post("/tasks", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["classrooms"] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useStudentAttendance(studentId: string) {
  return useQuery({
    queryKey: ["attendance", "student", studentId],
    queryFn: () =>
      api.get<{
        total: number;
        present: number;
        absent: number;
        attendanceRate: string;
        attendances: Attendance[];
      }>(`/attendance/student/${studentId}`),
    enabled: !!studentId,
  });
}

export function useClassroomAttendance(classId: string, date?: string) {
  return useQuery({
    queryKey: ["attendance", "classroom", classId, date],
    queryFn: () =>
      api
        .get<{ attendances: Attendance[] }>(
          `/attendance/classroom/${classId}${date ? `?date=${date}` : ""}`
        )
        .then(r => r.attendances),
    enabled: !!classId,
  });
}

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () =>
      api
        .get<{ count: number; notifications: Notification[] }>(`/notifications/user/${userId}`)
        .then(r => r.notifications),
    enabled: !!userId,
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; userId: string }) => api.delete(`/notifications/${id}`),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["notifications", vars.userId] });
    },
  });
}