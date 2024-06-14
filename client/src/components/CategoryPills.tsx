import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
type CategoryPillsProps = {
  categories: string[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

export default function CategoryPills({
  categories,
  selected,
  setSelected,
}: CategoryPillsProps) {
  const TRANSLATE_AMOUNT = 200;
  const [translate, setTranslate] = useState<number>(0);
  const [showLeftArrow, setShowLeftArrow] = useState<Boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<Boolean>(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollerRef.current === null) return;
    const observer = new ResizeObserver((entries) => {
      const container = entries[0].target;
      if (container === null) return;
      setShowLeftArrow(translate > 0);
      setShowRightArrow(
        translate + container.clientWidth < container.scrollWidth,
      );
    });
    observer.observe(scrollerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [categories, translate]);
  return (
    <div ref={scrollerRef} className="overflow-x-hidden relative bg-primary-bg">
      <div
        className="flex whitespace-nowrap gap-3 transition-transform w-[max-content] h-14 py-3"
        style={{ transform: `translateX(-${translate}px)` }}
      >
        {categories.map((category) => {
          return (
            <Button
              key={category}
              className={`py-0.5 px-3 rounded-lg whitespace-nowrap font-semibold ${
                selected === category
                  ? "bg-primary-dark text-primary-bg hover:bg-primary-dark-hover"
                  : "bg-primary"
              }`}
              onClick={() => setSelected(category)}
            >
              {category}
            </Button>
          );
        })}
      </div>
      {showLeftArrow && (
        <div className="absolute top-0 left-0 -traslate-y-1/2 bg-gradient-to-r from-primary-bg from-50% to-transparent w-24 h-full flex items-center">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="h-10 aspect-square w-auto p-1.5"
            onClick={() => {
              setTranslate((translate) => {
                const newTranslate = translate - TRANSLATE_AMOUNT;
                if (newTranslate <= 0) return 0;
                return newTranslate;
              });
            }}
          >
            <IoIosArrowBack className="text-xl" />
          </Button>
        </div>
      )}
      {showRightArrow && (
        <div className="absolute top-0 right-0 -traslate-y-1/2 bg-gradient-to-l from-primary-bg from-50% to-transparent w-24 h-full flex items-center justify-end ">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="h-10 aspect-square w-auto p-1.5"
            onClick={() => {
              setTranslate((translate) => {
                if (scrollerRef.current === null) {
                  return translate;
                }
                const newTranslate = translate + TRANSLATE_AMOUNT;
                const edge = scrollerRef.current.scrollWidth;
                const width = scrollerRef.current.clientWidth;
                if (newTranslate + width >= edge) {
                  return edge - width;
                }
                return newTranslate;
              });
            }}
          >
            <IoIosArrowForward className="text-xl" />
          </Button>
        </div>
      )}
    </div>
  );
}
