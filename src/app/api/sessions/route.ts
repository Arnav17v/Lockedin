import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Session from '@/models/Session';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      // Fetch sessions from the external API
      const response = await axios.get('https://studylens-backend.onrender.com/api/v1/sessions/');
      
      // Filter sessions by the current user's username
      const userSessions = response.data.filter(
        (studySession: any) => studySession.username === session.user.username
      );
      
      return NextResponse.json(userSessions, { status: 200 });
    } catch (externalApiError) {
      console.error('Error fetching from external API:', externalApiError);
      
      // Fallback to local database if external API fails
      // Connect to the database
      await connectToDatabase();

      // Get all sessions for the logged in user
      const sessions = await Session.find({
        userId: new mongoose.Types.ObjectId(session.user.id)
      }).sort({ timestamp: -1 });

      return NextResponse.json(sessions, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'total_duration_sec',
      'focused_time_sec', 
      'wasted_time_sec',
      'drowsy_time_sec',
      'max_attention_span_sec',
      'avg_attention_span_sec',
      'wasted_percentage'
    ];

    for (const field of requiredFields) {
      if (!(field in data)) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Connect to the database
    await connectToDatabase();

    // Create a new session
    const newSession = new Session({
      userId: session.user.id,
      timestamp: new Date(),
      ...data
    });

    // Save the session to the database
    await newSession.save();

    return NextResponse.json(
      { message: 'Session saved successfully', session: newSession },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json(
      { message: 'An error occurred while saving the session' },
      { status: 500 }
    );
  }
} 