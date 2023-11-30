import { Request, Response, Router } from "express";
import pdf from "pdf-creator-node";
import { readFileAsync } from "../utils/readFileAsync";
import { v4 as uuid } from "uuid";
import { BadRequestError } from "../utils/Errors/BadRequestError";
import { uploadFile } from "../utils/uploadFile";
import { unlinkAsync } from "../utils/unlinkAsync";
import { sendInvoice } from "../utils/emailSender";
import { Shoe, invoiceSchema } from "./schema";
import { prismaClient } from "../main";
import { NotFoundError } from "../utils/Errors/NotFoundError";
import { compare } from "bcrypt";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { ForbiddenError } from "../utils/Errors/ForbiddenError";
import { authorize } from "../middleware/authorize";
config();

type NewShoe = {
  model: string;
  size: number;
  price: number;
  count: number;
};

export async function createInvoice(req: Request, res: Response) {
  const { json } = req.body;
  const jsonObject = JSON.parse(json);

  const newShoes: NewShoe[] = jsonObject.shoes.map((shoe: Shoe) => {
    return {
      model: shoe.model,
      size: +shoe.size,
      price: +shoe.price,
      count: +shoe.count,
    };
  });

  const { shoes, ...data } = await invoiceSchema.parseAsync({
    date: jsonObject.date,
    lastname: jsonObject.lastname,
    name: jsonObject.name,
    email: jsonObject.email,
    postalCode: jsonObject.postalCode,
    street: jsonObject.street,
    streetNumber: jsonObject.streetNumber,
    housingNumber: +jsonObject.housingNumber,
    shoes: newShoes,
    city: jsonObject.city,
    country: jsonObject.country,
    currency: jsonObject.currency,
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

  // const invoiceId = "1234";

  await prismaClient.invoice.create({
    data: {
      id: invoiceId,
      ...data,
      shoes: {
        createMany: {
          data: newShoes,
        },
      },
    },
  });

  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    footer: {
      height: "5mm",
      contents: {
        default: `<span style="font-size: 10px">Id umowy: ${invoiceId}</span>`,
      },
    },
  };

  const currencyMark = {
    PLN: "zł",
    EUR: "€",
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
      country: jsonObject.country,
      currency: jsonObject.currency,
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

export async function login(req: Request, res: Response) {
  const { login, password } = req.body;
  if (!login || !password)
    throw new BadRequestError("Login and password are mandatory!");
  const passwordResult = await compare(password, process.env.APP_PASSWORD!);
  const loginResult = login === process.env.APP_LOGIN;
  if (!passwordResult || !loginResult)
    throw new ForbiddenError("Invalid login or password!");
  const token = jwt.sign({ login }, process.env.JWT_SECRET!, {
    expiresIn: "365d",
  });
  res.status(200).json({ token });
}

export async function getInvoices(req: Request, res: Response) {
  const { page, limit, query, orderByDate } = req.query;
  const newQuery = (query as string) || "";
  const newOrderByDate = orderByDate === "asc" ? orderByDate : "desc";

  const invoices = await prismaClient.invoice.findMany({
    take: Number(limit) || 10,
    skip: (Number(page) - 1) * Number(limit) || 0,
    orderBy: {
      date: newOrderByDate,
    },
    where: {
      OR: [
        {
          country: {
            contains: newQuery,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: newQuery,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: newQuery,
            mode: "insensitive",
          },
        },
        {
          lastname: {
            contains: newQuery,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  res.status(200).json(invoices);
}
export async function getInvoiceById(req: Request, res: Response) {
  const { id } = req.params;
  const invoice = await prismaClient.invoice.findUnique({
    where: {
      id: id,
    },
    include: {
      shoes: {},
    },
  });
  if (!invoice) throw new NotFoundError("Invoice not found!");
  res.status(200).json(invoice);
}

export async function deleteInvoiceById(req: Request, res: Response) {
  const { id } = req.params;
  const invoice = await prismaClient.invoice.delete({
    where: {
      id: id,
    },
  });
  res.status(204);
}

const invoiceRouter = Router();

invoiceRouter.post("/invoices", createInvoice);
invoiceRouter.post("/login", login);
invoiceRouter.get("/invoices", authorize, getInvoices);
invoiceRouter.get("/invoices/:id", authorize, getInvoiceById);
invoiceRouter.delete("/invoices/:id", authorize, deleteInvoiceById);

export { invoiceRouter };
