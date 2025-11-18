import { useMemo } from 'react';

/**
 * Interface para requisitos de senha
 */
interface PasswordRequirement {
  id: string;
  label: string;
  regex: RegExp;
  met: boolean;
}

/**
 * Interface para resultado da força da senha
 */
export interface PasswordStrengthResult {
  requirements: PasswordRequirement[];
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  isValid: boolean;
  percentage: number;
}

/**
 * Requisitos para senha forte
 */
const PASSWORD_REQUIREMENTS: Omit<PasswordRequirement, 'met'>[] = [
  {
    id: 'length',
    label: 'Mínimo 11 caracteres',
    regex: /.{11,}/,
  },
  {
    id: 'uppercase',
    label: 'Pelo menos uma letra maiúscula (A-Z)',
    regex: /[A-Z]/,
  },
  {
    id: 'lowercase',
    label: 'Pelo menos uma letra minúscula (a-z)',
    regex: /[a-z]/,
  },
  {
    id: 'number',
    label: 'Pelo menos um número (0-9)',
    regex: /\d/,
  },
  {
    id: 'special',
    label: 'Pelo menos um caractere especial (!@#$%...)',
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  },
];

/**
 * Hook para calcular força da senha e verificar requisitos
 * @param password Senha para analisar
 * @returns Objeto com requisitos, força e validação
 */
export const usePasswordStrength = (password: string): PasswordStrengthResult => {
  const result = useMemo(() => {
    // Verifica cada requisito
    const requirements: PasswordRequirement[] = PASSWORD_REQUIREMENTS.map(req => ({
      ...req,
      met: req.regex.test(password),
    }));

    // Conta requisitos atendidos
    const metRequirements = requirements.filter(req => req.met).length;
    const totalRequirements = requirements.length;
    const percentage = (metRequirements / totalRequirements) * 100;

    // Calcula pontuação base (0-100)
    let score = percentage;

    // Bônus por comprimento extra
    if (password.length >= 15) score += 10;
    if (password.length >= 20) score += 10;

    // Bônus por diversidade de caracteres
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const diversity = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    score += (diversity - 1) * 5; // Bônus de até 15 pontos por diversidade

    // Limita pontuação máxima
    score = Math.min(score, 100);

    // Determina força baseada na pontuação e requisitos
    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    
    if (score >= 80 && metRequirements === totalRequirements) {
      strength = 'strong';
    } else if (score >= 50 && metRequirements >= 3) {
      strength = 'medium';
    }

    const isValid = metRequirements === totalRequirements && password.length <= 128;

    return {
      requirements,
      strength,
      score: Math.round(score),
      isValid,
      percentage,
    };
  }, [password]);

  return result;
};
