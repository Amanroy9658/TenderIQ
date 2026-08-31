export interface StorageProvider {
  /**
   * Saves a file to the underlying storage.
   * @param filename The original filename or a unique identifier
   * @param buffer The file contents
   * @returns A promise that resolves to the storage URL/path
   */
  saveFile(filename: string, buffer: Buffer): Promise<string>;

  /**
   * Retrieves a file from the underlying storage.
   * @param fileUrl The storage URL/path
   * @returns A promise that resolves to the file contents
   */
  getFile(fileUrl: string): Promise<Buffer>;
}

export const STORAGE_PROVIDER = Symbol('STORAGE_PROVIDER');
