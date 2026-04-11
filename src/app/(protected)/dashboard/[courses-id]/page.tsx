"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChatTeardropTextIcon,
  FileArrowUpIcon,
  CheckCircleIcon,
  CircleIcon,
  FileIcon,
  PlusIcon,
  TargetIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { UploadDialog } from "@/components/global/upload-dialog";
import { use } from "react";
import { AppNavbar } from "@/components/global/app-navbar";

// Mock Data
const mockObjectives = [
  {
    id: "1",
    content: "Understand inertia and an object's resistance to change",
    completed: true,
  },
  {
    id: "2",
    content: "Explain that force is mass times acceleration (F=ma)",
    completed: true,
  },
  {
    id: "3",
    content: "Provide a real-world example of the second law",
    completed: false,
  },
  {
    id: "4",
    content: "Address the 'dumb student' misconceptions",
    completed: false,
  },
];

const mockFiles = [
  {
    id: "1",
    name: "Newton's Principia.pdf",
    size: "2.4 MB",
    date: "Oct 12, 2023",
  },
  {
    id: "2",
    name: "Physics_101_Syllabus.docx",
    size: "1.1 MB",
    date: "Oct 10, 2023",
  },
  {
    id: "3",
    name: "Lecture_3_Slides.pptx",
    size: "4.5 MB",
    date: "Oct 14, 2023",
  },
];

const mockChats = [
  {
    id: "chat-123",
    title: "Reviewing Newton's First Law",
    date: "Oct 15, 2023",
    progress: "100%",
  },
  {
    id: "chat-456",
    title: "Explaining F=ma",
    date: "Oct 16, 2023",
    progress: "50%",
  },
  {
    id: "chat-789",
    title: "General Q&A Session",
    date: "Oct 18, 2023",
    progress: "10%",
  },
];

export default function CourseDashboardPage({
  params,
}: {
  params: Promise<{ "courses-id": string }>;
}) {
  const routeParams = use(params);
  const courseId = routeParams["courses-id"];
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <>
      <AppNavbar />
      <UploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={(files) => {
          console.log(files);
        }}
      />
      <div className="container mx-auto max-w-7xl space-y-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-primary text-3xl font-bold tracking-tight">
              Newton&apos;s Laws of Motion
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Master the fundamental principles of classical mechanics.
            </p>
          </div>
          <Link href={`/dashboard/${courseId}/new-chat`}>
            <Button size="lg" variant="gradient">
              <PlusIcon weight="bold" className="mr-2 size-5" />
              Start New Chat
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Objectives & Files */}
          <div className="space-y-8 lg:col-span-2">
            {/* Learning Objectives */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TargetIcon className="text-primary size-5" />
                    Learning Objectives
                  </CardTitle>
                  <CardDescription>
                    Goals set by the AI for this topic.
                  </CardDescription>
                </div>
                <Button variant="gradient" size="sm">
                  Edit Goals
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>Objective</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockObjectives.map((obj) => (
                      <TableRow key={obj.id}>
                        <TableCell>
                          {obj.completed ? (
                            <CheckCircleIcon
                              weight="fill"
                              className="size-5 text-green-500"
                            />
                          ) : (
                            <CircleIcon className="text-muted-foreground size-5" />
                          )}
                        </TableCell>
                        <TableCell
                          className={
                            obj.completed
                              ? "text-muted-foreground line-through"
                              : "text-foreground font-medium"
                          }
                        >
                          {obj.content}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Files & Materials */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileIcon className="text-primary size-5" />
                    Course Materials
                  </CardTitle>
                  <CardDescription>
                    Reference files used to generate the curriculum.
                  </CardDescription>
                </div>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <FileArrowUpIcon className="mr-2 size-4" />
                  Upload File
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead className="text-right">Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">
                          {file.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {file.date}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-right">
                          {file.size}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chat History */}
          <div className="space-y-8 lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChatTeardropTextIcon className="text-primary size-5" />
                  Chat History
                </CardTitle>
                <CardDescription>
                  Your previous practice sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="flex flex-col">
                  {mockChats.map((chat) => (
                    <Link
                      key={chat.id}
                      href={`/dashboard/${courseId}/${chat.id}`}
                      className="hover:bg-muted/50 border-b px-6 py-4 transition-colors last:border-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-foreground leading-none font-medium">
                            {chat.title}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {chat.date}
                          </p>
                        </div>
                        <div className="bg-primary/10 text-primary flex h-6 items-center rounded-full px-2.5 text-xs font-semibold">
                          {chat.progress}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
