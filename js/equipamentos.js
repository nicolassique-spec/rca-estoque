import { supabase } from './supabase.js';

const $ = (id) => document.getElementById(id);

let equipamentos = [];
let usuarioLogado = null;

/* ================= NAVEGAÇÃO ENTRE ABAS ================= */
function trocarAba(nome) {
  if (!nome) return;

  document.querySelectorAll('.aba').forEach((aba) => {
    aba.classList.toggle('ativa', aba.id === 'aba-' + nome);
  });

  document.querySelectorAll('.menu-inferior button').forEach((b) => {
    b.classList.toggle('ativo', b.dataset.aba === nome);
  });

  if (nome === 'equipamentos') carregarEquipamentos();
}

const nav = document.querySelector('.menu-inferior');
if (nav) {
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-aba]');
    if (btn) trocarAba(btn.dataset.aba);
  });
}

/* ================= LISTAGEM ================= */
async function carregarEquipamentos() {
  const container = $('lista-equipamentos');
  if (!container) return;

  const { data, error } = await supabase
    .from('equipamentos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) {
    container.innerHTML = `Erro ao carregar: ${error.message}

`;
    return;
  }

  equipamentos = data || [];
  renderizar(equipamentos);
}

function renderizar(lista) {
  const container = $('lista-equipamentos');
  if (!container) return;

  if (!lista.length) {
    container.innerHTML =
      'Nenhum equipamento cadastrado ainda.
Toque no + para começar.

';
    return;
  }

  container.innerHTML = lista.map((eq) => {
    const status = (eq.status || 'disponivel').replace('_', ' ');
    const meta = [eq.categoria, eq.marca].filter(Boolean).join(' · ');
    const foto = eq.foto_url
      ? `<img class="item-foto" src="${eq.foto_url}" alt="">`
      : '

';

    return `
      ${foto}
      
        ${eq.nome ?? ''}


        ${eq.codigo ?? ''}


        ${meta}


      


      ${status}
    

`;
  }).join('');
}

const busca = $('busca');
if (busca) {
  busca.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase().trim();
    renderizar(
      equipamentos.filter(
        (eq) =>
          (eq.nome || '').toLowerCase().includes(termo) ||
          (eq.codigo || '').toLowerCase().includes(termo)
      )
    );
  });
}

/* ================= MODAL ================= */
const modal = $('modal-fundo');
const form = $('form-equipamento');

function abrirModal() {
  if (!modal) return;
  if (form) form.reset();
  modal.classList.add('aberto');
}

function fecharModal() {
  if (modal) modal.classList.remove('aberto');
}

const btnNovo = $('btn-novo');
if (btnNovo) btnNovo.addEventListener('click', abrirModal);

const btnCancelar = $('btn-cancelar');
if (btnCancelar) btnCancelar.addEventListener('click', fecharModal);

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
  });
}

/* ================= CÓDIGO AUTOMÁTICO ================= */
async function gerarCodigo(categoria) {
  const prefixos = {
    som: 'SOM',
    iluminacao: 'ILU',
    palco: 'PAL',
    estrutura: 'EST',
    cabo: 'CAB',
    outro: 'OUT'
  };
  const prefixo = prefixos[categoria] || 'EQP';

  const { count } = await supabase
    .from('equipamentos')
    .select('*', { count: 'exact', head: true })
    .like('codigo', `RCA-${prefixo}-%`);

  return `RCA-${prefixo}-${String((count || 0) + 1).padStart(4, '0')}`;
}

/* ================= SALVAR ================= */
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = $('btn-salvar');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Salvando...';
    }

    const categoria = $('eq-categoria') ? $('eq-categoria').value : '';
    const codigo = await gerarCodigo(categoria);

    const { error } = await supabase.from('equipamentos').insert({
      codigo,
      nome: $('eq-nome') ? $('eq-nome').value.trim() : '',
      categoria,
      marca: $('eq-marca') ? $('eq-marca').value.trim() || null : null,
      modelo: $('eq-modelo') ? $('eq-modelo').value.trim() || null : null,
      numero_serie: $('eq-serie') ? $('eq-serie').value.trim() || null : null,
      valor_locacao: $('eq-valor') ? parseFloat($('eq-valor').value) || null : null,
      observacoes: $('eq-obs') ? $('eq-obs').value.trim() || null : null
    });

    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Salvar';
    }

    if (error) {
      alert('Erro ao salvar: ' + error.message);
      return;
    }

    fecharModal();
    if (form) form.reset();
    await carregarEquipamentos();
  });
}

/* ================= SAIR ================= */
const btnSair = $('btn-sair');
if (btnSair) {
  btnSair.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });
}

/* ================= INICIAR ================= */
async function iniciar() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    window.location.href = 'index.html';
    return;
  }

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('nome, perfil')
    .eq('id', data.session.user.id)
    .maybeSingle();

  usuarioLogado = perfil;

  const nomeEl = $('nome-usuario');
  if (nomeEl) {
    nomeEl.textContent = perfil
      ? `${perfil.nome} · ${perfil.perfil}`
      : data.session.user.email;
  }

  await carregarEquipamentos();
}

iniciar();
