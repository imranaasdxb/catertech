"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const PREFETCH_ROUTES = [
  "/",
  "/about",
  "/about/journey",
  "/services",
  "/services/catering-equipment",
  "/services/event-rental",
  "/services/kitchen-equipment",
  "/services/event-management",
  "/shop",
  "/partners",
  "/trade",
  "/trade/enquiry",
  "/trade/rfq",
  "/blog",
  "/contact",
  "/cart",
  "/privacy-policy",
  "/terms",
  "/auth?tab=login",
  "/auth?tab=signup",
] as const;

type IdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout?: number },
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

function scheduleIdle(callback: () => void) {
  const idleWindow = window as IdleWindow;

  if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
    const handle = idleWindow.requestIdleCallback(callback, { timeout: 2000 });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const handle = window.setTimeout(callback, 700);
  return () => window.clearTimeout(handle);
}

export default function SiteRoutePrefetcher() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/" || window.location.hash) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const scrollHomeToTop = () => {
      if (window.location.pathname !== "/" || window.location.hash) return;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const onPageShow = () => {
      scrollHomeToTop();
      window.setTimeout(scrollHomeToTop, 150);
    };

    scrollHomeToTop();
    const frame = window.requestAnimationFrame(scrollHomeToTop);
    const timers = [50, 150, 350, 700, 1200].map((delay) =>
      window.setTimeout(scrollHomeToTop, delay),
    );

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("load", scrollHomeToTop);

    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("load", scrollHomeToTop);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [pathname]);

  useEffect(() => {
    const timers: number[] = [];

    const cancelIdle = scheduleIdle(() => {
      PREFETCH_ROUTES.filter((href) => href.split("?")[0] !== pathname).forEach(
        (href, index) => {
          const timer = window.setTimeout(() => {
            try {
              router.prefetch(href);
            } catch {
              // Prefetch is best-effort; navigation still works if a route cannot be warmed.
            }
          }, index * 180);

          timers.push(timer);
        },
      );
    });

    return () => {
      cancelIdle();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [pathname, router]);

  return null;
}
