const createCandidateEmitter = () => {
  let remoteSub, localSub
  let sendAsRemote, sendAsLocal
  return {
    emitRemote: candidate => {
      remoteSub && remoteSub(candidate)
    },
    emitLocal: candidate => {
      localSub && localSub(candidate)
    },
    subscribeLocal: sub => {
      localSub = sub
    },
    subscribeRemote: sub => {
      remoteSub = sub
    },

    sendAsRemote: message => {
      sendAsRemote(message)
    },
    sendAsLocal: message => {
      sendAsLocal(message)
    },
    receiveFromRemote: () => {
      return new Promise(resolve => (sendAsRemote = resolve))
    },
    receiveFromLocal: () => {
      return new Promise(resolve => (sendAsLocal = resolve))
    },
  }
}

export const candidateEmitter = createCandidateEmitter()
