import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return NextResponse.json({ error: 'User is already verified' }, { status: 400 });
    }

    // Generate a new verification token
    const newVerificationToken = await Math.floor(100000 + Math.random() * 900000);

    // Update the user's token in the database
    await prisma.user.update({
      where: { email },
      data: {
        token: newVerificationToken,
      },
    });

    // Send the new verification token via email
    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: email,
      subject: 'Resend Verification Code',
      html: `<h3>Your new Agri-tech verification code is:</h3> <h1>${newVerificationToken}</h1>`,
    };

    const sentMail = await transporter.sendMail(mailOptions);
    console.log('Email Sent:', sentMail);

    // Return success response
    return NextResponse.json({
      message: 'Verification code resent successfully! Please check your email.',
    }, { status: 200 });

  } catch (error) {
    console.error('Error during resend verification:', error);
    return NextResponse.json({ error: 'An error occurred while resending the verification code' }, { status: 500 });
  }
}
