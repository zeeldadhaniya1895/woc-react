import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { deleteTab, renameTab, getTabCode, getUserTabs } from '../appwrite/database.service';
import authService from '../appwrite/auth.service';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

export default function Filebar({ fileSectionWidth, setFileSectionWidth,onTabSelect }) {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTab, setEditingTab] = useState(null);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        setLoading(true);
        // Get current user
        const user = await authService.getCurrentUser();
        if (!user) {
          throw new Error('No user logged in');
        }

        // Fetch tabs using user's email
        const userTabs = await getUserTabs(user.email);
        setTabs(userTabs);
      } catch (err) {
        console.error('Error fetching tabs:', err);
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
      // console.log('Code:', code);
      onTabSelect(tab, code);
    } catch (error) {
      console.error('Error fetching tab code:', error);
    }
  };

  const handleDeleteClick = async (tabId) => {
    try {
      if (window.confirm('Are you sure you want to delete this tab? This action cannot be undone.')) {
        const user = await authService.getCurrentUser();
        const success = await deleteTab(user.email, tabId);
        if (success) {
          setTabs(tabs.filter(tab => tab.id !== tabId));
        }
      }
    } catch (error) {
      console.error('Error deleting tab:', error);
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
        setTabs(tabs.map(tab => 
          tab.id === tabId ? { ...tab, name: newFileName } : tab
        ));
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error renaming tab:', error);
    }
    setEditingTab(null);
  };
  return (
    <Rnd
      size={{ width: fileSectionWidth, height: "100%" }}
      minWidth={150}
      maxWidth={400}
      enableResizing={{ right: true }}
      disableDragging={true}
      onResizeStop={(e, direction, ref) => setFileSectionWidth(ref.offsetWidth)}
      className="bg-gray-900 border-r border-gray-700 flex flex-col justify-start items-center p-4"
    >
      <h3 className="text-gray-400">Files</h3>
      <hr className="w-full border-gray-700 mb-4" />
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <ol className="w-full space-y-2">
          {tabs.map((tab) => (
            <li 
              key={tab.id} 
              className="flex items-center justify-between text-gray-300 hover:bg-gray-800 p-2 rounded"
            >
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
                  <span 
                    className="cursor-pointer flex-grow"
                    onClick={() => handleTabClick(tab)}
                  >
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
  );
}