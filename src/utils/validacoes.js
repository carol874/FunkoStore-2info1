export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function isValidPhone(phone) {
  const cleanPhone = String(phone || '').replace(/\D/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
}

export function validarUsuario(dados, { requirePassword = true } = {}) {
  const errors = {};

  const nome = String(dados?.nome || '').trim();
  const email = String(dados?.email || '').trim();
  const senha = String(dados?.senha || '');
  const telefone = String(dados?.telefone || '').trim();

  if (!nome) {
    errors.nome = 'Nome é obrigatório.';
  }

  if (!email) {
    errors.email = 'E-mail é obrigatório.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (requirePassword && senha.length < 6) {
    errors.senha = 'A senha deve ter pelo menos 6 caracteres.';
  }

  if (telefone && !isValidPhone(telefone)) {
    errors.telefone = 'Telefone inválido. Digite com DDD e número.';
  }

  return errors;
}
