/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { SERVER_URL } from "../../../config";

export default function ImageUpload({
  onUpload,
  disabled = false,
}: {
  onUpload: (url: string | null) => void; // allow null for clear
  disabled?: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Drop handler just sets preview and selectedFile, no upload yet
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: disabled || !!uploadedUrl, // disable dropzone if already uploaded
  });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("files", selectedFile);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await axios.post(`${SERVER_URL}/api/blogs/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const imageUrl = res.data.url;
      setUploadedUrl(imageUrl);  // Store uploaded URL
      onUpload(imageUrl);
      setSelectedFile(null);
      setPreview("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview("");
    setUploadedUrl("");
    setError("");
    onUpload(null); // Inform parent no URL now
  };

  // Render when image is already uploaded
  if (uploadedUrl) {
    return (
      <div className="mb-4 text-center">
        <img
          src={uploadedUrl}
          alt="Uploaded"
          className="mx-auto mb-2 max-h-48 rounded"
        />
        <p className="break-all text-sm mb-4">{uploadedUrl}</p>
        <button
          onClick={handleClear}
          disabled={disabled || uploading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
          type="button"
        >
          Delete / Clear
        </button>
      </div>
    );
  }

  // Render uploader when no image uploaded yet
  return (
    <div className="mb-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-5 text-center rounded ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : isDragActive
            ? "bg-muted"
            : "cursor-pointer"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive
          ? "Drop image here"
          : preview
          ? <img src={preview} alt="Preview" className="mx-auto mb-2 max-h-36 rounded" />
          : "Drag & drop or click to select an image"}
      </div>

      {preview && !uploading && (
        <button
          onClick={handleUpload}
          disabled={disabled}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          type="button"
        >
          Upload Image
        </button>
      )}

      {uploading && <p className="mt-2 text-center">Uploading image...</p>}

      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
}
