// app/api/insert_item/route.js
import db from '../../../db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    
    const { boxName } = await req.json();
    // const item_qty  = req.nextUrl.searchParams.get('itemQty');
    // console.log(req.nextUrl.searchParams.get('box'));
    // const { box_name } = req.json();
    

    // Insert the item into the specified box with the given quantity
    await new Promise((resolve, reject) => {
      db.query('INSERT INTO box (box_name) VALUES (?)', [boxName], (error, results, fields) => {
        if (error) {
          console.error('Error inserting item into database:', error);
          reject(error);
          return;
        }
        resolve();
      });
    });

    // Send a success response with status 200
    return NextResponse.json({ message: 'Box inserted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling POST request:', error);
    // Return an error response with status 500
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}