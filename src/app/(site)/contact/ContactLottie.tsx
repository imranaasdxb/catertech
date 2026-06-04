"use client";

import Lottie from "lottie-react";
import contactAnimation from "@/assets/contact.json";

export function ContactLottie() {
  return (
    <div
      className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[400px]"
      aria-hidden
    >
      <Lottie
        animationData={contactAnimation}
        loop
        className="h-auto w-full"
      />
    </div>
  );
}
