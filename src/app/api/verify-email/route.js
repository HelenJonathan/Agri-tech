import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(req) {
    try {
        const body = await req.json();
        const token = body.token;

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // Validate token format (assuming UUID)
        const tokenRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        if (!tokenRegex.test(token)) {
            return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
        }

        // Find user by token
        const user = await prisma.user.findUnique({ where: { verificationToken: token } });

        if (!user) {
            return NextResponse.json({ error: 'Token does not match any user' }, { status: 404 });
        }

        // Update user to set verified to true and remove the token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                token: null,
            },
        });

        return NextResponse.json({ message: 'Email verified successfully!' }, { status: 200 });

    } catch (error) {
        console.error('Error during email verification:', error);
        return NextResponse.json({ error: 'An error occurred during email verification' }, { status: 500 });
    }
}
