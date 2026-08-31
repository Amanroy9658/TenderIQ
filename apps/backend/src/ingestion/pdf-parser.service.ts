import { Injectable, Logger } from '@nestjs/common';
import { DocumentParser, ParsedDocument } from './document-parser.interface';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class PdfDocumentParser implements DocumentParser {
  private readonly logger = new Logger(PdfDocumentParser.name);

  async parse(buffer: Buffer): Promise<ParsedDocument> {
    const pages: { pageNumber: number; text: string }[] = [];
    let currentPage = 1;

    // Custom pagerender to capture text per page
    const render_page = async (pageData: any) => {
      const render_options = {
        normalizeWhitespace: false,
        disableCombineTextItems: false,
      };
      
      try {
        const textContent = await pageData.getTextContent(render_options);
        const text = textContent.items.map((item: any) => item.str).join(' ');
        pages.push({ pageNumber: currentPage, text });
        currentPage++;
        return text;
      } catch (error) {
        this.logger.error(`Error rendering page ${currentPage}`, error);
        pages.push({ pageNumber: currentPage, text: '' });
        currentPage++;
        return '';
      }
    };

    const options = {
      pagerender: render_page,
    };

    const data = await (pdfParse as any)(buffer, options);

    return {
      text: data.text,
      pages,
    };
  }
}
