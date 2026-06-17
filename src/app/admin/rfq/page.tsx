import { getDb } from "@/db";
import AdminRfqClient from "@/components/admin/AdminRfqClient";

export default function AdminRfqPage() {
  const db = getDb();
  return <AdminRfqClient dbConfigured={Boolean(db)} />;
}
