import { Module } from '@nestjs/common';
import { STORAGE_PROVIDER } from './storage.provider';
import { LocalFileSystemStorage } from './local-storage.service';

@Module({
  providers: [
    {
      provide: STORAGE_PROVIDER,
      useClass: LocalFileSystemStorage,
    },
  ],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
