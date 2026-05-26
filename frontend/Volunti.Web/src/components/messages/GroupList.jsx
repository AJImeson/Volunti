import React from "react";
import { getProfileImageUrl } from "../../services/authService";

export default function GroupList({
  groups,
  selectedId,
  onSelect,
  isLoading,
  error,
}) {
  if (isLoading) {
    return <p className="group-list-status">Laddar grupper...</p>;
  }

  if (error) {
    return <p className="group-list-status group-list-error">{error}</p>;
  }

  if (groups.length === 0) {
    return (
      <p className="group-list-status">
        Du är inte med i någon grupp än. Grupper läggs till automatiskt när du
        godkänns för uppdrag.
      </p>
    );
  }

  return (
    <ul className="group-list">
      {groups.map((g) => (
        <GroupListItem
          key={g.id}
          group={g}
          isActive={g.id === selectedId}
          onClick={() => onSelect(g.id)}
        />
      ))}
    </ul>
  );
}

function GroupListItem({ group, isActive, onClick }) {
  const lastMsg = group.lastMessage;
  const initial = (group.name?.charAt(0) || "?").toUpperCase();

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) {
      return date.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Igår";
    return date.toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <li className={`group-item ${isActive ? "active" : ""}`} onClick={onClick}>
      <div className="group-item-avatar">
        {group.imageUrl ? (
          <img src={getProfileImageUrl(group.imageUrl)} alt="" />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      <div className="group-item-body">
        <div className="group-item-header">
          <h3 className="group-item-name">{group.name}</h3>
          {lastMsg && (
            <span className="group-item-time">
              {formatTime(lastMsg.createdAt)}
            </span>
          )}
        </div>
        <div className="group-item-footer">
          <p className="group-item-preview">
            {lastMsg
              ? lastMsg.hasAttachments && !lastMsg.content
                ? "📎 Bilaga"
                : lastMsg.content || "Tomt meddelande"
              : `${group.organizationName}`}
          </p>
          {group.unreadCount > 0 && (
            <span className="group-item-badge">{group.unreadCount}</span>
          )}
        </div>
      </div>
    </li>
  );
}
