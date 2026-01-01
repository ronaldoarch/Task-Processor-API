/**
 * Gerador de IDs único usando crypto API
 */
export class IdGenerator {
  /**
   * Gera um ID único usando crypto.randomUUID()
   */
  static generate(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback para ambientes sem crypto.randomUUID
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Valida se uma string é um ID válido
   */
  static isValid(id: string): boolean {
    return typeof id === 'string' && id.length > 0;
  }
}

