'use server';

import { NextRequest, NextResponse } from 'next/server';

const TIMEZONE_DB_API_KEY = process.env.TIMEZONEDB_API_KEY;

// http://api.timezonedb.com/v2.1/list-time-zone
// http://api.timezonedb.com/v2.1/get-time-zone

async function listTimezones() {
  if (!TIMEZONE_DB_API_KEY) {
    return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
  }
  
  try {
    const response = await fetch(`http://api.timezonedb.com/v2.1/list-time-zone?key=${TIMEZONE_DB_API_KEY}&format=json`);
    const data = await response.json();

    if (data.status !== 'OK') {
        return NextResponse.json({ error: data.message || 'Failed to fetch timezones from provider.' }, { status: 500 });
    }

    return NextResponse.json(data.zones.map((z: any) => z.zoneName));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timezones.' }, { status: 500 });
  }
}

async function getTime(timezone: string) {
    if (!TIMEZONE_DB_API_KEY) {
        return NextResponse.json({ error: 'API key is not configured.' }, { status: 500 });
    }
    
    try {
        const response = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_DB_API_KEY}&format=json&by=zone&zone=${timezone}`);
        const data = await response.json();

        if (data.status !== 'OK') {
            return NextResponse.json({ error: data.message || `Could not find time for "${timezone}".`}, { status: 404 });
        }
        
        // The timestamp is in seconds, convert to milliseconds for JS Date
        const datetime = new Date(data.timestamp * 1000);
        
        const offsetInSeconds = data.gmtOffset;
        const hours = Math.floor(Math.abs(offsetInSeconds) / 3600);
        const minutes = Math.floor((Math.abs(offsetInSeconds) % 3600) / 60);
        const sign = offsetInSeconds >= 0 ? '+' : '-';
        const utc_offset = `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        return NextResponse.json({
            datetime: datetime.toISOString(),
            timezone: data.zoneName,
            abbreviation: data.abbreviation,
            utc_offset: utc_offset,
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch time data.' }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const timezone = searchParams.get('timezone');

  if (timezone) {
    return getTime(timezone);
  } else {
    return listTimezones();
  }
}