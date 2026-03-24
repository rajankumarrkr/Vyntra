import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function StoryItem({ name, active = true }) {
  const initials = name ? name.slice(0, 2).toUpperCase() : "??";
  return (
    <div className="story-item">
      <div className="story-ring" style={{ background: active ? "var(--ig-gradient)" : "#262626" }}>
        <div className="story-avatar">
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700" }}>
            {initials}
          </div>
        </div>
      </div>
      <span className="story-username">{name}</span>
    </div>
  );
}

function StoriesBar() {
  const mockStories = ["Your Story", "cristiano", "leomessi", "natgeo", "nasa", "nike", "apple"];
  return (
    <div className="stories-container glass-strong" style={{ border: "1px solid var(--border)", borderRadius: "8px", background: "var(--surface)", marginBottom: "24px" }}>
      {mockStories.map((s, i) => (
        <StoryItem key={i} name={s} active={i > 0} />
      ))}
    </div>
  );
}

function PostCard({ post }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes?.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount(c => wasLiked ? c - 1 : c + 1);
    try { await API.post(`/posts/${post._id}/like`); }
    catch (_) { setLiked(wasLiked); setLikeCount(c => wasLiked ? c + 1 : c - 1); }
  };

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/posts/${post._id}/comments`);
      setComments(data);
    } catch (_) {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await API.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText("");
      fetchComments();
    } catch (_) {}
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-user-info">
          <div className="post-avatar-small">
            <div className="post-avatar-inner">
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" }}>
                {post.user?.username?.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
          <span style={{ fontSize: "14px", fontWeight: "700" }}>{post.user?.username}</span>
        </div>
        <button className="nav-icon-btn">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
      </div>

      {/* Image */}
      <div className="post-img-container" onDoubleClick={handleLike}>
        <img src={post.image} alt="post" className="post-img" />
      </div>

      {/* Actions */}
      <div className="post-actions-row">
        <div className="post-actions-left">
          <button onClick={handleLike} className="nav-icon-btn" style={{ color: liked ? "var(--danger)" : "var(--text)" }}>
            {liked ? (
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 000-7.78v0z"/></svg>
            )}
          </button>
          <button className="nav-icon-btn" onClick={() => { if(!showComments) fetchComments(); setShowComments(!showComments); }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-11.5 8.38 8.38 0 013.9.9L22 3l-1.5 5.5L21 11.5z"/></svg>
          </button>
          <button className="nav-icon-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
        <button className="nav-icon-btn">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"/></svg>
        </button>
      </div>

      {/* Likes */}
      <div className="post-likes">{likeCount.toLocaleString()} likes</div>

      {/* Caption */}
      <div className="post-caption-area">
        <strong>{post.user?.username}</strong> {post.caption}
      </div>

      {/* View Comments */}
      {comments.length > 0 && !showComments && (
        <button className="view-comments-btn" onClick={() => { fetchComments(); setShowComments(true); }}>
          View all {comments.length} comments
        </button>
      )}

      {showComments && (
        <div style={{ padding: "0 12px", marginBottom: "8px" }}>
          {comments.map((c, i) => (
            <div key={i} style={{ fontSize: "14px", marginBottom: "4px" }}>
              <strong>{c.user?.username}</strong> {c.text}
            </div>
          ))}
          <form onSubmit={handleComment} style={{ marginTop: "8px" }}>
            <input 
              placeholder="Add a comment..." 
              value={commentText} 
              onChange={(e) => setCommentText(e.target.value)}
              style={{ background: "none", border: "none", color: "var(--text)", fontSize: "13px", width: "100%", outline: "none", padding: "8px 0", borderTop: "1px solid var(--border)" }}
            />
          </form>
        </div>
      )}

      {/* Time */}
      <div className="post-time">{timeAgo(post.createdAt)}</div>
    </div>
  );
}

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get("/posts/feed");
      setPosts(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="ig-main">
      <StoriesBar />
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
          <div className="spinner" style={{ width: "30px", height: "30px" }}></div>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "16px", fontWeight: "600" }}>Welcome to Vyntra</p>
          <p style={{ fontSize: "14px" }}>When you follow people, you'll see their photos here.</p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
}

export default Feed;