import React from 'react'
import ReactDOM from 'react-dom'
import { LocalApp } from './LocalApp'
import { RemoteApp } from './RemoteApp'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<LocalApp />, document.getElementById('localRoot'))
ReactDOM.render(<RemoteApp />, document.getElementById('remoteRoot'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
