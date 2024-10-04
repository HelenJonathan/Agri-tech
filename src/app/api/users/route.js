import { NextResponse } from "next/server";
import prisma from '../../../lib/prisma';

export async function GET(req) {
    try {
        // Fetch all users from the database
        const users = await prisma.user.findMany();

        // Remove the password field from each user
        const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        // Return the list of users without passwords
        return NextResponse.json({
            message: 'Users retrieved successfully!',
            data: usersWithoutPasswords
        }, { status: 200 });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: 'An error occurred while retrieving users' }, { status: 500 });
    }
}
