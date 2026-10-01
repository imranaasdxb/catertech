export default function ProductDetailLoading() {
  return (
    <main className="bg-[#FEFEFE] pt-[var(--header-height)]">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:px-8 lg:py-12">
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-[#ececec]" />

        <div className="flex min-w-0 flex-col gap-4">
          <div className="h-3 w-36 animate-pulse rounded-full bg-[#e4e4e4]" />
          <div className="space-y-2">
            <div className="h-8 w-4/5 animate-pulse rounded-lg bg-[#dedede]" />
            <div className="h-8 w-3/5 animate-pulse rounded-lg bg-[#e7e7e7]" />
          </div>
          <div className="h-4 w-32 animate-pulse rounded-full bg-[#e4e4e4]" />
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full animate-pulse rounded-full bg-[#ececec]" />
            <div className="h-3 w-11/12 animate-pulse rounded-full bg-[#ececec]" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#ececec]" />
          </div>
          <div className="mt-2 h-11 w-40 animate-pulse rounded-xl bg-[#d8d8d8]" />
        </div>
      </section>
    </main>
  );
}
