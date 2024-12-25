import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { fetchEditors } from "../API/api";
import authService from "../appwrite/auth.service";

export default function Filebar({ fileSectionWidth, setFileSectionWidth }) {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current user
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          console.error("No user logged in");
          setLoading(false);
          return;
        }

        // Fetch editors for the current user
        const editorsData = await fetchEditors(currentUser.uid);
        setEditors(editorsData);
      } catch (error) {
        console.error("Error fetching editors or user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="bg-gray-900 border-r border-gray-700 text-gray-400 flex flex-col justify-start items-center p-4">Loading...</div>; // Display loading state
  }

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
      <h3 className="text-gray-400">Sidebar</h3>
      <hr />
      <ol>
        {editors.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
      </ol>
    </Rnd>
  );
}
