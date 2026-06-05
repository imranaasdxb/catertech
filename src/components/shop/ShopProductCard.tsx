import Link from "next/link";
import Image from "next/image";
import WaterRiseCta from "@/components/ui/WaterRiseCta";
import { getShopProductDetail, type ShopProductCard } from "@/lib/shop-products";
import { cn } from "@/lib/utils";

type ShopProductCardProps = {
  product: ShopProductCard;
  className?: string;
};

export default function ShopProductCard({ product, className }: ShopProductCardProps) {
  const detail = getShopProductDetail(String(product.id));
  const description = detail?.shortDescription ?? product.cardSubtitle ?? "";
  const productHref = `/shop/${product.id}`;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-[#f5f2ee] transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-square w-full shrink-0 bg-[#f5f2ee]">
        <Link href={productHref} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain object-center p-4 transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
          />
        </Link>

        {product.tag ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#1a1a1a] px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
            {product.tag}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-5 pb-4 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-widest text-[#888888]">
          {product.category}
        </p>

        <Link href={productHref} className="block">
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[#1a1a1a] sm:text-xl">
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-2 text-[13px] leading-[1.6] text-[#666666]">
          {description || "\u00A0"}
        </p>

        <div className="mt-auto flex justify-end pt-2">
          <WaterRiseCta href={productHref} size="xs" className="w-fit">
            View &amp; quote
          </WaterRiseCta>
        </div>
      </div>
    </article>
  );
}
