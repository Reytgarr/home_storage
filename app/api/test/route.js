import db from '../../../db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    
    const box  = req.nextUrl.searchParams.get('box');

    // Fetch data from the database based on the selected box
    const data = await new Promise((resolve, reject) => {
      if (box === 'a') {
        
        db.query('SELECT * FROM item inner join box on box_id = item_boxid where box_id=1', (error, results, fields) => {
          if (error) {
            console.error('Error querying database:', error);
            reject(error);
            return;
          }
          resolve(results);
        });
      } else {
        
        db.query('SELECT * FROM item inner join box on box_id = item_boxid WHERE box_name = ?', [box], (error, results, fields) => {
          if (error) {
            console.error('Error querying database:', error);
            reject(error);
            return;
          }
          resolve(results);
        });
      }
    });

    // Send the data as JSON response with status 200
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error handling GET request:', error);
    // Return an error response with status 500
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}