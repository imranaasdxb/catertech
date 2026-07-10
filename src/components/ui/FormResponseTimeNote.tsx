import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type FormResponseTimeNoteProps = {
  className?: string;
};

export default function FormResponseTimeNote({ className }: FormResponseTimeNoteProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#e8e4df] bg-[#faf9f7] px-4 py-2 text-xs font-semibold tracking-wide text-ink",
        className,
      )}
    >
      <Clock className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} aria-hidden />
      Response within 10 minutes
    </p>
  );
}
