export const TRIE_PROBLEMS = {
    "implement-trie-prefix-tree": {
        id: "implement-trie-prefix-tree",
        title: "Implement Trie (Prefix Tree)",
        difficulty: "medium",
        category: "Tries",
        tags: ["Trie", "Design", "Hash Table", "String"],
        description: {
            text: "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker. Implement the Trie class.",
            notes: [],
        },
        examples: [
            {
                input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]',
                output: '[null, null, true, false, true, null, true]',
            },
        ],
        starterCode: {
            javascript: `var Trie = function() {\n    \n};\n\n/** \n * @param {string} word\n * @return {void}\n */\nTrie.prototype.insert = function(word) {\n    \n};\n\n/** \n * @param {string} word\n * @return {boolean}\n */\nTrie.prototype.search = function(word) {\n    \n};\n\n/** \n * @param {string} prefix\n * @return {boolean}\n */\nTrie.prototype.startsWith = function(prefix) {\n    \n};`,
            python: `class Trie:\n    def __init__(self):\n        pass\n\n    def insert(self, word: str) -> None:\n        pass\n\n    def search(self, word: str) -> bool:\n        pass\n\n    def startsWith(self, prefix: str) -> bool:\n        pass`,
            java: `class Trie {\n    public Trie() {\n        \n    }\n    \n    public void insert(String word) {\n        \n    }\n    \n    public boolean search(String word) {\n        \n    }\n    \n    public boolean startsWith(String prefix) {\n        \n    }\n}`,
        },
    },
    "design-add-and-search-words-data-structure": {
        id: "design-add-and-search-words-data-structure",
        title: "Design Add and Search Words Data Structure",
        difficulty: "medium",
        category: "Tries",
        tags: ["Trie", "Design", "String", "DFS"],
        description: {
            text: "Design a data structure that supports adding new words and finding if a string matches any previously added string. WordDictionary class needs to check if the word exists in the data structure. A word can contain the dot character '.' to represent any one letter.",
            notes: [],
        },
        examples: [
            {
                input: '["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\n[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]',
                output: '[null,null,null,null,false,true,true,true]',
            },
        ],
        starterCode: {
            javascript: `var WordDictionary = function() {\n    \n};\n\n/** \n * @param {string} word\n * @return {void}\n */\nWordDictionary.prototype.addWord = function(word) {\n    \n};\n\n/** \n * @param {string} word\n * @return {boolean}\n */\nWordDictionary.prototype.search = function(word) {\n    \n};`,
            python: `class WordDictionary:\n    def __init__(self):\n        pass\n\n    def addWord(self, word: str) -> None:\n        pass\n\n    def search(self, word: str) -> bool:\n        pass`,
            java: `class WordDictionary {\n    public WordDictionary() {\n        \n    }\n    \n    public void addWord(String word) {\n        \n    }\n    \n    public boolean search(String word) {\n        \n    }\n}`,
        },
    },
    "word-search-ii": {
        id: "word-search-ii",
        title: "Word Search II",
        difficulty: "hard",
        category: "Tries",
        tags: ["Trie", "Backtracking", "Matrix", "DFS"],
        description: {
            text: "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.",
            notes: [],
        },
        examples: [
            {
                input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
                output: '["eat","oath"]',
            },
        ],
        starterCode: {
            javascript: `function findWords(board, words) {\n  // Your code here\n  \n}`,
            python: `def findWords(board, words):\n    # Your code here\n    pass`,
            java: `class Solution {\n    public List<String> findWords(char[][] board, String[] words) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
        },
    },
};
