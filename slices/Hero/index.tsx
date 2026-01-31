"use client";

import { Bounded } from "@/components/Bounded";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import { Canvas } from "@react-three/fiber";
import { KeyboardExperience } from "./KeyboardExperience";

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps) => {
  const ctaText = slice.primary.buy_button_text?.trim();

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
