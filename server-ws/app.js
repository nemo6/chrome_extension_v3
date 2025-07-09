const express = require("express")
const app = express()
const server = require("http").createServer(app)
const PORT = 8080

const path = require("path")
const fs = require("fs")
const stream = fs.createWriteStream( "../log.txt" , { flags: "a" } )

const notifier = require("node-notifier")

const WebSocket = require("ws")

let bool = true
const wss = new WebSocket.Server({ server:server })
wss.on("connection", (ws) => {

	ws.send( "Coucou c'est le server !" )
	ws.on( "message", (message) => {
		message = message.toString("utf8")
		let obj = JSON.parse(message)
		let { currentTime,percentage } = obj
		console.log( currentTime , percentage )
		if( percentage == 100 && bool ){
			send_notif("video finish!")
			bool = false
			setTimeout( () => { bool = true }, 5000 )
		}
		// stream.write( message + "\n" )
	})

})

server.listen( PORT )

console.log(`Running at port ${PORT} [ws]`)

function send_notif(x){
	notifier.notify({
		title: "Notification",
		message: x,
		icon: path.join( __dirname, "icon_48x48.png" )
	})
}