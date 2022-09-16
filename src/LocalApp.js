import React, { useState, useEffect } from 'react'
import { css } from 'emotion'
import { candidateEmitter } from './Emitter'
import { MediaVideo } from './Video'
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

export const LocalApp = props => {
  const [isCalling, setCalling] = useState(null)
  const connection = useConnection('local', e =>
    candidateEmitter.emitLocal(e.candidate),
  )
  useEffect(
    () => {
      if (!connection) return
      candidateEmitter.subscribeRemote(candidate => {
        if (candidate)
          connection.connection.addIceCandidate(new RTCIceCandidate(candidate))
      })
    },
    [connection.connection],
  )
  const { localMediaStream } = useWebcam()

  const call = async () => {
    try {
      localMediaStream
        .getTracks()
        .forEach(track =>
          connection.connection.addTrack(track, localMediaStream),
        )
      console.log('added tracks to connection')
      const offer = await connection.offer({
        offerToReceiveVideo: 1,
      })
      // send offer
      candidateEmitter.sendAsLocal(offer)
      const answer = await candidateEmitter.receiveFromRemote()
      await connection.accept(answer)
      setCalling(true)
    } catch (e) {
      console.log('an error occured while trying to call', e)
    }
  }

  return (
    <div
      className={css({
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      })}>
      {localMediaStream && (
        <MediaVideo
          video={localMediaStream}
          className={videoStyle}
          style={{ transform: 'scaleX(-1)' }}
        />
      )}
      <button onClick={call} className={buttonStyle}>
        Call your friend!
      </button>
    </div>
  )
}
