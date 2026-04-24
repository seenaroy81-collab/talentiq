export const TWO_POINTERS_PROBLEMS = {
    "valid-palindrome": {
        id: "valid-palindrome",
        title: "Valid Palindrome",
        difficulty: "easy",
        category: "Two Pointers",
        tags: ["String", "Two Pointers"],
        description: {
            text: "Check if a string is a palindrome, considering only alphanumeric characters and ignoring cases.",
            notes: [],
        },
        examples: [
            { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
            { input: 's = "race a car"', output: "false" },
        ],
        starterCode: {
            javascript: `function isPalindrome(s) {\n  // Your code here\n  \n}\n\nconsole.log(isPalindrome("A man, a plan, a canal: Panama")); // true`,
            python: `def isPalindrome(s):\n    # Your code here\n    pass\n\nprint(isPalindrome("A man, a plan, a canal: Panama")) # True`,
            java: `class Solution {\n    public boolean isPalindrome(String s) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "two-sum-ii-input-array-is-sorted": {
        id: "two-sum-ii-input-array-is-sorted",
        title: "Two Sum II - Input Array Is Sorted",
        difficulty: "medium",
        category: "Two Pointers",
        tags: ["Array", "Two Pointers", "Binary Search"],
        description: {
            text: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.",
            notes: ["The solution must use only constant extra space."]
        },
        examples: [
            {
                input: "numbers = [2,7,11,15], target = 9",
                output: "[1,2]",
                explanation: "The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2]."
            }
        ],
        starterCode: {
            javascript: `function twoSum(numbers, target) {\n  // Your code here\n  \n}`,
            python: `def twoSum(numbers, target):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
    "3sum": {
        id: "3sum",
        title: "3Sum",
        difficulty: "medium",
        category: "Two Pointers",
        tags: ["Array", "Two Pointers", "Sorting"],
        description: {
            text: "Find all unique triplets in the array that sum to zero.",
            notes: ["Solution set must not contain duplicate triplets"],
        },
        examples: [
            {
                input: "nums = [-1,0,1,2,-1,-4]",
                output: "[[-1,-1,2],[-1,0,1]]",
            },
        ],
        starterCode: {
            javascript: `function threeSum(nums) {\n  // Your code here\n  \n}\n\nconsole.log(threeSum([-1,0,1,2,-1,-4]));`,
            python: `def threeSum(nums):\n    # Your code here\n    pass\n\nprint(threeSum([-1,0,1,2,-1,-4]))`,
            java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "container-most-water": {
        id: "container-most-water",
        title: "Container With Most Water",
        difficulty: "medium",
        category: "Two Pointers",
        tags: ["Array", "Two Pointers", "Greedy"],
        description: {
            text: "Find two lines that together with the x-axis form a container that holds the most water.",
            notes: ["Cannot slant the container"],
        },
        examples: [
            {
                input: "height = [1,8,6,2,5,4,8,3,7]",
                output: "49",
            },
        ],
        starterCode: {
            javascript: `function maxArea(height) {\n  // Your code here\n  \n}\n\nconsole.log(maxArea([1,8,6,2,5,4,8,3,7])); // 49`,
            python: `def maxArea(height):\n    # Your code here\n    pass\n\nprint(maxArea([1,8,6,2,5,4,8,3,7])) # 49`,
            java: `class Solution {\n    public int maxArea(int[] height) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "trapping-rain-water": {
        id: "trapping-rain-water",
        title: "Trapping Rain Water",
        difficulty: "hard",
        category: "Two Pointers",
        tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
        description: {
            text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
            notes: []
        },
        examples: [
            {
                input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
                output: "6",
                explanation: "The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped."
            }
        ],
        starterCode: {
            javascript: `function trap(height) {\n  // Your code here\n  \n}`,
            python: `def trap(height):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int trap(int[] height) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
};
