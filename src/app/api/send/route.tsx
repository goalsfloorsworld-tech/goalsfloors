import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactEmail } from '@/emails/ContactEmail';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
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

    // Google Sheets Integration
    // Send data to Google Apps Script Web App
    if (process.env.GOOGLE_SCRIPT_URL) {
      try {
        await fetch(process.env.GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            company,
            address,
            interest,
            message
          }),
        });
      } catch (sheetError) {
        console.error('Google Sheets Error:', sheetError);
        // We log the error but don't fail the response since email was sent successfully
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error('API Route Error:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
