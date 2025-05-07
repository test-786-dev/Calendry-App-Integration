import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Configure Nodemailer transporter with test credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "test.email@gmail.com", // Replace with your Gmail
    pass: process.env.EMAIL_PASS || "test-app-password-1234", // Replace with your App Password
  },
});

export async function POST(request) {
  try {
    // Verify webhook signature
    const signature = request.headers.get("calendly-webhook-signature");
    const body = await request.json();

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const [t, v1] = signature.split(",");
    const timestamp = t.split("=")[1];
    const expectedSignature = v1.split("=")[1];

    const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY || "test-signing-key"; // Replace with your Calendly signing key
    if (!signingKey) {
      return NextResponse.json({ error: "Webhook signing key not configured" }, { status: 500 });
    }

    const data = `${timestamp}.${JSON.stringify(body)}`;
    const computedSignature = crypto
      .createHmac("sha256", signingKey)
      .update(data)
      .digest("hex");

    if (computedSignature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const timestampDiff = (Date.now() / 1000) - parseInt(timestamp);
    if (timestampDiff > 300) {
      return NextResponse.json({ error: "Timestamp too old" }, { status: 401 });
    }

    // Process the webhook event
    const { event, payload } = body;

    if (event === "invitee.created") {
      const { email, name, scheduled_event } = payload;
      const eventTime = new Date(scheduled_event.start_time).toLocaleString();
      const eventTitle = scheduled_event.event_type.name;

      // Send email to user
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "test.email@gmail.com",
        to: email,
        subject: `Appointment Confirmation: ${eventTitle}`,
        text: `Dear ${name},\n\nYour appointment is confirmed for ${eventTime}.\n\nThank you for booking with TestPOC!\n\nBest regards,\nTestPOC Team`,
      });

      // Send email to team
      await transporter.sendMail({
        from: process.env.EMAIL_USER || "test.email@gmail.com",
        to: "team@testpoc.com", // Replace with your team's email
        subject: `New Appointment Booked: ${eventTitle}`,
        text: `A new appointment has been booked.\n\nDetails:\nName: ${name}\nEmail: ${email}\nTime: ${eventTime}\nEvent: ${eventTitle}\n\nBest regards,\nTestPOC System`,
      });

      return NextResponse.json({ message: "Emails sent successfully" });
    }

    return NextResponse.json({ message: "Event not handled" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}