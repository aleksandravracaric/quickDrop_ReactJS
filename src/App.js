import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import FileSharePage from './components/FileSharePage';
import DownloadFilesPage from './components/DownloadFilesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/:sessionId' element={<FileSharePage />}></Route>
        <Route path='/download/:sessionId' element={<DownloadFilesPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
