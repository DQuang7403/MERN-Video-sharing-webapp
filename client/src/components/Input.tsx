import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
const inputStyles = cva([""], {
  variants: {
    variant: {
      default: [
        "bg-transparent",
        "border",
        "border-secondary-text",
        "rounded-lg",
        'focus:border-blue-500',
        "outline-none"
      ],
    },
    size: {
      default: ["py-2", "px-4", "w-full", "placeholder:text-secondary-text", "mt-2"],
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type InputProps = VariantProps<typeof inputStyles> & ComponentProps<"input">;
export default function Input({
  variant,
  size,
  className,
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={twMerge(inputStyles({ variant, size }), className)}
    />
  );
}
