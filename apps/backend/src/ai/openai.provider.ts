import { Injectable, Logger } from '@nestjs/common';
import { LLMProvider, GenerateStructuredOptions } from './llm.provider';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

@Injectable()
export class OpenAILLMProvider implements LLMProvider {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenAILLMProvider.name);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build', // Fallback for build
    });
  }

  async generateStructured<T extends z.ZodType>(options: GenerateStructuredOptions<T>): Promise<z.infer<T>> {
    const jsonSchema = zodToJsonSchema(options.schema as any, options.schemaName || 'StructuredOutput');
    
    // We use the JSON schema structure OpenAI expects for structured outputs
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: options.system || 'You are a helpful assistant.' },
        { role: 'user', content: options.prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: options.schemaName || 'StructuredOutput',
          schema: jsonSchema as Record<string, any>,
          strict: true,
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from LLM');
    }

    try {
      const parsed = JSON.parse(content);
      return options.schema.parse(parsed);
    } catch (e) {
      this.logger.error('Failed to parse LLM structured output', e);
      throw e;
    }
  }
}
