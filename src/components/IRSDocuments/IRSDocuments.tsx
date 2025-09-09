import React from "react";
import { FileText, Upload, Calendar, AlertCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

const IRSDocuments: React.FC = () => {
  const { documents, addDocument } = useAppStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Simulate document processing
      addDocument({
        name: file.name,
        year: new Date().getFullYear(),
        type: "Other",
        status: "processing",
        fileSize: file.size,
      });

      // Simulate processing completion
      setTimeout(() => {
        useAppStore
          .getState()
          .updateDocument(documents[documents.length]?.id || "", {
            status: "ready",
          });
      }, 2000);
    });
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "W-2":
        return "📄";
      case "1099":
        return "📋";
      case "1040":
        return "📊";
      default:
        return "📑";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "uploaded":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="h-5 w-5 text-irs-600" />
          IRS Documents
        </h2>
        <label className="btn-primary cursor-pointer">
          <Upload className="h-4 w-4 mr-2" />
          Upload Documents
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            No documents uploaded yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Upload your IRS forms to start asking questions
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">
                    {getDocumentIcon(doc.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {doc.type}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2",
                    getStatusColor(doc.status)
                  )}
                >
                  {doc.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {doc.year}
                </div>
                {doc.fileSize && (
                  <div>{(doc.fileSize / 1024 / 1024).toFixed(1)} MB</div>
                )}
              </div>

              {doc.status === "processing" && (
                <div className="mt-3 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Processing document...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IRSDocuments;
