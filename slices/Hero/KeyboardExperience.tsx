"use client";

import { Keyboard, KeyboardRefs } from "@/components/Keyboard";
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
  const keycapsGroupRef = useRef<THREE.Group>(null);
  const keyboardGroupRef = useRef<THREE.Group>(null);
  const keyboardAnimRef = useRef<KeyboardRefs | null>(null);
  const tl = useRef<GSAPTimeline>(null);
  const scrollTl = useRef<GSAPTimeline>(null);

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
      if (!keycapsGroupRef.current) return;

      if (typeof window !== "undefined") {
        const initialScrollY = window.scrollY;
        if (initialScrollY === 0) {
          document.body.style.overflow = "hidden";
        }
      }

      const keyboard = keyboardGroupRef.current;
      const keycaps = keycapsGroupRef.current;

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
        )
        .call(() => {
          if (typeof window !== "undefined") {
            document.body.style.overflow = "";
          }
          if (!keyboard) return;

          scrollTl.current = gsap
            .timeline({
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
              },
            })
            .to(keyboard.position, {
              x: 0,
              y: -0.5,
              z: 2.2,
            })
            .to(
              keyboard.rotation,
              {
                x: Math.PI * -2 + 0.8,
                y: 0,
                z: 0,
                ease: "power2.out",
              },
              "<",
            )
            .to(
              keycaps.scale,
              {
                x: 5,
                y: 5,
                z: 5,
                duration: 1,
                ease: "power2.out",
              },
              "-=0.5",
            );

          // Add wave animation to the scroll timeline
          if (keyboardAnimRef.current) {
            // Collect all switches and keycaps from all rows
            const switchRefs = keyboardAnimRef.current.switches;
            const individualKeys = keyboardAnimRef.current.keys;

            // Collect all switches into a single array
            const allSwitches: THREE.Object3D[] = [];

            // Gather all switches from all rows
            [
              switchRefs.functionRow.current,
              switchRefs.numberRow.current,
              switchRefs.topRow.current,
              switchRefs.homeRow.current,
              switchRefs.bottomRow.current,
              switchRefs.modifiers.current,
              switchRefs.arrows.current,
            ].forEach((row) => {
              if (row) {
                allSwitches.push(...Array.from(row.children));
              }
            });

            // Define keycaps in actual left-to-right COLUMN order across the keyboard
            const keyboardColumns = [
              ["esc", "grave", "tab", "caps", "lshift", "lcontrol"],
              ["f1", "one", "q", "a", "z", "lalt"],
              ["f2", "two", "w", "s", "x", "lwin"],
              ["f3", "three", "e", "d", "c"],
              ["f4", "four", "r", "f", "v"],
              ["f5", "five", "t", "g", "b", "space"],
              ["f6", "six", "y", "h", "n"],
              ["f7", "seven", "u", "j", "m"],
              ["f8", "eight", "i", "k", "comma"],
              ["f9", "nine", "o", "l", "period"],
              ["f10", "zero", "dash", "p", "semicolon", "slash", "ralt"],
              [
                "f11",
                "lsquarebracket",
                "quote",
                "rshift",
                "fn",
                "arrowleft",
                "rsquarebracket",
                "enter",
                "f12",
                "equal",
                "arrowup",
              ],
              [],
              [
                "del",
                "backspace",
                "backslash",
                "pagedown",
                "end",
                "arrowdown",
                "pageup",
                "arrowright",
              ],
              [],
            ];

            // Group keycaps and switches by column
            const keyCapsByColumn: THREE.Mesh[][] = [];
            const switchesByColumn: THREE.Object3D[][] = [];

            // Sort switches by X position to match column order
            const sortedSwitches = allSwitches.sort(
              (a, b) => a.position.x - b.position.x,
            );

            keyboardColumns.forEach((column, columnIndex) => {
              const columnKeycaps: THREE.Mesh[] = [];
              const columnSwitches: THREE.Object3D[] = [];

              column.forEach((keyName) => {
                if (keyName && individualKeys[keyName]?.current) {
                  columnKeycaps.push(individualKeys[keyName].current);
                }
              });

              // Assign switches to columns based on their count
              const switchesPerColumn = Math.ceil(
                sortedSwitches.length / keyboardColumns.length,
              );
              const startIndex = columnIndex * switchesPerColumn;
              const endIndex = Math.min(
                startIndex + switchesPerColumn,
                sortedSwitches.length,
              );

              for (let i = startIndex; i < endIndex; i++) {
                if (sortedSwitches[i]) {
                  columnSwitches.push(sortedSwitches[i]);
                }
              }

              keyCapsByColumn.push(columnKeycaps);
              switchesByColumn.push(columnSwitches);
            });

            // Add wave animation for each column to the scroll timeline
            keyCapsByColumn.forEach((columnKeycaps, columnIndex) => {
              const columnSwitches = switchesByColumn[columnIndex];

              if (columnKeycaps.length === 0 && columnSwitches.length === 0)
                return;

              if (!scrollTl.current) return;

              // Calculate wave timing - spread across scroll timeline
              const waveProgress = columnIndex / (keyboardColumns.length - 1); // 0 to 1
              const waveStartTime = waveProgress * 2 + 0.5; // Spread wave across 2 time units

              // Animate keycaps up then down
              if (columnKeycaps.length > 0) {
                const keycapPositions = columnKeycaps.map(
                  (keycap) => keycap.position,
                );

                // Create temporary keyframe for wave peak
                scrollTl.current.to(
                  keycapPositions,
                  {
                    y: "+=0.08", // Lift keycaps up
                    duration: 0.5,
                    ease: "power2.inOut",
                  },
                  waveStartTime,
                );

                // Return to original position
                scrollTl.current.to(
                  keycapPositions,
                  {
                    y: "-=0.08", // Bring keycaps back down
                    duration: 0.5,
                    ease: "power2.inOut",
                  },
                  waveStartTime + 0.5,
                );
              }

              // Animate switches (follow keycaps with delay and less movement)
              if (columnSwitches.length > 0) {
                const switchPositions = columnSwitches.map(
                  (switchObj) => switchObj.position,
                );

                // Up phase (slightly delayed and lower)
                scrollTl.current.to(
                  switchPositions,
                  {
                    y: "+=0.04", // Less movement for switches
                    duration: 0.3,
                    ease: "power2.inOut",
                  },
                  waveStartTime + 0.2, // Slight delay
                );

                // Down phase
                scrollTl.current.to(
                  switchPositions,
                  {
                    y: "-=0.04",
                    duration: 0.3,
                    ease: "power2.inOut",
                  },
                  waveStartTime + 0.5,
                );
              }
            });
          }
        });
    });
  });

  return (
    <>
      <group>
        <CameraController />
        <PerspectiveCamera position={[0, 0, 4]} fov={50} makeDefault />
        <ambientLight intensity={0.2 * lightIntensityScaler} />

        <group scale={scalingFactor}>
          <group
            ref={keyboardGroupRef}
            // position={[0.2, -0.5, 1.7]}
            // rotation={[1.6, 0.4, 0]}
          >
            <Keyboard
              scale={9}
              castShadow
              receiveShadow
              ref={keyboardAnimRef}
            />
          </group>
          <group ref={keycapsGroupRef}>
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
          environmentIntensity={0.1 * lightIntensityScaler}
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
