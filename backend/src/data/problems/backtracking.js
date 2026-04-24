export const BACKTRACKING_PROBLEMS = {
    "subsets": {
        id: "subsets",
        title: "Subsets",
        difficulty: "medium",
        category: "Backtracking",
        tags: ["Backtracking", "Array", "Bit Manipulation"],
        description: {
            text: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [1,2,3]",
                output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
            },
        ],
        starterCode: {
            javascript: `function subsets(nums) {\n  // Your code here\n  \n}`,
            python: `def subsets(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "combination-sum": {
        id: "combination-sum",
        title: "Combination Sum",
        difficulty: "medium",
        category: "Backtracking",
        tags: ["Backtracking", "Array"],
        description: {
            text: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order. The same number may be chosen from candidates an unlimited number of times.",
            notes: [],
        },
        examples: [
            {
                input: "candidates = [2,3,6,7], target = 7",
                output: "[[2,2,3],[7]]",
            },
        ],
        starterCode: {
            javascript: `function combinationSum(candidates, target) {\n  // Your code here\n  \n}`,
            python: `def combinationSum(candidates, target):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "permutations": {
        id: "permutations",
        title: "Permutations",
        difficulty: "medium",
        category: "Backtracking",
        tags: ["Backtracking", "Array"],
        description: {
            text: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [1,2,3]",
                output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
            },
        ],
        starterCode: {
            javascript: `function permute(nums) {\n  // Your code here\n  \n}`,
            python: `def permute(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "subsets-ii": {
        id: "subsets-ii",
        title: "Subsets II",
        difficulty: "medium",
        category: "Backtracking",
        tags: ["Backtracking", "Array", "Bit Manipulation"],
        description: {
            text: "Given an integer array nums that may contain duplicates, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [1,2,2]",
                output: "[[],[1],[1,2],[1,2,2],[2],[2,2]]",
            },
        ],
        starterCode: {
            javascript: `function subsetsWithDup(nums) {\n  // Your code here\n  \n}`,
            python: `def subsetsWithDup(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<List<Integer>> subsetsWithDup(int[] nums) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "combination-sum-ii": {
        id: "combination-sum-ii",
        title: "Combination Sum II",
        difficulty: "medium",
        category: "Backtracking",
        tags: ["Backtracking", "Array"],
        description: {
            text: "Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target. Each number in candidates may only be used once in the combination.",
            notes: [],
        },
        examples: [
            {
                input: "candidates = [10,1,2,7,6,1,5], target = 8",
                output: "[[1,1,6],[1,2,5],[1,7],[2,6]]",
            },
        ],
        starterCode: {
            javascript: `function combinationSum2(candidates, target) {\n  // Your code here\n  \n}`,
            python: `def combinationSum2(candidates, target):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<List<Integer>> combinationSum2(int[] candidates, int target) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "word-search": {
        id: "word-search",
        title: "Word Search",
        difficulty: "medium",
        category: "Backtracking",
        tags: ["Backtracking", "Matrix", "Array"],
        description: {
            text: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.",
            notes: [],
        },
        examples: [
            {
                input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
                output: "true",
            },
        ],
        starterCode: {
            javascript: `function exist(board, word) {\n  // Your code here\n  \n}`,
            python: `def exist(board, word):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "palindrome-partitioning": {
        id: "palindrome-partitioning",
        title: "Palindrome Partitioning",
        difficulty: "medium",
        category: "Backtracking",
        tags: ["Backtracking", "String", "Dynamic Programming"],
        description: {
            text: "Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.",
            notes: [],
        },
        examples: [
            {
                input: 's = "aab"',
                output: '[["a","a","b"],["aa","b"]]',
            },
        ],
        starterCode: {
            javascript: `function partition(s) {\n  // Your code here\n  \n}`,
            python: `def partition(s):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<List<String>> partition(String s) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "letter-combinations-of-a-phone-number": {
        id: "letter-combinations-of-a-phone-number",
        title: "Letter Combinations of a Phone Number",
        difficulty: "medium",
        category: "Backtracking",
        tags: ["Backtracking", "String", "Hash Table"],
        description: {
            text: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.",
            notes: [],
        },
        examples: [
            {
                input: 'digits = "23"',
                output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
            },
        ],
        starterCode: {
            javascript: `function letterCombinations(digits) {\n  // Your code here\n  \n}`,
            python: `def letterCombinations(digits):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<String> letterCombinations(String digits) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "n-queens": {
        id: "n-queens",
        title: "N-Queens",
        difficulty: "hard",
        category: "Backtracking",
        tags: ["Backtracking", "Array"],
        description: {
            text: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.",
            notes: [],
        },
        examples: [
            {
                input: "n = 4",
                output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
            },
        ],
        starterCode: {
            javascript: `function solveNQueens(n) {\n  // Your code here\n  \n}`,
            python: `def solveNQueens(n):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
};
