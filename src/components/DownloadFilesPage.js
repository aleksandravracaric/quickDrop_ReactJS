import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { getFilesFirestoreReference, getFilesStorageReference } from '../services/Firebase';
import { downloadFile } from '../helper/DownloadHelper';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function DownloadFilesPage() {
    const { sessionId } = useParams()
    const [fileList, setFileList] = useState([]);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const filesRef = doc(getFilesFirestoreReference(), sessionId)
                const docSnap = await getDoc(filesRef);

                const fileData = docSnap.data()
                console.log(`fileData: ${fileData}`)

                if (fileData == null || isFileExpired(fileData)) {
                    setError('Link expired.')
                } else {
                    const fileNames = fileData.fileNames
                    setFileList(fileNames);
                }

            } catch (error) {
                console.log(error);
            }
        }
        fetchFiles()
    }, [sessionId])


    function isFileExpired(fileData) {
        const now = Timestamp.now()

        const expirationHours = new Timestamp(
            fileData.createdAt.seconds + fileData.duration * 3600,
            fileData.createdAt.nanoseconds
        )
        return now.toMillis() >= expirationHours.toMillis()
    }

    return (
        <div className="container-fluid backgroundColorDownloadPageList">
            <h2 className="text-center mb-4">Files to download</h2>
            <>
                <ul className="list-group">
                    {error ? (
                        <div className='d-flex justify-content-center align-items-center'>
                            {error}
                        </div>

                    ) : (
                        fileList.map((fileName, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    {fileName}
                                </div>
                                <Button className="btn btn-success" onClick={() => downloadFile(getFilesStorageReference(sessionId, fileName))}>
                                    Download
                                </Button>
                            </li>
                        ))
                    )}
                </ul>
            </>
        </div>
    )
}
