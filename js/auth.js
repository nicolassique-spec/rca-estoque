import { supabase } from './supabase.js';

const form = document.getElementById('form-login');
const btn = document.getElementById('btn-entrar');
const msgErro = document.getElementById('msg-erro');

function mostrarErro(texto) {
  if (msgErro) {
    msgErro.textContent = texto;
    msgErro.hidden = false;
  } else {
    alert(texto);
  }
}

supabase.auth.getSession().then(({ data }) => {
  if (data.session) window.location.href = 'app.html';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (msgErro) msgErro.hidden = true;

  btn.disabled = true;
  btn.textContent = 'Entrando...';

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) {
      mostrarErro(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message
      );
      btn.disabled = false;
      btn.textContent = 'Entrar';
      return;
    }

    if (data.session) {
      window.location.href = 'app.html';
    }
  } catch (err) {
    mostrarErro('Erro de conexão: ' + err.message);
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
});
