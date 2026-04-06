import { useEffect, useRef } from "react";
import Matter from "matter-js";

interface DeepfakePhysicsProps {
  isDeepfake: boolean;
  isActive: boolean;
}

export const DeepfakePhysics = ({ isDeepfake, isActive }: DeepfakePhysicsProps) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Matter.js Engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;

    // 2. Create Bounds (Floor/Walls) - Kept out of bounds so elements can float out softly
    const { width, height } = render.options;
    Matter.World.add(engine.world, [
      Matter.Bodies.rectangle(width! / 2, height! + 50, width! + 100, 50, { isStatic: true, render: { visible: false } }), // Floor (lower)
      Matter.Bodies.rectangle(-50, height! / 2, 50, height! + 100, { isStatic: true, render: { visible: false } }), // Left Wall
      Matter.Bodies.rectangle(width! + 50, height! / 2, 50, height! + 100, { isStatic: true, render: { visible: false } }), // Right Wall
      Matter.Bodies.rectangle(width! / 2, -50, width! + 100, 50, { isStatic: true, render: { visible: false }, isSensor: true }), // Ceiling (pass through)
    ]);

    Matter.Runner.run(Matter.Runner.create(), engine);
    Matter.Render.run(render);

    // Optimized resize handler
    const handleResize = () => {
      if (!sceneRef.current || !renderRef.current) return;
      renderRef.current.canvas.width = sceneRef.current.clientWidth;
      renderRef.current.canvas.height = sceneRef.current.clientHeight;
      renderRef.current.options.width = sceneRef.current.clientWidth;
      renderRef.current.options.height = sceneRef.current.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  // Handle Threat Dynamics and Particles
  useEffect(() => {
    if (!engineRef.current || !renderRef.current || !isActive) return;
    const engine = engineRef.current;
    
    // Clear old dynamic bodies when state changes
    const dynamicBodies = Matter.Composite.allBodies(engine.world).filter((b) => !b.isStatic);
    Matter.Composite.remove(engine.world, dynamicBodies);

    // Subtle Particle Spawner
    const interval = setInterval(() => {
      const { width, height } = renderRef.current!.options;
      
      // Limit number of particles to 12 maximum to maintain optimized performance
      const currentBodies = Matter.Composite.allBodies(engine.world).filter((b) => !b.isStatic);
      if (currentBodies.length > 12) {
         // remove oldest
         Matter.Composite.remove(engine.world, currentBodies[0]);
      }

      if (isDeepfake) {
        // Deepfake effect: Subtle gravity, falling red irregular shards
        engine.world.gravity.y = 0.5;
        const xPos = Math.random() * (width! - 50) + 25;
        const shard = Matter.Bodies.polygon(xPos, -20, 3, Math.random() * 8 + 8, {
          restitution: 0.6,
          frictionAir: 0.02,
          render: {
            fillStyle: Math.random() > 0.5 ? "#ef4444" : "#b91c1c", // red variants
            opacity: 0.7,
          },
        });
        Matter.World.add(engine.world, shard);
      } else {
        // Authentic effect: Antigravity, smooth green floating spheres
        engine.world.gravity.y = -0.15; // Smooth slow floating
        const xPos = Math.random() * (width! - 50) + 25;
        const sphere = Matter.Bodies.circle(xPos, height! + 20, Math.random() * 10 + 6, {
          restitution: 0.8,
          frictionAir: 0.04,
          render: {
            fillStyle: Math.random() > 0.5 ? "#10b981" : "#34d399", // green variants
            opacity: 0.5,
          },
        });
        Matter.World.add(engine.world, sphere);
      }

      // Cleanup elements floating too high or falling too low to preserve performance
      const allBodies = Matter.Composite.allBodies(engine.world);
      allBodies.forEach(b => {
        if (!b.isStatic && (b.position.y < -150 || b.position.y > height! + 150)) {
          Matter.Composite.remove(engine.world, b);
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isDeepfake, isActive]);

  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen"
      style={{ zIndex: 0 }}
    />
  );
};
