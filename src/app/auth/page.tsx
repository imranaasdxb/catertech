import { Suspense } from "react";
import AuthPageClient from "./AuthPageClient";

export const metadata = {
  title: "Team access | Catertech",
  description: "Log in or request access to the Catertech team portal.",
};

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-admin-bg flex items-center justify-center text-admin-ink/40 text-sm">
          Loading…
        </div>
      }
    >
      <AuthPageClient />
    </Suspense>
  );
}
