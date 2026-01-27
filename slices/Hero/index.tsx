import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Link from "next/link";

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
      className="blue-gradient-bg text-white"
    >
      <PrismicRichText
        field={slice.primary.heading}
        components={{
          heading1: ({ children }) => (
            <h1 className="text-4xl font-bold">{children}</h1>
          ),
          heading2: ({ children }) => (
            <h2 className="text-2xl font-bold">{children}</h2>
          ),
        }}
      />
      <PrismicRichText
        field={slice.primary.body}
        components={{
          paragraph: ({ children }) => <p className="text-lg">{children}</p>,
        }}
      />
      {ctaText && (
        <Link href={"#"}>
          <button className="font-bold-slanted group flex w-fit cursor-pointer items-center gap-1 rounded-md bg-[#01A7E1] px-3 py-1 text-2xl uppercase transition disabled:grayscale">
            {ctaText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              {">"}
            </span>
          </button>
        </Link>
      )}
    </section>
  );
};

export default Hero;
