/**
 * Implementação do padrão Result para tratamento de erros funcional
 */
export class ResultHelper {
  /**
   * Cria um resultado de sucesso
   */
  static success<T>(data: T): { success: true; data: T } {
    return { success: true, data };
  }

  /**
   * Cria um resultado de erro
   */
  static error<E = Error>(error: E): { success: false; error: E } {
    return { success: false, error };
  }

  /**
   * Executa uma função e retorna um Result
   */
  static tryCatch<T, E = Error>(
    fn: () => T
  ): { success: true; data: T } | { success: false; error: E } {
    try {
      return ResultHelper.success(fn());
    } catch (error) {
      return ResultHelper.error(error as E);
    }
  }

  /**
   * Executa uma função assíncrona e retorna um Result
   */
  static async tryCatchAsync<T, E = Error>(
    fn: () => Promise<T>
  ): Promise<{ success: true; data: T } | { success: false; error: E }> {
    try {
      const data = await fn();
      return ResultHelper.success(data);
    } catch (error) {
      return ResultHelper.error(error as E);
    }
  }
}

