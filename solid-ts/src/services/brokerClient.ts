export interface ServiceRequest {
  service: string;
  operation: string;
  params: Record<string, unknown>;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function callBroker<T>(
  service: string,
  operation: string,
  params: Record<string, unknown>
): Promise<ServiceResponse<T>> {
  const request: ServiceRequest = { service, operation, params };

  const res = await fetch("http://localhost:8080/api/broker/requestService", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  return res.json();
}
