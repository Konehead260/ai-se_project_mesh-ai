import "./KnowledgeBase.css";
import { useState, useEffect } from "react";
import { getDocuments, type KnowledgeDoc } from "../../utils/api";
import UploadArea from "../../components/UploadArea/UploadArea";
import xIcon from "../../assets/Vector.png";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleFileSelect = (file: File) => {
    const newDoc: KnowledgeDoc = {
      _id: Date.now().toString(),
      title: file.name,
      fileName: file.name,
      userId: "local",
      createdAt: new Date().toISOString(),
    };
    setDocuments((currentDocuments) => [newDoc, ...currentDocuments]);
  };

  return (
    <main className="knowledge-base__page">
      <h1 className="knowledge-base__header">Manage Your Knowledge Base</h1>

      <section className="knowledge-base__content">
        <p>Upload documents (PDF)</p>
        <UploadArea onFileSelect={handleFileSelect} />
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

      <button className="save-btn" type="button">
        Save
      </button>
    </main>
  );
}