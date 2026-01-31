import { Float, useGLTF, useTexture } from "@react-three/drei";
import { useState } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Keycap: THREE.Mesh;
  };
  materials: Record<string, unknown>;
};

interface KeycapProps extends React.ComponentProps<"group"> {
  texture?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export function Keycap({ texture, ...props }: KeycapProps) {
  const { nodes } = useGLTF("/keycap.gltf") as unknown as GLTFResult;
  const [placeholderMat] = useState(() => {
    const mat = new THREE.MeshStandardMaterial({
      roughness: 0.6,
    });
    return mat;
  });

  const textures = [
    "/keycap_uv-1.png",
    "/keycap_uv-2.png",
    "/keycap_uv-3.png",
    "/keycap_uv-4.png",
    "/keycap_uv-5.png",
    "/keycap_uv-6.png",
    "/keycap_uv-7.png",
    "/keycap_uv-8.png",
    "/keycap_uv-9.png",
  ];

  const uvTexture = textures[texture ?? 0];

  const keycapTexture = useTexture(uvTexture);
  keycapTexture.flipY = false;
  keycapTexture.colorSpace = THREE.SRGBColorSpace;

  placeholderMat.map = keycapTexture;

  return (
    <group dispose={null} {...props}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Keycap.geometry}
        material={placeholderMat}
        rotation={[Math.PI / 2, 0, 0]}
        scale={10}
      />
    </group>
  );
}

export function FloatedKeycap({ texture, ...props }: KeycapProps) {
  return (
    <Float rotationIntensity={2} floatIntensity={0.5}>
      <group {...props}>
        <Keycap texture={texture} />
      </group>
    </Float>
  );
}
