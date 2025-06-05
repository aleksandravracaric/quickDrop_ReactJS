const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/https');
admin.initializeApp()
const cors = require("cors")


const db = admin.firestore()
const storage = admin.storage()
const bucket = storage.bucket()

const allowedOrigins = [
    "http://localhost:3000",
    "https://a-quickdrop.web.app/",
];

const corsHandler = cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
});


exports.deleteExpiredFiles = onRequest({ region: ["europe-west1"] }, (req, res) => {
    corsHandler(req, res, async () => {
        try {
            const now = admin.firestore.Timestamp.now()

            const snapshot = await db.collection('files').get()

            const deletions = snapshot.docs.map(async (doc) => {
                const data = doc.data()
                const { createdAt, duration, uid, fileNames } = data

                if (!createdAt || !duration || !uid || !fileNames) return;

                const expiration = new admin.firestore.Timestamp(
                    createdAt.seconds + duration * 3600,
                    createdAt.nanoseconds
                )

                if (now.toMillis() >= expiration.toMillis()) {
                    await deleteFolder(uid, fileNames)
                    await doc.ref.delete()
                }
            })
            await Promise.all(deletions)
            return res.status(200).json({ success: true })
        } catch (error) {
            console.error('Error deleting expired files:', error);
            return res.status(500).json({ message: error })
        }

    })
})

async function deleteFolder(folderPath, fileNames) {
    const deletePromises = fileNames.map(fileName => {
        const filePath = `${folderPath}/${fileName}`;
        return bucket.file(filePath).delete();
    });

    await Promise.all(deletePromises);

    console.log(`Deleted all files in folder: ${folderPath}`);
}
