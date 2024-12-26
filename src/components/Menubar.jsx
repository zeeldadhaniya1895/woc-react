import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import { boysAndGirls, ayuLight, barf, cobalt, clouds } from "thememirror";
import { LANGUAGE_DATA } from "../config/constants";
import { executeCode } from "../API/api";
import {
  setEditorTheme,
  setEditorLanguage,
  toggleLineWrapping,
} from "../store/varSlice";
import { FaBars, FaTerminal, FaPlay, FaCode, FaPalette, FaLanguage } from "react-icons/fa";
import { setAll, setOutput } from "../store/apiResponseSlice";
// import  {onCreateEditor} from "../appwrite/service_functionality";
// import  {onCreateEditor} from "../appwrite/auth.service";
import { addNewTab } from '../appwrite/database.service';
import authService from '../appwrite/auth.service';
// Main Menubar component
export default function Menubar({ fileSectionVisible, setFileSectionVisible, terminalVisible, setTerminalVisible, setTerminalHeight,guest,onCreateEditor }) {
  // Initialize Redux dispatch
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isThemeDropdownVisible, setThemeDropdownVisible] = useState(false);
  const [isLanguageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [isLanguageDropdownVisible2, setLanguageDropdownVisible2] = useState(false);
  const [fileName, setFileName] = useState(null);

  // Available themes object
  const themes = {
    oneDark,
    boysAndGirls,
    ayuLight,
    barf,
    cobalt,
    clouds,
  };
  
  // Get editor state from Redux store
  const { theme, language, codeSnippet, isLineWrapping,version} =
    useSelector((state) => state.var.editor);
  const {input} = useSelector((state) => state.response);

  const handleThemeChange = (e) => {
    dispatch(setEditorTheme(e.target.value));
    setThemeDropdownVisible(false);
  };

  const handleLanguageChange = (e) => {
    dispatch(setEditorLanguage(e.target.value));
    setLanguageDropdownVisible(false);
  };

  const handleLanguageChange2 = async (e) => {
    try {
      setLanguageDropdownVisible2(false);
      const selectedLanguage = e.target.value;
      
      if (fileName && selectedLanguage) {
        const user = await authService.getCurrentUser();
        if (!user) {
          throw new Error('No user logged in');
        }
  
        const result = await addNewTab(user.email, fileName, selectedLanguage);
        
        if (result.success) {
          dispatch(setEditorLanguage(selectedLanguage));
          console.log(result.message);
        } else {
          console.error(result.message);
        }
        
        setFileName(null);
      }
    } catch (error) {
    console.error("Create Editor error:", error);
  }};

  const handleLineWrapping = () => {
    dispatch(toggleLineWrapping());
  };


 const handleNewEditor = () => {
    const name = prompt("Enter file name:");
    if (name) {

      setFileName(name);
      setLanguageDropdownVisible2(true); 
     // Show the dropdown
    }
  };


  const runCode = async () => {
    setLoading(true);
    setTerminalVisible(true);
    dispatch(setOutput("Loading..."));
    try {
      const result = await executeCode(language, version, codeSnippet, input);
      dispatch(setAll(result));
    } catch (error) {
      console.error("Run Code error:", error);
      dispatch(setAll({ output: "Error executing code", code: 1 }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white px-3 py-2 flex justify-between items-center border border-gray-700 shadow-md">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {/* File Section Toggle */}
        {!guest && (
          <button
            onClick={() => setFileSectionVisible(!fileSectionVisible)}
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-purple-500 transition-all shadow-md"
          >
            <FaBars className="text-lg" />
          </button>
        )}

        {/* Terminal Toggle */}
        <button
          onClick={() => {
            setTerminalVisible(!terminalVisible);
            setTerminalHeight(250);
          }}
          className="p-2 bg-gray-800 text-white rounded-md hover:bg-purple-500 transition-all shadow-md"
        >
          <FaTerminal className="text-lg" />
        </button>

        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLanguageDropdownVisible(!isLanguageDropdownVisible)}
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-purple-500 shadow-md sm:hidden"
          >
            <FaLanguage />
          </button>
          <select
            className={`px-2 py-1 bg-gray-700 text-white rounded-md shadow-md focus:ring focus:ring-purple-400 ${
              isLanguageDropdownVisible ? "block" : "hidden sm:block"
            }`}
            value={language}
            onChange={handleLanguageChange}
          >
            {LANGUAGE_DATA.map((lang, index) => (
              <option key={index} value={lang.language}>
                {lang.language.toUpperCase()} (v{lang.version})
              </option>
            ))}
          </select>
        </div>

        
        {/* Theme Dropdown */}
        
      </div>

      <button
  className={`relative flex items-center gap-2 justify-center w-auto px-4 py-2 rounded-full ${
    loading
      ? "bg-blue-600 cursor-not-allowed opacity-80"
      : "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500"
  } shadow-md hover:shadow-lg active:scale-95 transition-all`}
  onClick={runCode}
  disabled={loading}
>
  {loading ? (
    <>
      <svg
        className="animate-spin w-5 h-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 100 8h4a8 8 0 01-8 8v-4a4 4 0 100-8H4z"
        ></path>
      </svg>
      <span className="text-sm font-medium text-white">Running...</span>
    </>
  ) : (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9.75 6.75a.75.75 0 011.074-.659l8.5 4.75a.75.75 0 010 1.318l-8.5 4.75a.75.75 0 01-1.124-.659V6.75z" />
      </svg>
      <span className="text-sm font-medium text-white">Run Code</span>
    </>
  )}
</button>




      {/* Right Section */}
      <div className="flex items-center space-x-3">

      <div className="relative">
          <button
            onClick={() => setThemeDropdownVisible(!isThemeDropdownVisible)}
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-purple-500 shadow-md sm:hidden"
          >
            <FaPalette />
          </button>
          <select
            className={`px-2 py-1 bg-gray-700 text-white rounded-md shadow-md focus:ring focus:ring-purple-400 ${
              isThemeDropdownVisible ? "block" : "hidden sm:block"
            }`}
            value={theme}
            onChange={handleThemeChange}
          >
            {Object.keys(themes).map((themeKey, index) => (
              <option key={index} value={themeKey}>
                {themeKey}
              </option>
            ))}
          </select>
        </div>
      </div>


    {/*Add a button for adding new code editors */}
    {!guest && ( <button
  onClick={handleNewEditor}
  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 flex items-center justify-center shadow-md"
>
  <FaCode className="text-lg" />
  <span className="hidden sm:inline ml-2">New Editor</span>
</button>
    )}
  {/* Language Dropdown */}
  {isLanguageDropdownVisible2 && (
    <div className="absolute bg-gray-800 text-white p-4 rounded shadow-md">
      <label className="block mb-2">Select Language:</label>
      <select
        className="px-2 py-1 bg-gray-700 rounded"
        onChange={handleLanguageChange2}
      >
        {LANGUAGE_DATA.map((lang, index) => (
          <option key={index} value={lang.language}>
            {lang.language.toUpperCase()} (v{lang.version})
          </option>
        ))}
      </select>
    </div>
  )}
      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Line wrapping toggle button */}
        <button
          className="px-4 py-1 bg-gray-700 text-white rounded-md hover:bg-cyan-500 transition-all shadow-md flex items-center space-x-2"
          onClick={handleLineWrapping}
        >
          <FaCode />
          <span className="hidden sm:inline">
            {isLineWrapping ? "Disable Wrapping" : "Enable Wrapping"}
          </span>
        </button>

        {/* Run Code */}
              
      </div>
    </div>
  );
}
