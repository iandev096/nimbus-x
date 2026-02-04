"use client";

import { Keyboard } from "@/components/Keyboard";
import { FloatedKeycap } from "@/components/Keycap";
import { useGSAP } from "@gsap/react";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

function CameraController() {
  const { camera, size } = useThree();
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const targetPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const prefersReducedMotionRef = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  const baseCameraPosition = useMemo(() => {
    return new THREE.Vector3(0, 0, 4);
  }, []);

  useFrame(() => {
    const mouse = mouseRef.current;

    if (prefersReducedMotionRef.current) {
      camera.position.copy(baseCameraPosition);
      camera.lookAt(targetPositionRef.current);
      return;
    }

    const tiltX = (mouse.x - 0.5) * 0.5;
    const tiltY = (mouse.y - 0.5) * 0.5;

    const targetPosition = new THREE.Vector3(
      baseCameraPosition.x - tiltX,
      baseCameraPosition.y + tiltY,
      baseCameraPosition.z,
    );

    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(targetPositionRef.current);
  });

  useEffect(() => {
    if (prefersReducedMotionRef.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX / size.width;
      mouseRef.current.y = event.clientY / size.height;
    };
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [size.width, size.height]);

  return null;
}

export function KeyboardExperience() {
  const keyboardGroupRef = useRef<THREE.Group>(null);
  const tl = useRef<GSAPTimeline>(null);

  const [scalingFactor, setScalingFactor] = useState(1);
  const [lightIntensityScaler, setLightIntensityScaler] = useState(0);

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

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!keyboardGroupRef.current) return;

      const keyboard = keyboardGroupRef.current;

      tl.current = gsap.timeline({
        ease: "power2.out",
      });
      tl.current
        .to(keyboard.position, {
          x: 0,
          y: -0.5,
          z: 0.5,
          duration: 2.5,
          ease: "power2.out",
        })
        .to(
          { lightIntensityScaler: 0 },
          {
            lightIntensityScaler: 1,
            duration: 4,
            ease: "power2.out",
            onUpdate() {
              setLightIntensityScaler(this.targets()[0].lightIntensityScaler);
            },
          },
          "<",
        )
        .to(
          keyboard.rotation,
          {
            x: 1.6,
            y: 0.4,
            z: 0,
            duration: 1.8,
            ease: "power2.out",
          },
          "-=1.6",
        )
        .to(
          keyboard.position,
          {
            x: 0.2,
            y: -0.5,
            z: 1.9,
            duration: 2,
          },
          "<",
        );
    });
  });

  return (
    <>
      <group>
        <CameraController />
        <PerspectiveCamera position={[0, 0, 4]} fov={50} makeDefault />
        <ambientLight intensity={0.1 * lightIntensityScaler} />

        <group scale={scalingFactor}>
          <group
            ref={keyboardGroupRef}
            // position={[0.2, -0.5, 1.7]}
            // rotation={[1.6, 0.4, 0]}
          >
            <Keyboard scale={9} castShadow receiveShadow />
          </group>
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
          environmentIntensity={0.08 * lightIntensityScaler}
        />
        <directionalLight
          intensity={2.5 * lightIntensityScaler}
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
