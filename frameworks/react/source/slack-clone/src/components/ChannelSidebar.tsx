import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface ChannelSidebarProps {
  selectedChannelId: Id<"channels"> | null;
  onSelectChannel: (channelId: Id<"channels">) => void;
}

export function ChannelSidebar({ selectedChannelId, onSelectChannel }: ChannelSidebarProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const channels = useQuery(api.channels.list);
  const createChannel = useMutation(api.channels.create);

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const channelId = await createChannel({ name: newChannelName.trim() });
      setNewChannelName("");
      setShowCreateForm(false);
      onSelectChannel(channelId);
      toast.success("Channel created!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create channel");
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      {/* Channels Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Channels</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded text-sm flex items-center justify-center transition-colors"
            title="Create channel"
          >
            +
          </button>
        </div>

        {/* Create Channel Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateChannel} className="mb-3">
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Channel name"
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex gap-1 mt-2">
              <button
                type="submit"
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewChannelName("");
                }}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto">
        {channels?.map((channel) => (
          <button
            key={channel._id}
            onClick={() => onSelectChannel(channel._id)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
              selectedChannelId === channel._id ? "bg-blue-600" : ""
            }`}
          >
            <span className="text-gray-300">#</span> {channel.name}
          </button>
        ))}
      </div>
    </div>
  );
}
