import { Injectable, Inject } from '@nestjs/common';
import { DOCUMENT_PARSER, type DocumentParser } from './document-parser.interface';
import { STORAGE_PROVIDER, type StorageProvider } from '../storage/storage.provider';
import { PrismaService } from '../prisma/prisma.service';
import { RequirementsService } from '../requirements/requirements.service';

@Injectable()
export class IngestionService {
  constructor(
    @Inject(DOCUMENT_PARSER) private readonly parser: DocumentParser,
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
    private readonly prisma: PrismaService,
    private readonly requirementsService: RequirementsService,
  ) {}

  async ingestTenderDocument(tenderId: string, filename: string, buffer: Buffer, fileType: string) {
    // 1. Save document to storage
    const fileUrl = await this.storage.saveFile(filename, buffer);

    // 2. Parse document text and pages
    const parsedDoc = await this.parser.parse(buffer);

    // 3. Save to database
    const document = await this.prisma.tenderDocument.create({
      data: {
        tenderId,
        title: filename,
        fileUrl,
        fileType,
      },
    });

    // 4. Save sections (pages)
    // We treat each page as a section for provenance tracking
    const sectionsData = parsedDoc.pages.map((page: any) => ({
      documentId: document.id,
      title: `Page ${page.pageNumber}`,
      content: page.text,
      pageNumber: page.pageNumber,
    }));

    if (sectionsData.length > 0) {
      await this.prisma.tenderSection.createMany({
        data: sectionsData,
      });
      
      // 5. Trigger AI requirement extraction asynchronously
      // In a production system, this should be a queue job.
      this.requirementsService.extractRequirementsForTender(tenderId).catch(err => {
        console.error('Failed to extract requirements asynchronously:', err);
      });
    }

    return {
      documentId: document.id,
      fileUrl,
      pagesExtracted: sectionsData.length,
    };
  }
}
