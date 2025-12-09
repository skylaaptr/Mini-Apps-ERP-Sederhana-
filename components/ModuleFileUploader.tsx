import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons';

interface ModuleFileUploaderProps {
  onFileSelect: (file: File) => void;
  accept: string;
  label?: string;
}

const ModuleFileUploader: React.FC<ModuleFileUploaderProps> = ({ onFileSelect, accept, label = "Upload File" }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndUpload = (file: File) => {
      setError(null);
      setSuccess(null);
      
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const acceptedExtensions = accept.split(',').map(e => e.trim().toLowerCase());
      
      // Simple validation: if accept is provided, check if extension is in list
      if (accept && !acceptedExtensions.includes(fileExtension)) {
           setError(`Invalid file type. Accepted: ${accept}`);
           return;
      }
      
      onFileSelect(file);
      setSuccess(`File "${file.name}" processed successfully.`);
      setTimeout(() => setSuccess(null), 3000);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
      e.target.value = ''; // Reset
    }
  };

  return (
    <div className="w-full mb-6">
        <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleChange} />
            <div 
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${dragActive ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-8 h-8 mb-3 text-gray-400"/>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-primary">{label}</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">Supported formats: {accept}</p>
                </div>
            </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-2 text-sm text-green-600 font-medium">{success}</p>}
    </div>
  );
};

export default ModuleFileUploader;