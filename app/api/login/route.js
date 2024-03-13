import db from '../../../db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, password } = await req.json();


    const data = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM user WHERE user_name = ?',[username], (error, results, fields) => {
        if (error) {
          console.error('Error querying database:', error);
          reject(error);
          return;
        }
        resolve(results);
      });
    });

    
    // User exists, access user properties safely
    const userPassword = data[0].user_password;

    const passwordMatch = await bcrypt.compare(password, userPassword);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // At this point, the username and password are correct
    // You can now authenticate the user and route them accordingly
    // For example, you can generate a JWT token and send it back to the client

    // For demonstration purposes, let's send a success message
    return NextResponse.json({ message: 'User logged in successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling POST request:', error);

    // Return an error response with status 500 if an internal server error occurs
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
