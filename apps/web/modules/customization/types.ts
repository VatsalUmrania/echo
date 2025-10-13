import z from "zod";
import { widgetSettingSchema } from "./schema";

export type FormSchema = z.infer<typeof widgetSettingSchema>