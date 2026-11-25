import { supabase } from './supabase.js';

const form = document.getElementById('form-login');
const btn = document.getElementById('btn-entrar');
const msgErro = document.getElementById('msg-erro');

function mostrarErro(texto) {
  msgErro.textContent = texto;
  msgErro.hidden = false;
}

supabase.auth.getSession().then(({ data }) => {
  if (data.session) window.location.href = 'app.html';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgErro.hidden = true;
  btn.disabled = true;
  btn.textContent = 'Entrando...';

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    mostrarErro(
      error.message === 'Invalid login credentials'
        ? 'E-mail ou senha incorretos.'
        : 'Não foi possível entrar. Tente novamente.'
    );
    btn.disabled = false;
    btn.textContent = 'Entrar';
    return;
  }

  window.location.href = 'app.html';
});
