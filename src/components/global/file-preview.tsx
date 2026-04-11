"use client";

import { useEffect, useRef } from "react";
import Viewer from "@nutrient-sdk/viewer";

export default function FilePreview({ file }: { file: File }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const objectUrl = URL.createObjectURL(file);

    Viewer.load({
      container,
      document: objectUrl,
    }).catch(console.error);

    return () => {
      try {
        Viewer.unload(container);
      } catch (error) {
        console.error("Failed to unload viewer:", error);
      }
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return <div ref={containerRef} className="h-full min-h-[500px] w-full" />;
}
