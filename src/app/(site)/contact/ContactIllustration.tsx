import Image from "next/image";
import contactIllustrationImage from "@/assets/contact/contact-page-illustration.png";

export function ContactIllustration() {
  return (
    <div
      className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[400px]"
      aria-hidden
    >
      <Image
        src={contactIllustrationImage}
        alt=""
        width={500}
        height={500}
        className="h-auto w-full object-contain"
        priority
      />
    </div>
  );
}
