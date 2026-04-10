import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import {
  brainrot,
  chats,
  courses,
  files,
  objectives,
} from "@/server/db/schema";
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

  getCourseById: publicProcedure
    .input(
      z.object({
        user_id: z.string().min(1),
        course_id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [course] = await ctx.db
        .select()
        .from(courses)
        .where(
          and(
            eq(courses.id, input.course_id),
            eq(courses.user_id, input.user_id),
          ),
        );

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found.",
        });
      }

      return course;
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

  getCourseObjectives: publicProcedure
    .input(
      z.object({
        course_id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(objectives)
        .where(eq(objectives.course_id, input.course_id));
    }),

  getCourseFiles: publicProcedure
    .input(
      z.object({
        course_id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(files)
        .where(eq(files.course_id, input.course_id));
    }),

//   getChats: publicProcedure
//     .input(
//       z.object({
//         courseId: z.number().int().positive(),
//       }),
//     )
//     .query(async ({ ctx, input }) => {
//       return await ctx.db
//         .select()
//         .from(chats)
//         .where(
//           and(eq(chats.courseId, input.courseId), eq(chats.active, false)),
//         );
//     }),

  getActiveChat: publicProcedure
    .input(
      z.object({
        courseId: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [chat] = await ctx.db
        .select()
        .from(chats)
        .where(and(eq(chats.courseId, input.courseId), eq(chats.active, true)));

      return chat ?? null;
    }),

  getChatHistory: publicProcedure
    .input(
      z.object({
        courseId: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(chats)
        .where(
          and(eq(chats.courseId, input.courseId), eq(chats.active, false)),
        );
    }),

  getBrainrot: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(brainrot);
  }),
});
