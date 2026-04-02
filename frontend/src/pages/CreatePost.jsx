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
    if (!image || loading) return;
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
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ig-main" style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Create New Post</h2>
        <button 
          className="nav-icon-btn" 
          onClick={() => onPostCreated()}
          style={{ padding: 4 }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      {success && (
        <div className="glass-strong animate-fadeIn" style={{ padding: 20, borderRadius: 16, marginBottom: 24, textAlign: "center", border: "1px solid var(--success)", background: "rgba(0, 200, 83, 0.1)", color: "var(--success)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
          <p style={{ fontWeight: 700 }}>Shared successfully! Redirecting…</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }} className="animate-fadeIn">
        <div 
          style={{ 
            aspectRatio: "1/1", 
            borderRadius: 20, 
            border: dragOver ? "3px dashed var(--accent)" : "2px dashed var(--border)",
            background: dragOver ? "var(--accent-light)" : "var(--surface)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden", cursor: "pointer",
            transition: "var(--transition)"
          }}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input 
            ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} 
            onChange={(e) => handleFile(e.target.files[0])} 
          />

          {preview ? (
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div className="glass-strong" style={{ 
                position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", 
                padding: "8px 20px", borderRadius: 30, fontSize: 13, fontWeight: 700, 
                boxShadow: "var(--shadow-md)", color: "#fff", background: "rgba(0,0,0,0.5)"
              }}>
                Edit Image
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ 
                width: 64, height: 64, borderRadius: "50%", background: "var(--bg-sub)", 
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" 
              }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Drag & drop or Click to upload</p>
              <p style={{ fontSize: 14, color: "var(--text-muted)" }}>JPG, PNG or WEBP (Max 10MB)</p>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="label">Add Caption</label>
          <textarea 
            className="input" 
            placeholder="What's on your mind?..." 
            rows="4"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ resize: "none", fontSize: 15, borderRadius: 16 }}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading || !image} style={{ padding: 18, fontSize: 16 }}>
          {loading ? <><span className="spinner" />Uploading Studio Quality Post…</> : "Share to Feed"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;