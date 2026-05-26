import React, { useState, useEffect, useRef } from "react";
import {
  getGroupDetails,
  removeGroupMember,
  deleteGroup,
  addGroupMember,
  searchUsersForGroup,
} from "../../services/messageService";
import { getProfileImageUrl } from "../../services/authService";

export default function GroupSettingsModal({
  groupId,
  onClose,
  onGroupDeleted,
}) {
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [addingUserId, setAddingUserId] = useState(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getGroupDetails(groupId)
      .then((data) => {
        if (cancelled) return;
        setGroup(data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Kunde inte ladda gruppen.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  const isAdmin = group?.myRole === "Admin";

  // Debounced sökning
  useEffect(() => {
    const trimmed = searchQuery.trim();

    // Båda fall: clear pending timeout
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (trimmed.length < 2) {
      // För kort query - schemalägg cleanup asynkront
      searchTimeoutRef.current = setTimeout(() => {
        setSearchResults([]);
        setIsSearching(false);
        setSearchError("");
      }, 0);
      return () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      };
    }

    // Schemalägg sökningen
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(true);
      searchUsersForGroup(groupId, trimmed)
        .then((data) => {
          setSearchResults(data);
          setSearchError("");
        })
        .catch((err) => {
          console.error(err);
          setSearchError("Sökningen misslyckades.");
          setSearchResults([]);
        })
        .finally(() => setIsSearching(false));
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery, groupId]);

  const handleAddMember = async (user) => {
    setAddingUserId(user.userId);
    setSearchError("");
    try {
      await addGroupMember(groupId, user.userId);
      // Lägg till i medlemslistan direkt
      setGroup((prev) => ({
        ...prev,
        members: [
          ...prev.members,
          {
            userId: user.userId,
            name: user.name,
            imageUrl: user.imageUrl,
            role: "Member",
            joinedAt: new Date().toISOString(),
          },
        ],
      }));
      // Ta bort från sökresultat
      setSearchResults((prev) => prev.filter((u) => u.userId !== user.userId));
      setSearchQuery("");
    } catch (err) {
      console.error(err);
      setSearchError(
        err.response?.data?.detail || "Kunde inte lägga till användaren.",
      );
    } finally {
      setAddingUserId(null);
    }
  };

  const handleRemoveMember = async (userId, memberName) => {
    if (!window.confirm(`Ta bort ${memberName} från gruppen?`)) return;
    try {
      await removeGroupMember(groupId, userId);
      setGroup((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.userId !== userId),
      }));
    } catch (err) {
      console.error(err);
      alert("Kunde inte ta bort medlemmen.");
    }
  };

  const handleDeleteGroup = async () => {
    if (
      !window.confirm(
        "Är du säker på att du vill ta bort hela gruppen? Detta kan inte ångras.",
      )
    )
      return;
    try {
      await deleteGroup(groupId);
      onGroupDeleted?.();
    } catch (err) {
      console.error(err);
      alert("Kunde inte ta bort gruppen.");
    }
  };

  return (
    <div className="cg-overlay" onClick={onClose}>
      <div
        className="cg-modal cg-modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cg-header">
          <h3>Gruppinställningar</h3>
          <button
            type="button"
            className="cg-close"
            onClick={onClose}
            aria-label="Stäng"
          >
            ×
          </button>
        </div>

        <div className="cg-body">
          {isLoading && <p className="cg-status">Laddar...</p>}
          {error && <p className="cg-status cg-error">{error}</p>}

          {group && (
            <>
              <div className="cg-info-block">
                <h4 className="cg-info-title">{group.name}</h4>
                {group.description && (
                  <p className="cg-info-desc">{group.description}</p>
                )}
                <p className="cg-info-meta">
                  {group.organizationName} · {group.members.length} medlemmar
                </p>
              </div>

              {isAdmin && (
                <div className="cg-add-member-section">
                  <h4 className="cg-section-title">Lägg till medlem</h4>
                  <input
                    type="text"
                    className="cg-input"
                    placeholder="Sök på namn eller e-postadress..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  {searchError && <p className="cg-error">{searchError}</p>}

                  {isSearching && <p className="cg-search-status">Söker...</p>}

                  {!isSearching &&
                    searchQuery.trim().length >= 2 &&
                    searchResults.length === 0 && (
                      <p className="cg-search-status">
                        Inga användare hittades.
                      </p>
                    )}

                  {searchResults.length > 0 && (
                    <ul className="cg-search-results">
                      {searchResults.map((user) => (
                        <li key={user.userId} className="cg-search-result">
                          <div className="cg-member-avatar">
                            {user.imageUrl ? (
                              <img
                                src={getProfileImageUrl(user.imageUrl)}
                                alt=""
                              />
                            ) : (
                              <span>
                                {(user.name?.charAt(0) || "?").toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="cg-member-info">
                            <p className="cg-member-name">{user.name}</p>
                            <p className="cg-member-role">
                              {user.email}
                              {user.type === "Organization" &&
                                " · Organisation"}
                              {user.type === "Volunteer" && " · Volontär"}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="cg-search-add-btn"
                            onClick={() => handleAddMember(user)}
                            disabled={addingUserId === user.userId}
                          >
                            {addingUserId === user.userId
                              ? "..."
                              : "+ Lägg till"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <h4 className="cg-section-title">
                Medlemmar ({group.members.length})
              </h4>
              <ul className="cg-member-list">
                {group.members.map((m) => (
                  <li key={m.userId} className="cg-member-item">
                    <div className="cg-member-avatar">
                      {m.imageUrl ? (
                        <img src={getProfileImageUrl(m.imageUrl)} alt="" />
                      ) : (
                        <span>{(m.name?.charAt(0) || "?").toUpperCase()}</span>
                      )}
                    </div>
                    <div className="cg-member-info">
                      <p className="cg-member-name">{m.name}</p>
                      <p className="cg-member-role">
                        {m.role === "Admin" ? "Administratör" : "Medlem"}
                      </p>
                    </div>
                    {isAdmin && m.role !== "Admin" && (
                      <button
                        type="button"
                        className="cg-member-remove"
                        onClick={() => handleRemoveMember(m.userId, m.name)}
                      >
                        Ta bort
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {isAdmin && (
                <div className="cg-danger-zone">
                  <button
                    type="button"
                    className="cg-btn-danger"
                    onClick={handleDeleteGroup}
                  >
                    Ta bort hela gruppen
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
