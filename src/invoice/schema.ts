import zod from "zod";

export const invoiceSchema = zod.object({
  date: zod.string(),
  name: zod.string().min(3),
  lastname: zod.string().min(2),
  email: zod.string().email(),
  postalCode: zod.string().min(2),
  city: zod.string().min(2),
  street: zod.string().min(2),
  country: zod.string().min(2),
  currency: zod.enum(["EUR", "PLN"]),
  streetNumber: zod.string().min(1),
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

export type Shoe = {
  model: string;
  size: string;
  price: string;
  count: string;
};

type Invoice = {
  date: Date;
  name: string;
  lastname: string;
  email: string;
  postalCode: string;
  city: string;
  street: string;
  country: string;
  currency: string;
  streetNumber: string;
  housingNumber: string;
  shoes: Shoe[];
};
