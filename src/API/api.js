import axios from "axios";

/**
 * Function to execute code using the provided API.
 * @param {string} language - The programming language to execute.
 * @param {string} version - The version of the language.
 * @param {string} sourceCode - The source code to execute.
 * @param {string} codeInput - Input for the program, if required.
 * @returns {Promise<string>} - The output or error message.
 */
export const executeCode = async (language, version, sourceCode, codeInput = "") => {
  try {
    const response = await axios.post("https://winter-of-code-react-js.vercel.app/code/execute-code", {
      language: language.toLowerCase(),
      version,
      sourceCode,
      codeInput,
    });

    

    // Return standard output if present, otherwise return error output
    return response.data || "Execution completed with no output.";
  } catch (error) {
    console.error("Error executing code:", error.message);
    throw new Error("An error occurred while executing the code.");
  }
};
