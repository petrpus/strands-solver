import { useEffect, useRef, useState } from "react";
import Field from "./Field";
import { solve } from "../utils";

import { COLS, ROWS } from "../constants";
import { Path } from "../types";

const initLetters: string[][] = Array(ROWS).fill(Array(COLS).fill(""));

const drawPath = (canvas: HTMLCanvasElement, path: Path) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.strokeStyle = "#0092b8";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(path[0][1] * 56 + 24, path[0][0] * 56 + 24);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i][1] * 56 + 24, path[i][0] * 56 + 24);
  }
  ctx.stroke();
};

const Board = () => {
  const [letters, setLetters] = useState(initLetters.map((row) => [...row]));
  const [activeIndex, setActiveIndex] = useState<[number, number]>([0, 0]);
  const [solutions, setSolutions] = useState<[string, Path][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      //event.preventDefault();

      const newLetters = letters.map((row) => [...row]);
      let newIndex = [activeIndex[0], activeIndex[1]] as [number, number];
      if (/^[a-zA-Z]$/.test(event.key)) {
        newLetters[activeIndex[0]][activeIndex[1]] = event.key.toUpperCase();
        const prevPosition = activeIndex[0] * COLS + activeIndex[1];
        const newPosition = prevPosition + 1;
        newIndex = [
          Math.floor((newPosition / COLS) % ROWS),
          newPosition % COLS,
        ];
      }
      if (event.key === "Backspace") {
        newLetters[activeIndex[0]][activeIndex[1]] = "";
        const prevPosition = activeIndex[0] * COLS + activeIndex[1];
        const newPosition = prevPosition - 1;
        newIndex = [Math.floor(newPosition / COLS), newPosition % COLS];
      }
      if (event.key === "Delete") {
        newLetters[activeIndex[0]][activeIndex[1]] = "";
      }
      if (event.key === "ArrowRight") {
        newIndex[1] = activeIndex[1] === COLS - 1 ? 0 : activeIndex[1] + 1;
      }
      if (event.key === "ArrowLeft") {
        newIndex[1] = activeIndex[1] === 0 ? COLS - 1 : activeIndex[1] - 1;
      }
      if (event.key === "ArrowDown") {
        newIndex[0] = activeIndex[0] === ROWS - 1 ? 0 : activeIndex[0] + 1;
      }
      if (event.key === "ArrowUp") {
        newIndex =
          activeIndex[0] === 0
            ? [ROWS - 1, activeIndex[1]]
            : [activeIndex[0] - 1, activeIndex[1]];
      }
      setLetters(newLetters);
      setActiveIndex(newIndex);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activeIndex, letters]);

  const fields = Array.from({ length: ROWS }, (_, i) => {
    return Array.from({ length: COLS }, (_, j) => {
      const index = i * COLS + j;
      return (
        <Field
          key={index}
          letter={letters[i][j]}
          active={i === activeIndex[0] && j === activeIndex[1]}
          onClick={() => setActiveIndex([i, j])}
        />
      );
    });
  }).flat();

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="grid grid-cols-6 gap-2 relative">{fields}</div>
      <div className="flex justify-between">
        <button
          className="rounded-md border border-white px-4 py-2 hover:bg-slate-800 active:bg-slate-700"
          onClick={() => {
            setLetters(initLetters.map((row) => [...row]));
            setActiveIndex([0, 0]);
            setSolutions([]);
          }}
        >
          Clear
        </button>
        <button
          className="rounded-md bg-cyan-800 px-4 py-2 hover:bg-cyan-600 active:bg-cyan-900"
          onClick={() => setSolutions(solve(letters))}
        >
          Solve
        </button>
      </div>
      <p className="mt-4 text-lg font-semibold">Solutions:</p>
      <div className="flex gap-2">
        {solutions.length == 0 ? (
          <p>No solutions</p>
        ) : (
          solutions.map((solution, i) => (
            <div
              className="rounded-md px-2 py-1 bg-slate-700 hover:bg-slate-800 active:bg-slate-700 tracking-widest"
              key={i}
              onMouseEnter={() => drawPath(canvasRef.current!, solution[1])}
              onMouseLeave={() => {
                const ctx = canvasRef.current?.getContext("2d");
                if (!ctx) return;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
              }}
            >
              {solution[0]}
            </div>
          ))
        )}
      </div>
      <canvas
        ref={canvasRef}
        className="absolute -z-10"
        width="328px"
        height="440px"
      />
    </div>
  );
};

export default Board;
