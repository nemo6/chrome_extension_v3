console.log("%ccontent_script","color:blue")

let socket
let player
let bool = false
let total

start()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log( request )
	console.log( request.action )
	if (request.action === "start") {
		start()
	}
});

function start(){
	console.log( "start!" )
	socket = new WebSocket( "ws://localhost:8080/" )
	/*if( socket.readyState )
	socket.addEventListener( "message", event => {
		console.log( "%cVoici un message du serveur: ", "color:green" , event.data )
	})*/
}

/*if( socket )
socket.addEventListener( "open" , event => {
	socket.send( "Coucou c'est le client !" )
})*/

let try_connection = true

function loop_reconnection(){
	let refreshId = setInterval( () => {
		console.log( "%cconnection lost..." , "color:red" )
		/*if( count === max ) clearInterval(refreshId)
		count++*/
		if ( socket.readyState == 1 ){
			console.log( "%cconnection back!" , "color:green" )
			try_connection = true
			clearInterval(refreshId)
			return
		}
		start()

	}, 5000 )
}

window.addEventListener( "load", function(){

	// console.log( document.querySelectorAll("video") )

	player = [...document.querySelectorAll("video")].at(0)

	if( player ){

		total = player.duration

		player.addEventListener("timeupdate", function(){
			let {currentTime} = this
			if( socket.readyState == 1 ){
				socket.send( JSON.stringify({ currentTime:currentTime, percentage:percentage(currentTime,total) }) )
			}else{
				if( try_connection )
					loop_reconnection()
				try_connection = false
			}
		})

		player.addEventListener("pause", function(){
			console.log( "pause!" )
		})

		player.addEventListener("play", function(){
			console.log( "play!" )
		})

	}

})

console.log( socket )

function percentage( partialValue, totalValue ){
	return Math.ceil( ( 100 * partialValue ) / totalValue )
}