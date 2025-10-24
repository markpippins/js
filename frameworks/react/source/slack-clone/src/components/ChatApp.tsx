import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ChannelSidebar } from "./ChannelSidebar";
import { MessageArea } from "./MessageArea";
import { ProfileModal } from "./ProfileModal";
import { SearchModal } from "./SearchModal";
import { SignOutButton } from "../SignOutButton";

export function ChatApp() {
  const [selectedChannelId, setSelectedChannelId] = useState<Id<"channels"> | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const channels = useQuery(api.channels.list);

  // Auto-select first channel
  useEffect(() => {
    if (channels && channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0]._id);
    }
  }, [channels, selectedChannelId]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">SlackChat</h1>
          <button
            onClick={() => setShowSearch(true)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-600 transition-colors"
          >
            Search messages...
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowProfile(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
          >
            Edit Profile
          </button>
          <SignOutButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ChannelSidebar
          selectedChannelId={selectedChannelId}
          onSelectChannel={setSelectedChannelId}
        />
        <MessageArea channelId={selectedChannelId} />
      </div>

      {/* Modals */}
      {showProfile && (
        <ProfileModal onClose={() => setShowProfile(false)} />
      )}
      {showSearch && (
        <SearchModal 
          onClose={() => setShowSearch(false)}
          onSelectChannel={setSelectedChannelId}
        />
      )}
    </div>
  );
}
