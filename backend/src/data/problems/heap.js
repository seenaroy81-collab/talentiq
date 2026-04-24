export const HEAP_PROBLEMS = {
    "kth-largest-element-in-a-stream": {
        id: "kth-largest-element-in-a-stream",
        title: "Kth Largest Element in a Stream",
        difficulty: "easy",
        category: "Heap / Priority Queue",
        tags: ["Heap", "Design", "Tree", "Binary Tree"],
        description: {
            text: "Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
            notes: [],
        },
        examples: [
            {
                input: '["KthLargest", "add", "add", "add", "add", "add"]\n[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]',
                output: '[null, 4, 5, 5, 8, 8]',
            },
        ],
        starterCode: {
            javascript: `/**\n * @param {number} k\n * @param {number[]} nums\n */\nvar KthLargest = function(k, nums) {\n    \n};\n\n/** \n * @param {number} val\n * @return {number}\n */\nKthLargest.prototype.add = function(val) {\n    \n};`,
            python: `class KthLargest:\n    def __init__(self, k: int, nums: List[int]):\n        pass\n\n    def add(self, val: int) -> int:\n        pass`,
            java: `class KthLargest {\n    public KthLargest(int k, int[] nums) {\n        \n    }\n    \n    public int add(int val) {\n        \n    }\n}`,
        },
    },
    "last-stone-weight": {
        id: "last-stone-weight",
        title: "Last Stone Weight",
        difficulty: "easy",
        category: "Heap / Priority Queue",
        tags: ["Heap", "Array"],
        description: {
            text: "You are given an array of integers stones where stones[i] is the weight of the ith stone. We play a game with the stones. On each turn, we choose the heaviest two stones and smash them together. Return the weight of the last remaining stone. If there are no stones left, return 0.",
            notes: [],
        },
        examples: [
            {
                input: "stones = [2,7,4,1,8,1]",
                output: "1",
                explanation: "1 is the result.",
            },
        ],
        starterCode: {
            javascript: `function lastStoneWeight(stones) {\n  // Your code here\n  \n}`,
            python: `def lastStoneWeight(stones):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int lastStoneWeight(int[] stones) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "k-closest-points-to-origin": {
        id: "k-closest-points-to-origin",
        title: "K Closest Points to Origin",
        difficulty: "medium",
        category: "Heap / Priority Queue",
        tags: ["Heap", "Math", "Geometry", "Sorting"],
        description: {
            text: "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).",
            notes: [],
        },
        examples: [
            {
                input: "points = [[1,3],[-2,2]], k = 1",
                output: "[[-2,2]]",
            },
        ],
        starterCode: {
            javascript: `function kClosest(points, k) {\n  // Your code here\n  \n}`,
            python: `def kClosest(points, k):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        // Your code here\n        return new int[0][0];\n    }\n}`,
        },
    },
    "task-scheduler": {
        id: "task-scheduler",
        title: "Task Scheduler",
        difficulty: "medium",
        category: "Heap / Priority Queue",
        tags: ["Heap", "Greedy", "Array", "Sorting"],
        description: {
            text: "Given a characters array tasks, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle. However, there is a non-negative integer n that represents the cooldown period between two same tasks (the same letter in the array), that is that there must be at least n units of time between any two same tasks. Return the least number of units of times that the CPU will take to finish all the given tasks.",
            notes: [],
        },
        examples: [
            {
                input: 'tasks = ["A","A","A","B","B","B"], n = 2',
                output: "8",
                explanation: "A -> B -> idle -> A -> B -> idle -> A -> B.",
            },
        ],
        starterCode: {
            javascript: `function leastInterval(tasks, n) {\n  // Your code here\n  \n}`,
            python: `def leastInterval(tasks, n):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int leastInterval(char[] tasks, int n) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "design-twitter": {
        id: "design-twitter",
        title: "Design Twitter",
        difficulty: "medium",
        category: "Heap / Priority Queue",
        tags: ["Heap", "Design", "Hash Table"],
        description: {
            text: "Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the 10 most recent tweets in the user's news feed.",
            notes: [],
        },
        examples: [
            {
                input: '["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"]\n[[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]',
                output: '[null, null, [5], null, null, [6, 5], null, [5]]',
            },
        ],
        starterCode: {
            javascript: `var Twitter = function() {\n    \n};\n\n/** \n * @param {number} userId \n * @param {number} tweetId\n * @return {void}\n */\nTwitter.prototype.postTweet = function(userId, tweetId) {\n    \n};\n\n/** \n * @param {number} userId\n * @return {number[]}\n */\nTwitter.prototype.getNewsFeed = function(userId) {\n    \n};\n\n/** \n * @param {number} followerId \n * @param {number} followeeId\n * @return {void}\n */\nTwitter.prototype.follow = function(followerId, followeeId) {\n    \n};\n\n/** \n * @param {number} followerId \n * @param {number} followeeId\n * @return {void}\n */\nTwitter.prototype.unfollow = function(followerId, followeeId) {\n    \n};`,
            python: `class Twitter:\n    def __init__(self):\n        pass\n\n    def postTweet(self, userId: int, tweetId: int) -> None:\n        pass\n\n    def getNewsFeed(self, userId: int) -> List[int]:\n        pass\n\n    def follow(self, followerId: int, followeeId: int) -> None:\n        pass\n\n    def unfollow(self, followerId: int, followeeId: int) -> None:\n        pass`,
            java: `class Twitter {\n    public Twitter() {\n        \n    }\n    \n    public void postTweet(int userId, int tweetId) {\n        \n    }\n    \n    public List<Integer> getNewsFeed(int userId) {\n        \n    }\n    \n    public void follow(int followerId, int followeeId) {\n        \n    }\n    \n    public void unfollow(int followerId, int followeeId) {\n        \n    }\n}`,
        },
    },
    "find-median-from-data-stream": {
        id: "find-median-from-data-stream",
        title: "Find Median from Data Stream",
        difficulty: "hard",
        category: "Heap / Priority Queue",
        tags: ["Heap", "Design", "Data Stream", "Sorting"],
        description: {
            text: "The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the MedianFinder class.",
            notes: [],
        },
        examples: [
            {
                input: '["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]\n[[], [1], [2], [], [3], []]',
                output: '[null, null, null, 1.5, null, 2.0]',
            },
        ],
        starterCode: {
            javascript: `var MedianFinder = function() {\n    \n};\n\n/** \n * @param {number} num\n * @return {void}\n */\nMedianFinder.prototype.addNum = function(num) {\n    \n};\n\n/**\n * @return {number}\n */\nMedianFinder.prototype.findMedian = function() {\n    \n};`,
            python: `class MedianFinder:\n    def __init__(self):\n        pass\n\n    def addNum(self, num: int) -> None:\n        pass\n\n    def findMedian(self) -> float:\n        pass`,
            java: `class MedianFinder {\n    public MedianFinder() {\n        \n    }\n    \n    public void addNum(int num) {\n        \n    }\n    \n    public double findMedian() {\n        \n    }\n}`,
        },
    },
};
