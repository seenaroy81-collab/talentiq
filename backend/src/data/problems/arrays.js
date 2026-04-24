export const ARRAY_PROBLEMS = {
    "two-sum": {
        id: "two-sum",
        title: "Two Sum",
        difficulty: "easy",
        category: "Arrays & Hashing",
        tags: ["Array", "Hash Table"],
        description: {
            text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            notes: ["Each input has exactly one solution", "Cannot use the same element twice"],
        },
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "nums[0] + nums[1] == 9",
            },
        ],
        starterCode: {
            javascript: `function twoSum(nums, target) {\n  // Your code here\n  \n}\n\nconsole.log(twoSum([2,7,11,15], 9)); // [0,1]`,
            python: `def twoSum(nums, target):\n    # Your code here\n    pass\n\nprint(twoSum([2,7,11,15], 9)) # [0,1]`,
            java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
    "contains-duplicate": {
        id: "contains-duplicate",
        title: "Contains Duplicate",
        difficulty: "easy",
        category: "Arrays & Hashing",
        tags: ["Array", "Hash Table"],
        description: {
            text: "Return true if any value appears at least twice in the array, and return false if every element is distinct.",
            notes: [],
        },
        examples: [
            { input: "nums = [1,2,3,1]", output: "true" },
            { input: "nums = [1,2,3,4]", output: "false" },
        ],
        starterCode: {
            javascript: `function containsDuplicate(nums) {\n  // Your code here\n  \n}\n\nconsole.log(containsDuplicate([1,2,3,1])); // true`,
            python: `def containsDuplicate(nums):\n    # Your code here\n    pass\n\nprint(containsDuplicate([1,2,3,1])) # True`,
            java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "valid-anagram": {
        id: "valid-anagram",
        title: "Valid Anagram",
        difficulty: "easy",
        category: "Arrays & Hashing",
        tags: ["String", "Hash Table", "Sorting"],
        description: {
            text: "Determine if two strings are anagrams of each other.",
            notes: ["An anagram is formed by rearranging the letters of a word"],
        },
        examples: [
            { input: 's = "anagram", t = "nagaram"', output: "true" },
            { input: 's = "rat", t = "car"', output: "false" },
        ],
        starterCode: {
            javascript: `function isAnagram(s, t) {\n  // Your code here\n  \n}\n\nconsole.log(isAnagram("anagram", "nagaram")); // true`,
            python: `def isAnagram(s, t):\n    # Your code here\n    pass\n\nprint(isAnagram("anagram", "nagaram")) # True`,
            java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "group-anagrams": {
        id: "group-anagrams",
        title: "Group Anagrams",
        difficulty: "medium",
        category: "Arrays & Hashing",
        tags: ["String", "Hash Table", "Sorting"],
        description: {
            text: "Group strings that are anagrams of each other together.",
            notes: [],
        },
        examples: [
            {
                input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
                output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
            },
        ],
        starterCode: {
            javascript: `function groupAnagrams(strs) {\n  // Your code here\n  \n}\n\nconsole.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));`,
            python: `def groupAnagrams(strs):\n    # Your code here\n    pass\n\nprint(groupAnagrams(["eat","tea","tan","ate","nat","bat"]))`,
            java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "top-k-frequent-elements": {
        id: "top-k-frequent-elements",
        title: "Top K Frequent Elements",
        difficulty: "medium",
        category: "Arrays & Hashing",
        tags: ["Array", "Hash Table", "Heap", "Bucket Sort"],
        description: {
            text: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
            notes: ["It is guaranteed that the answer is unique"],
        },
        examples: [
            {
                input: "nums = [1,1,1,2,2,3], k = 2",
                output: "[1,2]",
            },
            {
                input: "nums = [1], k = 1",
                output: "[1]",
            },
        ],
        starterCode: {
            javascript: `function topKFrequent(nums, k) {\n  // Your code here\n  \n}\n\nconsole.log(topKFrequent([1,1,1,2,2,3], 2)); // [1,2]`,
            python: `def topKFrequent(nums, k):\n    # Your code here\n    pass\n\nprint(topKFrequent([1,1,1,2,2,3], 2)) # [1, 2]`,
            java: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
    "product-except-self": {
        id: "product-except-self",
        title: "Product of Array Except Self",
        difficulty: "medium",
        category: "Arrays & Hashing",
        tags: ["Array", "Prefix Sum"],
        description: {
            text: "Return an array where each element is the product of all elements in the original array except itself. Do this in O(n) time without using division.",
            notes: ["Must run in O(n) time", "Cannot use division operator"],
        },
        examples: [
            {
                input: "nums = [1,2,3,4]",
                output: "[24,12,8,6]",
                explanation: "24 = 2*3*4, 12 = 1*3*4, 8 = 1*2*4, 6 = 1*2*3",
            },
        ],
        starterCode: {
            javascript: `function productExceptSelf(nums) {\n  // Your code here\n  \n}\n\nconsole.log(productExceptSelf([1,2,3,4])); // [24,12,8,6]`,
            python: `def productExceptSelf(nums):\n    # Your code here\n    pass\n\nprint(productExceptSelf([1,2,3,4])) # [24,12,8,6]`,
            java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
    "valid-sudoku": {
        id: "valid-sudoku",
        title: "Valid Sudoku",
        difficulty: "medium",
        category: "Arrays & Hashing",
        tags: ["Array", "Hash Table", "Matrix"],
        description: {
            text: "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules: Each row must contain the digits 1-9 without repetition. Each column must contain the digits 1-9 without repetition. Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.",
            notes: [],
        },
        examples: [
            {
                input: 'board = [["5","3",".",".","7",".",".",".","."], ...]',
                output: "true",
            },
        ],
        starterCode: {
            javascript: `function isValidSudoku(board) {\n  // Your code here\n  \n}`,
            python: `def isValidSudoku(board):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "encode-decode-strings": {
        id: "encode-decode-strings",
        title: "Encode and Decode Strings",
        difficulty: "medium",
        category: "Arrays & Hashing",
        tags: ["String", "Design"],
        description: {
            text: "Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.",
            notes: [],
        },
        examples: [
            {
                input: 'dummy_input = ["Hello","World"]',
                output: '["Hello","World"]',
            },
        ],
        starterCode: {
            javascript: `/**\n * Encodes a list of strings to a single string.\n * @param {string[]} strs\n * @return {string}\n */\nvar encode = function(strs) {\n    \n};\n\n/**\n * Decodes a single string to a list of strings.\n * @param {string} s\n * @return {string[]}\n */\nvar decode = function(s) {\n    \n};`,
            python: `class Codec:\n    def encode(self, strs: List[str]) -> str:\n        \"\"\"Encodes a list of strings to a single string.\"\"\"\n        \n\n    def decode(self, s: str) -> List[str]:\n        \"\"\"Decodes a single string to a list of strings.\"\"\"\n        `,
            java: `public class Codec {\n    // Encodes a list of strings to a single string.\n    public String encode(List<String> strs) {\n        \n    }\n\n    // Decodes a single string to a list of strings.\n    public List<String> decode(String s) {\n        \n    }\n}`,
        },
    },
    "longest-consecutive-sequence": {
        id: "longest-consecutive-sequence",
        title: "Longest Consecutive Sequence",
        difficulty: "medium",
        category: "Arrays & Hashing",
        tags: ["Array", "Hash Table", "Union Find"],
        description: {
            text: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
            notes: ["O(n) time complexity required"],
        },
        examples: [
            {
                input: "nums = [100,4,200,1,3,2]",
                output: "4",
                explanation: "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4."
            }
        ],
        starterCode: {
            javascript: `function longestConsecutive(nums) {\n  // Your code here\n  \n}\n\nconsole.log(longestConsecutive([100,4,200,1,3,2])); // 4`,
            python: `def longestConsecutive(nums):\n    # Your code here\n    pass\n\nprint(longestConsecutive([100,4,200,1,3,2])) # 4`,
            java: `class Solution {\n    public int longestConsecutive(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
};
