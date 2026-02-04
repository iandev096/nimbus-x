"use client";

import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FadeInProps = {
  children: React.ReactNode;
  vars?: gsap.TweenVars;
  start?: string;
  className?: string;
  targetChildren?: boolean;
};

export function FadeIn({
  children,
  vars = {},
  start = "top 50%",
  className,
  targetChildren,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const target = targetChildren ? ref.current?.children : ref.current;
    if (!target) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        target,
        { opacity: 0, y: 60 },
        {
          duration: 0.8,
          opacity: 1,
          ease: "power3.inOut",
          y: 0,
          stagger: 0.2,
          ...vars,
          scrollTrigger: {
            trigger: ref.current,
            start,
          },
        },
      );
    });
  }, [vars, targetChildren]);

  return (
    <div ref={ref} className={clsx(className)}>
      {children}
    </div>
  );
}
