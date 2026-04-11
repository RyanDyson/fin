import { and, count, eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { chats, courses, files, objectives } from "@/server/db/schema";

export const courseRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    // TEMPORARY: fallback to a hardcoded user ID for dashboard preview without auth
    const userId = ctx.session?.user?.id ?? "rBji61OyvMYVCetmynej7FDOroGqUDT9";
    // const userId = ctx.session?.user?.id;
    // if (!userId) return []; // Fallback to empty if not authenticated


    const dbCourses = await ctx.db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        createdAt: courses.createdAt,
      })
      .from(courses)
      .where(eq(courses.user_id, userId));

    const withProgress = await Promise.all(
      dbCourses.map(async (course) => {
        const [fileCountResult] = await ctx.db
          .select({ value: count() })
          .from(files)
          .where(eq(files.course_id, course.id));

        const [objectiveCountResult] = await ctx.db
          .select({ value: count() })
          .from(objectives)
          .where(eq(objectives.course_id, course.id));

        const [completedObjectiveCountResult] = await ctx.db
          .select({ value: count() })
          .from(chats)
          .innerJoin(objectives, eq(chats.completedObjectives, objectives.id))
          .where(
            and(
                // eq(chats.userId, userId), 
                eq(objectives.course_id, course.id)),
          );

        return {
          id: course.id,
          title: course.title,
          description: course.description ?? "",
          createdAt: course.createdAt,
          fileCount: fileCountResult?.value ?? 0,
          totalObjectives: objectiveCountResult?.value ?? 0,
          completedObjectives: completedObjectiveCountResult?.value ?? 0,
        };
      }),
    );

    return withProgress.sort((a, b) => {
      const first = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const second = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return second - first;
    });
  }),
});
