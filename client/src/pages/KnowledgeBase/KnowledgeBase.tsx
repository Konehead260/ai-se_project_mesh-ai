import "./KnowledgeBase.css";
import { useState, useEffect } from "react";
import {
  getDocuments,
  type KnowledgeDoc,
  uploadDocument,
} from "../../utils/api";
import UploadArea from "../../components/UploadArea/UploadArea";
import xIcon from "../../assets/Vector.png";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDocuments();
        setDocuments(res.data || []);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await uploadDocument(file);
      if (res.data) {
        const newDocument = res.data;
        setDocuments((prev) => [...prev, newDocument]);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading the file.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="knowledge-base__page">
      <h1 className="knowledge-base__header">Manage Your Knowledge Base</h1>

      <section className="knowledge-base__content">
        <p>Upload documents (PDF)</p>
        <UploadArea onFileSelect={handleFileSelect} isUploading={isUploading} />
      </section>

      <section className="library" aria-label="Uploaded documents">
        {isLoading && <p className="knowledge-base__status">Loading...</p>}
        {!isLoading && error && (
          <p className="knowledge-base__status" role="alert">
            {error}
          </p>
        )}
        {!isLoading && !error && documents.length === 0 && (
          <p className="knowledge-base__status">No documents yet.</p>
        )}
        {!isLoading &&
          !error &&
          documents.map((doc) => (
            <div className="file-upload__div" key={doc._id}>
              <div className="file-upload__text" title={doc.fileName}>
                <span className="file-upload__name">{doc.fileName}</span>
                <button
                  className="file-upload__remove"
                  type="button"
                  aria-label={`Remove ${doc.fileName}`}
                >
                  <img src={xIcon} alt="" />
                </button>
              </div>
            </div>
          ))}
      </section>

    </main>
  );
}