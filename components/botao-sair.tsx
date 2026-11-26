'use client';

import { useRouter } from 'next/navigation';
import { criarClienteNavegador } from '@/lib/supabase/client';

export default function BotaoSair() {
  const router = useRouter();

  async function sair() {
    const supabase = criarClienteNavegador();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      className="rounded-lg border border-yellow-400 px-4 py-2 font-semibold text-yellow-400"
    >
      Sair
    </button>
  );
}
