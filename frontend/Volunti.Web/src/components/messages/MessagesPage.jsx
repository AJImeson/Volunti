import React, { useState, useEffect } from "react";
import "./MessagesPage.css";
import BottomNav from "../bottomnav/BottomNav";
import GroupList from "./GroupList";
import ChatView from "./ChatView";
import { getMyGroups } from "../../services/messageService";
import CreateGroupModal from "./CreateGroupModal";
import GroupSettingsModal from "./GroupSettingsModal";
import { getCurrentUser } from "../../services/authService";

export default function MessagesPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [settingsGroupId, setSettingsGroupId] = useState(null);

  const currentUser = getCurrentUser();
  const canCreateGroup = currentUser && !currentUser.driverLicense;

  const loadGroups = async () => {
    try {
      const data = await getMyGroups();
      setGroups(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Kunde inte ladda grupper.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getMyGroups()
      .then((data) => {
        if (cancelled) return;
        setGroups(data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Kunde inte ladda grupper.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const showList = !selectedGroupId;

  return (
    <div className="messages-wrapper">
      <div className="messages-top">
        <h1 className="messages-logo">VOLUNTI</h1>
        <div className="messages-title-row">
          <h2 className="messages-title">Meddelanden</h2>
          {canCreateGroup && (
            <button
              className="messages-create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + Ny grupp
            </button>
          )}
        </div>
      </div>

      <div className="messages-layout">
        <aside
          className={`messages-sidebar ${showList ? "" : "mobile-hidden"}`}
        >
          <GroupList
            groups={groups}
            selectedId={selectedGroupId}
            onSelect={setSelectedGroupId}
            isLoading={isLoading}
            error={error}
          />
        </aside>

        <main
          className={`messages-main ${selectedGroupId ? "" : "mobile-hidden"}`}
        >
          {selectedGroupId ? (
            <ChatView
              groupId={selectedGroupId}
              onBack={() => setSelectedGroupId(null)}
              onMessageSent={loadGroups}
              onOpenSettings={() => setSettingsGroupId(selectedGroupId)}
            />
          ) : (
            <div className="messages-empty">
              <p>Välj en grupp för att börja chatta</p>
            </div>
          )}
        </main>
      </div>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newGroupId) => {
            setShowCreateModal(false);
            loadGroups();
            setSelectedGroupId(newGroupId);
          }}
        />
      )}

      {settingsGroupId && (
        <GroupSettingsModal
          groupId={settingsGroupId}
          onClose={() => setSettingsGroupId(null)}
          onGroupDeleted={() => {
            setSettingsGroupId(null);
            setSelectedGroupId(null);
            loadGroups();
          }}
        />
      )}

      <BottomNav />
    </div>
  );
}
