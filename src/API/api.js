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
    console.log(language, version, sourceCode, codeInput);
    const response = await axios.post("https://winter-of-code-react-js.vercel.app/code/execute-code", {
      language: language.toLowerCase(),
      version,
      sourceCode,
      codeInput,
    });
    console.log(response.data);
    // Return standard output if present, otherwise return error output
    return response.data || "Execution completed with no output.";
  } catch (error) {
    console.error("Error executing code:", error.message);
    throw new Error("An error occurred while executing the code.");
  }
};


export const addEditor = async (userId, editor) => {
  try {
    await axios.post("http://localhost:5000/addEditor", { userId, editor });
  } catch (error) {
    console.error("Error adding editor:", error);
  }
};

export const updateEditor = async (userId, editorId, code) => {
  try {
    await axios.put("http://localhost:5000/updateEditor", { userId, editorId, code });
  } catch (error) {
    console.error("Error updating editor:", error);
  }
};

export const deleteEditor = async (userId, editorId) => {
  try {
    await axios.delete("http://localhost:5000/deleteEditor", { data: { userId, editorId } });
  } catch (error) {
    console.error("Error deleting editor:", error);
  }
};

// only give the list of filename of all the editors of a user
export const fetchEditors = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5000/getEditors/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching editors:", error);
    return [];
  }
};
