import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  brainrot,
  chats,
  courses,
  files,
  objectives,
} from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  postCourse: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().nullable().optional(),
        brainrot_id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [selectedBrainrot] = await ctx.db
        .select({ id: brainrot.id })
        .from(brainrot)
        .where(eq(brainrot.id, input.brainrot_id));
      const { id: userId } = ctx.session.user;

      if (!selectedBrainrot) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "No brainrot record exists. Create one before posting a course.",
        });
      }

      const [course] = await ctx.db
        .insert(courses)
        .values({
          title: input.title,
          description: input.description ?? null,
          user_id: userId,
          brainrot: input.brainrot_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return course;
    }),

  postObjectives: protectedProcedure
    .input(
      z.object({
        course_id: z.number().int().positive(),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [objective] = await ctx.db
        .insert(objectives)
        .values({
          course_id: input.course_id,
          content: input.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return objective;
    }),

  postOrUploadFiles: protectedProcedure
    .input(
      z.object({
        course_id: z.number().int().positive(),
        file_url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [file] = await ctx.db
        .insert(files)
        .values({
          course_id: input.course_id,
          file_url: input.file_url,
        })
        .returning();

      return file;
    }),

  postSession: protectedProcedure
    .input(
      z.object({
        courseId: z.number().int().positive(),
        completedObjectiveId: z.number().int().positive(),
        active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let completedObjectiveId = input.completedObjectiveId;

      if (!completedObjectiveId) {
        const [placeholderObjective] = await ctx.db
          .insert(objectives)
          .values({
            course_id: input.courseId,
            content: "Session started",
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning({ id: objectives.id });

        completedObjectiveId = placeholderObjective.id;
      }

      const [chat] = await ctx.db
        .insert(chats)
        .values({
          courseId: input.courseId,
          completedObjectives: completedObjectiveId,
          active: input.active ?? true,
        })
        .returning();

      return chat;
    }),
});
