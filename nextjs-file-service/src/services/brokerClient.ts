const BASE_URL = "/api/broker/submitRequest";

// Shared interfaces for the Service Broker API

export interface ServiceRequest {
  service: string;
  operation: string;
  params: Record<string, unknown>;
  requestId?: string;
}

export interface ServiceResponse<T = unknown> {
  ok: boolean;
  data: T | null;
  errors: Array<Record<string, unknown>>;
  requestId?: string;
  ts: string;
}

export async function submitRequest<T>(
  client: string,
  service: string, 
  operation: string,
  params: Record<string, unknown>
): Promise<ServiceResponse<T> | null> {
  const request: ServiceRequest = {
    service,
    operation,
    params,
    requestId: client + "-" + Date.now(),
  };

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return (await res.json()) as ServiceResponse<T>;
  } catch (err) {
    console.error("Broker call failed", err);
    return null;
  }
}

// File upload with service broker integration
export interface FileUploadRequest {
  service: string;
  operation: string;
  params: Record<string, unknown>;
  requestId?: string;
  file: File;
}

export async function submitFileRequest<T>(
  client: string,
  service: string,
  operation: string,
  params: Record<string, unknown>,
  file: File
): Promise<ServiceResponse<T> | null> {
  const formData = new FormData();
  
  // Add broker routing fields
  formData.append("service", service);
  formData.append("operation", operation);
  formData.append("params", JSON.stringify(params));
  formData.append("requestId", client + "-" + Date.now());
  formData.append("file", file, file.name);

  try {
    const res = await fetch("/api/broker/submitRequestWithFile", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return (await res.json()) as ServiceResponse<T>;
  } catch (err) {
    console.error("File broker call failed", err);
    return null;
  }
}