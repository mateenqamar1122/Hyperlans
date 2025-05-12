"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
  primaryCTA,
  secondaryCTA,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  primaryCTA?: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(
                    `dark:text-white text-black opacity-0 hidden`,
                    word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={cn(
          "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
          className
        )}
      >
        {renderWords()}
        <motion.span
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
            cursorClassName
          )}
        ></motion.span>
      </div>
      {(primaryCTA || secondaryCTA) && (
        <motion.div 
          className="flex gap-4 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {primaryCTA && (
            <button
              onClick={primaryCTA.onClick}
              className="px-6 py-3 text-sm md:text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {primaryCTA.text}
            </button>
          )}
          {secondaryCTA && (
            <button
              onClick={secondaryCTA.onClick}
              className="px-6 py-3 text-sm md:text-base font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {secondaryCTA.text}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
  primaryCTA,
  secondaryCTA,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  primaryCTA?: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });
  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn("flex space-x-1 my-6", className)}>
        <motion.div
          className="overflow-hidden pb-2"
          initial={{
            width: "0%",
          }}
          whileInView={{
            width: "fit-content",
          }}
          transition={{
            duration: 2,
            ease: "linear",
            delay: 1,
          }}
        >
          <div
            className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {renderWords()}{" "}
          </div>{" "}
        </motion.div>
        <motion.span
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "block rounded-sm w-[4px]  h-4 sm:h-6 xl:h-12 bg-blue-500",
            cursorClassName
          )}
        ></motion.span>
      </div>
      {(primaryCTA || secondaryCTA) && (
        <motion.div 
          className="flex gap-4 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          {primaryCTA && (
            <button
              onClick={primaryCTA.onClick}
              className="px-6 py-3 text-sm md:text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {primaryCTA.text}
            </button>
          )}
          {secondaryCTA && (
            <button
              onClick={secondaryCTA.onClick}
              className="px-6 py-3 text-sm md:text-base font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {secondaryCTA.text}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};