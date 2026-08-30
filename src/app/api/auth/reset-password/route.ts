import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { email, newPassword, name } = await request.json();

    if (!newPassword || newPassword.trim().length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters long' },
        { status: 400 }
      );
    }

    await dbConnect();

    const targetEmail = (email || process.env.ADMIN_EMAIL || 'admin@rafagarden.com').trim().toLowerCase();
    const cleanPassword = newPassword.trim();

    // 1. Find existing super-admin or admin user
    let user = await User.findOne({ $or: [{ role: 'super-admin' }, { email: targetEmail }] });

    if (user) {
      user.email = targetEmail;
      user.password = cleanPassword;
      if (name) user.name = name;
      await user.save();
    } else {
      // Create super-admin if none exists
      user = await User.create({
        name: name || 'Super Admin',
        email: targetEmail,
        password: cleanPassword,
        role: 'super-admin',
        active: true
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Super Admin credentials updated successfully in database!',
      user: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reset Super Admin password' },
      { status: 500 }
    );
  }
}
