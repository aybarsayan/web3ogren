import Layout from '@theme/Layout';
import './quiz.css';
import React, { useState } from 'react';
import questions from './quiztest.json';

export default function Quiz() {
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(questions.length).fill(null));

  const handleAnswerOptionClick = (questionIndex, answerIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] !== null && questions[i].answerOptions[selectedAnswers[i]].isCorrect) {
        score++;
      }
    }
    return score;
  };

  const resetQuiz = () => {
    setSelectedAnswers(new Array(questions.length).fill(null));
  };

  return (
    <Layout title="Quiz" description="Quiz Page">
      <div className='main'>
        <div className='questions'>
          <div className='baslik'>
            <h1>Soru Başlığı</h1>
          </div>
        
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <h2>{question.questionText}</h2>
            {question.answerOptions.map((answerOption, answerIndex) => (
              <button
                key={answerIndex}
                className={
                  selectedAnswers[questionIndex] === answerIndex
                    ? answerOption.isCorrect
                      ? 'correct'
                      : 'incorrect'
                    : ''
                }
                onClick={() => handleAnswerOptionClick(questionIndex, answerIndex)}
                disabled={selectedAnswers[questionIndex] !== null}
              >
                {answerOption.answerText}
              </button>
            ))}
          </div>
        ))}
        <div>
          <div className='scor'>
            <p>Your score: {calculateScore()} out of {questions.length}</p>
          </div>
          <div className='reset'>
            <button onClick={resetQuiz}>Reset Quiz</button>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}
