
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileAudio, FileImage, FileVideo, Upload } from 'lucide-react';
import { toast } from 'sonner';

type MediaType = 'image' | 'video' | 'audio' | null;

const MediaUploader = ({ onUploadComplete }: { onUploadComplete: (file: File, type: MediaType) => void }) => {
  const [dragging, setDragging] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    // Check file type
    const fileType = selectedFile.type.split('/')[0];
    let type: MediaType = null;
    
    if (fileType === 'image') type = 'image';
    else if (fileType === 'video') type = 'video';
    else if (fileType === 'audio') type = 'audio';
    
    if (!type) {
      toast.error('Unsupported file type. Please upload an image, video, or audio file.');
      return;
    }
    
    setFile(selectedFile);
    setMediaType(type);
    
    // Create preview
    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else if (type === 'video') {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (file && mediaType) {
      onUploadComplete(file, mediaType);
    }
  };

  const renderPreview = () => {
    if (!preview) return null;
    
    if (mediaType === 'image') {
      return (
        <div className="mt-4">
          <img src={preview} alt="Preview" className="max-h-64 max-w-full mx-auto rounded-md" />
        </div>
      );
    } else if (mediaType === 'video') {
      return (
        <div className="mt-4">
          <video 
            src={preview} 
            controls 
            className="max-h-64 max-w-full mx-auto rounded-md"
          />
        </div>
      );
    }
    
    return null;
  };

  const renderIcon = () => {
    if (mediaType === 'image') return <FileImage className="w-12 h-12 text-ransomguard-purple" />;
    if (mediaType === 'video') return <FileVideo className="w-12 h-12 text-ransomguard-purple" />;
    if (mediaType === 'audio') return <FileAudio className="w-12 h-12 text-ransomguard-purple" />;
    return <Upload className="w-12 h-12 text-ransomguard-purple" />;
  };

  return (
    <Card className="w-full border-dashed border-2 border-ransomguard-purple/30 bg-gray-900">
      <CardHeader>
        <CardTitle className="text-center">Upload Media for Deepfake Detection</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
            dragging ? 'border-ransomguard-purple bg-ransomguard-purple/10' : 'border-gray-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            {renderIcon()}
            
            {file ? (
              <div className="text-center">
                <p className="font-medium">File selected:</p>
                <p className="text-gray-400 text-sm">{file.name}</p>
                <p className="text-gray-400 text-sm">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p>Drag and drop your file here, or</p>
                <label className="block mt-2">
                  <span className="inline-block px-4 py-2 bg-ransomguard-purple text-white rounded-md cursor-pointer hover:bg-ransomguard-deep-purple transition-colors">
                    Browse Files
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </div>
          
          {renderPreview()}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-ransomguard-purple hover:bg-ransomguard-deep-purple"
          disabled={!file}
          onClick={handleUpload}
        >
          Analyze for Deepfakes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MediaUploader;
