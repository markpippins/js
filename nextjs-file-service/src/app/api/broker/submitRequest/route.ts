import { NextRequest, NextResponse } from 'next/server';

// Service Broker proxy endpoint
const SERVICE_BROKER_URL = process.env.SERVICE_BROKER_URL || 'http://localhost:8080/api/broker/submitRequest';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request structure
    if (!body.service || !body.operation) {
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

    // Forward request to Spring Boot Service Broker
    const response = await fetch(SERVICE_BROKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
    console.error('Service Broker proxy error:', error);
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