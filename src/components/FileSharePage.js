import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from 'react-bootstrap';
import LogoIcon from '../quickDropLogoIcon.png'

const FileSharePage = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate()

    const [downloadLink] = useState(`${window.location.origin}/download/${sessionId}`);

    const handleCopy = () => {
        navigator.clipboard.writeText(downloadLink)
    }

    const handleUploadAgain = () => {
        navigate('/')
    }

    return (
        <div className='container-fluid backgroundColorOfPages'>
            <div className='row backgroundHeaderTitle'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex justify-content-between align-items-center'>
                    <div className=' d-flex align-items-center'>
                        <img src={LogoIcon} alt="Logo" style={{ width: '30px', height: 'auto', }} />
                        <h4 className="downloadTitleText mt-2 ms-2">Quick Drop</h4>
                    </div>
                    <Button onClick={handleUploadAgain} className='buttonUploadAgain'>Upload again</Button>
                </div>
            </div>
            <div className='row d-flex justify-content-center align-items-center' style={{ minHeight: '88vh' }}>
                <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center'>
                    <div className="fileShareContainer" style={{ width: '100%' }}>
                        <div className='downloadLink' >
                            <p className='fileShareContainerTitle'>Scan QR Code</p>
                            <div className='qrCode' >
                                <QRCode value={downloadLink} size={150} />
                            </div>
                            <div className="d-flex align-items-center">
                                <input
                                    type="text"
                                    className="form-control downloadLinkInput"
                                    value={downloadLink}
                                    readOnly
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        border: 'none'
                                    }}
                                    title={downloadLink}
                                />
                                <i
                                    className="bi bi-copy ms-2"
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: '#ffffff',
                                        width: '35px',
                                        height: '35px',
                                        borderRadius: '5px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    onClick={handleCopy}
                                    title="Copy link"
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <div className="text-center">
                    Made by Aleksandra
                </div>
            </footer>
        </div>
    );
};

export default FileSharePage;
