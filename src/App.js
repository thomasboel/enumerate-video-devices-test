import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';

function App() {
  const [ devices, setDevices ] = useState([]);

  const refs = [
    useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)
  ]

  useEffect(() => {
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
    window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

    navigator.mediaDevices.enumerateDevices().then(devs => {
      let videoDevices = _.filter(devs, d => d.kind === 'videoinput');
      setDevices(videoDevices);

      const getUserMediaSuccess = (stream, refObject) => {      
        try {
          refObject.current.srcObject = stream;
        } catch (error) {
          refObject.current.src = window.URL.createObjectURL(stream);
        }
      }

      const attemptGetUserMedia = (constraints, refObject) => {
        if (navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia(constraints).then(stream => getUserMediaSuccess(stream, refObject))
        } else if (navigator.getUserMedia) {
          navigator.getUserMedia(constraints, stream => getUserMediaSuccess(stream, refObject), (e) => console.error(e));
        }
      }
  
      for (let i = 0; i < videoDevices.length; i++) {
        setTimeout(() => {
          const constraints = { video: { deviceId: { exact: videoDevices[i].deviceId } }, audio: false };
          attemptGetUserMedia(constraints, refs[i]);
        }, i * 1500);
      }
    });
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {devices.map((device, index) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <video ref={refs[index]} style={{ width: '40%', margin: '2.5%', backgroundColor: '#000000' }} playsInline autoPlay muted={true} />
          <p key={index}>{device.label}</p>
        </div>
      ))}
    </div>
  );
}

export default App;