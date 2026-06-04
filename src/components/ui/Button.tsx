// import Link from "next/link";

// interface ButtonProps {
//   href?: string;
//   onClick?: () => void;
//   variant?: "primary" | "secondary" | "outline-light" | "outline-dark" | "ghost";
//   size?: "sm" | "md" | "lg";
//   children: React.ReactNode;
//   className?: string;
//   external?: boolean;
//   type?: "button" | "submit" | "reset";
//   disabled?: boolean;
// }

// export default function Button({
//   href,
//   onClick,
//   variant = "primary",
//   size = "md",
//   children,
//   className = "",
//   external = false,
//   type = "button",
//   disabled = false,
// }: ButtonProps) {
//   const base =
//     "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 cursor-pointer select-none";

//   const variants: Record<string, string> = {
//     primary:
//       "bg-sand text-white hover:bg-sand-dark active:scale-[0.98]",
//     secondary:
//       "bg-navy text-white hover:bg-[#111624] active:scale-[0.98]",
//     "outline-light":
//       "border border-white text-white hover:bg-white hover:text-navy active:scale-[0.98]",
//     "outline-dark":
//       "border border-sand text-sand hover:bg-sand hover:text-white active:scale-[0.98]",
//     ghost:
//       "text-sand hover:text-sand-dark underline-offset-4 hover:underline p-0",
//   };

//   const sizes: Record<string, string> = {
//     sm: "px-4 py-2 text-xs",
//     md: "px-6 py-3 text-sm",
//     lg: "px-8 py-4 text-sm",
//   };

//   const sizeClass = variant === "ghost" ? "" : sizes[size];
//   const classes = `${base} ${variants[variant]} ${sizeClass} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;

//   if (href) {
//     if (external) {
//       return (
//         <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
//           {children}
//         </a>
//       );
//     }
//     return (
//       <Link href={href} className={classes}>
//         {children}
//       </Link>
//     );
//   }

//   return (
//     <button type={type} onClick={onClick} disabled={disabled} className={classes}>
//       {children}
//     </button>
//   );
// }
