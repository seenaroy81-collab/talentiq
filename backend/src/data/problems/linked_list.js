export const LINKED_LIST_PROBLEMS = {
    "reverse-linked-list": {
        id: "reverse-linked-list",
        title: "Reverse Linked List",
        difficulty: "easy",
        category: "Linked List",
        tags: ["Linked List", "Recursion"],
        description: {
            text: "Reverse a singly linked list.",
            notes: ["Can be done iteratively or recursively"],
        },
        examples: [
            {
                input: "head = [1,2,3,4,5]",
                output: "[5,4,3,2,1]",
            },
        ],
        starterCode: {
            javascript: `function reverseList(head) {\n  // Your code here\n  \n}`,
            python: `def reverseList(head):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "merge-two-sorted-lists": {
        id: "merge-two-sorted-lists",
        title: "Merge Two Sorted Lists",
        difficulty: "easy",
        category: "Linked List",
        tags: ["Linked List", "Recursion"],
        description: {
            text: "Merge two sorted linked lists and return it as a sorted list.",
            notes: [],
        },
        examples: [
            {
                input: "list1 = [1,2,4], list2 = [1,3,4]",
                output: "[1,1,2,3,4,4]",
            },
        ],
        starterCode: {
            javascript: `function mergeTwoLists(list1, list2) {\n  // Your code here\n  \n}`,
            python: `def mergeTwoLists(list1, list2):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "reorder-list": {
        id: "reorder-list",
        title: "Reorder List",
        difficulty: "medium",
        category: "Linked List",
        tags: ["Linked List", "Two Pointers", "Stack", "Recursion"],
        description: {
            text: "You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …",
            notes: [],
        },
        examples: [
            {
                input: "head = [1,2,3,4]",
                output: "[1,4,2,3]",
            },
        ],
        starterCode: {
            javascript: `function reorderList(head) {\n  // Your code here\n  \n}`,
            python: `def reorderList(head):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public void reorderList(ListNode head) {\n        // Your code here\n    }\n}`,
        },
    },
    "remove-nth-node": {
        id: "remove-nth-node",
        title: "Remove Nth Node From End of List",
        difficulty: "medium",
        category: "Linked List",
        tags: ["Linked List", "Two Pointers"],
        description: {
            text: "Remove the nth node from the end of the list and return its head.",
            notes: ["Do this in one pass"],
        },
        examples: [
            {
                input: "head = [1,2,3,4,5], n = 2",
                output: "[1,2,3,5]",
            },
        ],
        starterCode: {
            javascript: `function removeNthFromEnd(head, n) {\n  // Your code here\n  \n}`,
            python: `def removeNthFromEnd(head, n):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "copy-list-with-random-pointer": {
        id: "copy-list-with-random-pointer",
        title: "Copy List with Random Pointer",
        difficulty: "medium",
        category: "Linked List",
        tags: ["Hash Table", "Linked List"],
        description: {
            text: "A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null. Construct a deep copy of the list.",
            notes: [],
        },
        examples: [
            {
                input: "head = [[7,null],[13,0],[11,4],[10,2],[1,0]]",
                output: "[[7,null],[13,0],[11,4],[10,2],[1,0]]",
            },
        ],
        starterCode: {
            javascript: `function copyRandomList(head) {\n  // Your code here\n  \n}`,
            python: `def copyRandomList(head):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public Node copyRandomList(Node head) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "add-two-numbers": {
        id: "add-two-numbers",
        title: "Add Two Numbers",
        difficulty: "medium",
        category: "Linked List",
        tags: ["Linked List", "Math", "Recursion"],
        description: {
            text: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
            notes: [],
        },
        examples: [
            {
                input: "l1 = [2,4,3], l2 = [5,6,4]",
                output: "[7,0,8]",
                explanation: "342 + 465 = 807.",
            },
        ],
        starterCode: {
            javascript: `function addTwoNumbers(l1, l2) {\n  // Your code here\n  \n}`,
            python: `def addTwoNumbers(l1, l2):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "linked-list-cycle": {
        id: "linked-list-cycle",
        title: "Linked List Cycle",
        difficulty: "easy",
        category: "Linked List",
        tags: ["Linked List", "Two Pointers"],
        description: {
            text: "Determine if a linked list has a cycle in it.",
            notes: ["Use Floyd's Cycle Detection (fast & slow pointers)"],
        },
        examples: [
            {
                input: "head = [3,2,0,-4], pos = 1",
                output: "true",
                explanation: "Cycle at position 1",
            },
        ],
        starterCode: {
            javascript: `function hasCycle(head) {\n  // Your code here\n  \n}`,
            python: `def hasCycle(head):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "find-the-duplicate-number": {
        id: "find-the-duplicate-number",
        title: "Find the Duplicate Number",
        difficulty: "medium",
        category: "Linked List",
        tags: ["Array", "Two Pointers", "Binary Search", "Bit Manipulation"],
        description: {
            text: "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums, return this repeated number. You must solve the problem without modifying the array nums and uses only constant extra space.",
            notes: [],
        },
        examples: [
            {
                input: "nums = [1,3,4,2,2]",
                output: "2",
            },
        ],
        starterCode: {
            javascript: `function findDuplicate(nums) {\n  // Your code here\n  \n}`,
            python: `def findDuplicate(nums):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int findDuplicate(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "lru-cache": {
        id: "lru-cache",
        title: "LRU Cache",
        difficulty: "medium",
        category: "Linked List",
        tags: ["Hash Table", "Linked List", "Design", "Doubly Linked List"],
        description: {
            text: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
            notes: [],
        },
        examples: [
            {
                input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
                output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
            },
        ],
        starterCode: {
            javascript: `var LRUCache = function(capacity) {\n    \n};\n\n/** \n * @param {number} key\n * @return {number}\n */\nLRUCache.prototype.get = function(key) {\n    \n};\n\n/** \n * @param {number} key \n * @param {number} value\n * @return {void}\n */\nLRUCache.prototype.put = function(key, value) {\n    \n};`,
            python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass`,
            java: `class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    \n    public int get(int key) {\n        \n    }\n    \n    public void put(int key, int value) {\n        \n    }\n}`,
        },
    },
    "merge-k-sorted-lists": {
        id: "merge-k-sorted-lists",
        title: "Merge k Sorted Lists",
        difficulty: "hard",
        category: "Linked List",
        tags: ["Linked List", "Divide and Conquer", "Heap", "Merge Sort"],
        description: {
            text: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
            notes: [],
        },
        examples: [
            {
                input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
                output: "[1,1,2,3,4,4,5,6]",
            },
        ],
        starterCode: {
            javascript: `function mergeKLists(lists) {\n  // Your code here\n  \n}`,
            python: `def mergeKLists(lists):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "reverse-nodes-in-k-group": {
        id: "reverse-nodes-in-k-group",
        title: "Reverse Nodes in k-Group",
        difficulty: "hard",
        category: "Linked List",
        tags: ["Linked List", "Recursion"],
        description: {
            text: "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list.",
            notes: [],
        },
        examples: [
            {
                input: "head = [1,2,3,4,5], k = 2",
                output: "[2,1,4,3,5]",
            },
        ],
        starterCode: {
            javascript: `function reverseKGroup(head, k) {\n  // Your code here\n  \n}`,
            python: `def reverseKGroup(head, k):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
};
