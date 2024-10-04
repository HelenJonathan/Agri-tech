import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(req) {
  try {
    const { verificationToken, email } = await req.json();

    // Check for both the verificationToken and email
    if (!verificationToken || !email) {
      return NextResponse.json({ error: 'Verification token and email are required' }, { status: 400 });
    }

    // Convert verificationToken to an integer (assuming token is stored as Int in DB)
    const parsedToken = parseInt(verificationToken, 10);

    if (isNaN(parsedToken)) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    // Find user by token and email
    const user = await prisma.user.findUnique({ 
      where: { 
        email,  // Searching by email
        token: parsedToken  // Searching by token (now an integer)
      } 
    });

    if (!user) {
      return NextResponse.json({ error: 'Token or email does not match any user' }, { status: 404 });
    }

    // Update user to set verified to true and remove the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        token: null, // Clearing the token
      },
    });

    return NextResponse.json({ success: true, message: 'Email verified successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error during email verification:', error);
    return NextResponse.json({ error: 'An error occurred during email verification' }, { status: 500 });
  }
}
