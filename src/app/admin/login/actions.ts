
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const COOKIE_NAME = 'admin-session';

if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD environment variable is not set.');
}

export async function login(password: string) {
  if (password === ADMIN_PASSWORD) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    cookies().set(COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      path: '/',
      sameSite: 'lax',
    });
    return null; // No error
  } else {
    return 'Incorrect password. Please try again.';
  }
}

export async function logout() {
  cookies().set(COOKIE_NAME, '', { expires: new Date(0) });
  redirect('/admin/login');
}
