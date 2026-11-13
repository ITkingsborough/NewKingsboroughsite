import nodemailer, { type Transporter } from "nodemailer";
import type { InsertContact } from "@shared/schema";

const recipient = "info@kingsborough.org.uk";

export function createContactTransport(): { transport: Transporter; from: string } {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  const port = Number(SMTP_PORT);
  if (!SMTP_HOST || !SMTP_PORT || !Number.isInteger(port) || port < 1 || port > 65535 ||
      !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error("SMTP settings are missing or invalid");
  }

  return {
    transport: nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    }),
    from: SMTP_FROM,
  };
}

export async function sendContactEmail(
  contact: InsertContact,
  isPrivate: boolean,
  mailer = createContactTransport(),
): Promise<void> {
  const lines = [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    ...(contact.phone ? [`Phone: ${contact.phone}`] : []),
    ...(isPrivate ? ["Confidential: share only with the pastoral team"] : []),
    "",
    contact.message,
  ];
  await mailer.transport.sendMail({
    from: mailer.from,
    to: recipient,
    replyTo: contact.email,
    subject: contact.isPrayer ? "Website prayer request" : "Website enquiry",
    text: lines.join("\n"),
  });
}
