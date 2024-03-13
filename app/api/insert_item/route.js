// app/api/insert_item/route.js
import db from '../../../db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { box, itemName, itemQty } = await req.json();
    // const box_name  = req.nextUrl.searchParams.get('box');
    // const item_name  = req.nextUrl.searchParams.get('itemName');
    // const item_qty  = req.nextUrl.searchParams.get('itemQty');
    // console.log(req.nextUrl.searchParams.get('box'));
    
    // const { box_name, item_name, item_qty } = req.body;
    

    // Insert the item into the specified box with the given quantity
    await new Promise((resolve, reject) => {
      db.query('INSERT INTO item (item_boxid, item_name, item_qty) VALUES ((select box_id from box where box_name = ?), ?, ?)', [box, itemName, itemQty], (error, results, fields) => {
        if (error) {
          console.error('Error inserting item into database:', error);
          reject(error);
          return;
        }
        resolve();
      });
    });

    // Send a success response with status 200
    return NextResponse.json({ message: 'Item inserted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling POST request:', error);
    // Return an error response with status 500
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}