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
          id: crypto.randomUUID(),
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

  postObjectives: publicProcedure
    .input(
      z.object({
        course_id: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [objective] = await ctx.db
        .insert(objectives)
        .values({
          id: crypto.randomUUID(),
          course_id: input.course_id,
          content: input.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return objective;
    }),

  getObjectives: publicProcedure
    .input(
      z.object({
        objective_id: z.string().min(1),
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

  postorUploadFiles: publicProcedure
    .input(
      z.object({
        course_id: z.string().min(1),
        file_url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [file] = await ctx.db
        .insert(files)
        .values({
          id: crypto.randomUUID(),
          course_id: input.course_id,
          file_url: input.file_url,
        })
        .returning();

      return file;
    }),

  postSession: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        completedObjectiveId: z.string().min(1),
        active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [chat] = await ctx.db
        .insert(chats)
        .values({
          id: crypto.randomUUID(),
          userId: input.userId,
          completedObjectives: input.completedObjectiveId,
          active: input.active ?? false,
        })
        .returning();

      return chat;
    }),

  getSession: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(chats)
        .where(and(eq(chats.userId, input.userId), eq(chats.active, false)));
    }),
});
