import { Upload } from "lucide-react";
import { useRef } from "react";

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onFilesChange: (files: File[]) => void;
  maxSizeMB?: number;
}

export function FileUpload({
  label,
  accept = "image/*",
  multiple = true,
  onFilesChange,
  maxSizeMB = 5,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesChange(files);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      <div
        onClick={handleClick}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-teal-600 mb-1">
          Click to upload
        </p>
        <p className="text-xs text-gray-500">
          SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
        </p>
      </div>
    </div>
  );
}
