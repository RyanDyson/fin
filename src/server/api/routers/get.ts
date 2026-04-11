import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { brainrot, chats, courses, objectives } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const getRouter = createTRPCRouter({
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getCourses: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    return await ctx.db.select().from(courses).where(eq(courses.user_id, id));
  }),

  getCourseById: protectedProcedure
    .input(
      z.object({
        course_id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(courses)
        .where(
          and(
            eq(courses.id, input.course_id),
            eq(courses.user_id, ctx.session.user.id),
          ),
        );

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found.",
        });
      }

      return result;
    }),

  getObjectives: protectedProcedure
    .input(
      z.object({
        objective_id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(objectives)
        .innerJoin(courses, eq(objectives.course_id, courses.id))
        .where(
          and(
            eq(objectives.id, input.objective_id),
            eq(courses.user_id, ctx.session.user.id),
          ),
        );

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Objective not found.",
        });
      }

      return result.objectives;
    }),

  getDoneObjectives: protectedProcedure
    .input(
      z.object({
        course_id: z.number().int().positive().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(objectives.isDone, true),
        eq(courses.user_id, ctx.session.user.id),
      ];

      if (input.course_id) {
        conditions.push(eq(objectives.course_id, input.course_id));
      }

      const results = await ctx.db
        .select()
        .from(objectives)
        .innerJoin(courses, eq(objectives.course_id, courses.id))
        .where(and(...conditions));

      return results.map((r) => r.objectives);
    }),

  getChats: protectedProcedure
    .input(
      z.object({
        courseId: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(chats)
        .innerJoin(courses, eq(chats.courseId, courses.id))
        .where(
          and(
            eq(chats.courseId, input.courseId),
            eq(chats.active, false),
            eq(courses.user_id, ctx.session.user.id),
          ),
        );

      return results.map((r) => r.chats);
    }),

  getBrainrot: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(brainrot);
  }),
});
