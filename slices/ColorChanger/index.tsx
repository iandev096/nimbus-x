"use client";
import { Bounded } from "@/components/Bounded";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Canvas } from "@react-three/fiber";
import clsx from "clsx";
import Image from "next/image";
import { FC, useCallback, useState } from "react";
import { KEYCAP_TEXTURES, KeycapTexture } from "./constants";
import { KeyboardExperience } from "./KeyboardExperience";

/**
 * Props for `ColorChanger`.
 */
export type ColorChangerProps = SliceComponentProps<Content.ColorChangerSlice>;

/**
 * Component for "ColorChanger" Slices.
 */
const ColorChanger: FC<ColorChangerProps> = ({ slice }) => {
  const [selectedTextureId, setSelectedTextureId] = useState(
    KEYCAP_TEXTURES[0].id,
  );
  const [backgroundText, setBackgroundText] = useState(KEYCAP_TEXTURES[0].name);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleTextureSelect(texture: KeycapTexture) {
    if (texture.id === selectedTextureId || isAnimating) return;

    setIsAnimating(true);
    setSelectedTextureId(texture.id);
    setBackgroundText(texture.name);
  }

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative flex h-[90vh] min-h-[1000px] flex-col overflow-hidden bg-linear-to-br from-[#0f172a] to-[#062f4a] text-white"
    >
      {/* SVG background */}
      <svg
        className="wifull pointer-events-none absolute top-0 left-0 h-auto mix-blend-overlay"
        viewBox="0 0 100 100"
      >
        <text
          fontSize="7"
          textAnchor="middle"
          dominantBaseline="middle"
          x="50%"
          y="50%"
          className="font-black-slanted fill-white/20 uppercase group-hover:fill-white/30 motion-safe:transition-all motion-safe:duration-700"
        >
          {Array.from({ length: 20 }, (_, idx) => {
            return (
              <tspan
                key={idx}
                x={`${(idx + 1) * 10}%`}
                dy={idx === 0 ? -50 : 6}
              >
                {backgroundText.concat(" ").repeat(10).trim()}
              </tspan>
            );
          })}
        </text>
      </svg>

      {/* Canvas */}
      <Canvas
        camera={{ position: [0, 0.5, 0.5], fov: 50, zoom: 1.5 }}
        className="-mb-[10vh] grow"
      >
        <KeyboardExperience
          selectedTextureId={selectedTextureId}
          onAnimationComplete={handleAnimationComplete}
        />
      </Canvas>
      <Bounded
        className="relative shrink-0"
        innerClassName="gap-6 lg:gap-8 flex flex-col lg:flex-row"
      >
        <div className="max-w-md shrink-0">
          <PrismicRichText
            field={slice.primary.heading}
            components={{
              heading2: ({ children }) => (
                <h2 className="font-bold-slanted mb-1 text-4xl uppercase lg:mb-2 lg:text-6xl">
                  {children}
                </h2>
              ),
            }}
          />
          <PrismicRichText
            field={slice.primary.description}
            components={{
              paragraph: ({ children }) => (
                <p className="text-pretty lg:text-lg">{children}</p>
              ),
            }}
          />
        </div>
        <ul className="grid grow grid-cols-2 gap-3 rounded-2xl bg-white p-4 text-black shadow-lg sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
          {KEYCAP_TEXTURES.map((texture) => (
            <li key={texture.id}>
              <button
                onClick={() => handleTextureSelect(texture)}
                className={clsx(
                  "flex aspect-square flex-col items-center justify-center rounded-lg border-2 p-4 hover:scale-105 motion-safe:transition-all motion-safe:duration-300",
                  selectedTextureId === texture.id
                    ? "border-[#81BFED] bg-[#81BFED]/20"
                    : "cursor-pointer border-gray-300 hover:border-gray-500",
                  isAnimating &&
                    "pointer-events-none cursor-not-allowed opacity-50",
                )}
                disabled={isAnimating}
              >
                <div className="mb-3 overflow-hidden rounded border-2 border-black bg-gray-100">
                  <Image
                    src={texture.path}
                    alt={texture.name}
                    width={400}
                    height={255}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-center text-sm font-semibold">
                  {texture.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Bounded>
    </section>
  );
};

export default ColorChanger;
