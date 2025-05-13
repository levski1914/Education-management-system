"use client"
// app/teacher/page.tsx
import withAuth from "@/app/utils/withAuth";
import TeacherDashboard from "./components/TeacherDashboard"; // ако е отделен

export default withAuth(TeacherDashboard, ["TEACHER"]);
