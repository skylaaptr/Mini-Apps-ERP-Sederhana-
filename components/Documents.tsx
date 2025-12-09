
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DocumentFile, User } from '../types';
import { UploadIcon, DownloadIcon } from './icons';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.xlsx', '.csv', '.docx', '.jpg', '.jpeg', '.png'];


const Documents: React.FC<{ user: User | null }> = ({ user }) => {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const storedFiles = localStorage.getItem('erp-documents');
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
      }
    } catch (e) {
      console.error("Failed to parse documents from localStorage", e);
    }
  }, []);

  useEffect(() => {
    // Revoke old object URLs on unmount to prevent memory leaks
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.url));
    };
  }, [files]);


  const handleFileUpload = useCallback((uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    const file = uploadedFiles[0];
    setError(null);

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError(`File type not supported. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
      return;
    }

    const newFile: DocumentFile = {
      id: new Date().toISOString() + '-' + file.name,
      nama_file: file.name,
      tipe_file: file.type,
      ukuran: file.size,
      tanggal_upload: new Date().toLocaleDateString(),
      diupload_oleh: user?.username || 'Unknown',
      url: URL.createObjectURL(file), // Create a temporary URL for the file
    };

    setFiles(prevFiles => {
      const updatedFiles = [...prevFiles, newFile];
      // We can't store the File object itself in localStorage, but we can store the metadata.
      // The object URL will be invalid on page refresh. For a real app, you'd upload to a server.
      // For this simulation, we will re-parse localStorage on load but downloads won't persist across sessions.
      // A better simulation would be to use FileReader and store base64, but that hits localStorage limits fast.
      // This is a reasonable compromise.
      
      const storableFiles = updatedFiles.map(({url, ...rest}) => rest); // Don't store URL
      localStorage.setItem('erp-documents', JSON.stringify(storableFiles));
      
      // We keep the URL in the component state for active session downloads.
      return updatedFiles;
    });

  }, [user]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };
  
  const onButtonClick = () => {
    inputRef.current?.click();
  };


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-dark">Document Management</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dark mb-4">Upload New Document</h2>
        <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input ref={inputRef} type="file" id="input-file-upload" className="hidden" onChange={handleChange} />
            <label id="label-file-upload" htmlFor="input-file-upload" 
                className={`h-48 block text-center border-2 border-dashed rounded-lg cursor-pointer
                ${dragActive ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <div className="flex flex-col items-center justify-center h-full">
                    <UploadIcon className="w-12 h-12 text-gray-400"/>
                    <p className="font-semibold text-medium">
                      <span className="text-primary hover:underline" onClick={onButtonClick}>Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, XLSX, CSV, DOCX, JPG, PNG (MAX. 10MB)</p>
                </div>
            </label>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-dark mb-4">Uploaded Files</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No documents uploaded yet.</td>
                </tr>
              ) : (
                files.map(file => (
                  <tr key={file.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.nama_file}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.tipe_file}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${(file.ukuran / 1024).toFixed(2)} KB`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.tanggal_upload}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.diupload_oleh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href={file.url} download={file.nama_file} className="text-primary hover:text-primary-dark inline-flex items-center gap-1">
                        <DownloadIcon className="w-4 h-4" />
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;
