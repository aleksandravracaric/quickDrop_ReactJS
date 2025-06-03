import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { getFilesFirestoreReference, getFilesStorageReference } from '../services/Firebase';
import { downloadFile } from '../helper/DownloadHelper';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function DownloadFilesPage() {
    const { sessionId } = useParams()
    const [fileList, setFileList] = useState([]);


    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const filesRef = doc(getFilesFirestoreReference(), sessionId)
                const docSnap = await getDoc(filesRef);

                const fileData = docSnap.data()
                const fileNames = fileData.fileNames
                setFileList(fileNames);
            } catch (error) {
                console.log(error);
            }
        }
        fetchFiles()
    }, [sessionId])

    return (
        <div className="container-fluid backgroundColorDownloadPageList">
            <h2 className="text-center mb-4">Files to download</h2>
            <>
                <ul className="list-group">
                    {fileList.map((fileName, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                {fileName}
                            </div>
                            <Button className="btn btn-success" onClick={() => downloadFile(getFilesStorageReference(sessionId, fileName))}>
                                Download
                            </Button>
                        </li>
                    ))}
                </ul>
            </>
        </div>
    )
}
