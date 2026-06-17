import Image from "next/image";
import vector3 from "@/assets/vector3.png";

export function ContactLottie() {
  return (
    <div
      className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[400px]"
      aria-hidden
    >
      <Image
        src={vector3}
        alt=""
        width={500}
        height={500}
        className="h-auto w-full object-contain"
        priority
      />
    </div>
  );
}
