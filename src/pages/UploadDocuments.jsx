import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaFileAlt, FaTrash, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/wlogo.png";

const UploadDocuments = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentFileProgress, setCurrentFileProgress] = useState({
    name: "",
    progress: 0,
  });
  const [loadedDocuments, setLoadedDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/documents/list");
      if (response.ok) {
        const data = await response.json();
        setLoadedDocuments(data);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (selectedFiles.length !== pdfFiles.length) {
      alert("Only PDF files are allowed");
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (droppedFiles.length !== pdfFiles.length) {
      alert("Only PDF files are allowed");
    }

    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFileProgress({ name: file.name, progress: 0 });

      try {
        const formData = new FormData();
        formData.append("file", file);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setCurrentFileProgress({ name: file.name, progress });
          }
        });

        await new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => reject(new Error("Upload failed"));

          xhr.open("POST", "http://localhost:8000/api/documents/upload", true);
          xhr.send(formData);
        });
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        alert(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    setFiles([]);
    fetchDocuments();
  };

  const confirmDelete = (pdfName) => {
    setFileToDelete(pdfName);
    setShowModal(true);
  };

  const deleteDocument = async () => {
    if (!fileToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/documents/${encodeURIComponent(
          fileToDelete
        )}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setLoadedDocuments(
          loadedDocuments.filter((doc) => doc.name !== fileToDelete)
        );
        setShowModal(false);
        setFileToDelete(null);
      } else {
        alert("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document");
    }
  };

  const filteredDocuments = loadedDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      <header className="bg-zinc-900/70 backdrop-blur-lg border-b border-blue-500/20 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 filter blur-lg animate-pulse"></div>
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 relative z-10 drop-shadow-glow"
              />
            </div>
            <p className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              GCN
            </p>
          </Link>
          <Link
            to="/home"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/40 hover:to-indigo-600/40 px-4 py-2 rounded-lg transition-all duration-300 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20"
          >
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 rounded-xl p-6 border border-zinc-700/50 shadow-lg mb-8 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-semibold mb-6 text-blue-300">
            Upload Documents
          </h2>

          <div
            className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/60 transition-all"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
            />
            <FaUpload className="mx-auto text-5xl text-blue-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              Drag & Drop PDF Files Here
            </h3>
            <p className="text-gray-400 mb-4">Or click to browse your files</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white font-medium">
              Select PDF Files
            </button>
          </div>

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-300 mb-3">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-zinc-800/60 p-3 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FaFileAlt className="text-red-400 mr-3" />
                      <span className="text-gray-300 truncate max-w-xs">
                        {file.name}
                      </span>
                      <span className="text-gray-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={uploadFiles}
                disabled={uploading}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? "Uploading..." : "Upload All Files"}
              </button>
            </div>
          )}

          {uploading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>{currentFileProgress.name}</span>
                <span>{currentFileProgress.progress}%</span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentFileProgress.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Document Library Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 rounded-xl p-6 border border-zinc-700/50 shadow-lg backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-blue-300">
              Document Library
            </h2>

            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-zinc-800/60 border border-zinc-700/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-300 placeholder-gray-500"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
          </div>

          {loadedDocuments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-zinc-800/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileAlt className="text-3xl text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-400 mb-2">
                No Documents Found
              </h3>
              <p className="text-gray-500">
                Upload some PDF documents to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-zinc-700/50">
                    <th className="text-left py-3 font-medium">
                      Document Name
                    </th>
                    <th className="text-left py-3 font-medium">Size</th>
                    <th className="text-left py-3 font-medium">Chunks</th>
                    <th className="text-right py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc, index) => (
                    <tr
                      key={index}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center">
                          <FaFileAlt className="text-red-400 mr-3" />
                          <span className="text-gray-300">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-400">{doc.size}</td>
                      <td className="py-4 text-gray-400">{doc.chunks}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => confirmDelete(doc.name)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-xl border border-zinc-700 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-300">
              Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-blue-400">{fileToDelete}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteDocument}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;
