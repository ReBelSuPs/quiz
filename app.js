const questionElm = document.querySelector('#question');
const options = document.querySelectorAll('.opt');
const disabledOptions = document.querySelectorAll('.disabled');
const warningElm = document.querySelector('#warning');
const checkBtn = document.querySelector('#checkBtn');
const score = document.querySelector('#score');

let questionsInfo = {};
let answersReport = {};

const shuffle = (arr) => {
  arr.sort(() => Math.random() - 0.5);
};

const displayCurrentQuestion = (i) => {
  const { question, correct_answer, incorrect_answers } = questionsInfo[i];
  const answers = incorrect_answers.concat(correct_answer);
  shuffle(answers);

  questionElm.innerHTML = question;
  for (let index = 0; index < answers.length; index++) {
    const element = options[index];
    element.innerHTML = answers[index];
  }
  return answers.length;
};

const checkAnswerAndUpdate = (i, len) => {
  let ansRep = {
    selected: [],
    correctAns: '',
    isCorrect: false,
  };
  const { correct_answer } = questionsInfo[i];
  ansRep.correctAns = correct_answer;
  options.forEach((opt) => {
    if (opt.classList.contains('selected')) {
      ansRep.selected.push(opt.textContent);
    }
  });
  if (
    ansRep.selected.includes(correct_answer) &&
    ansRep.selected.length < len
  ) {
    ansRep.isCorrect = true;
    updateScore(20 / Math.pow(2, ansRep.selected.length - 1));
  }
  answersReport[i] = ansRep;
};

const updateScore = (mark) => {
  const prevTot = Number(score.textContent);
  score.textContent = `${prevTot + mark}`;
};

const removeSelected = () => {
  options.forEach((opt) => {
    opt.classList.remove('selected');
  });
};

const displaySummary = () => {
  let i = 0;
  questionElm.textContent = 'Summary';
  checkBtn.classList.add('disabled');
  disabledOptions.forEach((opt) => opt.classList.remove('disabled'));
  options.forEach((optElm) => {
    const { selected, correctAns } = answersReport[i];
    const { question } = questionsInfo[i];
    optElm.style.cursor = 'default';
    optElm.innerHTML = `Q${i + 1}. ${question} <br> Selected :- ${selected.join(
      ', '
    )}<br> Correct Answer :- ${correctAns}`;
    i++;
  });
};

const grabData = async () => {
  const result = await fetch(
    'https://cross-origin.herokuapp.com/https://opentdb.com/api.php?amount=10'
  ).then((res) => res.json());
  const datas = result.results;
  let i = 0;
  for (const data of datas) {
    questionsInfo[i] = data;
    i++;
  }
};

grabData().then((datas) => {
  let currentIndex = 0;
  let ansLen = displayCurrentQuestion(currentIndex);
  checkBtn.addEventListener('click', () => {
    if (currentIndex < 10) {
      checkAnswerAndUpdate(currentIndex, ansLen);
      removeSelected();
      if (currentIndex < 9) {
        currentIndex++;
        ansLen = displayCurrentQuestion(currentIndex);
      } else {
        displaySummary();
      }
    }
  });
});

options.forEach((opt) => {
  opt.addEventListener('click', () => {
    opt.classList.add('selected');
  });
});
