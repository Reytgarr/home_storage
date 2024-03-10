// app/api/insert_item/route.js
import db from '../../../db';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  try {
    
    const item_id  = req.nextUrl.searchParams.get('itemId');

    // Insert the item into the specified box with the given quantity
    await new Promise((resolve, reject) => {
      db.query('delete from items where item_id = ?', [item_id], (error, results, fields) => {
        if (error) {
          console.error('Error deleting item from database:', error);
          reject(error);
          return;
        }
        resolve();
      });
    });

    // Send a success response with status 200
    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling DELETE request:', error);
    // Return an error response with status 500
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}