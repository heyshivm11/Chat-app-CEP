
"use client";

import { usePageLoader } from "./providers/page-loader-provider";
import { Plane } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function PageLoader() {
  const { isLoading } = usePageLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-full h-full overflow-hidden">
            <Plane className="absolute top-1/2 -translate-y-1/2 h-16 w-16 text-primary animate-fly-across" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
