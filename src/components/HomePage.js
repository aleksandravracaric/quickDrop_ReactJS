import { useState, useRef } from 'react';
import { uploadBytes } from 'firebase/storage';
import { getFilesFirestoreReference, getFilesStorageReference } from '../services/Firebase';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { doc } from 'firebase/firestore';
import { FILE_SIZE_LIMIT_MB, FILES_LIMIT } from '../FileConfig';


export default function HomePage() {
    const [selectedFile, setSelectedFiles] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadingStateMessage, setUploadingStateMessage] = useState('')
    const [filesData, setFilesData] = useState({
        expirationHours: 1
    })

    const fileInputRef = useRef(null);

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

        const uploadPromises = filesToUpload.map(async (file) => {
            try {
                const filesStorageRef = getFilesStorageReference(sessionId, file.name);;

                await uploadBytes(filesStorageRef, file);
                console.log(`Uploaded: ${file.name}`);
                return { file, fileName: file.name, filePath: file.filePath, sessionId };
            } catch (error) {
                console.log(error);
                alert(`Failed to upload ${file.name}`);
                return null;
            }
        });

        await Promise.all(uploadPromises);

        setLoading(false);
        setUploadingStateMessage('Uploaded');
    };


    const handleSelectHours = (value) => {
        console.log(`value: ${value}`)
        setFilesData(prev => ({ ...prev, expirationHours: value }))
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
                                Duration: {filesData.expirationHours}h
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
