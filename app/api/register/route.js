import db from '../../../db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Check if the user already exists
    const result = await db.query('SELECT user_id FROM user WHERE user_name = ?', [username]);

    // Check if the query result is an array and has at least one element
    if (Array.isArray(result) && result.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password using bcrypt before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database with the hashed password
    await db.query('INSERT INTO user (user_name, user_password) VALUES (?, ?)', [username, hashedPassword]);

    // Return a success response if user registration is successful
    return NextResponse.json({ message: 'User registered successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error handling POST request:', error);

    // Return an error response with status 500 if an internal server error occurs
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
