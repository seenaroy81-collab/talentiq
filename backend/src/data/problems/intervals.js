export const INTERVAL_PROBLEMS = {
    "insert-interval": {
        id: "insert-interval",
        title: "Insert Interval",
        difficulty: "medium",
        category: "Intervals",
        tags: ["Array", "Intervals"],
        description: {
            text: "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval. Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary). Return intervals after the insertion.",
            notes: [],
        },
        examples: [
            {
                input: "intervals = [[1,3],[6,9]], newInterval = [2,5]",
                output: "[[1,5],[6,9]]",
            },
        ],
        starterCode: {
            javascript: `function insert(intervals, newInterval) {\n  // Your code here\n  \n}`,
            python: `def insert(intervals, newInterval):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[][] insert(int[][] intervals, int[] newInterval) {\n        // Your code here\n        return new int[0][0];\n    }\n}`,
        },
    },
    "merge-intervals": {
        id: "merge-intervals",
        title: "Merge Intervals",
        difficulty: "medium",
        category: "Intervals",
        tags: ["Array", "Sorting", "Intervals"],
        description: {
            text: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
            notes: [],
        },
        examples: [
            {
                input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
                output: "[[1,6],[8,10],[15,18]]",
            },
        ],
        starterCode: {
            javascript: `function merge(intervals) {\n  // Your code here\n  \n}`,
            python: `def merge(intervals):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n        return new int[0][0];\n    }\n}`,
        },
    },
    "non-overlapping-intervals": {
        id: "non-overlapping-intervals",
        title: "Non-overlapping Intervals",
        difficulty: "medium",
        category: "Intervals",
        tags: ["Array", "Dynamic Programming", "Greedy", "Sorting", "Intervals"],
        description: {
            text: "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
            notes: [],
        },
        examples: [
            {
                input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
                output: "1",
                explanation: "[1,3] can be removed and the rest of the intervals are non-overlapping.",
            },
        ],
        starterCode: {
            javascript: `function eraseOverlapIntervals(intervals) {\n  // Your code here\n  \n}`,
            python: `def eraseOverlapIntervals(intervals):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "meeting-rooms": {
        id: "meeting-rooms",
        title: "Meeting Rooms",
        difficulty: "easy",
        category: "Intervals",
        tags: ["Array", "Sorting", "Intervals"],
        description: {
            text: "Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings.",
            notes: [],
        },
        examples: [
            {
                input: "intervals = [[0,30],[5,10],[15,20]]",
                output: "false",
            },
        ],
        starterCode: {
            javascript: `function canAttendMeetings(intervals) {\n  // Your code here\n  \n}`,
            python: `def canAttendMeetings(intervals):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean canAttendMeetings(int[][] intervals) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "meeting-rooms-ii": {
        id: "meeting-rooms-ii",
        title: "Meeting Rooms II",
        difficulty: "medium",
        category: "Intervals",
        tags: ["Array", "Two Pointers", "Greedy", "Sorting", "Heap", "Intervals"],
        description: {
            text: "Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.",
            notes: [],
        },
        examples: [
            {
                input: "intervals = [[0,30],[5,10],[15,20]]",
                output: "2",
            },
        ],
        starterCode: {
            javascript: `function minMeetingRooms(intervals) {\n  // Your code here\n  \n}`,
            python: `def minMeetingRooms(intervals):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int minMeetingRooms(int[][] intervals) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
};
