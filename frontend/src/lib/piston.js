import axiosInstance from "./axios";

// Piston is now proxied via our backend to handle test cases
// const PISTON_API = "https://emkc.org/api/v2/piston";

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @param {string} problemId - current problem ID
 * @returns {Promise<{success:boolean, output?:string, error?: string, results?: any[]}>}
 */
export async function executeCode(language, code, problemId) {
  try {
    const response = await axiosInstance.post("code/execute", {
      language,
      code,
      problemId
    });

    const data = response.data;

    // The backend returns { success, status, results, raw_output, error }

    if (data.error) {
      return {
        success: false,
        error: data.error,
        output: data.raw_output
      };
    }

    if (!data.success) { // Runtime error parsed by controller
      return {
        success: false,
        error: data.error || "Runtime Error",
        output: data.raw_output
      };
    }

    // Pass back the full test results to UI
    return {
      success: true,
      status: data.status, // "Accepted" or "Wrong Answer"
      results: data.results,
      output: formatOutput(data.results, data.status)
    };

  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || `Failed to execute code: ${error.message}`,
    };
  }
}

function formatOutput(results, status) {
  if (!results) return "";

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  let output = `${status}\n`;
  output += `Passed: ${passedCount}/${totalCount} Test Cases\n\n`;

  results.forEach((r, idx) => {
    output += `Test Case ${idx + 1}: ${r.passed ? "PASSED" : "FAILED"}\n`;
    output += `Input:Str: ${r.input}\n`;
    output += `Expected: ${r.expected}\n`;
    output += `Actual:   ${r.actual}\n`;
    output += `----------------------------\n`;
  });

  return output;
}

// Deprecated local logic, but keeping for reference if needed
function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}
