import db from '../../../db';
import { NextResponse } from 'next/server';

export async function PATCH(req) {
  try {
    const itemId = req.nextUrl.searchParams.get('itemId');
    const { newName } = await req.json(); // Extract newName from the request body

    // Update the item name in the database
    await new Promise((resolve, reject) => {
      db.query('UPDATE item SET item_name = ? WHERE item_id = ?', [newName, itemId], (error, results, fields) => {
        if (error) {
          console.error('Error updating item name in database:', error);
          reject(error);
          return;
        }
        resolve();
      });
    });

    // Send a success response with status 200
    return NextResponse.json({ message: 'Item name updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling PATCH request:', error);
    // Return an error response with status 500
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
