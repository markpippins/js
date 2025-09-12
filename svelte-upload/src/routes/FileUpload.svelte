<script lang="ts">
  // Svelte: plain reactive variables, no createSignal
  let file: File | null = null;
  let isDragging = false;
  let fileInput: HTMLInputElement | null = null;
  let message: string | null = null;
  let uploading = false;

  // Adjust to your broker/upload endpoint
  // Example endpoints we've used: "/service/requestService" or "/api/broker/requestService"
  const UPLOAD_URL = "/api/broker/requestServiceWithFile";

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    const dt = e.dataTransfer;
    if (dt?.files && dt.files.length > 0) {
      file = dt.files[0];
      dt.clearData();
    }
  }

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target?.files && target.files.length > 0) {
      file = target.files[0];
    }
  }

  async function uploadFile() {
    if (!file) {
      message = "No file selected";
      return;
    }
    uploading = true;
    message = null;

    try {
      const form = new FormData();
      // add broker routing fields (service/operation/params) as form fields
      form.append("service", "fileService");      // adjust service name
      form.append("operation", "processFile");     // adjust operation name
      form.append("params", JSON.stringify({}));  // optional params JSON
      form.append("file", file, file.name);

      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const txt = await res.text();
        message = `Upload failed: ${res.status} ${res.statusText} — ${txt}`;
      } else {
        const txt = await res.text();
        message = `Upload succeeded: ${txt}`;
        // optionally clear selection:
        // file = null;
      }
    } catch (err) {
      console.error(err);
      message = `Upload error: ${(err as Error).message}`;
    } finally {
      uploading = false;
    }
  }

  function clearFile() {
    file = null;
    message = null;
    if (fileInput) fileInput.value = "";
  }
</script>

<div class="max-w-xl mx-auto">
  <div
    class="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition"
    class:border-blue-500={isDragging}
    class:bg-blue-50={isDragging}
    class:border-gray-300={!isDragging}
    class:bg-white={!isDragging}
    on:dragover|preventDefault={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    on:click={() => fileInput?.click()}
    aria-label="File dropzone"
  >
    <input
      type="file"
      class="hidden"
      bind:this={fileInput}
      on:change={handleFileSelect}
    />

    <!-- top icon / cue -->
    <svg class="w-12 h-12 text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16l5-5 5 5M12 11v10" />
    </svg>

    <!-- file name or prompt -->
    {#if file}
      <p class="text-lg font-semibold text-gray-900 mb-1">{file.name}</p>
      <p class="text-sm text-gray-500 mb-2">{Math.round(file.size / 1024)} KB</p>
    {:else}
      <p class="text-lg font-semibold text-gray-900 mb-1">Drag & drop a file here</p>
      <p class="text-sm text-gray-500">or click to browse</p>
    {/if}
  </div>

  <!-- controls -->
  <div class="mt-4 flex items-center gap-3">
    <button
      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
      on:click={uploadFile}
      disabled={!file || uploading}
    >
      {#if uploading}
        <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4L6 12z"></path></svg>
      {/if}
      Upload
    </button>

    <button
      class="px-3 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
      on:click={clearFile}
      disabled={uploading}
    >
      Clear
    </button>

    <!-- optional small hint -->
    <span class="ml-auto text-sm text-gray-500">Max: configured on server</span>
  </div>

  {#if message}
    <div class="mt-3 p-3 rounded-md bg-gray-50 text-sm text-gray-800 shadow-sm">
      {message}
    </div>
  {/if}
</div>
