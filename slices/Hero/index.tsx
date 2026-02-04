"use client";

import { Bounded } from "@/components/Bounded";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";
import { KeyboardExperience } from "./KeyboardExperience";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(SplitText);

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps) => {
  const ctaText = slice.primary.buy_button_text?.trim();
  const tl = useRef<GSAPTimeline>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(".hero-heading", {
        type: "chars, lines",
        mask: "lines",
        linesClass: "lines++",
      });
      tl.current = gsap.timeline({
        delay: 4.1,
      });
      tl.current
        .from(split.chars, {
          opacity: 0,
          y: -120,
          ease: "back",
          stagger: 0.07,
        })
        .fromTo(
          ".hero-body",
          { opacity: 0, scale: 0.9, y: 30, x: 50, skewY: 5, skewX: 10 },
          {
            opacity: 1,
            duration: 0.8,
            scale: 1,
            y: 0,
            x: 0,
            skewY: 0,
            skewX: 0,
            ease: "power3.inOut",
          },
        );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      tl.current = gsap.timeline({
        delay: 4.1,
      });
      tl.current.fromTo(
        ".hero-heading, .hero-body",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power3.inOut",
        },
      );
    });
  });

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="blue-gradient-bg relative h-dvh text-white text-shadow-black/30 text-shadow-lg"
    >
      <div className="hero-scene pointer-events-none sticky top-0 h-dvh w-full">
        <Canvas shadows="variance">
          <KeyboardExperience />
        </Canvas>
      </div>

      <div className="hero-content absolute inset-x-0 top-0 h-dvh">
        <Bounded
          fullWidth
          className="absolute inset-x-0 top-18 md:top-24 md:left-[8vw]"
        >
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading1: ({ children }) => (
                <h1 className="hero-heading font-black-slanted text-6xl leading-[0.8] uppercase sm:text-7xl lg:text-8xl">
                  {children}
                </h1>
              ),
            }}
          />
        </Bounded>
        <Bounded
          fullWidth
          className="hero-body absolute inset-x-0 bottom-0 md:right-[8vw] md:left-auto"
          innerClassName="flex flex-col gap-3"
        >
          <div className="max-w-md">
            <PrismicRichText
              field={slice.primary.body}
              components={{
                heading2: ({ children }) => (
                  <h2 className="font-bold-slanted mb-1 text-4xl uppercase lg:mb-2 lg:text-6xl">
                    {children}
                  </h2>
                ),
                paragraph: ({ children }) => (
                  <p className="text-lg">{children}</p>
                ),
              }}
            />
          </div>
          {ctaText && (
            <button className="font-bold-slanted group flex w-fit cursor-pointer items-center gap-1 rounded-md bg-[#01A7E1] px-3 py-1 text-2xl uppercase transition disabled:grayscale">
              {ctaText}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                {">"}
              </span>
            </button>
          )}
        </Bounded>
      </div>
    </section>
  );
};

export default Hero;
