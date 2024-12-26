import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import {
  deleteTab,
  renameTab,
  getTabCode,
  getUserTabs,
  addNewTab,
} from "../appwrite/database.service";
import authService from "../appwrite/auth.service";
import {
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaPlus,
  FaTimesCircle,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { LANGUAGE_DATA } from "../config/constants";
import { setEditorLanguage } from "../store/varSlice";
import { Icon } from "@mui/material";
import { ICON } from "../config/icon";
export default function Filebar({
  fileSectionWidth,
  setFileSectionWidth,
  onTabSelect,
  setFileSectionVisible,
}) {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTab, setEditingTab] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFileName, setModalFileName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(null);
  const [tabToDelete, setTabToDelete] = useState(null);
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        if (!user) {
          throw new Error("No user logged in");
        }
        const userTabs = await getUserTabs(user.email);
        setTabs(userTabs);
      } catch (err) {
        console.error("Error fetching tabs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTabs();
  }, []);

  const handleTabClick = async (tab) => {
    try {
      const user = await authService.getCurrentUser();
      const code = await getTabCode(user.email, tab.id);
      onTabSelect(tab, code);
    } catch (error) {
      console.error("Error fetching tab code:", error);
      setNotificationModal({
        type: "error",
        message: "Failed to load the file content. Please try again.",
      });
      setTimeout(() => setNotificationModal(null), 2000);
    }
  };

  const handleDeleteClick = (tabId) => {
    setTabToDelete(tabId);
    setConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const user = await authService.getCurrentUser();
      const success = await deleteTab(user.email, tabToDelete);
      if (success) {
        setTabs(tabs.filter((tab) => tab.id !== tabToDelete));
        setNotificationModal({
          type: "success",
          message: "Tab deleted successfully!",
        });
      } else {
        setNotificationModal({
          type: "error",
          message: "Failed to delete the tab.",
        });
      }
    } catch (error) {
      console.error("Error deleting tab:", error);
      setNotificationModal({
        type: "error",
        message: "An error occurred while deleting the tab.",
      });
    } finally {
      setConfirmModal(false);
      setTimeout(() => setNotificationModal(null), 2000);
    }
  };

  const handleRenameClick = (tab) => {
    setEditingTab(tab.id);
    setNewFileName(tab.name);
  };

  const handleRenameSubmit = async (tabId) => {
    try {
      const user = await authService.getCurrentUser();
      const result = await renameTab(user.email, tabId, newFileName);
      if (result.success) {
        setTabs(tabs.map((tab) => (tab.id === tabId ? { ...tab, name: newFileName } : tab)));
        setNotificationModal({
          type: "success",
          message: "Tab renamed successfully!",
        });
      } else {
        setNotificationModal({
          type: "error",
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error renaming tab:", error);
      setNotificationModal({
        type: "error",
        message: "An error occurred while renaming the tab.",
      });
    } finally {
      setEditingTab(null);
      setTimeout(() => setNotificationModal(null), 2000);
    }
  };

  const handleNewEditor = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    try {
      if (!modalFileName || !selectedLanguage) {
        setNotificationModal({
          type: "error",
          message: "Please provide a file name and select a language.",
        });
        return;
      }

      const user = await authService.getCurrentUser();
      if (!user) {
        throw new Error("No user logged in");
      }

      const result = await addNewTab(user.email, modalFileName, selectedLanguage);
      if (result.success) {
        dispatch(setEditorLanguage(selectedLanguage));
        setTabs([...tabs, { id: result.tabId, name: modalFileName }]);
        setNotificationModal({
          type: "success",
          message: "File created successfully!",
        });
      } else {
        setNotificationModal({
          type: "error",
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error creating new file:", error);
      setNotificationModal({
        type: "error",
        message: "An error occurred while creating the file.",
      });
    } finally {
      setIsModalOpen(false);
      setModalFileName("");
      setSelectedLanguage("");
      setTimeout(() => setNotificationModal(null), 2000);
    }
  };

  const handleCloseFilebar = () => {
    setFileSectionVisible(false);
  };

  return (
    <>
      <Rnd
        size={{ width: fileSectionWidth, height: "100%" }}
        minWidth={150}
        maxWidth={400}
        enableResizing={{ right: true }}
        disableDragging={true}
        onResizeStop={(e, direction, ref) => setFileSectionWidth(ref.offsetWidth)}
        className="bg-gray-900 border-r border-gray-700 flex flex-col justify-start items-center p-4"
      >
        <div className="flex justify-between items-center w-full mb-4">
          <h3 className="text-gray-400">Files</h3>
          <div className="flex gap-2">
            <button onClick={handleNewEditor} className="text-green-500">
              <FaPlus />
            </button>
            <button onClick={handleCloseFilebar} className="text-red-500">
              <FaTimesCircle />
            </button>
          </div>
        </div>
        <hr className="w-full border-gray-700 mb-4" />
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <ol className="w-full space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id} className="flex items-center justify-between text-gray-300 hover:bg-gray-800 p-2 rounded">
                {editingTab === tab.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="bg-gray-700 px-2 py-1 rounded"
                    />
                    <button onClick={() => handleRenameSubmit(tab.id)}>
                      <FaCheck className="text-green-500" />
                    </button>
                    <button onClick={() => setEditingTab(null)}>
                      <FaTimes className="text-red-500" />
                    </button>
                  </div>
                ) : (
                  <>
                  <span>
                  <img
        src={ICON[tab.language]}
        alt={`${tab.language} Icon`}
        className="inline-block w-6 h-6 mr-2"
      />
                  </span>
                    <span className="cursor-pointer flex-grow" onClick={() => handleTabClick(tab)}>
                      {tab.name}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleRenameClick(tab)}>
                        <FaEdit className="text-blue-500" />
                      </button>
                      <button onClick={() => handleDeleteClick(tab.id)}>
                        <FaTrash className="text-red-500" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
        )}
      </Rnd>

      {/* Modal for new file */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Create New File</h3>
            <div className="mb-4">
              <label className="block mb-2">File Name:</label>
              <input
                type="text"
                value={modalFileName}
                onChange={(e) => setModalFileName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Select Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded"
              >
                <option value="">Select Language</option>
                {LANGUAGE_DATA.map((lang, index) => (
                  <option key={index} value={lang.language}>
                    {lang.language.toUpperCase()} (v{lang.version})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this tab? This action cannot be undone.</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notificationModal && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-4 rounded shadow-lg">
          <p>{notificationModal.message}</p>
        </div>
      )}
    </>
  );
}
