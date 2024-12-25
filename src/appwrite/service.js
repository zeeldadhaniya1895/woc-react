const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path-to-your-firebase-admin-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Add a new editor for a user
app.post("/addEditor", async (req, res) => {
  const { userId, editor } = req.body; // editor: {editorId, fileName, language, code}
  try {
    const userDoc = db.collection("users").doc(userId);
    await userDoc.set(
      {
        editors: admin.firestore.FieldValue.arrayUnion(editor),
      },
      { merge: true }
    );
    res.status(200).send("Editor added successfully");
  } catch (error) {
    console.error("Error adding editor:", error);
    res.status(500).send("Error adding editor");
  }
});

// Update code for a specific editor
app.put("/updateEditor", async (req, res) => {
  const { userId, editorId, code } = req.body;
  try {
    const userDoc = db.collection("users").doc(userId);
    const userData = await userDoc.get();

    if (!userData.exists) return res.status(404).send("User not found");

    const editors = userData.data().editors.map((editor) =>
      editor.editorId === editorId ? { ...editor, code } : editor
    );

    await userDoc.set({ editors }, { merge: true });
    res.status(200).send("Editor updated successfully");
  } catch (error) {
    console.error("Error updating editor:", error);
    res.status(500).send("Error updating editor");
  }
});

// Delete an editor for a user
app.delete("/deleteEditor", async (req, res) => {
  const { userId, editorId } = req.body;
  try {
    const userDoc = db.collection("users").doc(userId);
    const userData = await userDoc.get();

    if (!userData.exists) return res.status(404).send("User not found");

    const editors = userData.data().editors.filter((editor) => editor.editorId !== editorId);

    await userDoc.set({ editors }, { merge: true });
    res.status(200).send("Editor deleted successfully");
  } catch (error) {
    console.error("Error deleting editor:", error);
    res.status(500).send("Error deleting editor");
  }
});

// Get all editors for a user

// app.get("/getEditors/:userId", async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const doc = await db.collection("users").doc(userId).get();
//     if (doc.exists) {
//       res.status(200).send(doc.data().editors || []);
//     } else {
//       res.status(404).send("No editors found for user");
//     }
//   } catch (error) {
//     console.error("Error retrieving editors:", error);
//     res.status(500).send("Error retrieving editors");
//   }
// });


// Get all editors filename for a user
app.get("/getEditors/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      // Fetch the user's editors and only include the fileName field
      const user = await UserModel.findById(userId, { editors: { fileName: 1 } });
  
      if (!user) {
        return res.status(404).send({ error: "User not found." });
      }
  
      // Extract filenames from the editors array
      const fileNames = user.editors.map(editor => editor.fileName);
      res.status(200).send(fileNames);
    } catch (error) {
      console.error("Error fetching editor filenames:", error);
      res.status(500).send({ error: "Failed to fetch editor filenames." });
    }
  });
  


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
