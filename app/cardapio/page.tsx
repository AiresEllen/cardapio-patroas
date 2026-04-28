"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const WHATSAPP_NUMBER = "5511959048246";

export default function CardapioPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const catQuery = query(
        collection(db, "patroas_categories"),
        where("active", "==", true),
      );

      const prodQuery = query(
        collection(db, "patroas_products"),
        where("active", "==", true),
      );

      const [catSnap, prodSnap] = await Promise.all([
        getDocs(catQuery),
        getDocs(prodQuery),
      ]);

      setCategories(
        catSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => a.order - b.order),
      );

      setProducts(
        prodSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => a.order - b.order),
      );
    }

    load();
  }, []);

  const grouped = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      items: products.filter((p) => p.categorySlug === cat.slug),
    }));
  }, [categories, products]);

  function getCategory(slug: string) {
    return grouped.find((cat) => cat.slug === slug);
  }

  function formatMoney(value: number) {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function CategoryBlock({
    slug,
    icon,
    color = "pink",
  }: {
    slug: string;
    icon: string;
    color?: "pink" | "gold";
  }) {
    const cat = getCategory(slug);
    if (!cat) return null;

    const mobileTitle =
      slug === "refrigerantes" ? "text-[12px]" : "text-[14px]";

    return (
      <section className="grid grid-cols-[16px_1fr] gap-1.5 md:grid-cols-[46px_1fr] md:gap-4">
        <div className="pt-0.5 text-sm md:text-4xl">{icon}</div>

        <div className="min-w-0">
          <h3
            className={`mb-1 font-black uppercase leading-none tracking-wide ${mobileTitle} md:mb-3 md:text-4xl ${
              color === "gold" ? "text-[#d9a441]" : "text-pink-500"
            }`}
          >
            {cat.name}
          </h3>

          {cat.items.length === 0 && (
            <p className="text-[7px] text-zinc-500 md:text-sm">
              Nenhum item cadastrado.
            </p>
          )}

          {cat.items.map((item: any) => (
            <div
              key={item.id}
              className="grid grid-cols-[minmax(0,auto)_1fr_auto] items-end gap-1 text-[7px] md:gap-2 md:text-base"
            >
              <span className="max-w-[58px] truncate text-white md:max-w-none">
                {item.name}
              </span>

              <span className="mb-0.5 min-w-[8px] border-b border-dashed border-[#d9a441] md:mb-1" />

              <span className="whitespace-nowrap text-[#d9a441]">
                {formatMoney(item.price)}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const whatsappMessage = encodeURIComponent(
    "Olá! Vim pelo cardápio da Patroas do Gole e gostaria de fazer um pedido.",
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-3 py-6 text-white md:px-8 md:py-10">
      <section className="relative w-full max-w-[390px] border border-[#c9983d] bg-black px-4 py-6 shadow-2xl md:max-w-5xl md:px-14 md:py-10">
        <div className="pointer-events-none absolute inset-2 border border-[#c9983d]/70 md:inset-4" />

        <header className="relative mb-6 text-center md:mb-12">
          <div className="text-2xl md:text-6xl">👑</div>

          <h1 className="text-3xl font-black text-[#d9a441] md:text-8xl">
            PATROAS
          </h1>

          <p className="text-base font-bold text-pink-500 md:text-5xl">DO</p>

          <p className="text-4xl italic leading-none text-pink-500 md:text-9xl">
            Gole
          </p>

          <p className="mt-1 text-[9px] tracking-widest text-[#d9a441] md:mt-3 md:text-sm md:tracking-[0.45em]">
            ADEGA DAS MENINAS
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 md:mt-8 md:gap-4">
            <span className="h-px w-6 bg-pink-500 md:w-24" />
            <span className="text-pink-500">♥</span>
            <h2 className="text-xl font-bold text-[#d9a441] md:text-5xl">
              CARDÁPIO
            </h2>
            <span className="text-pink-500">♥</span>
            <span className="h-px w-6 bg-pink-500 md:w-24" />
          </div>
        </header>

        <div className="relative grid grid-cols-2 gap-x-3 gap-y-4 md:gap-x-16 md:gap-y-10">
          <div className="space-y-4 md:space-y-10">
            <CategoryBlock slug="drinks" icon="🍸" />
            <CategoryBlock slug="doses" icon="🥃" />
            <CategoryBlock slug="refrigerantes" icon="🥤" />
            <CategoryBlock slug="petiscos" icon="🍟" />
          </div>

          <div className="space-y-4 md:space-y-10">
            <CategoryBlock slug="cervejas" icon="🍺" color="gold" />
            <CategoryBlock slug="vinhos" icon="🍷" color="gold" />

            <div className="rounded-lg border border-pink-500 p-1.5 text-center md:mx-auto md:max-w-[330px] md:rounded-3xl md:border-4 md:p-6">
              <p className="mb-1 text-[8px] font-black uppercase text-[#d9a441] md:text-xl">
                Faça seu pedido
              </p>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 rounded-full bg-[#25D366] px-2 py-1 text-[7px] font-black uppercase text-white md:gap-2 md:px-5 md:py-3 md:text-sm"
              >
                <svg
                  viewBox="0 0 32 32"
                  className="h-3 w-3 fill-white md:h-5 md:w-5"
                  aria-hidden="true"
                >
                  <path d="M16.04 3C8.86 3 3.02 8.83 3.02 16c0 2.29.6 4.53 1.74 6.5L3 29l6.66-1.74A12.94 12.94 0 0 0 16.04 29C23.21 29 29 23.17 29 16S23.21 3 16.04 3Zm0 23.76c-2.04 0-4.03-.55-5.77-1.6l-.41-.24-3.95 1.03 1.05-3.84-.27-.43A10.72 10.72 0 0 1 5.26 16c0-5.94 4.84-10.76 10.78-10.76S26.76 10.06 26.76 16 21.98 26.76 16.04 26.76Zm5.91-8.05c-.32-.16-1.91-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.84 1.05-1.03 1.26-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.49.14-.65.15-.15.32-.38.49-.57.16-.19.21-.32.32-.54.11-.21.05-.4-.03-.57-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.57.08-.86.4-.3.32-1.13 1.1-1.13 2.68s1.16 3.11 1.32 3.32c.16.21 2.29 3.5 5.55 4.9.78.34 1.38.54 1.85.69.78.25 1.49.21 2.05.13.63-.09 1.91-.78 2.18-1.53.27-.75.27-1.4.19-1.53-.08-.14-.29-.22-.61-.38Z" />
                </svg>
                WhatsApp
              </a>

              <p className="mt-1 text-[8px] italic text-[#d9a441] md:mt-4 md:text-3xl">
                A melhor companhia é a sua!
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-5 text-center text-[8px] text-[#d9a441] md:mt-10 md:text-sm md:tracking-[0.45em]">
          ♥ ADEGA DAS MENINAS ♥
        </div>
      </section>
    </main>
  );
}
