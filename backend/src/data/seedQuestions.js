import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dsaProblems = [
  { 
    title: "Two Sum", 
    category: "Arrays", 
    difficulty: "easy", 
    question: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] == 6." }
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."]
  },
  { 
    title: "Valid Parentheses", 
    category: "Strings", 
    difficulty: "easy", 
    question: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."]
  },
  { 
    title: "Merge Two Sorted Lists", 
    category: "Linked Lists", 
    difficulty: "easy", 
    question: "Merge two sorted linked lists and return it as a sorted list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" }
    ],
    constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100", "Both list1 and list2 are sorted in non-decreasing order."]
  },
  { 
    title: "Maximum Subarray", 
    category: "Arrays", 
    difficulty: "medium", 
    question: "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum = 6." }
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"]
  },
  { 
    title: "Reverse Linked List", 
    category: "Linked Lists", 
    difficulty: "easy", 
    question: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }
    ],
    constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"]
  }
];

const categories = ["Arrays", "Strings", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", "Backtracking", "Two Pointers", "Binary Search", "Stacks & Queues", "Greedy", "Heaps", "Bit Manipulation"];
const difficulties = ["easy", "medium", "hard"];

const problemTemplates = {
  "Arrays": [
    "Find the maximum product of two integers in an array of size N.",
    "Rotate an array of N elements to the right by K steps.",
    "Check if an array contains any duplicate elements."
  ],
  "Strings": [
    "Determine if a string is a palindrome after removing non-alphanumeric characters.",
    "Find the first non-repeating character in a string.",
    "Reverse only the vowels in a given string."
  ],
  "Trees": [
    "Find the maximum depth of a binary tree.",
    "Check if two binary trees are identical.",
    "Invert a binary tree (mirror image)."
  ],
  "Graphs": [
    "Find the number of connected components in an undirected graph.",
    "Check if there is a path between two nodes in a directed graph.",
    "Implement Breadth First Search for a given graph representation."
  ],
  "Linked Lists": [
    "Remove the N-th node from the end of a linked list.",
    "Check if a linked list has a cycle.",
    "Merge two sorted linked lists."
  ],
  "Dynamic Programming": [
    "Find the longest common subsequence between two strings.",
    "Calculate the N-th Fibonacci number using memoization.",
    "Solve the 0/1 Knapsack problem for given weights and values."
  ],
  "Binary Search": [
    "Find the peak element in an array where each element is different from its neighbors.",
    "Implement a square root function without using built-in libraries.",
    "Search for a target value in a 2D matrix where each row is sorted."
  ],
  "Two Pointers": [
    "Summarize ranges of consecutive numbers in a sorted array.",
    "Move all zeros in an array to the end while maintaining the order of non-zero elements.",
    "Find if two numbers in a sorted array sum up to a target value."
  ]
};

for (let i = dsaProblems.length; i < 250; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  const templates = problemTemplates[category] || ["Implement an efficient algorithm for this coding challenge."];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  dsaProblems.push({
    _id: `${i + 1}`,
    title: `${category} Problem #${i + 1}`,
    category: category,
    difficulty: difficulty,
    question: `${template}`,
    examples: [
      { input: "Example input data", output: "Example output data", explanation: "Automated example for placeholder." }
    ],
    constraints: ["Standard constraints apply.", "Time complexity: O(n)", "Space complexity: O(n)"],
    tags: [category.toLowerCase(), "coding", "interview"]
  });
}

const generateJSON = () => {
  try {
    const filePath = path.join(__dirname, "questions.json");
    fs.writeFileSync(filePath, JSON.stringify(dsaProblems, null, 2));
    console.log(`Successfully generated ${dsaProblems.length} questions in ${filePath}`);
  } catch (error) {
    console.error("Error generating JSON:", error);
  }
};

generateJSON();
