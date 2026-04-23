import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactEmail } from '@/emails/ContactEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, address, interest, message } = body;

    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }

    const { data, error } = await resend.emails.send({
      from: 'Goals Floors Leads <onboarding@resend.dev>', // Change to verified domain later
      to: ['goalsfloors.world@gmail.com'],
      subject: `New Lead: ${name} - ${interest}`,
      react: (
        <ContactEmail
          name={name}
          email={email}
          phone={phone}
          company={company}
          address={address}
          interest={interest}
          message={message}
        />
      ),
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error('API Route Error:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
