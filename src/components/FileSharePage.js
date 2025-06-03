import { useParams } from 'react-router-dom';
import { useState } from 'react';
import QRCode from 'react-qr-code';

const FileSharePage = () => {
    const { sessionId } = useParams();

    const [downloadLink] = useState(`${window.location.origin}/download/${sessionId}`);

    return (
        <div className='container-fluid backgroundColorDownloadPage'>
            <div className='text-center'>
                <div className='downloadLink' >
                    <div className='qrCode' >
                        <QRCode value={downloadLink} size={150} />
                    </div>

                    <p>
                        <a
                            href={downloadLink} target="_blank" rel="noopener noreferrer">
                            Click here
                        </a>
                        {/* todo: add icon for copy and logic for copy */}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FileSharePage;
