import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { ReactNode } from "react";

type BoundedProps = {
  as?: "section" | "footer";
  fullWidth?: boolean;
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export function Bounded({
  as = "section",
  fullWidth = false,
  className,
  innerClassName,
  children,
  asChild = false,
  ...props
}: BoundedProps) {
  const Comp = asChild ? Slot : as;

  return (
    <Comp
      className={clsx(
        "px-6 py-10 md:py-20 [.header+&]:pt-44 [.header+&]:md:pt-32",
        className,
      )}
      {...props}
    >
      <div
        className={clsx(
          "mx-auto w-full",
          !fullWidth && "max-w-7xl",
          innerClassName,
        )}
      >
        {children}
      </div>
    </Comp>
  );
}
