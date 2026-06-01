import Footer4Col from "@/components/ui/footer-column";
import FooterNewsletter from "@/components/ui/footer-newsletter-demo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer w-full bg-black text-white">
      <FooterNewsletter />
      <Footer4Col />

      <div className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-white">
            © {new Date().getFullYear()} Catertech. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-end">
            <Link
              href="/admin/login"
              className="text-xs text-white transition-colors hover:text-white/80"
            >
              Staff login
            </Link>
            <Link
              href="/privacy-policy"
              className="text-xs text-white transition-colors hover:text-white/80"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-white transition-colors hover:text-white/80"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
