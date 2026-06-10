import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactEmail } from '@/emails/ContactEmail';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, phone, company, address, interest, message, source, discountStatus } = body;

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
          source={source}
          discountStatus={discountStatus}
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
      const sheetPayload = JSON.stringify({
        name,
        email,
        phone,
        company,
        address,
        interest,
        message,
        source,
        discountStatus
      });

      const maxRetries = 3;
      let attempt = 0;
      let success = false;

      while (attempt < maxRetries && !success) {
        try {
          const controller = new AbortController();
          // 8 second timeout per request
          const timeoutId = setTimeout(() => controller.abort(), 8000); 

          const res = await fetch(process.env.GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: sheetPayload,
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            success = true;
          } else {
            throw new Error(`Google Script returned ${res.status}`);
          }
        } catch (sheetError) {
          attempt++;
          console.error(`Google Sheets Error (Attempt ${attempt}/${maxRetries}):`, sheetError);
          
          if (attempt < maxRetries) {
            // Wait 1.5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      }

      if (!success) {
        console.error('CRITICAL: Failed to sync lead with Google Sheets after all retries.');
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error('API Route Error:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
