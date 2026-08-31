'use client';
import { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';

interface FileUploadProps {
  endpoint: string;
  onSuccess?: () => void;
  label?: string;
}

export function FileUpload({ endpoint, onSuccess, label = "Upload PDF" }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }
      
      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => {
        setIsSuccess(false);
        setFile(null);
      }, 3000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isSuccess 
            ? 'border-green-500 bg-green-50/10' 
            : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
        } transition-colors`}
      >
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center space-y-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-8 w-8" />
            <p className="text-sm font-medium">Successfully Processed</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <UploadCloud className="h-8 w-8 text-neutral-400" />
            <div className="space-y-1">
              <label className="text-sm font-medium cursor-pointer hover:underline text-neutral-900 dark:text-neutral-50">
                <span>{label}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                />
              </label>
              <p className="text-xs text-neutral-500">PDFs up to 10MB</p>
            </div>
            
            {file && (
              <div className="flex items-center gap-2 mt-2 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded text-sm">
                <span className="truncate max-w-[200px]">{file.name}</span>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded text-xs font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm'}
                </button>
              </div>
            )}
            
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
