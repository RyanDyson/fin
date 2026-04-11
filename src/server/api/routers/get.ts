import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  brainrot,
  chats,
  courses,
  messages,
  objectives,
} from "@/server/db/schema";
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

  getCourseProgress: protectedProcedure
    .input(
      z.object({
        course_id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          objectiveId: objectives.id,
          isDone: objectives.isDone,
        })
        .from(objectives)
        .innerJoin(courses, eq(objectives.course_id, courses.id))
        .where(
          and(
            eq(courses.id, input.course_id),
            eq(courses.user_id, ctx.session.user.id),
          ),
        );

      const totalObjectives = rows.length;
      const completedObjectives = rows.filter((row) => row.isDone).length;
      const completedRatio =
        totalObjectives === 0 ? 0 : completedObjectives / totalObjectives;

      return {
        courseId: input.course_id,
        totalObjectives,
        completedObjectives,
        completedRatio,
      };
    }),

  getCourseObjectives: protectedProcedure
    .input(
      z.object({
        course_id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(objectives)
        .innerJoin(courses, eq(objectives.course_id, courses.id))
        .where(
          and(
            eq(objectives.course_id, input.course_id),
            eq(courses.user_id, ctx.session.user.id),
          ),
        )
        .orderBy(objectives.id);

      return results.map((result) => result.objectives);
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
            eq(courses.user_id, ctx.session.user.id),
          ),
        );

      const chatsWithMetadata = await Promise.all(
        results.map(async (result) => {
          const [firstMessage] = await ctx.db
            .select({ createdAt: messages.createdAt, content: messages.content })
            .from(messages)
            .where(eq(messages.chat_id, result.chats.id))
            .orderBy(messages.createdAt)
            .limit(1);

          const [lastMessage] = await ctx.db
            .select({ createdAt: messages.createdAt, content: messages.content })
            .from(messages)
            .where(eq(messages.chat_id, result.chats.id))
            .orderBy(desc(messages.createdAt))
            .limit(1);

          return {
            id: result.chats.id,
            courseId: result.chats.courseId,
            active: result.chats.active,
            completedObjectives: result.chats.completedObjectives,
            title:
              firstMessage?.content?.slice(0, 60)?.trim() ||
              `Chat ${result.chats.id}`,
            date: lastMessage?.createdAt ?? firstMessage?.createdAt ?? null,
            lastMessage: lastMessage?.content ?? null,
          };
        }),
      );

      return chatsWithMetadata;
    }),

  getBrainrot: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(brainrot);
  }),
});
