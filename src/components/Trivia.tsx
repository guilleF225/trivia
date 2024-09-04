import { useState, useEffect } from "react";
import RegisterUser from "./RegisterUser";

const TIME = 10;

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  type: string;
  difficulty: string;
}

const Trivia = () => {
  //   const [questions, setQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userAlreadyPlayed, setUserAlreadyPlayed] = useState(false);
  const [bg_color, setBg_color] = useState("");
  const [timer, setTimer] = useState(0);

  const fetchQuestions = async () => {
    setIsLoading(true);
    const response = await fetch("/api/get-questions");
    const data = await response.json();
    setQuestions(data.response);
    setIsLoading(false);
    setTimer(TIME);
  };
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("es-ES", options).format(new Date(date));
  };
  const checkIfUserAlreadyPlayed = async () => {
    // check localStorage for userAlreadyPlayed
    const userAlreadyPlayed = localStorage.getItem("played_today");
    if (userAlreadyPlayed) {
      const data = JSON.parse(userAlreadyPlayed);
      console.log(data);
      if (data.last_played) {
        const today = new Date();
        console.log(formatDate(today));
        console.log(formatDate(data.last_played));
        if (formatDate(today) === formatDate(data.last_played)) {
          setUserAlreadyPlayed(true);

          return;
        }
      }
    }
    setUserAlreadyPlayed(false);
  };

  useEffect(() => {
    checkIfUserAlreadyPlayed();
  }, []);

  const startGame = async () => {
    setIsStarted(true);
    setIsEnded(false);
    setCurrentQuestion(0);
    setScore(0);
    await fetchQuestions();
  };

  const renderAnswers = () => {
    if (!questions) return;
    const allAnswers: string[] = questions[currentQuestion].incorrect_answers;
    if (!allAnswers.includes(questions[currentQuestion].correct_answer)) {
      allAnswers.push(questions[currentQuestion].correct_answer);
    }

    return allAnswers.sort().map((answer, index) => (
      <button
        key={index}
        onClick={() => checkAnswer(answer)}
        className="bg-blue-500 w-80  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
      >
        {answer}
      </button>
    ));
  };

  const nextQuestion = () => {
    if (!questions) return;
    if (currentQuestion === questions.length - 1) {
      finishGame();
      return;
    }
    setCurrentQuestion(currentQuestion + 1);

    setBg_color("bg-red-500/40");
    setTimeout(() => {
      setBg_color("");
    }, 200);
  };

  useEffect(() => {
    if (!isStarted) return;
    const interval = setInterval(() => {
      setTimer(timer - 1);
      if (timer === 0) {
        nextQuestion();
        setTimer(TIME);
        clearInterval(interval);
        return;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const finishGame = () => {
    setIsEnded(true);
    setIsStarted(false);
    const playedToday = {
      played_today: true,
      last_played: new Date(),
    };
    localStorage.setItem("played_today", JSON.stringify(playedToday));
  };

  const checkAnswer = (answer: string) => {
    if (!questions) return;
    if (
      questions[currentQuestion].correct_answer.toLowerCase() ===
      answer.toLowerCase()
    ) {
      setScore(score + Number(questions[currentQuestion].difficulty));

      setBg_color("bg-green-500/40");
      setTimer(TIME);
      setTimeout(() => {
        setBg_color("");
      }, 200);
      if (currentQuestion === questions.length - 1) {
        finishGame();
        return;
      }
      setCurrentQuestion(currentQuestion + 1);
      return;
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setBg_color("bg-red-500/40");
      setTimer(TIME);
      setTimeout(() => {
        setBg_color("");
      }, 200);
      if (currentQuestion === questions.length - 1) {
        finishGame();
        return;
      }
    }
  };
  return (
    <div className="flex flex-col w-screen items-center justify-center gap-4 text-center text-white">
      {userAlreadyPlayed && (
        <h4 className="text-2xl font-bold">¡Vuelve mañana para jugar!</h4>
      )}
      {!isStarted && !isEnded && !userAlreadyPlayed && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startGame}
        >
          Pronto para jugar?
        </button>
      )}

      {isLoading && <p>Cargando...</p>}
      {!userAlreadyPlayed && questions && !isEnded && isStarted && (
        <div
          className={`flex flex-col items-center justify-center gap-4 m-4 p-8 w-screen md:w-3/4 text-white rounded-lg ${bg_color}`}
        >
          <p>Puntos : {score}</p>
          <h3 className="text-xl font-bold">
            {questions[currentQuestion].question}
          </h3>
          {/* <p> Type : {questions[currentQuestion].type}</p> */}
          <p> Categoría : {questions[currentQuestion].category}</p>
          <p> Vale {questions[currentQuestion].difficulty}</p>
          <p className="text-lg">{timer}</p>

          <section
            className={`rounded-lg flex transition-all flex-col items-center justify-center w-96 p-8 gap-4 m-8 text-white`}
          >
            {renderAnswers()}
          </section>

          {questions[currentQuestion].type === "boolean" && (
            <div className="flex flex-col items-center justify-center gap-4 m-8 text-white">
              <button
                onClick={() => checkAnswer("true")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                True
              </button>
              <button
                onClick={() => checkAnswer("false")}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                False
              </button>
            </div>
          )}
        </div>
      )}
      {!userAlreadyPlayed && isEnded && (
        <section className="flex flex-col items-center justify-center gap-4 text-white">
          <p>¡Felicidades! Has ganado {score} puntos</p>
          <RegisterUser puntos={score} />
        </section>
      )}
    </div>
  );
};

export default Trivia;
