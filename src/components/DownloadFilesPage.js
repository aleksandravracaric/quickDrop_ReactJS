import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { getFilesFirestoreReference, getFilesStorageReference } from '../services/Firebase';
import { downloadFile } from '../helper/DownloadHelper';
import { useParams } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import LogoIcon from '../quickDropLogoIcon.png'
import SignedFooter from './SignedFooter';

export default function DownloadFilesPage() {
    const { sessionId } = useParams()
    const [fileList, setFileList] = useState([]);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingDownload, setLoadingDownload] = useState(false)

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true)
            try {
                const filesRef = doc(getFilesFirestoreReference(), sessionId)
                const docSnap = await getDoc(filesRef);
                const fileData = docSnap.data()
                console.log(`fileData: ${fileData}`)

                if (fileData == null || isFileExpired(fileData)) {
                    setLoading(false)
                    setError('Link expired.')
                } else {
                    const fileNames = fileData.fileNames
                    setLoading(false)
                    setFileList(fileNames);
                }
            } catch (error) {
                setLoading(false)
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

    function showLoadingAnimation() {
        setLoadingDownload(true)
        setTimeout(() => {
            setLoadingDownload(false)
        }, 1500)
    }

    return (
        <>
            <div className="container-fluid backgroundColorOfPages">
                <div className='row backgroundHeaderTitle'>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex align-items-center">
                        <img src={LogoIcon} alt="Logo" style={{ width: '30px', height: 'auto', }} />
                        <h3 className="downloadTitleText mt-2 ms-2">Quick Drop</h3>
                    </div>
                </div>
                <div className='row d-flex justify-content-center'>
                    <div className='col-xl-10 col-lg-10 col-md-10 col-sm-12 align-items-center' style={{ minHeight: '88vh' }}>
                        <div className="bg-white uploadedFilesContainer" style={{ width: '100%' }}>
                            <h5 className="fs-bold pt-3 ps-3 text-start" style={{ letterSpacing: '1px' }}>Download files</h5>
                            {loading ? (
                                <div className="loading-indicator text-center pb-4">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden"></span>
                                    </Spinner>
                                </div>
                            ) : (
                                <>
                                    <ul className=" uploadedFilesList">
                                        {
                                            error ? (
                                                <div className='d-flex justify-content-center align-items-center mb-3' >
                                                    {error}
                                                </div>

                                            ) : (
                                                fileList.map((fileName, index) => (
                                                    <li key={index} className=" d-flex justify-content-between align-items-center downloadFileItem">
                                                        <div className="d-flex align-items-center">
                                                            {fileName}
                                                        </div>

                                                        {loadingDownload ? (
                                                            <Button className="downloadFileButton text-light">
                                                                <Spinner className='' animation="border" role="status">
                                                                    <span className="visually-hidden"></span>
                                                                </Spinner>
                                                            </Button>
                                                        )
                                                            : (<Button className="downloadFileButton" onClick={
                                                                () => {
                                                                    showLoadingAnimation()
                                                                    downloadFile(getFilesStorageReference(sessionId, fileName))

                                                                }}>
                                                                Download
                                                            </Button>
                                                            )
                                                        }
                                                    </li>
                                                ))
                                            )}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div >
                </div >
            </div >
            <SignedFooter />
        </>
    )
}
