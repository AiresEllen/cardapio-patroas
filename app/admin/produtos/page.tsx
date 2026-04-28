"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

const ADMIN_UID = "14F8OZ70eNSDCyCeDZ3lQ89p1AO2";

export default function AdminProdutosPage() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [order, setOrder] = useState("1");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user || user.uid !== ADMIN_UID) {
        router.push("/admin/login");
        return;
      }

      setChecking(false);
      load();
    });

    return () => unsub();
  }, [router]);

  async function load() {
    const catSnap = await getDocs(collection(db, "patroas_categories"));
    const prodSnap = await getDocs(collection(db, "patroas_products"));

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

  async function criarProduto(e: React.FormEvent) {
    e.preventDefault();

    await addDoc(collection(db, "patroas_products"), {
      name,
      slug: name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-"),
      categorySlug,
      price: Number(price),
      promotionPrice: null,
      order: Number(order),
      active: true,
    });

    setName("");
    setPrice("");
    setCategorySlug("");
    setOrder("1");

    load();
  }

  async function editarPreco(id: string, priceAtual: number) {
    const novoPreco = prompt("Digite o novo preço:", String(priceAtual));

    if (!novoPreco) return;

    await updateDoc(doc(db, "patroas_products", id), {
      price: Number(novoPreco.replace(",", ".")),
    });

    load();
  }

  async function alternarStatus(id: string, active: boolean) {
    await updateDoc(doc(db, "patroas_products", id), {
      active: !active,
    });

    load();
  }

  async function deletarProduto(id: string) {
    const confirmar = confirm("Deseja realmente excluir este produto?");
    if (!confirmar) return;

    await deleteDoc(doc(db, "patroas_products", id));
    load();
  }

  async function sair() {
    await signOut(auth);
    router.push("/admin/login");
  }

  const grouped = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      items: products.filter((p) => p.categorySlug === cat.slug),
    }));
  }, [categories, products]);

  function formatMoney(value: number) {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Verificando acesso...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-[28px] border border-[#d9a441]/40 bg-zinc-950 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/patroas-do-gole.jpeg.jpeg"
              alt="Patroas do Gole"
              className="h-20 w-20 rounded-2xl object-cover"
            />

            <div>
              <h1 className="text-3xl font-black text-[#d9a441]">
                Painel de Produtos
              </h1>
              <p className="text-sm text-zinc-400">
                Gerencie produtos, preços e categorias do cardápio.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href="/cardapio"
              target="_blank"
              className="rounded-xl border border-[#d9a441]/50 px-4 py-2 text-sm font-bold text-[#d9a441]"
            >
              Ver cardápio
            </a>

            <button
              onClick={sair}
              className="rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white"
            >
              Sair
            </button>
          </div>
        </header>

        <form
          onSubmit={criarProduto}
          className="mb-8 rounded-[28px] border border-pink-500/30 bg-zinc-950 p-5 shadow-2xl"
        >
          <h2 className="mb-5 text-xl font-black text-pink-500">
            Novo Produto
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            <input
              placeholder="Nome do produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-black p-3 text-white outline-none focus:border-pink-500"
              required
            />

            <input
              placeholder="Preço"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-black p-3 text-white outline-none focus:border-pink-500"
              required
            />

            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-black p-3 text-white outline-none focus:border-pink-500"
              required
            >
              <option value="">Categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Ordem"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-black p-3 text-white outline-none focus:border-pink-500"
            />
          </div>

          <button className="mt-4 rounded-xl bg-pink-500 px-6 py-3 font-bold text-white hover:bg-pink-600">
            Criar Produto
          </button>
        </form>

        <div className="grid gap-6 md:grid-cols-2">
          {grouped.map((cat) => (
            <section
              key={cat.id}
              className="rounded-[28px] border border-[#d9a441]/30 bg-zinc-950 p-5"
            >
              <h2
                className={`mb-4 text-2xl font-black uppercase ${
                  cat.slug === "cervejas" || cat.slug === "vinhos"
                    ? "text-[#d9a441]"
                    : "text-pink-500"
                }`}
              >
                {cat.name}
              </h2>

              <div className="space-y-3">
                {cat.items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-500">
                    Nenhum produto cadastrado.
                  </p>
                )}

                {cat.items.map((p: any) => (
                  <div
                    key={p.id}
                    className={`rounded-2xl border p-4 ${
                      p.active
                        ? "border-zinc-800 bg-black"
                        : "border-red-500/30 bg-red-950/20 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-bold text-white">{p.name}</h3>
                        <p className="text-sm text-[#d9a441]">
                          {formatMoney(p.price)}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Ordem: {p.order || 1} •{" "}
                          {p.active ? "Ativo" : "Inativo"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => editarPreco(p.id, p.price)}
                          className="rounded-xl bg-[#d9a441] px-3 py-2 text-xs font-bold text-black"
                        >
                          Editar preço
                        </button>

                        <button
                          onClick={() => alternarStatus(p.id, p.active)}
                          className="rounded-xl bg-zinc-700 px-3 py-2 text-xs font-bold text-white"
                        >
                          {p.active ? "Desativar" : "Ativar"}
                        </button>

                        <button
                          onClick={() => deletarProduto(p.id)}
                          className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
