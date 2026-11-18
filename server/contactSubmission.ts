import type { RequestHandler } from "express";
import { z } from "zod";
import { insertContactSchema, type Contact, type InsertContact } from "@shared/schema";

type ContactDependencies = {
  save: (contact: InsertContact) => Promise<Contact>;
  send: (contact: InsertContact, isPrivate: boolean) => Promise<void>;
  // When provided, submissions must carry a reCAPTCHA token that this check accepts
  verifyCaptcha?: (token: string | undefined, remoteIp?: string) => Promise<boolean>;
};

const requestSchema = insertContactSchema.extend({
  email: z.string().email(),
  isPrivate: z.boolean().optional(),
  recaptchaToken: z.string().optional(),
});

export function createContactHandler({ save, send, verifyCaptcha }: ContactDependencies): RequestHandler {
  return async (req, res) => {
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: "Invalid contact form data" });
    }

    const { isPrivate = false, recaptchaToken, ...contact } = parsed.data;

    if (verifyCaptcha) {
      let human: boolean;
      try {
        human = await verifyCaptcha(recaptchaToken, req.ip);
      } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
        return res.status(503).json({ success: false, message: "We could not verify you are human. Please try again." });
      }
      if (!human) {
        return res.status(400).json({ success: false, message: "reCAPTCHA verification failed. Please try again." });
      }
    }

    let result: Contact;
    try {
      result = await save({
        ...contact,
        message: isPrivate ? `[Confidential: share only with the pastoral team]\n\n${contact.message}` : contact.message,
      });
    } catch (error) {
      console.error("Error saving contact form:", error);
      return res.status(500).json({ success: false, message: "Could not save your message" });
    }

    try {
      await send(contact, isPrivate);
      return res.status(201).json({
        success: true,
        message: "Contact message submitted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error sending contact notification:", error);
      return res.status(503).json({
        success: false,
        message: "Your message was saved, but email notification failed. Please email info@kingsborough.org.uk directly.",
      });
    }
  };
}
