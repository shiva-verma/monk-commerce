import { cartSchema } from "../model/cartSchema";
import { z } from "zod";

export type CartType = z.infer<typeof cartSchema>;
