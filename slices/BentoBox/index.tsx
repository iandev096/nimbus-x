import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import { asText, Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import clsx from "clsx";
import { FC } from "react";

/**
 * Props for `BentoBox`.
 */
export type BentoBoxProps = SliceComponentProps<Content.BentoBoxSlice>;

/**
 * Component for "BentoBox" Slices.
 */
const BentoBox: FC<BentoBoxProps> = ({ slice }) => {
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-white"
    >
      <FadeIn>
        <h2 className="font-bold-slanted mb-8 scroll-pt-6 text-6xl uppercase md:text-8xl">
          <PrismicText field={slice.primary.heading} />
        </h2>
      </FadeIn>
      <FadeIn targetChildren className="grid grid-cols-1 gap-4 md:grid-cols-6">
        {slice.primary.items.map((item) => (
          <BentoBoxItem
            key={asText(item.text)}
            image={item.image}
            text={item.text}
            size={item.size}
          />
        ))}
      </FadeIn>
    </Bounded>
  );
};

type BentoBoxItemProps = {} & Content.BentoBoxSliceDefaultPrimaryItemsItem;
type Size = Content.BentoBoxSliceDefaultPrimaryItemsItem["size"]; // can't be null

function BentoBoxItem({ image, text, size }: BentoBoxItemProps) {
  const sizeClassesMap = new Map<Size, string>([
    ["Small", "md:col-span-2"],
    ["Medium", "md:col-span-3"],
    ["Large", "md:col-span-4"],
    [null, "col-span-1"],
  ]);

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-3xl",
        sizeClassesMap.get(size),
      )}
    >
      <PrismicNextImage
        field={image}
        className="h-full w-full object-cover"
        quality={96}
        width={700}
      />

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-black"></div>
      <div className="absolute bottom-0 left-0 max-w-xl p-6 text-xl text-balance text-white">
        <PrismicRichText field={text} />
      </div>
    </div>
  );
}

export default BentoBox;
