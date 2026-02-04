import { Keyboard } from "@/components/Keyboard";
import { useGSAP } from "@gsap/react";
import { Stage, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { KEYCAP_TEXTURES } from "./constants";

gsap.registerPlugin(useGSAP);

type KeyboardExperienceProps = {
  selectedTextureId: string;
  onAnimationComplete: () => void;
};

const TEXTURE_PATHS = KEYCAP_TEXTURES.map((texture) => texture.path);

export function KeyboardExperience({
  selectedTextureId,
  onAnimationComplete,
}: KeyboardExperienceProps) {
  const [currentTextureId, setCurrentTextureId] = useState(selectedTextureId);
  const textures = useTexture(TEXTURE_PATHS);
  const keyboardRef = useRef<THREE.Group>(null);
  const tl = useRef<GSAPTimeline>(null);

  useGSAP(() => {
    // Animate keyboard
    if (!keyboardRef.current || selectedTextureId === currentTextureId) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const keyboard = keyboardRef.current;
      if (!keyboard) return;
      tl.current = gsap.timeline({
        onComplete: () => {
          onAnimationComplete();
        },
      });

      tl.current.to(keyboard.position, {
        y: 0.3,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          setCurrentTextureId(selectedTextureId);
        },
      });
      tl.current.to(keyboard.position, {
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      setCurrentTextureId(selectedTextureId);
      onAnimationComplete();
    });
  }, [selectedTextureId, currentTextureId]);

  const materials = useMemo(() => {
    const materialMap: Record<string, THREE.MeshStandardMaterial> = {};
    KEYCAP_TEXTURES.forEach((textureConfig, index) => {
      const texture = Array.isArray(textures) ? textures[index] : textures;

      if (!texture) return;

      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;

      materialMap[textureConfig.id] = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
      });
    });

    return materialMap;
  }, [textures]);

  const currentKnobColor = KEYCAP_TEXTURES.find(
    (texture) => texture.id === selectedTextureId,
  )?.knobColor;

  return (
    <Stage environment="city" intensity={0.08} shadows="contact">
      <group ref={keyboardRef}>
        <Keyboard
          keycapMaterial={materials[currentTextureId]}
          knobColor={currentKnobColor}
        />
      </group>
    </Stage>
  );
}
