import { useState } from "react";
import { motion } from "framer-motion";
import AgentChat from "./AgentChat";
import AgentVisualBuilder from "./AgentVisualBuilder";

const AgentBuilder = () => {
  const [highlightedBlocks, setHighlightedBlocks] = useState<string[]>([]);

  const handleBlockSuggested = (blockId: string) => {
    setHighlightedBlocks((prev) =>
      prev.includes(blockId) ? prev : [...prev, blockId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex min-h-0"
    >
      {/* Chat - Left side */}
      <div className="w-[45%] border-r border-border/30 flex flex-col min-h-0">
        <AgentChat onBlockSuggested={handleBlockSuggested} />
      </div>

      {/* Visual Builder - Right side */}
      <div className="w-[55%] flex flex-col min-h-0">
        <AgentVisualBuilder highlightedBlocks={highlightedBlocks} />
      </div>
    </motion.div>
  );
};

export default AgentBuilder;
