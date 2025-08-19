const taskList = [];
const listElement = document.getElementById("taskList");
const statusText = document.getElementById("status");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-US";

recognition.onresult = (event) => {
  let transcript = event.results[0][0].transcript.toLowerCase().trim();
  statusText.innerText = `Heard: "${transcript}"`;

  if (transcript.startsWith("new task")) {
    const taskText = transcript.replace("new task", "").trim();
    if (taskText) addTask(taskText);
  } 
  else if (transcript.startsWith("delete task")) {
    const num = getTaskNumber(transcript) - 1;
    if (!isNaN(num)) deleteTask(num);
  } 
  else if (transcript.startsWith("mark task")) {
    const num = getTaskNumber(transcript) - 1;
    if (!isNaN(num)) markTaskDone(num);
  }
};

//  detect digits OR words anywhere in transcript
function getTaskNumber(t) {
  const map = {one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
  t = t.toLowerCase().replace(/[.,!?]/g, ""); 

  // check digits like "2", "12"
  const digit = t.match(/\d+/);
  if (digit) return parseInt(digit[0]);

  // check words like "two", "seven"
  for (let w of t.split(" ")) if (map[w]) return map[w];

  return NaN;
}

function addTask(task) {
  taskList.push({ text: task, done: false });
  renderTasks();
}
function deleteTask(num) {
  if (num >= 0 && num < taskList.length) {
    taskList.splice(num, 1);
    renderTasks();
    statusText.innerText = `Deleted task ${num + 1}`;
  }
}
function markTaskDone(num) {
  if (num >= 0 && num < taskList.length) {
    taskList[num].done = true;
    renderTasks();
    statusText.innerText = `Marked task ${num + 1} done ✅`;
  }
}
function renderTasks() {
  listElement.innerHTML = "";
  taskList.forEach((task, idx) => {
    const li = document.createElement("li");
    li.innerText = `${idx + 1}. ${task.text} ${task.done ? "✅" : ""}`;
    listElement.appendChild(li);
  });
}
function startVoice() {
  statusText.innerText = "Listening...";
  recognition.start();
}
document.getElementById("startBtn").addEventListener("click", startVoice);
