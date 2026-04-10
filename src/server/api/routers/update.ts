import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { brainrot, courses } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const updateRouter = createTRPCRouter({
	updateBrainrot: publicProcedure
		.input(
			z.object({
				user_id: z.string().min(1),
				course_id: z.string().min(1),
				brainrot_id: z.string().min(1).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let targetBrainrotId = input.brainrot_id;

			if (!targetBrainrotId) {
				const [defaultBrainrot] = await ctx.db.select().from(brainrot).limit(1);

				if (!defaultBrainrot) {
					throw new TRPCError({
						code: "PRECONDITION_FAILED",
						message:
							"No brainrot record exists. Create one before updating course brainrot.",
					});
				}

				targetBrainrotId = defaultBrainrot.id;
			}

			const [updatedCourse] = await ctx.db
				.update(courses)
				.set({
					brainrot: targetBrainrotId,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(courses.id, input.course_id),
						eq(courses.user_id, input.user_id),
					),
				)
				.returning();

			if (!updatedCourse) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Course not found for this user.",
				});
			}

			return updatedCourse;
		}),

	updateCouseTitle: publicProcedure
		.input(
			z.object({
				user_id: z.string().min(1),
				course_id: z.string().min(1),
				title: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [updatedCourse] = await ctx.db
				.update(courses)
				.set({
					title: input.title,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(courses.id, input.course_id),
						eq(courses.user_id, input.user_id),
					),
				)
				.returning();

			if (!updatedCourse) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Course not found for this user.",
				});
			}

			return updatedCourse;
		}),

	updateCourseDecription: publicProcedure
		.input(
			z.object({
				user_id: z.string().min(1),
				course_id: z.string().min(1),
				description: z.string().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [updatedCourse] = await ctx.db
				.update(courses)
				.set({
					description: input.description,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(courses.id, input.course_id),
						eq(courses.user_id, input.user_id),
					),
				)
				.returning();

			if (!updatedCourse) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Course not found for this user.",
				});
			}

			return updatedCourse;
		}),
});
