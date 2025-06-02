import { useState, useRef } from 'react';
import { uploadBytes } from 'firebase/storage';
import { getFilesFirestoreReference, getFilesStorageReference } from '../services/Firebase';
import { Button } from 'react-bootstrap';
import { doc } from 'firebase/firestore';


export default function FilePicker({ onFileSelect, uploadStateSetter }) {
    const [fileName, setFileName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadingStateMessage, setUploadingStateMessage] = useState('')

    const fileInputRef = useRef(null);
    const sizeFiveMB = 5242880;

    const handleAddFilesClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const filesToUpload = Array.from(event.target.files);

        let isFileLarge = false
        filesToUpload.forEach(file => {
            if (file.size > sizeFiveMB) {
                isFileLarge = true
                return
            }
        });

        if (isFileLarge) {
            alert('Error uploading file')
            return
        }

        setUploadingStateMessage('Uploading...');
        setLoading(true);

        const newFileRef = doc(getFilesFirestoreReference());
        const sessionId = newFileRef.id;

        const uploadPromises = filesToUpload.map(async (file) => {
            try {
                const filesStorageRef = getFilesStorageReference(file.name, sessionId);;

                await uploadBytes(filesStorageRef, file);
                console.log(`Uploaded: ${file.name}`);
                return { file, fileName: file.name, filePath: file.filePath, sessionId };
            } catch (error) {
                console.log(error);
                alert(`Failed to upload ${file.name}`);
                return null;
            }
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        const successfulFiles = [];

        uploadedFiles.forEach(file => {
            if (file !== null) {
                console.log("Uploaded file:", file.fileName);
                successfulFiles.push(file);
            } else {
                console.log("Upload error");
            }
        });

        if (onFileSelect) {
            onFileSelect(successfulFiles);
        }

        setLoading(false);
        setUploadingStateMessage('Uploaded');
    };

    return (
        <div className='container-fluid backgroundColorHomePage'>
            <div className='row d-flex justify-content-center'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 align-items-start'>
                    <h3>Quick Drop</h3>
                </div>
            </div>
            <div className='row d-flex justify-content-center align-items-center'>
                <div className='col-12 align-items-center text-center '>
                    <Button className="addFilesButton" onClick={handleAddFilesClick} disabled={loading}>
                        <p className='plusText'><i class="bi bi-file-earmark-plus"></i></p>
                        {loading ? 'Uploading...' : uploadingStateMessage}
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </div>
    );
}
