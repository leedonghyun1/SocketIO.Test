const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form")
const room = document.getElementById("room")

room.hidden = true;
let roomName;

//welcome message
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li")
  li.innerText = message;
  ul.appendChild(li);
}

//send chat messages
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
}
//send nickname
function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value;
  socket.emit("nickname", value);
  input.value = "";
}

//Room & message showing change
function showRoom() {
  welcome.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector("h3");
  h3.innerText = `Room name : ${roomName}`

  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");

  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

//room join
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = ""
}

//main page -> room 
form.addEventListener("submit", handleRoomSubmit);

//listening from server welcome notification.
socket.on("Welcome", (user, userCount) => {
  const h4 = room.querySelector("h4");
  h4.innerText = `Total User : (${userCount})`
  addMessage(`${user} Joined!`);
})
socket.on("Bye", (user, userCount) => {
  const h4 = room.querySelector("h4");
  h4.innerText = `Total User : (${userCount})`
  addMessage(`${user} Leaved!`);
})
socket.on("new_message", (msg) => { addMessage(msg) });

socket.on("room_change", (rooms)=>{
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if(rooms.length === 0){
    roomList.innerHTML = "";
    return;
  }
  rooms.forEach((room)=>{
    const li = document.createElement("li")
    li.innerText = room;
    roomList.appendChild(li);
  })
});