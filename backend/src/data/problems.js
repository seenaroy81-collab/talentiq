import { ARRAY_PROBLEMS } from "./problems/arrays.js";
import { TWO_POINTERS_PROBLEMS } from "./problems/two_pointers.js";
import { SLIDING_WINDOW_PROBLEMS } from "./problems/sliding_window.js";
import { STACK_PROBLEMS } from "./problems/stack.js";
import { BINARY_SEARCH_PROBLEMS } from "./problems/binary_search.js";
import { LINKED_LIST_PROBLEMS } from "./problems/linked_list.js";
import { TREE_PROBLEMS } from "./problems/trees.js";
import { TRIE_PROBLEMS } from "./problems/tries.js";
import { HEAP_PROBLEMS } from "./problems/heap.js";
import { BACKTRACKING_PROBLEMS } from "./problems/backtracking.js";
import { GRAPH_PROBLEMS } from "./problems/graphs.js";
import { DP_PROBLEMS } from "./problems/dp.js";
import { GREEDY_PROBLEMS } from "./problems/greedy.js";
import { INTERVAL_PROBLEMS } from "./problems/intervals.js";
import { MATH_GEOMETRY_PROBLEMS } from "./problems/math_geometry.js";
import { BIT_MANIPULATION_PROBLEMS } from "./problems/bit_manipulation.js";

// Comprehensive problem library with 150+ coding problems across all patterns

export const PROBLEM_CATEGORIES = {
  ARRAYS_HASHING: "Arrays & Hashing",
  TWO_POINTERS: "Two Pointers",
  SLIDING_WINDOW: "Sliding Window",
  STACK: "Stack",
  BINARY_SEARCH: "Binary Search",
  LINKED_LIST: "Linked List",
  TREES: "Tree",
  TRIES: "Tries",
  HEAP: "Heap / Priority Queue",
  BACKTRACKING: "Backtracking",
  GRAPHS: "Graphs",
  DP: "Dynamic Programming",
  GREEDY: "Greedy",
  INTERVALS: "Intervals",
  MATH_GEOMETRY: "Math & Geometry",
  BIT_MANIPULATION: "Bit Manipulation",
};

export const PROBLEMS = {
  ...ARRAY_PROBLEMS,
  ...TWO_POINTERS_PROBLEMS,
  ...SLIDING_WINDOW_PROBLEMS,
  ...STACK_PROBLEMS,
  ...BINARY_SEARCH_PROBLEMS,
  ...LINKED_LIST_PROBLEMS,
  ...TREE_PROBLEMS,
  ...TRIE_PROBLEMS,
  ...HEAP_PROBLEMS,
  ...BACKTRACKING_PROBLEMS,
  ...GRAPH_PROBLEMS,
  ...DP_PROBLEMS,
  ...GREEDY_PROBLEMS,
  ...INTERVAL_PROBLEMS,
  ...MATH_GEOMETRY_PROBLEMS,
  ...BIT_MANIPULATION_PROBLEMS,
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
};

// Helper function to get problems by category
export function getProblemsByCategory(category) {
  return Object.values(PROBLEMS).filter((p) => p.category === category);
}

// Helper function to get problems by difficulty
export function getProblemsByDifficulty(difficulty) {
  return Object.values(PROBLEMS).filter((p) => p.difficulty === difficulty);
}

// Get all unique categories
export function getCategories() {
  return [...new Set(Object.values(PROBLEMS).map((p) => p.category))];
}
