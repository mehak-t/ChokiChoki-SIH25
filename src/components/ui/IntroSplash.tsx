import { useEffect, useRef, useState, useCallback } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function IntroSplash() {
  const [show, setShow] = useState(false);
  const trainRef = useRef<HTMLDivElement | null>(null);
  const leftDoorRef = useRef<HTMLDivElement | null>(null);
  const rightDoorRef = useRef<HTMLDivElement | null>(null);
  const splashRef = useRef<HTMLDivElement | null>(null);
  const windowGroupRef = useRef<HTMLDivElement | null>(null);

  const timeouts = useRef<number[]>([]);

  const finish = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    const el = document.getElementById("metro-splash");
    if (el && el.style.opacity !== "0") {
      el.style.transition = "opacity .6s cubic-bezier(.77,0,.18,1)";
      el.style.opacity = "0";
      const finalTimeout = window.setTimeout(() => setShow(false), 610);
      timeouts.current.push(finalTimeout);
    } else {
      setShow(false);
    }
    sessionStorage.setItem("introSeen", "1");
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem("introSeen");
    if (seen === "1") return;

    setShow(true);
    const reduce = prefersReducedMotion();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        finish();
      }
    };
    window.addEventListener("keydown", onKey);

    const t0 = requestAnimationFrame(() => {
      const t1 = requestAnimationFrame(() => {
        if (!trainRef.current || !splashRef.current || !windowGroupRef.current) return;

        // 1) Train arrives
        trainRef.current.style.transform = "translate(-50%, -50%)";
        trainRef.current.classList.add('animate-wheels');

        // Schedule the rest of the animation sequence
        const t2 = window.setTimeout(() => {
          if (!splashRef.current) return;
          splashRef.current.style.transition = "transform 1.8s cubic-bezier(.77,0,.18,1)";
          splashRef.current.style.transform = "scale(2.5)";

          const t3 = window.setTimeout(() => {
            const middleWindow = windowGroupRef.current!.querySelector('.metro-window:nth-child(2)') as HTMLDivElement;
            if (middleWindow) {
              middleWindow.style.opacity = '0';
            }

            if (leftDoorRef.current && rightDoorRef.current && trainRef.current) {
              leftDoorRef.current.style.transform = "translateX(-200%)";
              rightDoorRef.current.style.transform = "translateX(200%)";
              trainRef.current.style.opacity = "0";
            }
            
            // Call finish() immediately to fade out the background simultaneously with the train
            finish();

          }, reduce ? 0 : 1800);
          timeouts.current.push(t3);

        }, reduce ? 700 : 3000);
        timeouts.current.push(t2);
      });
      timeouts.current.push(t1);
    });

    return () => {
      window.removeEventListener("keydown", onKey);
      timeouts.current.forEach(clearTimeout);
      cancelAnimationFrame(t0);
    };
  }, [finish]);

  if (!show) return null;

  return (
    <div
      id="metro-splash"
      ref={splashRef}
      className="fixed inset-0 z-[9999] grid place-items-center bg-[#5a5a5a] overflow-hidden"
      aria-label="Loading intro"
      style={{ transition: "opacity .6s cubic-bezier(.77,0,.18,1)" }}
    >
      <style>{`
        .metro-train {
          position: absolute; top: 50%; left: 50%; width: 360px; height: 120px;
          transform: translate(100%, -50%);
          transition: transform 3s cubic-bezier(.77,0,.18,1), opacity 0.8s ease-in;
          z-index: 2; opacity: 1;
        }
        .metro-body {
          position: absolute; width: 100%; height: 100%;
          background: linear-gradient(90deg, #f0f7ff 0%, #e0e7ef 60%, #c8d2e0 100%);
          border-radius: 20px; box-shadow: 0 10px 40px #0005; border: 2px solid #1e293b;
          overflow: hidden;
        }
        .metro-window-group {
          position: absolute; top: 30px; left: 20px; right: 20px; height: 40px;
          display: flex; gap: 12px; z-index: 2;
        }
        .metro-window {
          flex-shrink: 0; width: 60px; height: 100%; background: #3b82f6; border-radius: 8px;
          opacity: 0.9; box-shadow: inset 0 0 8px rgba(0,0,0,0.3);
          transition: opacity 0.5s ease-out;
        }
        .metro-window:nth-child(2) {
          width: 70px;
        }
        .metro-door {
          position: absolute; top: 25px; width: 50px; height: 70px; background: #f3f4f6;
          border-radius: 6px; border: 1.5px solid #1e293b;
          transition: transform 1s cubic-bezier(.77,0,.18,1);
          z-index: 3;
        }
        .metro-door.left { left: 130px; }
        .metro-door.right { left: 180px; }
        .metro-body::before { content: ''; position: absolute; top: 5px; left: 5px; right: 5px; height: 8px; background: linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.8) 100%); border-radius: 4px; }
        .metro-red-strip { position: absolute; bottom: 12px; left: 0; width: 100%; height: 10px; background: #ef4444; z-index: 1; }
        .metro-door::before { content: ''; width: 8px; height: 20px; background: #94a3b8; border-radius: 2px; position: absolute; right: 8px; }
        .metro-headlight { position: absolute; left: 8px; top: 45px; width: 16px; height: 16px; background: #fbbf24; border-radius: 50%; box-shadow: 0 0 18px 6px #fbbf2499; z-index: 2; }
        .metro-tail-light { position: absolute; right: 8px; top: 45px; width: 16px; height: 16px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 18px 6px #ef444499; z-index: 2; }
        .metro-track { position: absolute; top: 98px; left: 0; width: 100%; height: 16px; background: repeating-linear-gradient( to right, #64748b 0 20px, #1e293b 20px 40px ); border-radius: 0 0 12px 12px; z-index: 1; }
        .skip-intro{ position:absolute;right:16px;top:16px;background:white;border:1px solid #0002;border-radius:999px; padding:.35rem .6rem;font-weight:600;font-size:12px;line-height:1;cursor:pointer; z-index: 10000; }
        @keyframes rotateWheels { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .wheel { position: absolute; width: 20px; height: 20px; background-color: #1e293b; border-radius: 50%; border: 2px solid #64748b; bottom: 2px; z-index: 4; }
        .wheel::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; }
        .wheel.front-left { left: 35px; } .wheel.mid-left { left: 85px; } .wheel.rear-left { left: 250px; }
        .metro-train.animate-wheels .wheel { animation: rotateWheels 0.8s linear infinite; }

        /* REMOVED old station-background and station-name styles */

        /* ADDED new styles for the outdoor station background */
        .station-bg-new {
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(to bottom, #87CEEB 0%, #B0E0E6 60%); /* Sky gradient */
            overflow: hidden;
        }

        .station-hills {
            position: absolute;
            bottom: 43%;
            left: -10%;
            width: 120%;
            height: 30%;
            background: #90EE90; /* Light green hills */
            border-radius: 50%;
        }

        .station-platform {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 43%;
            background: #D3D3D3; /* Light grey platform */
            border-top: 12px solid #FFD700; /* Yellow line */
        }

        .station-canopy {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 57%; /* Covers from top down to platform */
            display: flex;
            justify-content: space-around;
        }

        .station-pillar {
            width: 6%;
            height: 100%;
            background: #696969; /* Dark grey pillar */
        }

        .station-roof {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 15%;
            background: #A9A9A9;
        }

        .station-sign {
            position: absolute;
            top: 18%;
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            padding: 8px 12px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.5);
            text-align: center;
            font-family: Arial, sans-serif;
            color: #333;
            z-index: 1;
        }

        .station-sign-title {
            font-size: 25px;
            font-weight: bold;
            text-transform: uppercase;
        }
      `}</style>
      
      <button className="skip-intro" aria-label="Skip intro" onClick={finish}>
        Skip
      </button>

      {/* REPLACED old station background with the new one */}
      <div className="station-bg-new">
        <div className="station-hills"></div>
        <div className="station-platform"></div>
        <div className="station-canopy">
            <div className="station-pillar"></div>
            <div className="station-pillar"></div>
            <div className="station-pillar"></div>
        </div>
        <div className="station-roof"></div>
        <div className="station-sign">
            <div className="station-sign-title">WELCOME TO KMRL</div>
        </div>
      </div>
      
      <div style={{ position: "relative", width: 380, height: 130 }}>
        <div ref={trainRef} className="metro-train">
          <div className="metro-body">
            <div className="metro-red-strip"></div>
            <div ref={windowGroupRef} className="metro-window-group">
                <div className="metro-window"></div>
                <div className="metro-window"></div>
                <div className="metro-window"></div>
            </div>
          </div>
          <div ref={leftDoorRef} className="metro-door left" />
          <div ref={rightDoorRef} className="metro-door right" />
          <div className="metro-headlight" />
          <div className="metro-tail-light" />
          <div className="wheel front-left"></div>
          <div className="wheel mid-left"></div>
          <div className="wheel rear-left"></div>
        </div>
        <div className="metro-track" />
      </div>
    </div>
  );
}