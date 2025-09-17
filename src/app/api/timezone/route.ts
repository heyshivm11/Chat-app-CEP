
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.TIMEZONEDB_API_KEY;
const BASE_URL = 'http://api.timezonedb.com/v2.1';

export async function GET(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const list = searchParams.get('list');
  const zone = searchParams.get('zone');

  try {
    let apiUrl = '';
    if (list) {
      apiUrl = `${BASE_URL}/list-time-zone?key=${API_KEY}&format=json`;
    } else if (zone) {
      apiUrl = `${BASE_URL}/get-time-zone?key=${API_KEY}&format=json&by=zone&zone=${zone}`;
    } else {
      return NextResponse.json({ error: 'Missing required query parameters.' }, { status: 400 });
    }

    const apiResponse = await fetch(apiUrl, {
        cache: 'no-store', // Ensure fresh data
    });

    if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({ message: 'Unknown API error' }));
        console.error('TimezoneDB API Error:', errorData);
        return NextResponse.json({ error: `API request failed: ${errorData.message}` }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();

    if (data.status !== 'OK') {
        return NextResponse.json({ error: data.message || 'An error occurred with the timezone API.'}, { status: 400 });
    }
    
    // timezonedb returns a timestamp in seconds, but we need JS date which works in ms
    if(data.timestamp) {
        data.formatted = new Date(data.timestamp * 1000).toISOString();
    }


    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
