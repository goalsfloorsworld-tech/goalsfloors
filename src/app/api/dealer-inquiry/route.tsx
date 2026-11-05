import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DealerInquiryEmail } from '@/emails/DealerInquiryEmail';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      company,
      city,
      state,
      zip,
      dob,
      businessType,
      turnover,
      gstNumber,
      message,
      businessCardBase64
    } = body;

    // --- Basic Validation ---
    if (!name || !email || !phone || !company || !city || !state) {
      return NextResponse.json(
        { error: 'Please provide your Name, Company, Email, Phone, City, and State.' },
        { status: 400 }
      );
    }

    const finalMessage = message || "No additional message provided.";
    const finalZip = zip || "000000";
    const finalDob = dob || "N/A";
    const finalGst = gstNumber || "N/A";
    const finalBusinessType = businessType || "Retailer";
    const finalTurnover = turnover || "Upto 10L";

    // --- Process File Attachment for Resend (Decode Base64 if present) ---
    const attachments: Array<{
      content: string;
      filename: string;
      contentType: string;
    }> = [];

    if (businessCardBase64 && typeof businessCardBase64 === 'string') {
      const matches = businessCardBase64.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const contentType = matches[1];
        const base64Content = matches[2];
        const safeName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const ext = contentType.includes('png') ? 'png' : contentType.includes('pdf') ? 'pdf' : 'jpg';
        attachments.push({
          content: base64Content,
          filename: `visiting_card_${safeName}.${ext}`,
          contentType: contentType,
        });
      }
    }

    // --- 1. Send Data to Google Sheets ---
    let sheetSuccess = false;
    if (process.env.GOOGLE_DEALER_SCRIPT_URL) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        const sheetRes = await fetch(process.env.GOOGLE_DEALER_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            company,
            gstNumber: finalGst,
            city,
            state,
            businessType: finalBusinessType,
            turnover: finalTurnover,
            message: finalMessage,
            hasVisitingCard: attachments.length > 0 ? "Yes" : "No",
            timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        if (sheetRes.ok) {
          sheetSuccess = true;
        } else {
          console.warn(`Google Sheet responded with status ${sheetRes.status}`);
        }
      } catch (sheetError) {
        console.error('Google Sheets Dealer Sync Error:', sheetError);
      }
    }

    // --- 2. Send Email via Resend ---
    let emailSuccess = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
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
            businessType={finalBusinessType}
            turnover={finalTurnover}
            gstNumber={finalGst}
            message={finalMessage}
          />
        );

        const emailPayload: any = {
          from: 'Goals Floors Dealers <onboarding@resend.dev>',
          to: ['goalsfloors.world@gmail.com'],
          subject: `New Dealer Application: ${name} - ${company}`,
          react: emailReact,
        };

        if (attachments.length > 0) {
          emailPayload.attachments = attachments;
        }

        const resendResult = await resend.emails.send(emailPayload);
        if (resendResult.error) {
          console.error("Resend Error:", resendResult.error);
        } else {
          emailSuccess = true;
        }
      } catch (resendError) {
        console.error("Resend Exception:", resendError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Dealer application received successfully.',
      sheetSynced: sheetSuccess,
      emailSent: emailSuccess
    });
  } catch (error) {
    console.error("Dealer Inquiry API Route Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
