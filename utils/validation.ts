/**
 * Utilitários de Validação - iSelfToken
 * Validações custom para formulários de autenticação
 * Sem dependências externas, mantendo código limpo
 */

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email é obrigatório';
  }

  // Regex simples para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Digite um email válido';
  }

  if (email.length > 254) {
    return 'Email muito longo';
  }

  return null;
};

/**
 * Valida formato da senha (requisitos básicos)
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Senha é obrigatória';
  }

  if (password.length < 6) {
    return 'Senha deve ter pelo menos 6 caracteres';
  }

  if (password.length > 128) {
    return 'Senha muito longa';
  }

  // Verifica se tem pelo menos um número
  if (!/\d/.test(password)) {
    return 'Senha deve conter pelo menos um número';
  }

  // Verifica se tem pelo menos uma letra
  if (!/[a-zA-Z]/.test(password)) {
    return 'Senha deve conter pelo menos uma letra';
  }

  return null;
};

/**
 * Valida formato da senha forte (requisitos para registro)
 */
export const validateStrongPassword = (password: string): string | null => {
  if (!password) {
    return 'Senha é obrigatória';
  }

  if (password.length < 11) {
    return 'Senha deve ter pelo menos 11 caracteres';
  }

  if (password.length > 128) {
    return 'Senha muito longa';
  }

  // Verifica se tem pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(password)) {
    return 'Senha deve conter pelo menos uma letra maiúscula';
  }

  // Verifica se tem pelo menos um caractere especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Senha deve conter pelo menos um caractere especial';
  }

  // Verifica se tem pelo menos um número
  if (!/\d/.test(password)) {
    return 'Senha deve conter pelo menos um número';
  }

  // Verifica se tem pelo menos uma letra (minúscula)
  if (!/[a-z]/.test(password)) {
    return 'Senha deve conter pelo menos uma letra minúscula';
  }

  return null;
};

/**
 * Valida confirmação de senha
 */
export const validatePasswordConfirmation = (
  password: string, 
  confirmation: string
): string | null => {
  if (!confirmation) {
    return 'Confirme sua senha';
  }

  if (password !== confirmation) {
    return 'As senhas não coincidem';
  }

  return null;
};

/**
 * Valida nome completo
 */
export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Nome é obrigatório';
  }

  if (name.trim().length < 3) {
    return 'Nome deve ter pelo menos 3 caracteres';
  }

  if (name.trim().length > 100) {
    return 'Nome muito longo';
  }

  // Verifica se tem apenas letras e espaços
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim())) {
    return 'Nome deve conter apenas letras';
  }

  return null;
};

/**
 * Interface para resultados de validação
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida formulário de login
 */
export const validateLoginForm = (
  email: string, 
  password: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valida formulário de registro
 */
export const validateRegisterForm = (
  name: string,
  email: string, 
  password: string,
  passwordConfirmation: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  const nameError = validateName(name);
  if (nameError) {
    errors.name = nameError;
  }

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validateStrongPassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmationError = validatePasswordConfirmation(
    password, 
    passwordConfirmation
  );
  if (confirmationError) {
    errors.passwordConfirmation = confirmationError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valida formulário de recuperação de senha
 */
export const validateForgotPasswordForm = (email: string): ValidationResult => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
