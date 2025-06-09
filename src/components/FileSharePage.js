import { useParams } from 'react-router-dom';
import { useState } from 'react';
import QRCode from 'react-qr-code';

const FileSharePage = () => {
    const { sessionId } = useParams();

    const [downloadLink] = useState(`${window.location.origin}/download/${sessionId}`);

    const handleCopy = () => {
        navigator.clipboard.writeText(downloadLink)
    }

    return (
        <div className='container-fluid backgroundColorOfPages'>
            <div className='row backgroundHeaderTitle'>
                <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 align-items-center'>
                    <h4 className="downloadTitleText">Quick Drop</h4>
                </div>
            </div>
            <div className='row d-flex justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
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
        </div>
    );
};

export default FileSharePage;
