import { Suspense } from "react";
import Board from "./components/Board";

function App() {
  return (
    <div className="w-full h-full flex flex-col gap-4 md:gap-8 justify-center items-center pt-4 px-2 sm:pt-8 sm:px-4 md:pt-12 md:px-8 lg:pt-16 lg:px-12">
      <p className="text-4xl font-bold">Strands Solver v1</p>
      <p>by Petr Puš</p>
      <Suspense fallback={<p>Loading words...</p>}>
        <Board />
      </Suspense>
    </div>
  );
}

export default App;
