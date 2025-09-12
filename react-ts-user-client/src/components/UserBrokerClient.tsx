import { useState } from "react";
import { callBroker, type ServiceResponse } from "../services/brokerClient";

export interface User {
  id: number;
  email: string;
  name: string;
}

export default function UserBrokerClient() {
  const [userId, setUserId] = useState<string>("");
  const [createName, setCreateName] = useState<string>("");
  const [createEmail, setCreateEmail] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<ServiceResponse<any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUser = async () => {
    if (!userId) {
      setError("Please enter a user ID");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await callBroker<User>("react", "userService", "getById", {
      id: Number(userId),
    });
    setResponse(res);
    setLoading(false);
  };

  const handleCreateUser = async () => {
    if (!createEmail || !createName) {
      setError("Name and email required");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await callBroker<User>("react", "userService", "create", {
      user: { name: createName, email: createEmail },
    });
    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-950 text-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Service Broker Demo</h1>

      {/* Get user */}
      <div className="mb-6 bg-gray-950 text-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Get User by ID</h2>
        <input
          type="number"
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleGetUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Fetch
        </button>
      </div>

      {/* Create user */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Create User</h2>
        <input
          type="text"
          placeholder="Name"
          value={createName}
          onChange={(e) => setCreateName(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={createEmail}
          onChange={(e) => setCreateEmail(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleCreateUser}
          className="bg-green-600 text-black px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* Response display */}
      <div className=" bg-gray-950 text-black p-4 rounded shadow">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {response && (
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
