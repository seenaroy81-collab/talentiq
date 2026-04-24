export const BIT_MANIPULATION_PROBLEMS = {
    "single-number": {
        id: "single-number",
        title: "Single Number",
        difficulty: "easy",
        category: "Bit Manipulation",
        tags: ["Bit Manipulation", "Array"],
        description: {
            text: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [2,2,1]",
                output: "1",
            },
        ],
        starterCode: {
            javascript: `function singleNumber(nums) {\n  // Your code here\n  \n}`,
            python: `def singleNumber(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int singleNumber(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "number-of-1-bits": {
        id: "number-of-1-bits",
        title: "Number of 1 Bits",
        difficulty: "easy",
        category: "Bit Manipulation",
        tags: ["Bit Manipulation", "Divide and Conquer"],
        description: {
            text: "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).",
            notes: [],
        },
        examples: [
            {
                input: "n = 11",
                output: "3",
                explanation: "The input binary string 00000000000000000000000000001011 has a total of three set bits.",
            },
        ],
        starterCode: {
            javascript: `function hammingWeight(n) {\n  // Your code here\n  \n}`,
            python: `def hammingWeight(n):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int hammingWeight(int n) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "counting-bits": {
        id: "counting-bits",
        title: "Counting Bits",
        difficulty: "easy",
        category: "Bit Manipulation",
        tags: ["Bit Manipulation", "Dynamic Programming"],
        description: {
            text: "Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.",
            notes: [],
        },
        examples: [
            {
                input: "n = 2",
                output: "[0,1,1]",
                explanation: "0 --> 0\n1 --> 1\n2 --> 10",
            },
        ],
        starterCode: {
            javascript: `function countBits(n) {\n  // Your code here\n  \n}`,
            python: `def countBits(n):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[] countBits(int n) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
    "reverse-bits": {
        id: "reverse-bits",
        title: "Reverse Bits",
        difficulty: "easy",
        category: "Bit Manipulation",
        tags: ["Bit Manipulation", "Divide and Conquer"],
        description: {
            text: "Reverse bits of a given 32 bits unsigned integer.",
            notes: [],
        },
        examples: [
            {
                input: "n = 11111111111111111111111111111101",
                output: "3221225471",
            },
        ],
        starterCode: {
            javascript: `function reverseBits(n) {\n  // Your code here\n  \n}`,
            python: `def reverseBits(n):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int reverseBits(int n) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "missing-number": {
        id: "missing-number",
        title: "Missing Number",
        difficulty: "easy",
        category: "Bit Manipulation",
        tags: ["Array", "Hash Table", "Math", "Bit Manipulation", "Sorting"],
        description: {
            text: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [3,0,1]",
                output: "2",
            },
        ],
        starterCode: {
            javascript: `function missingNumber(nums) {\n  // Your code here\n  \n}`,
            python: `def missingNumber(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int missingNumber(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "sum-of-two-integers": {
        id: "sum-of-two-integers",
        title: "Sum of Two Integers",
        difficulty: "medium",
        category: "Bit Manipulation",
        tags: ["Math", "Bit Manipulation"],
        description: {
            text: "Given two integers a and b, return the sum of the two integers without using the operators + and -.",
            notes: [],
        },
        examples: [
            {
                input: "a = 1, b = 2",
                output: "3",
            },
        ],
        starterCode: {
            javascript: `function getSum(a, b) {\n  // Your code here\n  \n}`,
            python: `def getSum(a, b):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int getSum(int a, int b) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "reverse-integer": {
        id: "reverse-integer",
        title: "Reverse Integer",
        difficulty: "medium",
        category: "Bit Manipulation",
        tags: ["Math"],
        description: {
            text: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-231, 231 - 1], then return 0.",
            notes: [],
        },
        examples: [
            {
                input: "x = 123",
                output: "321",
            },
        ],
        starterCode: {
            javascript: `function reverse(x) {\n  // Your code here\n  \n}`,
            python: `def reverse(x):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int reverse(int x) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
};
