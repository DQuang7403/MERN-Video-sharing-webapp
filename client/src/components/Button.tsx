import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
const buttonStyles = cva(["hover:bg-primary-hover", "transition-color"], {
  variants: {
    variant: {
      default: ["bg-primary", "hover:bg-primary-hover"],
      ghost: ["hover:bg-primary"],
    },
    size: {
      default: [],
      icon: [
        "rounded-full",
        "size-10",
        "flex",
        "items-center",
        "justify-center",
        "p-2",
      ],
      auth: [
        "py-2",
        "px-4",
        "rounded-full",
        "flex-shrink-0",
        "ml-2",
        "font-semibold",
      ]
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;
export default function Button({
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(buttonStyles({ variant, size }), className)}
    />
  );
}
