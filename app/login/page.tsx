'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { criarClienteNavegador } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCarregando(true);

    const supabase = criarClienteNavegador();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert('E-mail ou senha inválidos.');
      setCarregando(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      
        <h1 className="mb-2 text-center text-4xl font-black tracking-wide text-yellow-400">
          RCA ESTOQUE
        </h1>
        Acesso restrito à equipe



        <form onSubmit={entrar} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-yellow-400/40 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-yellow-400/40 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
          />

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-yellow-400 py-3 font-bold text-black disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      


    </main>
  );
}
