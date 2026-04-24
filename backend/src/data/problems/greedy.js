export const GREEDY_PROBLEMS = {
    "maximum-subarray": {
        id: "maximum-subarray",
        title: "Maximum Subarray",
        difficulty: "medium",
        category: "Greedy",
        tags: ["Array", "Dynamic Programming", "Kadane's Algorithm"],
        description: {
            text: "Find the contiguous subarray with the largest sum and return its sum.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                output: "6",
                explanation: "Subarray [4,-1,2,1] has the largest sum 6",
            },
        ],
        starterCode: {
            javascript: `function maxSubArray(nums) {\n  // Your code here\n  \n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6`,
            python: `def maxSubArray(nums):\n    # Your code here\n    pass\n\nprint(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])) # 6`,
            java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "jump-game": {
        id: "jump-game",
        title: "Jump Game",
        difficulty: "medium",
        category: "Greedy",
        tags: ["Array", "Dynamic Programming", "Greedy"],
        description: {
            text: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [2,3,1,1,4]",
                output: "true",
            },
        ],
        starterCode: {
            javascript: `function canJump(nums) {\n  // Your code here\n  \n}`,
            python: `def canJump(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean canJump(int[] nums) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "jump-game-ii": {
        id: "jump-game-ii",
        title: "Jump Game II",
        difficulty: "medium",
        category: "Greedy",
        tags: ["Array", "Dynamic Programming", "Greedy"],
        description: {
            text: "You are given a 0-indexed array of integers nums of length n. You are initially positioned at nums[0]. Each element nums[i] represents the maximum length of a forward jump from index i. Return the minimum number of jumps to reach nums[n - 1].",
            notes: [],
        },
        examples: [
            {
                input: "nums = [2,3,1,1,4]",
                output: "2",
            },
        ],
        starterCode: {
            javascript: `function jump(nums) {\n  // Your code here\n  \n}`,
            python: `def jump(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int jump(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "gas-station": {
        id: "gas-station",
        title: "Gas Station",
        difficulty: "medium",
        category: "Greedy",
        tags: ["Array", "Greedy"],
        description: {
            text: "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations. Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique",
            notes: [],
        },
        examples: [
            {
                input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
                output: "3",
            },
        ],
        starterCode: {
            javascript: `function canCompleteCircuit(gas, cost) {\n  // Your code here\n  \n}`,
            python: `def canCompleteCircuit(gas, cost):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "hand-of-straights": {
        id: "hand-of-straights",
        title: "Hand of Straights",
        difficulty: "medium",
        category: "Greedy",
        tags: ["Array", "Hash Table", "Greedy", "Sorting"],
        description: {
            text: "Alice has some number of cards and she wants to rearrange the cards into groups so that each group is of size groupSize, and consists of groupSize consecutive cards. Given an integer array hand where hand[i] is the value written on the ith card and an integer groupSize, return true if she can rearrange the cards, or false otherwise.",
            notes: [],
        },
        examples: [
            {
                input: "hand = [1,2,3,6,2,3,4,7,8], groupSize = 3",
                output: "true",
            },
        ],
        starterCode: {
            javascript: `function isNStraightHand(hand, groupSize) {\n  // Your code here\n  \n}`,
            python: `def isNStraightHand(hand, groupSize):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean isNStraightHand(int[] hand, int groupSize) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
};
