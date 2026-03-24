import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../services/socket";

const TYPE_ICONS = { like: "❤️", comment: "💬", follow: "👤" };

function NotificationItem({ n, index }) {
  const icon = TYPE_ICONS[n.type] || "🔔";
  const dateStr = n.createdAt
    ? new Date(n.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="notif-card" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="notif-icon">{icon}</div>
      <div className="notif-body">
        <div className="notif-msg">{n.message}</div>
        {dateStr && <div className="notif-time">{dateStr}</div>}
      </div>
      {!n.read && <div className="notif-dot" />}
    </div>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    socket.on("get_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });
    return () => socket.off("get_notification");
  }, []);

  return (
    <div>
      <div className="notifs-header">Notifications</div>

      {loading ? (
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 68, borderRadius: 16, marginBottom: 12 }} />
          ))}
        </>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔔</div>
          <div className="title">All caught up!</div>
          <div className="sub">No new notifications</div>
        </div>
      ) : (
        notifications.map((n, i) => (
          <NotificationItem key={n._id} n={n} index={i} />
        ))
      )}
    </div>
  );
}

export default Notifications;