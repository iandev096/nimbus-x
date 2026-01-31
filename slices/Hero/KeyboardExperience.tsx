"use client";

import { Keyboard } from "@/components/Keyboard";
import { FloatedKeycap } from "@/components/Keycap";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useState } from "react";

export function KeyboardExperience() {
  const [scalingFactor, setScalingFactor] = useState(1);
  useEffect(() => {
    setScalingFactor(window.innerWidth <= 500 ? 0.5 : 1);
    const resizeObs = new ResizeObserver((instances) => {
      for (const instance of instances) {
        if (instance.contentRect) {
          setScalingFactor(instance.contentRect.width <= 500 ? 0.5 : 1);
        }
      }
    });
    resizeObs.observe(document.body);
    return () => {
      resizeObs.disconnect();
    };
  }, []);

  return (
    <>
      <group>
        <PerspectiveCamera position={[0, 0, 4]} fov={50} makeDefault />
        <ambientLight intensity={0.1} />

        <group scale={scalingFactor}>
          <Keyboard
            scale={9}
            position={[0.2, -0.5, 1.7]}
            rotation={[1.6, 0.4, 0]}
            castShadow
            receiveShadow
          />
          <group>
            <FloatedKeycap
              position={[0, -0.4, 2.6]}
              rotation={[0, 2, 3]}
              texture={0}
            />
            <FloatedKeycap
              position={[-1.4, 0, 2.3]}
              rotation={[3, 2, 1]}
              texture={1}
            />
            <FloatedKeycap
              position={[-1.8, 1, 1.5]}
              rotation={[0, 1, 3]}
              texture={2}
            />
            <FloatedKeycap
              position={[0, 1, 1]}
              rotation={[0, 4, 2]}
              texture={3}
            />
            <FloatedKeycap
              position={[0.7, 0.9, 1.4]}
              rotation={[3, 2, 0]}
              texture={4}
            />
            <FloatedKeycap
              position={[1.3, -0.3, 2.3]}
              rotation={[1, 2, 0]}
              texture={5}
            />
            <FloatedKeycap
              position={[0, 1, 2]}
              rotation={[2, 2, 3]}
              texture={6}
            />
            <FloatedKeycap
              position={[-0.7, 0.6, 2]}
              rotation={[1, 4, 0]}
              texture={7}
            />
            <FloatedKeycap
              position={[-0.77, 0.1, 2.8]}
              rotation={[3, 2, 3]}
              texture={8}
            />
          </group>
        </group>

        <Environment
          files={["/hdr/blue-studio.hdr"]}
          environmentIntensity={0.08}
        />
        <directionalLight
          intensity={2.5}
          castShadow
          position={[-2.3, 0.9, 1.8]}
          shadow-bias={-0.0001}
          shadow-normalBias={0.02}
          shadow-mapSize={4096}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
          shadow-camera-near={0.1}
          shadow-camera-far={10}
        />
      </group>
    </>
  );
}
