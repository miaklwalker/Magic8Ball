/* design patterns used
 State;
 Observer;
 Factory
 dependency injection
*/

// Caching the DOM (Document Object Model)
const DOM = {
  ball: document.getElementById("ball"),
  answers: document.getElementById("answers"),
  message: document.getElementById("message"),
  input: document.getElementById("question"),
  button: document.getElementById("button"),
  previous: document.getElementById("prev")
};

// Creating State
const State = class {
  constructor(question = "", answer = "") {
    this.question = question;
    this.answer = answer;
  }
};

// creating a observer
const Observer = class {
  constructor() {
    this.subscribers = [];
  }
  subscribe(sub) {
    this.subscribers.push(sub);
  }
  unsubscribe(unsub) {
    this.subscribers = this.subscribers.filter(sub => sub !== unsub);
  }
  dispatch(update) {
    this.subscribers.forEach(sub => sub.listen(update));
  }
};

// a list to hold the prevStates
class StateList {
  constructor() {
    this.prev = [];
  }
  listen(state) {
    this.prev.push(state);
  }
  display() {
    DOM.previous.innerHTML = this.prev.map((prev, index) => {
      return `
          <div>
          <details open>
          <summary>Question ${index + 1}</summary>
          <div class='value'>${prev.question}</div>
          <span class='label'>Answer:</span>

          <div class='value'>${prev.answer}<div>
          <hr>
          </details>
          </div>
          `;
    });
  }
}

const makeListner = ele => {
  return {
    text: ele.innerText,
    id: Date.now(),
    listen(state) {
      this.text = state.answer;
    }
  };
};

// 8Ball Answers
const Answer = [
  "It is certain.",
  "It is decidedly so",
  "Without a doubt.",
  "Yes - definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good",
  "Very doubtful."
];

// Creating the animation chain

const animateShakeAppear = () => {
  let ballshake = DOM.ball.animate(
    [
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(0px)" }
    ],
    {
      duration: 1000
    }
  );
  ballshake.onfinish = () => {
    console.log("finished");
    DOM.message.animate([{ opacity: "0%" }, { opacity: "100%" }], {
      duration: 500,
      easing: "ease-in"
    }).onfinish = () => {
      DOM.message.style.opacity = "100%";
    };
  };
};

// Simple function to get 8ball answer
const getAnswer = num => Answer[num];
DOM.message.style.opacity = "0%";
// Creating button listner function
const buttonListener = (obs, stateList) => () => {
  let state = new State(
    DOM.input.value,
    getAnswer(Math.floor(Math.random() * 20))
  );
  DOM.message.innerText = state.answer;
  DOM.message.style.opacity = "0%";
  animateShakeAppear();
  obs.dispatch(state);
  stateList.display();
};

const clog = () => {
  return {
    listen(msg) {
      console.log(msg);
    }
  };
};
const states = new StateList();
const observer = new Observer();
const answer = makeListner(DOM.message);

observer.subscribe(answer);
observer.subscribe(states);
observer.subscribe(clog());

DOM.button.addEventListener("click", buttonListener(observer, states));
