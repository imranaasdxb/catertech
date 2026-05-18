import { getDb } from "@/db";
import AdminContactsDirectoryClient from "@/components/admin/AdminContactsDirectoryClient";

export default function AdminContactsPage() {
  const db = getDb();
  return <AdminContactsDirectoryClient dbConfigured={Boolean(db)} />;
}
