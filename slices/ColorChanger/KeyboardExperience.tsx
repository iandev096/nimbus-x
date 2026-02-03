import { Keyboard } from "@/components/Keyboard";
import { Stage, useTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { KEYCAP_TEXTURES } from "./constants";

type KeyboardExperienceProps = {
  selectedTextureId: string;
  onAnimationComplete: () => void;
};

const TEXTURE_PATHS = KEYCAP_TEXTURES.map((texture) => texture.path);

export function KeyboardExperience({
  selectedTextureId,
  onAnimationComplete,
}: KeyboardExperienceProps) {
  const textures = useTexture(TEXTURE_PATHS);

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
      <group>
        <Keyboard
          keycapMaterial={materials[selectedTextureId]}
          knobColor={currentKnobColor}
        />
      </group>
    </Stage>
  );
}
