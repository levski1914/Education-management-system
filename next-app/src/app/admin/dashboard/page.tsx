"use client"
import withAuth from "@/app/utils/withAuth";
import AdminDashboard from "../components/AdminDashboard";


export default withAuth(AdminDashboard,["ADMIN","SUPERADMIN"])