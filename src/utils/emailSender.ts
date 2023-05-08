import nodemailer from "nodemailer";
import { config } from "dotenv";
config();
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const EMAILSERVER = process.env.EMAILSERVER;
const EMAILPORT = process.env.EMAILPORT;
const SSL = process.env.SSL === "true" ? true : false;
const PRIVATEMAIL = process.env.PRIVATEMAIL;

export async function sendInvoice(recipent: string, invoicePath: string) {
  const transporter = nodemailer.createTransport({
    host: EMAILSERVER,
    port: +EMAILPORT!,
    secure: SSL,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `${EMAIL} SNEAKERMAN.SHOP`,
    to: [
      {
        address: recipent,
        name: "Sprzedawca",
      },
      {
        address: PRIVATEMAIL!,
        name: "Kupujący",
      },
    ],
    subject: "UMOWA KUPNA SPRZEDAŻY",
    text: "test",
    html: "<b>UMOWA KUPNA SPRZEDAŻY</b>",
    attachments: [
      {
        path: invoicePath,
      },
    ],
  });
  return info;
}
