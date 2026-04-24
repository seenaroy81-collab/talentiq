export const GRAPH_PROBLEMS = {
    "number-of-islands": {
        id: "number-of-islands",
        title: "Number of Islands",
        difficulty: "medium",
        category: "Graphs",
        tags: ["Graph", "DFS", "BFS", "Grid"],
        description: {
            text: "Count the number of islands in a 2D grid. '1' represents land and '0' represents water. Islands are formed by connecting adjacent lands horizontally or vertically.",
            notes: [],
        },
        examples: [
            {
                input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
                output: "2",
            },
        ],
        starterCode: {
            javascript: `function numIslands(grid) {\n  // Your code here\n  \n}`,
            python: `def numIslands(grid):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "clone-graph": {
        id: "clone-graph",
        title: "Clone Graph",
        difficulty: "medium",
        category: "Graphs",
        tags: ["Graph", "DFS", "BFS", "Hash Table"],
        description: {
            text: "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.",
            notes: [],
        },
        examples: [
            {
                input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
                output: "[[2,4],[1,3],[2,4],[1,3]]",
            },
        ],
        starterCode: {
            javascript: `/**\n * // Definition for a Node.\n * function Node(val, neighbors) {\n *    this.val = val === undefined ? 0 : val;\n *    this.neighbors = neighbors === undefined ? [] : neighbors;\n * };\n */\n\n/**\n * @param {Node} node\n * @return {Node}\n */\nvar cloneGraph = function(node) {\n    \n};`,
            python: `class Node:\n    def __init__(self, val = 0, neighbors = None):\n        self.val = val\n        self.neighbors = neighbors if neighbors is not None else []\n\nclass Solution:\n    def cloneGraph(self, node: 'Node') -> 'Node':\n        pass`,
            java: `class Solution {\n    public Node cloneGraph(Node node) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "max-area-of-island": {
        id: "max-area-of-island",
        title: "Max Area of Island",
        difficulty: "medium",
        category: "Graphs",
        tags: ["Graph", "DFS", "BFS", "Grid"],
        description: {
            text: "You are given an m x n binary matrix grid. An island is a group of 1s (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water. The area of an island is the number of cells with a value 1 in the island. Return the maximum area of an island in grid. If there is no island, return 0.",
            notes: [],
        },
        examples: [
            {
                input: 'grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],...]',
                output: "6",
            },
        ],
        starterCode: {
            javascript: `function maxAreaOfIsland(grid) {\n  // Your code here\n  \n}`,
            python: `def maxAreaOfIsland(grid):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int maxAreaOfIsland(int[][] grid) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "pacific-atlantic-water-flow": {
        id: "pacific-atlantic-water-flow",
        title: "Pacific Atlantic Water Flow",
        difficulty: "medium",
        category: "Graphs",
        tags: ["Graph", "DFS", "BFS", "Grid"],
        description: {
            text: "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. Return a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.",
            notes: [],
        },
        examples: [
            {
                input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
                output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
            },
        ],
        starterCode: {
            javascript: `function pacificAtlantic(heights) {\n  // Your code here\n  \n}`,
            python: `def pacificAtlantic(heights):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "surrounded-regions": {
        id: "surrounded-regions",
        title: "Surrounded Regions",
        difficulty: "medium",
        category: "Graphs",
        tags: ["Graph", "DFS", "BFS", "Grid", "Union Find"],
        description: {
            text: "Given an m x n matrix board containing 'X' and 'O', capture all regions that are 4-directionally surrounded by 'X'. A region is captured by flipping all 'O's into 'X's in that surrounded region.",
            notes: [],
        },
        examples: [
            {
                input: 'board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',
                output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]',
            },
        ],
        starterCode: {
            javascript: `/**\n * @param {character[][]} board\n * @return {void} Do not return anything, modify board in-place instead.\n */\nvar solve = function(board) {\n    \n};`,
            python: `def solve(board):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public void solve(char[][] board) {\n        // Your code here\n    }\n}`,
        },
    },
    "rotting-oranges": {
        id: "rotting-oranges",
        title: "Rotting Oranges",
        difficulty: "medium",
        category: "Graphs",
        tags: ["Graph", "BFS", "Grid"],
        description: {
            text: "You are given an m x n grid where each cell can have one of three values: 0 representing an empty cell, 1 representing a fresh orange, or 2 representing a rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.",
            notes: [],
        },
        examples: [
            {
                input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]',
                output: "4",
            },
        ],
        starterCode: {
            javascript: `function orangesRotting(grid) {\n  // Your code here\n  \n}`,
            python: `def orangesRotting(grid):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int orangesRotting(int[][] grid) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "course-schedule": {
        id: "course-schedule",
        title: "Course Schedule",
        difficulty: "medium",
        category: "Graphs",
        tags: ["Graph", "DFS", "BFS", "Topological Sort"],
        description: {
            text: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
            notes: [],
        },
        examples: [
            {
                input: "numCourses = 2, prerequisites = [[1,0]]",
                output: "true",
            },
        ],
        starterCode: {
            javascript: `function canFinish(numCourses, prerequisites) {\n  // Your code here\n  \n}`,
            python: `def canFinish(numCourses, prerequisites):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "course-schedule-ii": {
        id: "course-schedule-ii",
        title: "Course Schedule II",
        difficulty: "medium",
        category: "Graphs",
        tags: ["Graph", "DFS", "BFS", "Topological Sort"],
        description: {
            text: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.",
            notes: [],
        },
        examples: [
            {
                input: "numCourses = 2, prerequisites = [[1,0]]",
                output: "[0,1]",
            },
        ],
        starterCode: {
            javascript: `function findOrder(numCourses, prerequisites) {\n  // Your code here\n  \n}`,
            python: `def findOrder(numCourses, prerequisites):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
    "redundant-connection": {
        id: "redundant-connection",
        title: "Redundant Connection",
        difficulty: "medium",
        category: "Graphs",
        tags: ["Graph", "DFS", "BFS", "Union Find"],
        description: {
            text: "In this problem, a tree is an undirected graph that is connected and has no cycles. You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and was not an edge that already existed. Return an edge that can be removed so that the resulting graph is a tree of n nodes.",
            notes: []
        },
        examples: [
            {
                input: "edges = [[1,2],[1,3],[2,3]]",
                output: "[2,3]"
            }
        ],
        starterCode: {
            javascript: `function findRedundantConnection(edges) {\n  // Your code here\n  \n}`,
            python: `def findRedundantConnection(edges):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[] findRedundantConnection(int[][] edges) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
    "word-ladder": {
        id: "word-ladder",
        title: "Word Ladder",
        difficulty: "hard",
        category: "Graphs",
        tags: ["Graph", "BFS", "Hash Table"],
        description: {
            text: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter. Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
            notes: []
        },
        examples: [
            {
                input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
                output: "5",
                explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog", which has length 5.'
            }
        ],
        starterCode: {
            javascript: `function ladderLength(beginWord, endWord, wordList) {\n  // Your code here\n  \n}`,
            python: `def ladderLength(beginWord, endWord, wordList):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
};
