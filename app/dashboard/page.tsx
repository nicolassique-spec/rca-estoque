import { redirect } from 'next/navigation';
import { criarClienteServidor } from '@/lib/supabase/server';
import BotaoSair from '@/components/botao-sair';

export default async function Dashboard() {
  const supabase = criarClienteServidor();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: perfil } = await supabase
    .from('profiles')
    .select('nome, perfil, ativo')
    .eq('id', user.id)
    .single();

  if (!perfil || !perfil.ativo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        
          Sua conta não está ativa. Procure o administrador.
        


        <BotaoSair />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-8 flex items-center justify-between border-b border-yellow-400/30 pb-4">
        <h1 className="text-2xl font-black text-yellow-400">RCA ESTOQUE</h1>
        <BotaoSair />
      </header>

      
        Bem-vindo(a)


        <h2 className="mt-1 text-xl font-bold">{perfil.nome}</h2>
        
          Perfil: {perfil.perfil}
        


      



      
        Próximas etapas: equipamentos, QR Code, solicitações e relatórios.
      


    </main>
  );
}
