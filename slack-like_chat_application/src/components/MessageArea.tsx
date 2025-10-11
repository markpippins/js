import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface MessageAreaProps {
  channelId: Id<"channels"> | null;
}

export function MessageArea({ channelId }: MessageAreaProps) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messages = useQuery(api.messages.list, channelId ? { channelId } : "skip");
  const channel = useQuery(api.channels.get, channelId ? { channelId } : "skip");
  const sendMessage = useMutation(api.messages.send);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !channelId) return;

    try {
      await sendMessage({ channelId, content: messageText });
      setMessageText("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    }
  };

  if (!channelId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-gray-500">Select a channel to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Channel Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          #{channel?.name || "Loading..."}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages?.map((message) => (
          <div key={message._id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
              {message.author.avatarUrl ? (
                <img
                  src={message.author.avatarUrl}
                  alt={message.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                  {message.author.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-semibold text-gray-900">
                  {message.author.name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message._creationTime).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-700 break-words">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage}>
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Message #${channel?.name || "channel"}`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
