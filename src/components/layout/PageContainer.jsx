export default function Container({ children, className = "" }) {
  return (
    <div
      className={`w-full mx-auto max-w-[1920px] px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-12${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
