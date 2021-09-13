import React, { useState, useEffect } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState('');
  const [gif, setGif] = useState('');
  const load = async () => {
    const res = await ffmpeg.load();
    console.log(res);
    setLoading(false);
  };
  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );
    const data = ffmpeg.FS('readFile', 'out.gif');
    const url = URL.createObjectURL(new Blob([data.buffer]), {
      type: 'image/gif',
    });
    setGif(url);
  };

  useEffect(() => {
    load();
  }, []);
  return (
    <div className="App">
      {loading ? (
        <p>loading</p>
      ) : (
        <div>
          <input
            type="file"
            onChange={(e) => setVideo(e.target.files?.item[0])}
          />
          <button onClick={convertToGif}>convert</button>
          {video && (
            <video
              src={URL.createObjectURL(video)}
              controls
              width="250"
            ></video>
          )}
          {gif && <img src={gif} />}
        </div>
      )}
    </div>
  );
}

export default App;
