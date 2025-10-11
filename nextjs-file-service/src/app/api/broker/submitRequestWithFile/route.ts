import { NextRequest, NextResponse } from 'next/server';

// Service Broker file upload endpoint
const SERVICE_BROKER_FILE_URL = process.env.SERVICE_BROKER_FILE_URL || 'http://localhost:8080/api/broker/submitRequestWithFile';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract service broker fields
    const service = formData.get('service') as string;
    const operation = formData.get('operation') as string;
    const params = formData.get('params') as string;
    const requestId = formData.get('requestId') as string;
    const file = formData.get('file') as File;

    // Validate required fields
    if (!service || !operation) {
      return NextResponse.json(
        {
          ok: false,
          data: null,
          errors: [{ message: 'Missing required fields: service and operation' }],
          ts: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        {
          ok: false,
          data: null,
          errors: [{ message: 'No file provided' }],
          ts: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    // Create new FormData for forwarding to service broker
    const forwardFormData = new FormData();
    forwardFormData.append('service', service);
    forwardFormData.append('operation', operation);
    forwardFormData.append('params', params || '{}');
    forwardFormData.append('requestId', requestId || `nextjs-${Date.now()}`);
    forwardFormData.append('file', file, file.name);

    // Forward to Spring Boot Service Broker
    const response = await fetch(SERVICE_BROKER_FILE_URL, {
      method: 'POST',
      body: forwardFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          ok: false,
          data: null,
          errors: [{ message: `Service Broker error: ${response.status} ${response.statusText}`, details: errorText }],
          ts: new Date().toISOString()
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Service Broker file proxy error:', error);
    return NextResponse.json(
      {
        ok: false,
        data: null,
        errors: [{ message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }],
        ts: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}