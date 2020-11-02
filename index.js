const apiUrl = 'http://localhost:3000'
const webSocketUrl = 'ws://localhost:3000/cable'
const gameRoomList = document.getElementById('rooms-list');
const newPickForm = document.getElementById('new-pick');
const pickList = document.getElementById('picks-list');

// render room list
function renderAllRoomsList(Rooms) {
    Rooms.forEach(room => {
        renderRoom(room);
    })
}

// render individual room
function renderRoom(room){
    let newRoom = document.createElement('div');
    newRoom.innerHTML = `${room.name} <button class='join-room-button' data-room-id='${room.id}'>Join</button>`
    gameRoomList.prepend(newRoom);
}

// When user joins a game
function renderJoinGame(room){
    let roomDiv = document.getElementById('room-div');
    let roomName = document.createElement('h3');
    roomName.textContent = room.name;
    roomDiv.prepend(roomName)

    newPickForm.style = '';
    newPickForm.dataset.gameRoomId = room.id

    room.picks.forEach( pickObj => {
        renderPick(pickObj)
    })
}

function renderPick(pick){
    let newPick = document.createElement('div')
    newPick.innerHTML = ``
    newPick.textContent = pick.content;
    newPick.dataset.pickId = pick.id;

    pickList.prepend(newPick);
}

function createGameRoom(roomId){
    socket = new WebSocket(webSocketUrl);
    socket.onopen = function(event) {
        console.log('WebSocket connected');
        const msg = {
            command: 'subscribe',
            identifier: JSON.stringify({
                id: roomId,
                channel: 'GameRoomChannel'
            })
        };
        socket.send(JSON.stringify(msg));
    };
    socket.onclose = function(event) {
        console.log('WebSocket is closed.');
   };

   socket.onmessage = function(event){
       const response = event.data;
       const msg = JSON.parse(response);
       if(msg.type === "ping"){
           return;
       }
       console.log("FROM RAILS BACKEND: ", msg);
       if(msg.pick){
           renderPick(msg.pick)
       }
   };
    socket.onerror = function(error) {
     console.log('WebSocket Error: ' + error);
    };
}

document.addEventListener('DOMContentLoaded',() => {
    fetch(`${apiUrl}/game_rooms`)
        .then(response => response.json())
        .then(gameRooms => {
            renderAllRoomsList(gameRooms);
        })
    
    const newRoom = document.getElementById('new-room');
    newRoom.addEventListener('submit', event => {
        event.preventDefault();
        fetch(`${apiUrl}/game_rooms`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: event.target[0].value
            })
        }).then(response => response.json())
        .then(roomObj => {renderRoom(roomObj)})

        newRoom.reset(); 
    })

    // Add listener to button for join game
    gameRoomList.addEventListener('click', event => {
        if (event.target.className === 'join-room-button') {
            
            const roomListDiv = document.getElementById('room-div')
            roomListDiv.style.display = 'none'
            // Fetch and render info on a specific chat room from the server 
            fetch(`${apiUrl}/game_rooms/${event.target.dataset.roomId}`)
                .then(response => response.json())
                .then(roomObj => {
                    renderRoom(roomObj)
                })

            // Open up a websocket connection for that specific chat room
            createGameRoom(event.target.dataset.roomId)
        }
    })

    newPickForm.addEventListener('submit', event =>{
        event.preventDefault();
        debugger
        fetch(`${apiUrl}/picks`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                content: event.target[0].value,
                game_room_id: event.target.dataset.roomId
            })
        })
        //.then(response => response.json())
        //.then(pickObj => {renderPick(pickObj)})

        newPickForm.reset();
    })
    
})