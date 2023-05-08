import { Request, Response, Router } from "express";
import pdf from "pdf-creator-node";
import { readFileAsync } from "../utils/readFileAsync";
import zod from "zod";
import { v4 as uuid } from "uuid";
import { BadRequestError } from "../utils/Errors/BadRequestError";
import { uploadFile } from "../utils/uploadFile";
import { unlinkAsync } from "../utils/unlinkAsync";
import { sendInvoice } from "../utils/emailSender";
const invoiceSchema = zod.object({
  date: zod.string(),
  name: zod.string().min(3),
  lastname: zod.string().min(2),
  email: zod.string().email(),
  postalCode: zod.string().regex(/[0-9]{2}-[0-9]{3}/),
  city: zod.string().min(2),
  street: zod.string().min(2),
  streetNumber: zod.number().min(1),
  housingNumber: zod.number().optional(),
  shoes: zod.array(
    zod.object({
      model: zod.string(),
      size: zod.number().min(1).max(70),
      price: zod.number().min(1),
      count: zod.number().min(1),
    })
  ),
});

type Shoe = {
  model: string;
  size: string;
  price: string;
  count: string;
};

export async function createInvoice(req: Request, res: Response) {
  const { json } = req.body;
  const jsonObject = JSON.parse(json);

  const newShoes = jsonObject.shoes.map((shoe: Shoe) => {
    return {
      model: shoe.model,
      size: +shoe.size,
      price: +shoe.price,
      count: +shoe.count,
    };
  });

  const data = await invoiceSchema.parseAsync({
    date: jsonObject.date,
    lastname: jsonObject.lastname,
    name: jsonObject.name,
    email: jsonObject.email,
    postalCode: jsonObject.postalCode,
    street: jsonObject.street,
    streetNumber: +jsonObject.streetNumber,
    housingNumber: +jsonObject.housingNumber,
    shoes: newShoes,
    city: jsonObject.city,
  });

  const signature = req.files?.signature;
  if (Array.isArray(signature)) {
    throw new BadRequestError("Expected only one image!");
  }
  const imagePath = await uploadFile(signature, { amount: "single" });

  const [year, month, day] = (jsonObject.date as string)
    .split("T")[0]
    .split("-");

  const html = await readFileAsync("public/form.html", "utf-8");

  const invoiceId = uuid().substring(0, 8);

  // const invoiceId = 1234;

  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    footer: {
      height: "5mm",
      contents: {
        default: `<span style="font-size: 14px">Id umowy: ${invoiceId}</span>`,
      },
    },
  };

  const document = {
    html: html,
    data: {
      year,
      month,
      day,
      lastname: jsonObject.lastname,
      name: jsonObject.name,
      postalCode: jsonObject.postalCode,
      street: jsonObject.street,
      streetNumber: jsonObject.streetNumber,
      housingNumber: jsonObject.housingNumber,
      city: jsonObject.city,
      isHousingNumber: !!jsonObject.housingNumber,
      signature: imagePath,
      shoes: jsonObject.shoes,
    },
    path: `./invoices/${invoiceId}.pdf`,
    type: "",
  };

  const { filename } = await pdf.create(document, options);

  await sendInvoice(jsonObject.email, `./invoices/${invoiceId}.pdf`);

  await unlinkAsync(`./public/${imagePath}`);
  await unlinkAsync(`./invoices/${invoiceId}.pdf`);

  res.status(201).json({});
}

const invoiceRouter = Router();

invoiceRouter.post("/", createInvoice);

export { invoiceRouter };
