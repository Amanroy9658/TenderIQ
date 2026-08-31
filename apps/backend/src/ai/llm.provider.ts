import { z } from 'zod';

export interface GenerateStructuredOptions<T extends z.ZodType> {
  prompt: string;
  system?: string;
  schema: T;
  schemaName?: string;
}

export interface LLMProvider {
  /**
   * Generates a structured JSON response matching the provided Zod schema.
   */
  generateStructured<T extends z.ZodType>(options: GenerateStructuredOptions<T>): Promise<z.infer<T>>;
}

export const LLM_PROVIDER = Symbol('LLM_PROVIDER');
