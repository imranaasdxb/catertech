import { Suspense } from "react";
import AdminLoginInner from "./LoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-navy flex items-center justify-center text-white/40 text-sm">
          Loading…
        </div>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}
