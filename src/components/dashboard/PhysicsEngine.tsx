import { useEffect, useRef } from "react";
import Matter from "matter-js";

interface PhysicsEngineProps {
  threats: number;
}

export const PhysicsEngine = ({ threats }: PhysicsEngineProps) => {
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

    // 2. Create Bounds (Floor/Walls)
    const { width, height } = render.options;
    Matter.World.add(engine.world, [
      Matter.Bodies.rectangle(width! / 2, height! + 25, width!, 50, { isStatic: true, render: { visible: false } }), // Floor
      Matter.Bodies.rectangle(-25, height! / 2, 50, height!, { isStatic: true, render: { visible: false } }), // Left Wall
      Matter.Bodies.rectangle(width! + 25, height! / 2, 50, height!, { isStatic: true, render: { visible: false } }), // Right Wall
      Matter.Bodies.rectangle(width! / 2, -25, width!, 50, { isStatic: true, render: { visible: false } }), // Ceiling
    ]);

    Matter.Runner.run(Matter.Runner.create(), engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  // Handle Threat Dynamics
  useEffect(() => {
    if (!engineRef.current || !renderRef.current) return;
    const engine = engineRef.current;
    const { width } = renderRef.current.options;

    // Clear old dynamic bodies
    const dynamicBodies = Matter.Composite.allBodies(engine.world).filter((b) => !b.isStatic);
    if (threats === 0) {
      Matter.Composite.remove(engine.world, dynamicBodies);
    } 
    else if (threats > 0) {
      // Add heavy falling red squares (Gravity)
      engine.world.gravity.y = 1;
      const xPos = Math.random() * (width! - 50) + 25;
      const threatBox = Matter.Bodies.rectangle(xPos, -20, 30, 30, {
        restitution: 0.8,
        render: {
          fillStyle: "#ef4444", // red-500
          strokeStyle: "#7f1d1d",
          lineWidth: 2,
        },
      });
      Matter.World.add(engine.world, threatBox);
    }
  }, [threats]);

  // Handle Floating Safe Elements
  useEffect(() => {
    if (threats > 0 || !engineRef.current || !renderRef.current) return;
    
    const engine = engineRef.current;
    engine.world.gravity.y = -0.1; // Floating upwards mechanics

    const interval = setInterval(() => {
      const { width, height } = renderRef.current!.options;
      const xPos = Math.random() * (width! - 50) + 25;
      const safeCircle = Matter.Bodies.polygon(xPos, height! + 20, Math.floor(Math.random() * 3) + 4, 15, {
        restitution: 0.1,
        frictionAir: 0.05,
        render: {
          fillStyle: Math.random() > 0.5 ? "#10b981" : "#0ea5e9", // green or blue
          opacity: 0.6,
        },
      });
      Matter.World.add(engine.world, safeCircle);

      // Cleanup elements floating too high
      const allBodies = Matter.Composite.allBodies(engine.world);
      allBodies.forEach(b => {
        if (b.position.y < -100) Matter.Composite.remove(engine.world, b);
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [threats]);

  return (
    <div
      ref={sceneRef}
      className="absolute right-0 bottom-0 w-[200px] h-[300px] pointer-events-none opacity-80"
      style={{ zIndex: 10 }}
    />
  );
};
