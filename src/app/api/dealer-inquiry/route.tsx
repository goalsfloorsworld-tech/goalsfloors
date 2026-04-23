import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DealerInquiryEmail } from '@/emails/DealerInquiryEmail'; // Path must be correct

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name, email, phone, company, city, state, zip,
      dob, businessType, turnover, gstNumber, message, businessCardBase64
    } = body;

    // --- Validation (Crucial for multiple fields) ---
    if (!name || !email || !company || !city || !state || !businessType || !turnover || !businessCardBase64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Provide defaults for optional fields if they are falsy
    const finalMessage = message || "No additional message provided.";
    const finalZip = zip || "000000";
    const finalDob = dob || "N/A";

    // Validate file size/type (Max 15MB) - important for production
    // ... (Add file validation logic based on your Base64 and MIME type expectations)

    // --- Process File Attachment for Resend (Decode Base64) ---
    // Extract base64 content and metadata
    const matches = businessCardBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid file format.' }, { status: 400 });
    }

    const contentType = matches[1];
    const base64Content = matches[2];
    // Use a clean filename or based on applicant name
    const filename = `business_card_${name.replace(/\s+/g, '_').toLowerCase()}.jpg`;

    // --- Process Email Template ---
    // eslint-disable-next-line react-hooks/error-boundaries
    const emailReact = (
      <DealerInquiryEmail
        name={name}
        email={email}
        phone={phone}
        interest="Dealer Application"
        company={company}
        city={city}
        state={state}
        zip={finalZip}
        dob={finalDob}
        businessType={businessType}
        turnover={turnover}
        gstNumber={gstNumber || "N/A"}
        message={finalMessage}
      />
    );

    // --- Send Email ---
    const { data, error } = await resend.emails.send({
      from: 'Goals Floors Dealers <onboarding@resend.dev>',
      to: ['goalsfloors.world@gmail.com'],
      subject: `New Dealer Application: ${name} - ${company}`,
      react: emailReact,
      attachments: [{
        content: base64Content,
        filename: filename,
        contentType: contentType,
      }],
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}