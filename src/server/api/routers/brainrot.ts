import { asc } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { brainrot } from "@/server/db/schema";

export const brainrotRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: brainrot.id,
        name: brainrot.name,
      })
      .from(brainrot)
      .orderBy(asc(brainrot.name));
  }),
});
