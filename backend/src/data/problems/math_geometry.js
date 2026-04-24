export const MATH_GEOMETRY_PROBLEMS = {
    "rotate-image": {
        id: "rotate-image",
        title: "Rotate Image",
        difficulty: "medium",
        category: "Math & Geometry",
        tags: ["Array", "Math", "Matrix"],
        description: {
            text: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.",
            notes: [],
        },
        examples: [
            {
                input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
                output: '[[7,4,1],[8,5,2],[9,6,3]]',
            },
        ],
        starterCode: {
            javascript: `/**\n * @param {number[][]} matrix\n * @return {void} Do not return anything, modify matrix in-place instead.\n */\nvar rotate = function(matrix) {\n    \n};`,
            python: `def rotate(matrix):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public void rotate(int[][] matrix) {\n        // Your code here\n    }\n}`,
        },
    },
    "spiral-matrix": {
        id: "spiral-matrix",
        title: "Spiral Matrix",
        difficulty: "medium",
        category: "Math & Geometry",
        tags: ["Array", "Matrix", "Simulation"],
        description: {
            text: "Given an m x n matrix, return all elements of the matrix in spiral order.",
            notes: [],
        },
        examples: [
            {
                input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
                output: '[1,2,3,6,9,8,7,4,5]',
            },
        ],
        starterCode: {
            javascript: `function spiralOrder(matrix) {\n  // Your code here\n  \n}`,
            python: `def spiralOrder(matrix):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "set-matrix-zeroes": {
        id: "set-matrix-zeroes",
        title: "Set Matrix Zeroes",
        difficulty: "medium",
        category: "Math & Geometry",
        tags: ["Array", "Hash Table", "Matrix"],
        description: {
            text: "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's. You must do it in place.",
            notes: [],
        },
        examples: [
            {
                input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]',
                output: '[[1,0,1],[0,0,0],[1,0,1]]',
            },
        ],
        starterCode: {
            javascript: `/**\n * @param {number[][]} matrix\n * @return {void} Do not return anything, modify matrix in-place instead.\n */\nvar setZeroes = function(matrix) {\n    \n};`,
            python: `def setZeroes(matrix):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public void setZeroes(int[][] matrix) {\n        // Your code here\n    }\n}`,
        },
    },
    "happy-number": {
        id: "happy-number",
        title: "Happy Number",
        difficulty: "easy",
        category: "Math & Geometry",
        tags: ["Hash Table", "Math", "Two Pointers"],
        description: {
            text: "Write an algorithm to determine if a number n is happy. A happy number is a number defined by the following process: Starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Those numbers for which this process ends in 1 are happy. Return true if n is a happy number, and false if not.",
            notes: [],
        },
        examples: [
            {
                input: "n = 19",
                output: "true",
                explanation: "1^2 + 9^2 = 82\n8^2 + 2^2 = 68\n6^2 + 8^2 = 100\n1^2 + 0^2 + 0^2 = 1",
            },
        ],
        starterCode: {
            javascript: `function isHappy(n) {\n  // Your code here\n  \n}`,
            python: `def isHappy(n):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean isHappy(int n) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "plus-one": {
        id: "plus-one",
        title: "Plus One",
        difficulty: "easy",
        category: "Math & Geometry",
        tags: ["Array", "Math"],
        description: {
            text: "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0's. Increment the large integer by one and return the resulting array of digits.",
            notes: [],
        },
        examples: [
            {
                input: "digits = [1,2,3]",
                output: "[1,2,4]",
            },
        ],
        starterCode: {
            javascript: `function plusOne(digits) {\n  // Your code here\n  \n}`,
            python: `def plusOne(digits):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[] plusOne(int[] digits) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
};
