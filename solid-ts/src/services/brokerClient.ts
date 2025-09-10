export interface ServiceRequest {
  serviceName: string;
  functionName: string;
  parameters: Record<string, unknown>;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function callBroker<T>(
  serviceName: string,
  functionName: string,
  parameters: Record<string, unknown>
): Promise<ServiceResponse<T>> {
  const request: ServiceRequest = { serviceName, functionName, parameters };

  const res = await fetch("http://localhost:8080/service/requestService", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  return res.json();
}
