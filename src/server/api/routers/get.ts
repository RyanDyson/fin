import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { brainrot, chats, courses, objectives } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const getRouter = createTRPCRouter({
  getSecretMessage: publicProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getCourse: publicProcedure
    .input(
      z.object({
        user_id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(courses)
        .where(eq(courses.user_id, input.user_id));
    }),

	getObjectives: publicProcedure
		.input(
			z.object({
				objective_id: z.number().int().positive(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const [objective] = await ctx.db
				.select()
				.from(objectives)
				.where(eq(objectives.id, input.objective_id));

      if (!objective) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Objective not found.",
        });
      }

      return objective;
    }),

	getChats: publicProcedure
		.input(
			z.object({
				courseId: z.number().int().positive(),
			}),
		)
		.query(async ({ ctx, input }) => {
			return await ctx.db
				.select()
				.from(chats)
				.where(and(eq(chats.courseId, input.courseId), eq(chats.active, false)));
		}),

	getBrainrot: publicProcedure
		.query(async ({ ctx }) => {
			return await ctx.db.select().from(brainrot);
		}),
});
