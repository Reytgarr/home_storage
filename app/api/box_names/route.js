// app/api/test/route.js
import db from '../../../db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Fetch data from the database
    const data = await new Promise((resolve, reject) => {
      db.query('SELECT box_name FROM box', (error, results, fields) => {
        if (error) {
          console.error('Error querying database:', error);
          reject(error);
          return;
        }
        resolve(results);
      });
    });

    // Send the data as JSON response with status 200
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error handling GET request:', error);
    // Return an error response with status 500
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
