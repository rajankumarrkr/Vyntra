import { useState, useRef } from "react";
import API from "../services/api";

function CreatePost({ onPostCreated }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);
      await API.post("/posts", formData);
      setSuccess(true);
      setImage(null);
      setPreview(null);
      setCaption("");
      setTimeout(() => {
        setSuccess(false);
        if (onPostCreated) onPostCreated();
      }, 1800);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="create-header">New Post</div>

      {success && (
        <div className="alert-success animate-fadeIn" style={{ marginBottom: 16 }}>
          ✅ Post shared successfully! Redirecting…
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Drop zone */}
        <div
          className={`dropzone ${dragOver ? "over" : ""}`}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {preview ? (
            <div className="dropzone-preview">
              <img src={preview} alt="preview" />
              <div className="dropzone-overlay">Click to change image</div>
            </div>
          ) : (
            <div className="dropzone-placeholder">
              <div className="dropzone-icon">
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="dropzone-title">Drop your image here</div>
              <div className="dropzone-sub">or click to browse — JPG, PNG, WEBP</div>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="form-group">
          <label className="label">Caption</label>
          <textarea
            className="input"
            placeholder="Write a caption…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading || !image}>
          {loading ? <><span className="spinner" />Uploading…</> : "Share Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;