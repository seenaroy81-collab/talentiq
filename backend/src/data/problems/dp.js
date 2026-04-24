export const DP_PROBLEMS = {
    "climbing-stairs": {
        id: "climbing-stairs",
        title: "Climbing Stairs",
        difficulty: "easy",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "Math"],
        description: {
            text: "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?",
            notes: [],
        },
        examples: [
            { input: "n = 2", output: "2", explanation: "1+1 or 2" },
            { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1" },
        ],
        starterCode: {
            javascript: `function climbStairs(n) {\n  // Your code here\n  \n}\n\nconsole.log(climbStairs(3)); // 3`,
            python: `def climbStairs(n):\n    # Your code here\n    pass\n\nprint(climbStairs(3)) # 3`,
            java: `class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "min-cost-climbing-stairs": {
        id: "min-cost-climbing-stairs",
        title: "Min Cost Climbing Stairs",
        difficulty: "easy",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "Array"],
        description: {
            text: "You are given an integer array cost where cost[i] is the cost of ith step on a staircase. Once you pay the cost, you can either climb one or two steps. You can either start from the step with index 0, or the step with index 1. Return the minimum cost to reach the top of the floor.",
            notes: [],
        },
        examples: [
            {
                input: "cost = [10,15,20]",
                output: "15",
                explanation: "Start on cost[1], pay 15 and climb two steps to reach the top.",
            },
        ],
        starterCode: {
            javascript: `function minCostClimbingStairs(cost) {\n  // Your code here\n  \n}`,
            python: `def minCostClimbingStairs(cost):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int minCostClimbingStairs(int[] cost) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "house-robber": {
        id: "house-robber",
        title: "House Robber",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "Array"],
        description: {
            text: "You are planning to rob houses along a street. Each house has money, but adjacent houses have security systems. Maximize the amount you can rob without alerting the police.",
            notes: ["Cannot rob two adjacent houses"],
        },
        examples: [
            {
                input: "nums = [1,2,3,1]",
                output: "4",
                explanation: "Rob house 1 (money = 1) and house 3 (money = 3)",
            },
            {
                input: "nums = [2,7,9,3,1]",
                output: "12",
                explanation: "Rob house 1, 3, and 5 (2 + 9 + 1 = 12)",
            },
        ],
        starterCode: {
            javascript: `function rob(nums) {\n  // Your code here\n  \n}\n\nconsole.log(rob([1,2,3,1])); // 4`,
            python: `def rob(nums):\n    # Your code here\n    pass\n\nprint(rob([1,2,3,1])) # 4`,
            java: `class Solution {\n    public int rob(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "house-robber-ii": {
        id: "house-robber-ii",
        title: "House Robber II",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "Array"],
        description: {
            text: "You are planning to rob houses along a street. The houses are arranged in a circle. Each house has money, but adjacent houses have security systems. Maximize the amount you can rob without alerting the police.",
            notes: ["Cannot rob two adjacent houses"],
        },
        examples: [
            {
                input: "nums = [2,3,2]",
                output: "3",
            },
        ],
        starterCode: {
            javascript: `function rob(nums) {\n  // Your code here\n  \n}`,
            python: `def rob(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int rob(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "longest-palindromic-substring": {
        id: "longest-palindromic-substring",
        title: "Longest Palindromic Substring",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["String", "Dynamic Programming"],
        description: {
            text: "Find the longest palindromic substring in a string.",
            notes: [],
        },
        examples: [
            { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also valid' },
            { input: 's = "cbbd"', output: '"bb"' },
        ],
        starterCode: {
            javascript: `function longestPalindrome(s) {\n  // Your code here\n  \n}\n\nconsole.log(longestPalindrome("babad")); // "bab" or "aba"`,
            python: `def longestPalindrome(s):\n    # Your code here\n    pass\n\nprint(longestPalindrome("babad")) # "bab" or "aba"`,
            java: `class Solution {\n    public String longestPalindrome(String s) {\n        // Your code here\n        return "";\n    }\n}`,
        },
    },
    "palindromic-substrings": {
        id: "palindromic-substrings",
        title: "Palindromic Substrings",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["String", "Dynamic Programming"],
        description: {
            text: "Given a string s, return the number of palindromic substrings in it.",
            notes: [],
        },
        examples: [
            {
                input: 's = "abc"',
                output: "3",
                explanation: 'Three palindromic strings: "a", "b", "c".',
            },
        ],
        starterCode: {
            javascript: `function countSubstrings(s) {\n  // Your code here\n  \n}`,
            python: `def countSubstrings(s):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int countSubstrings(String s) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "decode-ways": {
        id: "decode-ways",
        title: "Decode Ways",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["String", "Dynamic Programming"],
        description: {
            text: "A message containing letters from A-Z can be encoded into numbers using the mapping 'A' -> '1', 'B' -> '2', ... 'Z' -> '26'. Given a string s containing only digits, return the number of ways to decode it.",
            notes: [],
        },
        examples: [
            {
                input: 's = "12"',
                output: "2",
                explanation: '"12" could be decoded as "AB" (1 2) or "L" (12).',
            },
        ],
        starterCode: {
            javascript: `function numDecodings(s) {\n  // Your code here\n  \n}`,
            python: `def numDecodings(s):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int numDecodings(String s) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "coin-change": {
        id: "coin-change",
        title: "Coin Change",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "Array"],
        description: {
            text: "You are given coins of different denominations and a total amount. Return the fewest number of coins needed to make up that amount.",
            notes: ["Return -1 if amount cannot be made up"],
        },
        examples: [
            {
                input: "coins = [1,2,5], amount = 11",
                output: "3",
                explanation: "11 = 5 + 5 + 1",
            },
        ],
        starterCode: {
            javascript: `function coinChange(coins, amount) {\n  // Your code here\n  \n}\n\nconsole.log(coinChange([1,2,5], 11)); // 3`,
            python: `def coinChange(coins, amount):\n    # Your code here\n    pass\n\nprint(coinChange([1,2,5], 11)) # 3`,
            java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "maximum-product-subarray": {
        id: "maximum-product-subarray",
        title: "Maximum Product Subarray",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Array", "Dynamic Programming"],
        description: {
            text: "Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [2,3,-2,4]",
                output: "6",
                explanation: "[2,3] has the largest product 6.",
            },
        ],
        starterCode: {
            javascript: `function maxProduct(nums) {\n  // Your code here\n  \n}`,
            python: `def maxProduct(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int maxProduct(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "word-break": {
        id: "word-break",
        title: "Word Break",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "String"],
        description: {
            text: "Given a string s and a dictionary of words, return true if s can be segmented into a space-separated sequence of dictionary words.",
            notes: ["Same word can be used multiple times"],
        },
        examples: [
            {
                input: 's = "leetcode", wordDict = ["leet","code"]',
                output: "true",
                explanation: 'Can be segmented as "leet code"',
            },
        ],
        starterCode: {
            javascript: `function wordBreak(s, wordDict) {\n  // Your code here\n  \n}\n\nconsole.log(wordBreak("leetcode", ["leet","code"])); // true`,
            python: `def wordBreak(s, wordDict):\n    # Your code here\n    pass\n\nprint(wordBreak("leetcode", ["leet","code"])) # True`,
            java: `class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "longest-increasing-subsequence": {
        id: "longest-increasing-subsequence",
        title: "Longest Increasing Subsequence",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "Binary Search"],
        description: {
            text: "Find the length of the longest strictly increasing subsequence in an array.",
            notes: ["Subsequence doesn't need to be contiguous"],
        },
        examples: [
            {
                input: "nums = [10,9,2,5,3,7,101,18]",
                output: "4",
                explanation: "LIS is [2,3,7,101] with length 4",
            },
        ],
        starterCode: {
            javascript: `function lengthOfLIS(nums) {\n  // Your code here\n  \n}\n\nconsole.log(lengthOfLIS([10,9,2,5,3,7,101,18])); // 4`,
            python: `def lengthOfLIS(nums):\n    # Your code here\n    pass\n\nprint(lengthOfLIS([10,9,2,5,3,7,101,18])) # 4`,
            java: `class Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "partition-equal-subset-sum": {
        id: "partition-equal-subset-sum",
        title: "Partition Equal Subset Sum",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "Array"],
        description: {
            text: "Given a non-empty array nums containing only positive integers, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [1,5,11,5]",
                output: "true",
                explanation: "The array can be partitioned as [1, 5, 5] and [11].",
            },
        ],
        starterCode: {
            javascript: `function canPartition(nums) {\n  // Your code here\n  \n}`,
            python: `def canPartition(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean canPartition(int[] nums) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "unique-paths": {
        id: "unique-paths",
        title: "Unique Paths",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "Math", "Combinatorics"],
        description: {
            text: "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m-1][n-1]). The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
            notes: [],
        },
        examples: [
            {
                input: "m = 3, n = 7",
                output: "28",
            },
        ],
        starterCode: {
            javascript: `function uniquePaths(m, n) {\n  // Your code here\n  \n}`,
            python: `def uniquePaths(m, n):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int uniquePaths(int m, int n) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "longest-common-subsequence": {
        id: "longest-common-subsequence",
        title: "Longest Common Subsequence",
        difficulty: "medium",
        category: "Dynamic Programming",
        tags: ["Dynamic Programming", "String"],
        description: {
            text: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
            notes: [],
        },
        examples: [
            {
                input: 'text1 = "abcde", text2 = "ace"',
                output: "3",
            },
        ],
        starterCode: {
            javascript: `function longestCommonSubsequence(text1, text2) {\n  // Your code here\n  \n}`,
            python: `def longestCommonSubsequence(text1, text2):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
};
