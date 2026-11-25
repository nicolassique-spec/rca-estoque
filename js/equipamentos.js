import { supabase } from './supabase.js';

let usuario = null;
let equipamentos = [];

async function iniciar() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('nome, perfil')
    .eq('id', session.user.id)
    .single();

  usuario = perfil;
  document.getElementById('nome-usuario').textContent =
    perfil ? `${perfil.nome} · ${perfil.perfil}` : '';

  await carregarEquipamentos();
}

async function carregarEquipamentos() {
  const { data, error } = await supabase
    .from('equipamentos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  equipamentos = data || [];
  renderizar(equipamentos);
}

function renderizar(lista) {
  const container = document.getElementById('lista-equipamentos');

  if (!lista.length) {
    container.innerHTML = 'Nenhum equipamento cadastrado ainda.
Toque no + para começar.

';
    return;
  }

  container.innerHTML = lista.map(eq => `
    
      ${eq.foto_url
        ? `<img class="item-foto" src="${eq.foto_url}" alt="">`
        : `

`}
      
        ${eq.nome}


        ${eq.codigo}


        ${eq.categoria}${eq.marca ? ' · ' + eq.marca : ''}


      


      ${eq.status.replace('_', ' ')}
    


  `).join('');
}

document.getElementById('busca').addEventListener('input', (e) => {
  const termo = e.target.value.toLowerCase();
  const filtrados = equipamentos.filter(eq =>
    eq.nome.toLowerCase().includes(termo) ||
    eq.codigo.toLowerCase().includes(termo)
  );
  renderizar(filtrados);
});

async function gerarCodigo(categoria) {
  const prefixos = {
    som: 'SOM', iluminacao: 'ILU', palco: 'PAL',
    estrutura: 'EST', cabo: 'CAB', outro: 'OUT'
  };
  const prefixo = prefixos[categoria] || 'EQP';

  const { count } = await supabase
    .from('equipamentos')
    .select('*', { count: 'exact', head: true })
    .like('codigo', `RCA-${prefixo}-%`);

  const numero = String((count || 0) + 1).padStart(4, '0');
  return `RCA-${prefixo}-${numero}`;
}

const modal = document.getElementById('modal-fundo');
const form = document.getElementById('form-equipamento');

document.getElementById('btn-novo').addEventListener('click', () => {
  form.reset();
  modal.classList.add('aberto');
});

document.getElementById('btn-cancelar').addEventListener('click', () => {
  modal.classList.remove('aberto');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('aberto');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btn-salvar');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  const categoria = document.getElementById('eq-categoria').value;
  const codigo = await gerarCodigo(categoria);

  const { error } = await supabase.from('equipamentos').insert({
    codigo,
    nome: document.getElementById('eq-nome').value.trim(),
    categoria,
    marca: document.getElementById('eq-marca').value.trim() || null,
    modelo: document.getElementById('eq-modelo').value.trim() || null,
    numero_serie: document.getElementById('eq-serie').value.trim() || null,
    valor_locacao: parseFloat(document.getElementById('eq-valor').value) || null,
    observacoes: document.getElementById('eq-obs').value.trim() || null
  });

  btn.disabled = false;
  btn.textContent = 'Salvar';

  if (error) {
    alert('Erro ao salvar: ' + error.message);
    return;
  }

  modal.classList.remove('aberto');
  form.reset();
  await carregarEquipamentos();
});

document.querySelectorAll('.menu-inferior button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-inferior button').forEach(b => b.classList.remove('ativo'));
    document.querySelectorAll('.aba').forEach(a => a.classList.remove('ativa'));
    btn.classList.add('ativo');
    document.getElementById('aba-' + btn.dataset.aba).classList.add('ativa');
  });
});

document.getElementById('btn-sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});

iniciar();
