<script lang="ts">
  import { callBroker, type ServiceResponse } from "../services/brokerClient";

  let userId = "";
  let createName = "";
  let createEmail = "";

  let response: ServiceResponse<unknown> | null = null;
  let loading = false;
  let error: string | null = null;

  async function handleGetUser() {
    if (!userId) {
      error = "Please enter a user ID";
      return;
    }
    loading = true;
    error = null;
    try {
      response = await callBroker("svelte", "userService", "getById", {
        id: Number(userId),
      });
    } catch (err) {
      error = (err as Error).message;
    } finally {
      loading = false;
    }
  }

  async function handleCreateUser() {
    if (!createName || !createEmail) {
      error = "Name and email required";
      return;
    }
    loading = true;
    error = null;
    try {
      response = await callBroker("svelte", "userService", "create", {
        user: { name: createName, email: createEmail },
      });
    } catch (err) {
      error = (err as Error).message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="p-6 max-w-lg mx-auto bg-gray-950 text-white rounded shadow">
  <h1 class="text-xl font-bold mb-4">Service Broker Demo (Svelte)</h1>

  <!-- Get user -->
  <div class="mb-6 bg-gray-900 p-4 rounded shadow">
    <h2 class="text-lg font-semibold mb-2">Get User by ID</h2>
    <input
      type="number"
      placeholder="Enter user ID"
      bind:value={userId}
      class="border p-2 mr-2 rounded text-black"
    />
    <button
      on:click={handleGetUser}
      class="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Fetch
    </button>
  </div>

  <!-- Create user -->
  <div class="mb-6 bg-gray-900 p-4 rounded shadow">
    <h2 class="text-lg font-semibold mb-2">Create User</h2>
    <input
      type="text"
      placeholder="Name"
      bind:value={createName}
      class="border p-2 mr-2 rounded text-black"
    />
    <input
      type="email"
      placeholder="Email"
      bind:value={createEmail}
      class="border p-2 mr-2 rounded text-black"
    />
    <button
      on:click={handleCreateUser}
      class="bg-green-600 text-white px-4 py-2 rounded"
    >
      Create
    </button>
  </div>

  <!-- Response -->
  <div class="bg-gray-900 p-4 rounded shadow">
    {#if loading}
      <p class="text-gray-400">Loading...</p>
    {/if}
    {#if error}
      <p class="text-red-500">Error: {error}</p>
    {/if}
    {#if response}
      <pre class="bg-gray-100 p-3 rounded text-sm text-black overflow-auto">
        {JSON.stringify(response, null, 2)}
      </pre>
    {/if}
  </div>
</div>
