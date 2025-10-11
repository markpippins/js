import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface SearchModalProps {
  onClose: () => void;
  onSelectChannel: (channelId: Id<"channels">) => void;
}

export function SearchModal({ onClose, onSelectChannel }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useQuery(
    api.messages.search,
    searchQuery.trim() ? { query: searchQuery } : "skip"
  );

  const handleResultClick = (channelId: Id<"channels">) => {
    onSelectChannel(channelId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-96 flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchQuery.trim() === "" ? (
            <p className="text-gray-500 text-center py-8">
              Type to search messages...
            </p>
          ) : searchResults === undefined ? (
            <p className="text-gray-500 text-center py-8">Searching...</p>
          ) : searchResults.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages found</p>
          ) : (
            <div className="space-y-3">
              {searchResults.map((message) => (
                <button
                  key={message._id}
                  onClick={() => handleResultClick(message.channelId)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-blue-600">
                      #{message.channelName}
                    </span>
                    <span className="text-sm text-gray-500">
                      by {message.author.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(message._creationTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {message.content}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
