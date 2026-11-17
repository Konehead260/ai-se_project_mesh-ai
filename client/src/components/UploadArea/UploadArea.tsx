import "./UploadArea.css";
import { useRef, useState } from "react";

type Props = {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
};

export default function UploadArea({ onFileSelect, isUploading }: Props) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const validationInProgress = useRef(false);

  const validateAndSelect = async (file: File) => {
    if (isUploading || validationInProgress.current) return;

    setValidationError(null);
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setValidationError("Please select a PDF file.");
      return;
    }

    validationInProgress.current = true;
    setIsValidating(true);
    try {
      const header = await file.slice(0, 1024).text();
      if (!header.includes("%PDF-")) {
        setValidationError("This file is not a valid PDF.");
        return;
      }

      onFileSelect(file);
    } catch {
      setValidationError("Unable to validate this file. Please try again.");
    } finally {
      validationInProgress.current = false;
      setIsValidating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (file) void validateAndSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isUploading || validationInProgress.current) return;
    const file = e.dataTransfer.files?.[0];
    if (file) void validateAndSelect(file);
  };

  return (
    <div
      className="upload-area"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <label className="upload-area__label">
        {isUploading || isValidating ? (
          <span className="upload-area__status" role="status">
            {isUploading ? "Uploading..." : "Checking PDF..."}
          </span>
        ) : (
          <>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M16 16L12 12L8 16M12 12V21M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935"
                stroke="#1C1C1C"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="upload-area__prompt">
              Drag and drop a PDF, or{" "}
            </span>
            <span className="upload-area__prompt underline">Upload</span>
          </>
        )}
        <input
          type="file"
          accept=".pdf,application/pdf"
          className="upload-area__input"
          disabled={isUploading || isValidating}
          onChange={handleChange}
        />
      </label>
      {validationError && (
        <p className="upload-area__error" role="alert">
          {validationError}
        </p>
      )}
    </div>
  );
}
