import { Module } from '@nestjs/common';
import { LLM_PROVIDER } from './llm.provider';
import { OpenAILLMProvider } from './openai.provider';

@Module({
  providers: [
    {
      provide: LLM_PROVIDER,
      useClass: OpenAILLMProvider,
    },
  ],
  exports: [LLM_PROVIDER],
})
export class AiModule {}
