export const BINARY_SEARCH_PROBLEMS = {
    "binary-search": {
        id: "binary-search",
        title: "Binary Search",
        difficulty: "easy",
        category: "Binary Search",
        tags: ["Binary Search", "Array"],
        description: {
            text: "Implement binary search on a sorted array. Return the index of target or -1 if not found.",
            notes: ["Must be O(log n) time"],
        },
        examples: [
            {
                input: "nums = [-1,0,3,5,9,12], target = 9",
                output: "4",
            },
        ],
        starterCode: {
            javascript: `function search(nums, target) {\n  // Your code here\n  \n}\n\nconsole.log(search([-1,0,3,5,9,12], 9)); // 4`,
            python: `def search(nums, target):\n    # Your code here\n    pass\n\nprint(search([-1,0,3,5,9,12], 9)) # 4`,
            java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "search-2d-matrix": {
        id: "search-2d-matrix",
        title: "Search a 2D Matrix",
        difficulty: "medium",
        category: "Binary Search",
        tags: ["Array", "Binary Search", "Matrix"],
        description: {
            text: "Write an efficient algorithm that searches for a value target in an m x n integer matrix matrix. This matrix has the following properties: Integers in each row are sorted from left to right. The first integer of each row is greater than the last integer of the previous row.",
            notes: [],
        },
        examples: [
            {
                input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3',
                output: "true",
            },
        ],
        starterCode: {
            javascript: `function searchMatrix(matrix, target) {\n  // Your code here\n  \n}`,
            python: `def searchMatrix(matrix, target):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "koko-eating-bananas": {
        id: "koko-eating-bananas",
        title: "Koko Eating Bananas",
        difficulty: "medium",
        category: "Binary Search",
        tags: ["Array", "Binary Search"],
        description: {
            text: "Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours. Koko can decide her bananas-per-hour eating speed of k. Return the minimum integer k such that she can eat all the bananas within h hours.",
            notes: [],
        },
        examples: [
            {
                input: 'piles = [3,6,7,11], h = 8',
                output: "4",
            },
        ],
        starterCode: {
            javascript: `function minEatingSpeed(piles, h) {\n  // Your code here\n  \n}`,
            python: `def minEatingSpeed(piles, h):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "find-minimum-in-rotated-sorted-array": {
        id: "find-minimum-in-rotated-sorted-array",
        title: "Find Minimum in Rotated Sorted Array",
        difficulty: "medium",
        category: "Binary Search",
        tags: ["Array", "Binary Search"],
        description: {
            text: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element of this array.",
            notes: ["You must write an algorithm that runs in O(log n) time."],
        },
        examples: [
            {
                input: 'nums = [3,4,5,1,2]',
                output: "1",
            },
        ],
        starterCode: {
            javascript: `function findMin(nums) {\n  // Your code here\n  \n}`,
            python: `def findMin(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int findMin(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "search-rotated-array": {
        id: "search-rotated-array",
        title: "Search in Rotated Sorted Array",
        difficulty: "medium",
        category: "Binary Search",
        tags: ["Binary Search", "Array"],
        description: {
            text: "Search for a target value in a rotated sorted array. Must be O(log n) time.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [4,5,6,7,0,1,2], target = 0",
                output: "4",
            },
        ],
        starterCode: {
            javascript: `function search(nums, target) {\n  // Your code here\n  \n}\n\nconsole.log(search([4,5,6,7,0,1,2], 0)); // 4`,
            python: `def search(nums, target):\n    # Your code here\n    pass\n\nprint(search([4,5,6,7,0,1,2], 0)) # 4`,
            java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "time-based-key-value-store": {
        id: "time-based-key-value-store",
        title: "Time Based Key-Value Store",
        difficulty: "medium",
        category: "Binary Search",
        tags: ["Hash Table", "Binary Search", "Design"],
        description: {
            text: "Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.",
            notes: [],
        },
        examples: [
            {
                input: '["TimeMap", "set", "get", "get", "set", "get", "get"]\n[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]',
                output: '[null, null, "bar", "bar", null, "bar2", "bar2"]',
            },
        ],
        starterCode: {
            javascript: `var TimeMap = function() {\n    \n};\n\n/** \n * @param {string} key \n * @param {string} value \n * @param {number} timestamp\n * @return {void}\n */\nTimeMap.prototype.set = function(key, value, timestamp) {\n    \n};\n\n/** \n * @param {string} key \n * @param {number} timestamp\n * @return {string}\n */\nTimeMap.prototype.get = function(key, timestamp) {\n    \n};`,
            python: `class TimeMap:\n    def __init__(self):\n        pass\n\n    def set(self, key: str, value: str, timestamp: int) -> None:\n        pass\n\n    def get(self, key: str, timestamp: int) -> str:\n        pass`,
            java: `class TimeMap {\n    public TimeMap() {\n        \n    }\n    \n    public void set(String key, String value, int timestamp) {\n        \n    }\n    \n    public String get(String key, int timestamp) {\n        \n    }\n}`,
        },
    },
    "median-of-two-sorted-arrays": {
        id: "median-of-two-sorted-arrays",
        title: "Median of Two Sorted Arrays",
        difficulty: "hard",
        category: "Binary Search",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        description: {
            text: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
            notes: [],
        },
        examples: [
            {
                input: 'nums1 = [1,3], nums2 = [2]',
                output: "2.00000",
            },
        ],
        starterCode: {
            javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n  \n}`,
            python: `def findMedianSortedArrays(nums1, nums2):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Your code here\n        return 0.0;\n    }\n}`,
        },
    },
};
