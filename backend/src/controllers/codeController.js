import axios from "axios";
import { PROBLEMS } from "../data/problems.js";

const ALL_PROBLEMS = PROBLEMS;

const PISTON_API = "https://emkc.org/api/v2/piston";

export const executeCode = async (req, res) => {
    try {
        const { language, code, problemId } = req.body;

        if (!language || !code || !problemId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const problem = PROBLEMS[problemId];
        if (!problem) {
            // Fallback: If not found in our limited backend import, maybe accept test cases from client?
            // For security, strict matching is better, but for this demo, let's allow "custom" execution if problem not found
            // OR just error out. Let's error out for "LeetCode style" to enforce structure.
            return res.status(404).json({ error: "Problem execution execution not supported for this ID yet" });
        }

        const testCases = problem.examples; // In real LeetCode, these are hidden cases

        // Construct Driver Code
        let driverCode = "";

        if (language === "javascript") {
            driverCode = generateJSDriver(code, problem.id, testCases);
        } else if (language === "python") {
            driverCode = generatePythonDriver(code, problem.id, testCases);
        } else {
            return res.status(400).json({ error: "Language not supported for full execution" });
        }

        const response = await axios.post(`${PISTON_API}/execute`, {
            language: language === "python" ? "python" : "javascript",
            version: language === "python" ? "3.10.0" : "18.15.0",
            files: [{ content: driverCode }]
        });

        const { run } = response.data;
        const output = run.output.trim();

        // Parse the output (Expected JSON format from our driver)
        // The driver should print a JSON on the last line like: {"results": [...]}
        // If runtime error, it won't be JSON.

        let results;
        try {
            // Find the last line that looks like JSON
            const lines = output.split('\n');
            const lastLine = lines[lines.length - 1];
            results = JSON.parse(lastLine);
        } catch (e) {
            return res.status(200).json({
                success: false,
                status: "Runtime Error",
                error: run.stderr || output
            });
        }

        // Determine final status
        const allPassed = results.every(r => r.passed);

        res.status(200).json({
            success: true,
            status: allPassed ? "Accepted" : "Wrong Answer",
            results: results,
            raw_output: output // For debugging
        });

    } catch (error) {
        console.error("Execution error:", error);
        res.status(500).json({ error: "Failed to execute code" });
    }
};

function generateJSDriver(userCode, functionName, testCases) {
    // We need to know the function name.
    // In our data, the user code usually starts with "function name(...)". 
    // We can regex it or just "blindly" call the expected function name if we stored it in DB.
    // Our data structure has `id` which is usually the slug, but not the function name.
    // Let's assume standard names for now or regex extract.

    // Hack: In the starter code, we can see the function name.
    // For 'Two Sum', expected is 'twoSum'.
    // Let's rely on the user NOT changing the function name, which is standard LeetCode behavior.

    // We'll wrap the user code and then run tests
    const testsJSON = JSON.stringify(testCases.map(tc => {
        // Parse input string "nums = [...], target = 9" into proper JS arguments
        // This is tricky without a strict parser.
        // SIMPLIFICATION: We will try to pass the raw values if we can parse the input string.
        // For this demo, let's hardcode a parsing logic for "Two Sum" style inputs.
        return { input: tc.input, expected: tc.output };
    }));

    return `
    ${userCode}

    const tests = ${testsJSON};
    const results = [];

    // Helper to parse input string like "nums = [2,7], target = 9"
    function parseArgs(inputStr) {
        // Very basic parser: extract values
        // Remove variable names
        const parts = inputStr.split(', ').map(p => p.split(' = ')[1]);
        return parts.map(p => JSON.parse(p));
    }

    try {
      tests.forEach(test => {
          const args = parseArgs(test.input);
          // Determine function name to call - tricky dynamically.
          // We'll try to find the global function that matches the pattern
          // For now, let's just assume the user wrote the function validation manually?
          // No, we must call it.
          
          // Let's assume the function name is the camelCase version of the title or we regex the user code
          const funcMatch = "${userCode}".match(/function\\s+(\\w+)/);
          const funcName = funcMatch ? funcMatch[1] : "twoSum"; // Fallback
          
          if (typeof global[funcName] !== 'function' && typeof this[funcName] !== 'function') {
             // Maybe it's defined in scope
          }

          const output = eval(funcName)(...args);
          
          // Compare output
          const expected = JSON.parse(test.expected);
          
          // Deep equal check for arrays
          const isEqual = JSON.stringify(output) === JSON.stringify(expected);
          
          results.push({
              input: test.input,
              expected: test.expected,
              actual: JSON.stringify(output),
              passed: isEqual
          });
      });
      
      console.log(JSON.stringify(results));
    } catch (e) {
      console.log(JSON.stringify({ error: e.message }));
    }
  `;
}

function generatePythonDriver(userCode, functionName, testCases) {
    // Similar logic for Python
    return `
import json
import ast

${userCode}

def parse_args(input_str):
    parts = input_str.split(', ')
    return [ast.literal_eval(p.split(' = ')[1]) for p in parts]

tests = ${JSON.stringify(testCases.map(tc => ({ input: tc.input, expected: tc.output })))}
results = []

try:
    # Find function name
    import inspect
    functions = [f for f in dir() if inspect.isfunction(locals()[f]) and f != 'parse_args']
    # Start with the last defined function usually
    func_name = functions[-1] if functions else "twoSum"

    for test in tests:
        args = parse_args(test['input'])
        func = locals()[func_name]
        
        output = func(*args)
        expected = ast.literal_eval(test['expected'])
        
        is_equal = output == expected
        # Handling lists order if needed? (Assume order matters for now)

        results.append({
            "input": test['input'],
            "expected": test['expected'],
            "actual": json.dumps(output),
            "passed": is_equal
        })

    print(json.dumps(results))

except Exception as e:
    print(json.dumps({"error": str(e)}))
   `;
}
