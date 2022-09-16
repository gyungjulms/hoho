import React, { useState, useEffect } from 'react'
import { css } from 'emotion'
import { MediaVideo } from './Video'
import { candidateEmitter } from './Emitter'
import { useConnection, useWebcam } from './useLiveVideoStream'

const videoStyle = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 1280,
  height: 720,
  backgroundColor: '#324357',
  borderRadius: 4,
  marginBottom: 8,
})
const buttonStyle = css({
  padding: '8px 16px',
  fontSize: 24,
  color: '#e5eff6',
  backgroundColor: '#275DAD',
  border: 'none',
  outline: 'none',
  borderRadius: 4,
  fontWeight: 'bold',
  transition: 'background-color .2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#073D8D',
  },
})

const NoCall = ({ children }) => (
  <div className={videoStyle}>
    <p
      className={css({
        color: '#e5eff6',
        fontSize: 32,
        fontFamily: 'sans-serif',
      })}>
      {children}
    </p>
  </div>
)

export const RemoteApp = props => {
  const [isCalling, setCalling] = useState(null)
  const connection = useConnection('remote', e =>
    candidateEmitter.emitRemote(e.candidate),
  )
  useEffect(
    () => {
      if (!connection) return
      candidateEmitter.subscribeLocal(candidate => {
        if (candidate)
          connection.connection.addIceCandidate(new RTCIceCandidate(candidate))
      })
    },
    [connection.connection],
  )
  useEffect(
    () => {
      if (!connection) return
      candidateEmitter
        .receiveFromLocal()
        .then(offer => connection.answer(offer))
        .then(candidateEmitter.sendAsRemote)
        .then(() => setCalling(true))
    },
    [connection.connection],
  )
  // const { localMediaStream } = useWebcam()

  // const acceptCall = () => {}

  return (
    <div
      className={css({
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      })}>
      {!isCalling && (
        <NoCall>Press "Call" to start a video call with yourself!</NoCall>
      )}
      {isCalling && (
        <MediaVideo
          video={connection.remoteStream}
          className={videoStyle}
          style={{ transform: 'scaleX(-1)' }}
        />
      )}
    </div>
  )
}
