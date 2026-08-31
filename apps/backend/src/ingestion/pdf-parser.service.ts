import { Injectable, Logger } from '@nestjs/common';
import { DocumentParser, ParsedDocument } from './document-parser.interface';
// Import removed to use require locally

@Injectable()
export class PdfDocumentParser implements DocumentParser {
  private readonly logger = new Logger(PdfDocumentParser.name);

  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const { PDFParse } = require('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    
    try {
      const data = await parser.getText();

      return {
        text: data.text,
        pages: data.pages.map((p: any) => ({
          pageNumber: p.num,
          text: p.text,
        })),
      };
    } catch (error) {
      this.logger.error('Error parsing PDF', error);
      throw error;
    } finally {
      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
    }
  }
}
