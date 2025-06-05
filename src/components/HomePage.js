import { useState, useRef } from 'react';
import { uploadBytes } from 'firebase/storage';
import { getFilesFirestoreReference, getFilesStorageReference } from '../services/Firebase';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { FILE_SIZE_LIMIT_MB, FILES_LIMIT } from '../FileConfig';
import { useNavigate } from 'react-router-dom';


export default function HomePage() {
    const [loading, setLoading] = useState(false);
    const [uploadingStateMessage, setUploadingStateMessage] = useState('')

    const initialDuration = 1
    const [duration, setDuration] = useState(initialDuration)

    const fileInputRef = useRef(null);
    const navigate = useNavigate()

    const clearDuration = () => {
        setDuration(initialDuration)
    }

    const handleAddFilesClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const filesToUpload = Array.from(event.target.files);

        let isFileLarge = false
        filesToUpload.forEach(file => {
            if (file.size > FILE_SIZE_LIMIT_MB) {
                isFileLarge = true
                return
            }
        });

        if (filesToUpload.length > FILES_LIMIT) {
            alert('Only 5 files allowed!')
            return
        }

        if (isFileLarge) {
            alert('Error uploading file')
            return
        }

        setUploadingStateMessage('Uploading...');
        setLoading(true);

        const newFileRef = doc(getFilesFirestoreReference());
        const sessionId = newFileRef.id;

        const fileNames = []
        const uploadPromises = filesToUpload.map(async (file) => {
            try {
                const filesStorageRef = getFilesStorageReference(sessionId, file.name);
                console.log("SessionId:", sessionId);

                await uploadBytes(filesStorageRef, file);
                console.log(`Uploaded: ${file.name}`);
                fileNames.push(file.name)
                return { file, fileName: file.name, filePath: file.filePath, sessionId };
            } catch (error) {
                console.log(error);
                alert(`Failed to upload ${file.name}`);
                return null;
            }
        });

        await Promise.all(uploadPromises);

        const data = {
            uid: sessionId,
            duration: duration,
            createdAt: serverTimestamp(),
            fileNames: fileNames
        }

        try {
            await setDoc(newFileRef, data)
        } catch (error) {
            console.log(error)
            setLoading(false)
            alert('Error uploading file')
            return
        }

        setLoading(false);
        setUploadingStateMessage('Uploaded');
        clearDuration()
        navigate(`/${sessionId}`)
    };


    const handleSelectHours = (value) => {
        setDuration(value)
    }

    return (
        <div className='container-fluid backgroundColorHomePage'>
            <div className='row'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12'>
                    <h3 className="pt-1 ps-1">Quick Drop</h3>
                </div>
            </div>

            <div className='row d-flex justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
                <div className='col-xl-4 col-lg-4 col-md-6 col-sm-11 align-items-center text-center '>
                    <div className='text-center'>
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
                        <Dropdown className='mt-3' onSelect={(e) => handleSelectHours(e)}>
                            <DropdownToggle className='dropdownHours' variant="primary" id="dropdownHoursButton">
                                Duration: {duration}h
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem eventKey='1'>
                                    1h
                                </DropdownItem>
                                <DropdownItem eventKey='6'>
                                    6h
                                </DropdownItem>
                                <DropdownItem eventKey='24'>
                                    24h
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
