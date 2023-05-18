const subbutton = document.getElementById("submit");
const question = document.getElementById("question");
const form = document.querySelector("form");
const ress = document.getElementById("result");

let button = document.querySelector(".button");

const synth = window.speechSynthesis;
let active;
const recognition = new webkitSpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = true;
reset();
recognition.onend = reset();

recognition.onresult = (event) => {
  console.log(event.results);
  const result = event.results[event.results.length - 1][0].transcript;
  console.log(result);
  question.value = `${result}`;
};

function reset() {
  active = false;
}

function StartStopBtn() {
  if (active) {
    console.log('ok');
    recognition.stop();
    reset();
  } else {
    recognition.start();
    active = true;
  }
}

function sendPostRequest(e) {
  e.preventDefault();
  if (!question.value) return;
  let value = question.value;
  question.value = "";

  if (synth.speaking) {
    alert("Please Wait")
    return;
  }

  axios
    .post("/server", { message: value })
    .then(() => {
      axios.get("/server").then((res) => {
        let data = res.data.message;
        let utterance = new SpeechSynthesisUtterance(data);
        synth.speak(utterance);
        ress.innerHTML = data;
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
}

form.addEventListener("submit", sendPostRequest);
subbutton.addEventListener('click' , sendPostRequest)
button.addEventListener("mousedown", StartStopBtn);
button.addEventListener("mouseup", StartStopBtn);
