import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  brainrot,
  chats,
  courses,
  files,
  objectives,
} from "@/server/db/schema";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  postCourse: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().nullable().optional(),
        user_id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [defaultBrainrot] = await ctx.db.select().from(brainrot).limit(1);

      if (!defaultBrainrot) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "No brainrot record exists. Create one before posting a course.",
        });
      }

      const [course] = await ctx.db
        .insert(courses)
        .values({
          title: input.title,
          description: input.description ?? null,
          user_id: input.user_id,
          brainrot: defaultBrainrot.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return course;
    }),

  postObjectives: publicProcedure
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

  postorUploadFiles: publicProcedure
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

  postSession: publicProcedure
    .input(
      z.object({
        courseId: z.number().int().positive(),
        completedObjectiveId: z.number().int().positive(),
        active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [chat] = await ctx.db
        .insert(chats)
        .values({
          courseId: input.courseId,
          completedObjectives: input.completedObjectiveId,
          active: input.active ?? false,
        })
        .returning();

      return chat;
    }),

});
