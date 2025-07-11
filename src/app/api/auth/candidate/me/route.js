import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import userModels from '@/models/userModels';
import connectDB from '@/lib/dbConnect';

const JWT_SECRET = process.env.JWT_SECRET;

export const GET = async (req) => {
  try {
    console.log('Connecting to DB...');
    await connectDB();
    console.log('Connected.');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Authorization header');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded JWT:', decoded);
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.id;
    console.log('User ID from token:', userId);

    const user = await userModels.findById(userId).select('-password');
    if (!user) {
      console.log('User not found for ID:', userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('User fetched:', user.email);

    return NextResponse.json(
      { message: 'User fetched successfully', data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return NextResponse.json(
      { message: 'Error fetching user', error: error.message },
      { status: 500 }
    );
  }
};
