import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import express from "express";
import nodemailer from "nodemailer";
import type { Contact, InsertContact } from "@shared/schema";
import { createContactHandler } from "./contactSubmission";
import { createContactTransport, sendContactEmail } from "./contactEmailService";

const sample: InsertContact = {
  name: "Test Visitor",
  email: "visitor@example.com",
  message: "Please contact me.",
  isPrayer: false,
};

test("SMTP configuration is required", () => {
  const original = process.env.SMTP_PORT;
  try {
    process.env.SMTP_PORT = "invalid";
    assert.throws(() => createContactTransport(), /SMTP settings are missing or invalid/);
  } finally {
    if (original === undefined) delete process.env.SMTP_PORT;
    else process.env.SMTP_PORT = original;
  }
});

test("enquiries and prayer requests produce emails for the church inbox", async () => {
  for (const isPrayer of [false, true]) {
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
    let message: { to?: unknown; replyTo?: unknown; subject?: unknown; text?: unknown } = {};
    transport.use("compile", (mail, callback) => {
      message = mail.data;
      callback();
    });

    await sendContactEmail({ ...sample, isPrayer, phone: "12345" }, isPrayer, {
      transport,
      from: "sender@example.com",
    });
    assert.equal(message.to, "info@kingsborough.org.uk");
    assert.equal(message.replyTo, sample.email);
    assert.equal(message.subject, isPrayer ? "Website prayer request" : "Website enquiry");
    assert.match(String(message.text), /Phone: 12345/);
    assert.equal(String(message.text).includes("Confidential"), isPrayer);
  }
});

test("contact handler saves requests, sends notifications and reports failures", async () => {
  const saved: InsertContact[] = [];
  const sent: { contact: InsertContact; isPrivate: boolean }[] = [];
  let failSend = false;
  let failSave = false;
  const app = express();
  app.use(express.json());
  app.post("/api/contact", createContactHandler({
    save: async (contact) => {
      if (failSave) throw new Error("save failed");
      saved.push(contact);
      return { ...contact, id: 1, phone: contact.phone ?? null, isPrayer: contact.isPrayer ?? false, createdAt: new Date() } satisfies Contact;
    },
    send: async (contact, isPrivate) => {
      if (failSend) throw new Error("send failed");
      sent.push({ contact, isPrivate });
    },
  }));
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const submit = (body: object) => fetch(`http://127.0.0.1:${address.port}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  try {
    assert.equal((await submit(sample)).status, 201);
    assert.equal(sent[0].contact.isPrayer, false);
    assert.equal((await submit({ ...sample, isPrayer: true, isPrivate: true })).status, 201);
    assert.equal(sent[1].contact.isPrayer, true);
    assert.equal(sent[1].isPrivate, true);
    assert.match(saved[1].message, /^\[Confidential:/);

    assert.equal((await submit({ ...sample, email: "invalid" })).status, 400);
    assert.equal(saved.length, 2);
    failSend = true;
    const response = await submit(sample);
    assert.equal(response.status, 503);
    assert.match((await response.json()).message, /saved.*email notification failed/i);
    assert.equal(saved.length, 3);
    failSave = true;
    assert.equal((await submit(sample)).status, 500);
    assert.equal(sent.length, 2);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
