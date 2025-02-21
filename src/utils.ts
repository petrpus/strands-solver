import { COLS, ROWS } from "./constants";
import type { Path, Position } from "./types";
import * as words from "./assets/words.json";

export const factorial = (n: number): number => {
  if (n === 0) return 1;
  return n * factorial(n - 1);
};

export const generateLettersPermutations = (
  lettersWithPositions: [string, Position][]
): [string, Path][] => {
  const permutations: [string, Path][] = Array(
    factorial(lettersWithPositions.length)
  )
    .fill([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map((_element) => ["", []]);

  const createWords = (letters: [string, Position][], shift: number) => {
    for (let i = 0; i < letters.length; i++) {
      const [letter, position] = letters[i];
      const roundLength = factorial(letters.length - 1);
      for (let j = 0; j < roundLength; j++) {
        const cursor = j + i * roundLength + shift;
        permutations[cursor][0] += letter;
        permutations[cursor][1].push(position);
      }
      const rest = letters.filter((_, index) => index !== i);
      if (rest.length > 0) createWords(rest, shift + i * roundLength);
    }
  };

  createWords(lettersWithPositions, 0);
  return permutations;
};

export const getLettersWithPositions = (
  letters: string[][]
): [string, Position][] => {
  const lettersWithPositions: [string, Position][] = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (letters[i][j] !== "") {
        lettersWithPositions.push([letters[i][j], [i, j]]);
      }
    }
  }
  return lettersWithPositions;
};

export const solve = (letters: string[][]) => {
  const permutations = generateLettersPermutations(
    getLettersWithPositions(letters)
  );
  const validWords = permutations.filter(
    (word) => word[0].toLowerCase() in words
  );
  const validPaths = validWords.filter((word) => isValidPath(word[1]));
  return validPaths;
};

const isValidPath = (path: Path): boolean => {
  for (let i = 1; i < path.length; i++) {
    const [prevRow, prevCol] = path[i - 1];
    const [row, col] = path[i];
    if (
      Math.abs(prevRow - row) > 1 ||
      Math.abs(prevCol - col) > 1 ||
      (prevRow === row && prevCol === col)
    ) {
      return false;
    }
  }
  return true;
};
