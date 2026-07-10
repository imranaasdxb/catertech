"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONNECT_US_TRIGGER_SECTION_IDS } from "@/lib/connect-us-sections";

export { SERVICES_FEATURES_SECTION_ID } from "@/lib/connect-us-sections";

function getActivationLine() {
  if (typeof window === "undefined") return 118;

  const headerHeight = getComputedStyle(document.documentElement).getPropertyValue(
    "--header-height",
  );
  const parsed = Number.parseFloat(headerHeight);
  return Number.isFinite(parsed) ? parsed : 118;
}

function isSectionActive(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  const topLine = getActivationLine();

  // Show once the section top reaches the header line, keep until the whole section scrolls past it.
  const hasReachedTop = rect.top <= topLine;
  const notFullyScrolledPast = rect.bottom > topLine;

  return hasReachedTop && notFullyScrolledPast;
}

function isAnyTriggerSectionActive() {
  return CONNECT_US_TRIGGER_SECTION_IDS.some((id) => {
    const section = document.getElementById(id);
    return section ? isSectionActive(section) : false;
  });
}

function hasAnyTriggerSection() {
  return CONNECT_US_TRIGGER_SECTION_IDS.some((id) => document.getElementById(id));
}

export default function ConnectUsTab() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setVisible(false);
      return;
    }

    let frame = 0;
    let attachRetryTimer: ReturnType<typeof setTimeout> | undefined;
    const syncTimers: ReturnType<typeof setTimeout>[] = [];

    const updateVisibility = () => {
      if (!hasAnyTriggerSection()) {
        setVisible(false);
        return;
      }

      setVisible(isAnyTriggerSectionActive());
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateVisibility);
    };

    const attach = () => {
      if (!hasAnyTriggerSection()) return false;

      updateVisibility();
      window.addEventListener("scroll", onScrollOrResize, { passive: true });
      window.addEventListener("resize", onScrollOrResize);
      window.addEventListener("hashchange", onScrollOrResize);
      requestAnimationFrame(() => {
        requestAnimationFrame(updateVisibility);
      });
      for (const delay of [120, 350, 700]) {
        syncTimers.push(setTimeout(updateVisibility, delay));
      }
      return true;
    };

    if (!attach()) {
      attachRetryTimer = setTimeout(attach, 200);
    }

    return () => {
      if (attachRetryTimer) clearTimeout(attachRetryTimer);
      for (const timer of syncTimers) clearTimeout(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("hashchange", onScrollOrResize);
    };
  }, [pathname]);

  return (
    <Link
      href="/contact"
      aria-label="Connect with Catertech"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`connect-us-tab fixed right-0 top-1/2 z-40 -translate-y-1/2 transition-transform duration-[900ms] ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none ${
        visible
          ? "pointer-events-auto translate-x-0"
          : "pointer-events-none translate-x-full"
      }`}
    >
      <span className="btn-brand connect-us-tab__pill group flex min-h-[132px] w-9 items-center justify-center rounded-l-2xl rounded-r-none border-r-0 py-4 shadow-[-8px_0_32px_rgba(27,43,75,0.16)] sm:min-h-[148px] sm:w-11 sm:py-5 md:min-h-[168px] md:w-12">
        <span
          className="btn-brand__content text-[10px] font-extrabold uppercase tracking-[0.28em] md:text-[11px]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Connect Us
        </span>
      </span>
    </Link>
  );
}
