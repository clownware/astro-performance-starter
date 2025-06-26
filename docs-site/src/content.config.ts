import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        lastUpdated: z.union([z.coerce.date(), z.string(), z.boolean()]).optional(),
        version: z.string().optional(),
      }),
    }),
  }),
};
