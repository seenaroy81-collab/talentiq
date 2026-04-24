export const TREE_PROBLEMS = {
    "invert-binary-tree": {
        id: "invert-binary-tree",
        title: "Invert Binary Tree",
        difficulty: "easy",
        category: "Tree",
        tags: ["Tree", "DFS", "BFS"],
        description: {
            text: "Given the root of a binary tree, invert the tree, and return its root.",
            notes: [],
        },
        examples: [
            {
                input: "root = [4,2,7,1,3,6,9]",
                output: "[4,7,2,9,6,3,1]",
            },
        ],
        starterCode: {
            javascript: `function invertTree(root) {\n  // Your code here\n  \n}`,
            python: `def invertTree(root):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "maximum-depth-binary-tree": {
        id: "maximum-depth-binary-tree",
        title: "Maximum Depth of Binary Tree",
        difficulty: "easy",
        category: "Tree",
        tags: ["Tree", "DFS", "BFS"],
        description: {
            text: "Find the maximum depth of a binary tree (number of nodes along the longest path from root to leaf).",
            notes: [],
        },
        examples: [
            {
                input: "root = [3,9,20,null,null,15,7]",
                output: "3",
            },
        ],
        starterCode: {
            javascript: `function maxDepth(root) {\n  // Your code here\n  \n}`,
            python: `def maxDepth(root):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int maxDepth(TreeNode root) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "diameter-of-binary-tree": {
        id: "diameter-of-binary-tree",
        title: "Diameter of Binary Tree",
        difficulty: "easy",
        category: "Tree",
        tags: ["Tree", "DFS"],
        description: {
            text: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.",
            notes: [],
        },
        examples: [
            {
                input: "root = [1,2,3,4,5]",
                output: "3",
                explanation: "3 is the length of the path [4,2,1,3] or [5,2,1,3].",
            },
        ],
        starterCode: {
            javascript: `function diameterOfBinaryTree(root) {\n  // Your code here\n  \n}`,
            python: `def diameterOfBinaryTree(root):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "balanced-binary-tree": {
        id: "balanced-binary-tree",
        title: "Balanced Binary Tree",
        difficulty: "easy",
        category: "Tree",
        tags: ["Tree", "DFS"],
        description: {
            text: "Given a binary tree, determine if it is height-balanced (a binary tree in which the left and right subtrees of every node differ in height by no more than 1).",
            notes: [],
        },
        examples: [
            {
                input: "root = [3,9,20,null,null,15,7]",
                output: "true",
            },
        ],
        starterCode: {
            javascript: `function isBalanced(root) {\n  // Your code here\n  \n}`,
            python: `def isBalanced(root):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean isBalanced(TreeNode root) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "same-tree": {
        id: "same-tree",
        title: "Same Tree",
        difficulty: "easy",
        category: "Tree",
        tags: ["Tree", "DFS", "BFS"],
        description: {
            text: "Given the roots of two binary trees p and q, write a function to check if they are the same or not.",
            notes: [],
        },
        examples: [
            {
                input: "p = [1,2,3], q = [1,2,3]",
                output: "true",
            },
        ],
        starterCode: {
            javascript: `function isSameTree(p, q) {\n  // Your code here\n  \n}`,
            python: `def isSameTree(p, q):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "subtree-of-another-tree": {
        id: "subtree-of-another-tree",
        title: "Subtree of Another Tree",
        difficulty: "easy",
        category: "Tree",
        tags: ["Tree", "DFS", "Hash Function"],
        description: {
            text: "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.",
            notes: [],
        },
        examples: [
            {
                input: "root = [3,4,5,1,2], subRoot = [4,1,2]",
                output: "true",
            },
        ],
        starterCode: {
            javascript: `function isSubtree(root, subRoot) {\n  // Your code here\n  \n}`,
            python: `def isSubtree(root, subRoot):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "lowest-common-ancestor-of-a-binary-search-tree": {
        id: "lowest-common-ancestor-of-a-binary-search-tree",
        title: "Lowest Common Ancestor of a Binary Search Tree",
        difficulty: "medium",
        category: "Tree",
        tags: ["Tree", "DFS", "BST"],
        description: {
            text: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
            notes: [],
        },
        examples: [
            {
                input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
                output: "6",
            },
        ],
        starterCode: {
            javascript: `function lowestCommonAncestor(root, p, q) {\n  // Your code here\n  \n}`,
            python: `def lowestCommonAncestor(root, p, q):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "binary-tree-level-order": {
        id: "binary-tree-level-order",
        title: "Binary Tree Level Order Traversal",
        difficulty: "medium",
        category: "Tree",
        tags: ["Tree", "BFS"],
        description: {
            text: "Return the level order traversal of a binary tree's nodes (left to right, level by level).",
            notes: [],
        },
        examples: [
            {
                input: "root = [3,9,20,null,null,15,7]",
                output: "[[3],[9,20],[15,7]]",
            },
        ],
        starterCode: {
            javascript: `function levelOrder(root) {\n  // Your code here\n  \n}`,
            python: `def levelOrder(root):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
    "validate-bst": {
        id: "validate-bst",
        title: "Validate Binary Search Tree",
        difficulty: "medium",
        category: "Tree",
        tags: ["Tree", "DFS", "BST"],
        description: {
            text: "Determine if a binary tree is a valid binary search tree.",
            notes: ["Left subtree values < node value < right subtree values"],
        },
        examples: [
            {
                input: "root = [2,1,3]",
                output: "true",
            },
            {
                input: "root = [5,1,4,null,null,3,6]",
                output: "false",
            },
        ],
        starterCode: {
            javascript: `function isValidBST(root) {\n  // Your code here\n  \n}`,
            python: `def isValidBST(root):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public boolean isValidBST(TreeNode root) {\n        // Your code here\n        return false;\n    }\n}`,
        },
    },
    "kth-smallest-element-in-a-bst": {
        id: "kth-smallest-element-in-a-bst",
        title: "Kth Smallest Element in a BST",
        difficulty: "medium",
        category: "Tree",
        tags: ["Tree", "DFS", "BFS", "BST"],
        description: {
            text: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
            notes: [],
        },
        examples: [
            {
                input: "root = [3,1,4,null,2], k = 1",
                output: "1",
            },
        ],
        starterCode: {
            javascript: `function kthSmallest(root, k) {\n  // Your code here\n  \n}`,
            python: `def kthSmallest(root, k):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "construct-binary-tree-from-preorder-and-inorder-traversal": {
        id: "construct-binary-tree-from-preorder-and-inorder-traversal",
        title: "Construct Binary Tree from Preorder and Inorder Traversal",
        difficulty: "medium",
        category: "Tree",
        tags: ["Tree", "Array", "Hash Table", "Divide and Conquer"],
        description: {
            text: "Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
            notes: [],
        },
        examples: [
            {
                input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]",
                output: "[3,9,20,null,null,15,7]",
            },
        ],
        starterCode: {
            javascript: `function buildTree(preorder, inorder) {\n  // Your code here\n  \n}`,
            python: `def buildTree(preorder, inorder):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public TreeNode buildTree(int[] preorder, int[] inorder) {\n        // Your code here\n        return null;\n    }\n}`,
        },
    },
    "binary-tree-maximum-path-sum": {
        id: "binary-tree-maximum-path-sum",
        title: "Binary Tree Maximum Path Sum",
        difficulty: "hard",
        category: "Tree",
        tags: ["Tree", "DFS", "Dynamic Programming"],
        description: {
            text: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root. The path sum is the sum of the node's values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.",
            notes: [],
        },
        examples: [
            {
                input: "root = [-10,9,20,null,null,15,7]",
                output: "42",
                explanation: "The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.",
            },
        ],
        starterCode: {
            javascript: `function maxPathSum(root) {\n  // Your code here\n  \n}`,
            python: `def maxPathSum(root):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public int maxPathSum(TreeNode root) {\n        // Your code here\n        return 0;\n    }\n}`,
        },
    },
    "serialize-and-deserialize-binary-tree": {
        id: "serialize-and-deserialize-binary-tree",
        title: "Serialize and Deserialize Binary Tree",
        difficulty: "hard",
        category: "Tree",
        tags: ["Tree", "Design", "BFS"],
        description: {
            text: "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment. Design an algorithm to serialize and deserialize a binary tree.",
            notes: [],
        },
        examples: [
            {
                input: "root = [1,2,3,null,null,4,5]",
                output: "[1,2,3,null,null,4,5]",
            },
        ],
        starterCode: {
            javascript: `/**\n * Encodes a tree to a single string.\n * @param {TreeNode} root\n * @return {string}\n */\nvar serialize = function(root) {\n    \n};\n\n/**\n * Decodes your encoded data to tree.\n * @param {string} data\n * @return {TreeNode}\n */\nvar deserialize = function(data) {\n    \n};`,
            python: `class Codec:\n    def serialize(self, root):\n        \"\"\"Encodes a tree to a single string.\n        \n        :type root: TreeNode\n        :rtype: str\n        \"\"\"\n        \n\n    def deserialize(self, data):\n        \"\"\"Decodes your encoded data to tree.\n        \n        :type data: str\n        :rtype: TreeNode\n        \"\"\"\n        `,
            java: `public class Codec {\n\n    // Encodes a tree to a single string.\n    public String serialize(TreeNode root) {\n        \n    }\n\n    // Decodes your encoded data to tree.\n    public TreeNode deserialize(String data) {\n        \n    }\n}`,
        },
    },
};
