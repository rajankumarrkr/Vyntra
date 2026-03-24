import { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";

const MOCK_CONVERSATIONS = [
  { id: "1", username: "cristiano", lastMsg: "See you at the match!", time: "2h", active: true },
  { id: "2", username: "leomessi", lastMsg: "Gracias amigo! 🙌", time: "5h", active: false },
  { id: "3", username: "natgeo", lastMsg: "New wildlife feature soon.", time: "1d", active: false },
  { id: "4", username: "nike", lastMsg: "Just do it.", time: "2d", active: false },
  { id: "5", username: "nasa", lastMsg: "Mars rover update incoming.", time: "1w", active: false },
];

const MOCK_MESSAGES = [
  { id: "m1", text: "Hey! How's the project going?", sender: "them", time: "10:00 AM" },
  { id: "m2", text: "It's going great! Almost finished with the UI overhaul.", sender: "me", time: "10:02 AM" },
  { id: "m3", text: "That's awesome! Instagram style?", sender: "them", time: "10:05 AM" },
  { id: "m4", text: "Exactly. Pixel perfect.", sender: "me", time: "10:06 AM" },
];

function Chat() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const newMsg = { id: Date.now().toString(), text: message, sender: "me", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, newMsg]);
    
    socket.emit("send_message", {
      receiverId: activeChat.id,
      message,
    });
    
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: data.message, sender: "them", time: "Now" }]);
    });
    return () => socket.off("receive_message");
  }, []);

  return (
    <div className="chat-container" style={{
      "--sidebar-display": activeChat ? "none" : "flex",
      "--view-display": activeChat ? "flex" : "none"
    }}>
      
      {/* ── Inbox Sidebar ── */}
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <span>{user?.username}</span>
          <button className="nav-icon-btn" style={{ marginLeft: "auto" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
        
        <div className="conversation-list">
          <div style={{ padding: "12px 20px", fontSize: "16px", fontWeight: "700" }}>Messages</div>
          {MOCK_CONVERSATIONS.map((conv) => (
            <div 
              key={conv.id} 
              className={`conversation-item ${activeChat?.id === conv.id ? 'conversation-active' : ''}`}
              onClick={() => setActiveChat(conv)}
            >
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--surface-secondary)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0, border: "1px solid var(--border)" }}>
                {conv.username[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{conv.username}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {conv.lastMsg} · {conv.time}
                </div>
              </div>
              {conv.active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0095F6" }}></div>}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Chat Window ── */}
      <main className="chat-messages-view">
        {activeChat ? (
          <>
            <div className="chat-view-header">
              <button 
                className="nav-icon-btn mobile-only" 
                onClick={() => setActiveChat(null)}
                style={{ padding: "8px 0", marginRight: "8px" }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--surface-secondary)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, border: "1px solid var(--border)" }}>
                {activeChat.username[0].toUpperCase()}
              </div>
              <span style={{ fontWeight: 600, fontSize: 16 }}>{activeChat.username}</span>
              <button className="nav-icon-btn" style={{ marginLeft: "auto" }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </button>
            </div>

            <div className="messages-scroll" ref={scrollRef}>
              {messages.map((m) => (
                <div key={m.id} className={`message-bubble ${m.sender === "me" ? "message-sent" : "message-received"}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <div className="chat-input-wrapper">
                <button type="button" className="nav-icon-btn" style={{ marginRight: 12 }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </button>
                <input 
                  className="chat-input"
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {message.trim() && (
                  <button type="submit" className="chat-send-btn">Send</button>
                )}
                {!message.trim() && (
                  <>
                  <button type="button" className="nav-icon-btn" style={{ marginLeft: 12 }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </button>
                  <button type="button" className="nav-icon-btn" style={{ marginLeft: 12 }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  </button>
                  </>
                )}
              </div>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", border: "2px solid var(--text)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 400 }}>Your Messages</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Send private photos and messages to a friend.</p>
            <button style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontWeight: 600, marginTop: 12, cursor: "pointer" }}>
              Send Message
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Chat;