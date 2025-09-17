
import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.TIMEZONEDB_API_KEY;
const BASE_URL_LIST = 'https://api.ipgeolocation.io/timezone';
const BASE_URL_GET = 'https://api.ipgeolocation.io/timezone';

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
      apiUrl = `${BASE_URL_LIST}?apiKey=${API_KEY}`;
    } else if (zone) {
      apiUrl = `${BASE_URL_GET}?apiKey=${API_KEY}&tz=${zone}`;
    } else {
      return NextResponse.json({ error: 'Missing required query parameters.' }, { status: 400 });
    }

    const apiResponse = await fetch(apiUrl, {
        cache: 'no-store', // Ensure fresh data
    });

    if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({ message: 'Unknown API error' }));
        console.error('Timezone API Error:', errorData);
        return NextResponse.json({ error: `API request failed: ${errorData.message}` }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();

    // ipgeolocation.io returns an array of zones for list, and an object for get
    if (list) {
        return NextResponse.json({ zones: data.timezones });
    }

    if (data.message) {
        return NextResponse.json({ error: data.message}, { status: 400 });
    }
    
    // ipgeolocation returns a string like "2024-08-01 10:30:45"
    // We need to make it a valid ISO string for new Date()
    const formattedDateTime = data.date_time_txt.replace(' ', 'T') + 'Z';

    return NextResponse.json({
        formatted: new Date(formattedDateTime).toISOString(),
        zoneName: data.timezone,
        gmtOffset: data.timezone_offset * 3600, // convert hours to seconds
    });
  } catch (error) {
    console.error('Proxy API Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
