import { getDb } from "@/db";
import AdminEnquiriesClient from "@/components/admin/AdminEnquiriesClient";

export default function AdminEnquiriesPage() {
  const db = getDb();
  return <AdminEnquiriesClient dbConfigured={Boolean(db)} />;
}
