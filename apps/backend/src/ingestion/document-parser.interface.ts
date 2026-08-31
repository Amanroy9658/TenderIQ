export interface ParsedDocument {
  text: string;
  pages: {
    pageNumber: number;
    text: string;
  }[];
}

export interface DocumentParser {
  /**
   * Parses a document buffer and extracts text, preserving page boundaries.
   * @param buffer The file buffer (e.g., PDF)
   */
  parse(buffer: Buffer): Promise<ParsedDocument>;
}

export const DOCUMENT_PARSER = Symbol('DOCUMENT_PARSER');
