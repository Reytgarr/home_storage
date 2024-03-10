import db from '../../../db';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  try {
    const itemId = req.nextUrl.searchParams.get('itemId');
    const { newQty } = await req.json(); // Extract newQty from the request body

    // Update the item quantity in the database
    await new Promise((resolve, reject) => {
      db.query('UPDATE items SET item_qty = ? WHERE item_id = ?', [newQty, itemId], (error, results, fields) => {
        if (error) {
          console.error('Error updating item quantity in database:', error);
          reject(error);
          return;
        }
        resolve();
      });
    });

    // Send a success response with status 200
    return NextResponse.json({ message: 'Item quantity updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling PATCH request:', error);
    // Return an error response with status 500
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}