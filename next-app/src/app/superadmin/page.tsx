"use client";

import { withRoleProtection } from "../utils/withRoleProtection";
import SuperAdminPage from "./SuperAdminPage";

export default withRoleProtection(SuperAdminPage, ["SUPERADMIN"]);
