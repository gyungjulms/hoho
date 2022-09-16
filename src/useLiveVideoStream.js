import { useEffect, useState } from 'react'

const offer = connection => async opts => {
  const description = await connection.createOffer(opts)
  await connection.setLocalDescription(description)
  return description
}
const answer = connection => async description => {
  await connection.setRemoteDescription(description)
  const answer = await connection.createAnswer()
  await connection.setLocalDescription(answer)
  return answer
}
const accept = connection => async description => {
  await connection.setRemoteDescription(description)
}

export const useConnection = (id, handleCandidate) => {
  const [connection, setConnection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [remoteStream, setRemoteStream] = useState(null)

  useEffect(
    () => {
      const connection = new RTCPeerConnection()
      setConnection(connection)
    },
    [id],
  )
  useEffect(
    () => {
      if (!connection) return
      const handleICECandidate = async event => {
        handleCandidate(event)
      }

      connection.addEventListener('icecandidate', handleICECandidate)

      return () => {
        connection.removeEventListener('icecandidate', handleICECandidate)
      }
    },
    [handleCandidate, connection],
  )
  useEffect(
    () => {
      if (!connection) return
      const handleTrack = event => {
        console.log(id, 'set stream')
        setRemoteStream(event.streams[0])
      }

      connection.addEventListener('track', handleTrack)

      return () => {
        connection.removeEventListener('track', handleTrack)
      }
    },
    [connection],
  )

  return {
    connection,
    candidates,
    remoteStream,
    offer: offer(connection),
    answer: answer(connection),
    accept: accept(connection),
  }
}

const defaultConstraints = {
  video: {
    width: 1280,
    height: 720,
  },
}
export const useWebcam = (constraints = defaultConstraints) => {
  const [localMediaStream, setLocalMediaStream] = useState()
  useEffect(
    () => {
      navigator.mediaDevices.getUserMedia(constraints).then(setLocalMediaStream)
    },
    [constraints],
  )
  return { localMediaStream }
}
