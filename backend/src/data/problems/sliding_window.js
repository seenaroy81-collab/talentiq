export const SLIDING_WINDOW_PROBLEMS = {
    "best-time-to-buy-sell-stock": {
        id: "best-time-to-buy-sell-stock",
        title: "Best Time to Buy and Sell Stock",
        difficulty: "easy",
        category: "Sliding Window",
        tags: ["Array", "Dynamic Programming", "Sliding Window"],
        description: {
            text: "Find the maximum profit from buying and selling a stock once. You must buy before you sell.",
            notes: ["Return 0 if no profit can be made"],
        },
        examples: [
            {
                input: "prices = [7,1,5,3,6,4]",
                output: "5",
                explanation: "Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5",
            },
        ],
        starterCode: {
            javascript: `function maxProfit(prices) {\n  // Your code here\n  \n}\n\nconsole.log(maxProfit([7,1,5,3,6,4])); // 5`,
            python: `def maxProfit(prices):\n    # Your code here\n    pass\n\nprint(maxProfit([7,1,5,3,6,4])) # 5`,
            java: `class Solution {\n    public int maxProfit(int[] prices) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "longest-substring-no-repeat": {
        id: "longest-substring-no-repeat",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "medium",
        category: "Sliding Window",
        tags: ["String", "Sliding Window", "Hash Table"],
        description: {
            text: "Find the length of the longest substring without repeating characters.",
            notes: [],
        },
        examples: [
            {
                input: 's = "abcabcbb"',
                output: "3",
                explanation: 'The answer is "abc", with length 3',
            },
            {
                input: 's = "bbbbb"',
                output: "1",
                explanation: 'The answer is "b", with length 1',
            },
        ],
        starterCode: {
            javascript: `function lengthOfLongestSubstring(s) {\n  // Your code here\n  \n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb")); // 3`,
            python: `def lengthOfLongestSubstring(s):\n    # Your code here\n    pass\n\nprint(lengthOfLongestSubstring("abcabcbb")) # 3`,
            java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "longest-repeating-character-replacement": {
        id: "longest-repeating-character-replacement",
        title: "Longest Repeating Character Replacement",
        difficulty: "medium",
        category: "Sliding Window",
        tags: ["String", "Sliding Window", "Hash Table"],
        description: {
            text: "You are given a string s composed of uppercase English characters and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.",
            notes: []
        },
        examples: [
            {
                input: 's = "ABAB", k = 2',
                output: "4",
                explanation: "Replace the two 'A's with two 'B's or vice versa."
            }
        ],
        starterCode: {
            javascript: `function characterReplacement(s, k) {\n  // Your code here\n  \n}`,
            python: `def characterReplacement(s, k):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int characterReplacement(String s, int k) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "permutation-in-string": {
        id: "permutation-in-string",
        title: "Permutation in String",
        difficulty: "medium",
        category: "Sliding Window",
        tags: ["String", "Sliding Window", "Hash Table", "Two Pointers"],
        description: {
            text: "Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. In other words, return true if one of s1's permutations is the substring of s2.",
            notes: []
        },
        examples: [
            {
                input: 's1 = "ab", s2 = "eidbaooo"',
                output: "true",
                explanation: "s2 contains one permutation of s1 ('ba')."
            }
        ],
        starterCode: {
            javascript: `function checkInclusion(s1, s2) {\n  // Your code here\n  \n}`,
            python: `def checkInclusion(s1, s2):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "minimum-window-substring": {
        id: "minimum-window-substring",
        title: "Minimum Window Substring",
        difficulty: "hard",
        category: "Sliding Window",
        tags: ["String", "Sliding Window", "Hash Table"],
        description: {
            text: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".",
            notes: ["The testcases will be generated such that the answer is unique."]
        },
        examples: [
            {
                input: 's = "ADOBECODEBANC", t = "ABC"',
                output: "\"BANC\"",
                explanation: "The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t."
            }
        ],
        starterCode: {
            javascript: `function minWindow(s, t) {\n  // Your code here\n  \n}`,
            python: `def minWindow(s, t):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public String minWindow(String s, String t) {\n        // Your code here\n        return \"\";\n    }\n}`,
        },
    },
    "sliding-window-maximum": {
        id: "sliding-window-maximum",
        title: "Sliding Window Maximum",
        difficulty: "hard",
        category: "Sliding Window",
        tags: ["Array", "Sliding Window", "Heap", "Queue"],
        description: {
            text: "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
            notes: []
        },
        examples: [
            {
                input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
                output: "[3,3,5,5,6,7]"
            }
        ],
        starterCode: {
            javascript: `function maxSlidingWindow(nums, k) {\n  // Your code here\n  \n}`,
            python: `def maxSlidingWindow(nums, k):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
};
