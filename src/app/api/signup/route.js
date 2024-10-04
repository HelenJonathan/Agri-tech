import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma'; 
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function POST(req) {
  try {
    const { fullName, email, password, userType } = await req.json();

    // Validate input
    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = await Math.floor(100000 + Math.random() * 900000);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        userType: userType || "buyer",
        token: verificationToken,
      },
    });

    // Send verification email
    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: email,
      subject: 'Your Verification Code',
      html: `<h3>Your Agri-tech verification code is:</h3> <h1>${verificationToken}</h1>`, 
    };

    const sentMail = await transporter.sendMail(mailOptions);
    console.log("Email Sent:", sentMail);

    // Return success response
    return NextResponse.json({ message: 'User registered successfully!, Check your mail for verification' }, { status: 201 });
    
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}
