export const STACK_PROBLEMS = {
    "valid-parentheses": {
        id: "valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "easy",
        category: "Stack",
        tags: ["String", "Stack"],
        description: {
            text: "Determine if the input string has valid parentheses. Open brackets must be closed by the same type in correct order.",
            notes: [],
        },
        examples: [
            { input: 's = "()"', output: "true" },
            { input: 's = "()[]{}"', output: "true" },
            { input: 's = "(]"', output: "false" },
        ],
        starterCode: {
            javascript: `function isValid(s) {\n  // Your code here\n  \n}\n\nconsole.log(isValid("()")); // true`,
            python: `def isValid(s):\n    # Your code here\n    pass\n\nprint(isValid("()")) # True`,
            java: `class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "min-stack": {
        id: "min-stack",
        title: "Min Stack",
        difficulty: "medium",
        category: "Stack",
        tags: ["Stack", "Design"],
        description: {
            text: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
            notes: []
        },
        examples: [
            {
                input: '["MinStack","push","push","push","getMin","pop","top","getMin"] [[],[-2],[0],[-3],[],[],[],[]]',
                output: '[null,null,null,null,-3,null,0,-2]'
            }
        ],
        starterCode: {
            javascript: `var MinStack = function() {\n    \n};\n\n/** \n * @param {number} val\n * @return {void}\n */\nMinStack.prototype.push = function(val) {\n    \n};\n\n/**\n * @return {void}\n */\nMinStack.prototype.pop = function() {\n    \n};\n\n/**\n * @return {number}\n */\nMinStack.prototype.top = function() {\n    \n};\n\n/**\n * @return {number}\n */\nMinStack.prototype.getMin = function() {\n    \n};`,
            python: `class MinStack:\n    def __init__(self):\n        pass\n\n    def push(self, val: int) -> None:\n        pass\n\n    def pop(self) -> None:\n        pass\n\n    def top(self) -> int:\n        pass\n\n    def getMin(self) -> int:\n        pass`,
            java: `class MinStack {\n    public MinStack() {\n        \n    }\n    \n    public void push(int val) {\n        \n    }\n    \n    public void pop() {\n        \n    }\n    \n    public int top() {\n        \n    }\n    \n    public int getMin() {\n        \n    }\n}`,
        },
    },
    "evaluate-reverse-polish-notation": {
        id: "evaluate-reverse-polish-notation",
        title: "Evaluate Reverse Polish Notation",
        difficulty: "medium",
        category: "Stack",
        tags: ["Stack", "Array", "Math"],
        description: {
            text: "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /. Each operand may be an integer or another expression. Note that division between two integers should truncate toward zero.",
            notes: []
        },
        examples: [
            {
                input: 'tokens = ["2","1","+","3","*"]',
                output: "9",
                explanation: "((2 + 1) * 3) = 9"
            }
        ],
        starterCode: {
            javascript: `function evalRPN(tokens) {\n  // Your code here\n  \n}`,
            python: `def evalRPN(tokens):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int evalRPN(String[] tokens) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "generate-parentheses": {
        id: "generate-parentheses",
        title: "Generate Parentheses",
        difficulty: "medium",
        category: "Stack",
        tags: ["String", "Stack", "Backtracking"],
        description: {
            text: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
            notes: []
        },
        examples: [
            {
                input: "n = 3",
                output: '["((()))","(()())","(())()","()(())","()()()"]'
            }
        ],
        starterCode: {
            javascript: `function generateParenthesis(n) {\n  // Your code here\n  \n}`,
            python: `def generateParenthesis(n):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<String> generateParenthesis(int n) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "daily-temperatures": {
        id: "daily-temperatures",
        title: "Daily Temperatures",
        difficulty: "medium",
        category: "Stack",
        tags: ["Array", "Stack", "Monotonic Stack"],
        description: {
            text: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0.",
            notes: []
        },
        examples: [
            {
                input: "temperatures = [73,74,75,71,69,72,76,73]",
                output: "[1,1,4,2,1,1,0,0]"
            }
        ],
        starterCode: {
            javascript: `function dailyTemperatures(temperatures) {\n  // Your code here\n  \n}`,
            python: `def dailyTemperatures(temperatures):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        // Your code here\n        return new int[0];\n    }\n}`,
        },
    },
    "car-fleet": {
        id: "car-fleet",
        title: "Car Fleet",
        difficulty: "medium",
        category: "Stack",
        tags: ["Array", "Stack", "Sorting", "Monotonic Stack"],
        description: {
            text: "There are n cars going to the same destination along a one-lane road. The destination is target miles away. You are given two integer arrays position and speed, both of length n, where position[i] is the position of the ith car and speed[i] is the speed of the ith car (in miles per hour). Return the number of car fleets that will arrive at the destination.",
            notes: []
        },
        examples: [
            {
                input: "target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]",
                output: "3",
                explanation: "The cars starting at 10 and 8 become a fleet, meeting at target. The car starting at 0 does not catch up to any other car. The cars starting at 5 and 3 become a fleet."
            }
        ],
        starterCode: {
            javascript: `function carFleet(target, position, speed) {\n  // Your code here\n  \n}`,
            python: `def carFleet(target, position, speed):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int carFleet(int target, int[] position, int[] speed) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "largest-rectangle-in-histogram": {
        id: "largest-rectangle-in-histogram",
        title: "Largest Rectangle in Histogram",
        difficulty: "hard",
        category: "Stack",
        tags: ["Array", "Stack", "Monotonic Stack"],
        description: {
            text: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
            notes: []
        },
        examples: [
            {
                input: "heights = [2,1,5,6,2,3]",
                output: "10",
                explanation: "The largest rectangle has an area = 10 units."
            }
        ],
        starterCode: {
            javascript: `function largestRectangleArea(heights) {\n  // Your code here\n  \n}`,
            python: `def largestRectangleArea(heights):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int largestRectangleArea(int[] heights) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
};
