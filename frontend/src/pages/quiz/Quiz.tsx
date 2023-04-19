import { Button, notification } from 'antd';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UserContext } from '../../App';
import { getRequest, getRequestWithoutAuthorization } from '../../api';
import WineCard from '../../components/catalog/WineCard';
import { Wine } from '../winePage/Wine';

import Squares from '../../assets/img/squares.svg';

import './Quiz.scoped.scss';

interface Answer {
  id: number;
  next_question: number;
  results: any[];
  text: string;
}

interface Question {
  answers: Answer[];
  id: number;
  text: string;
}

export default function Quiz() {
  const [question, setQuestion] = useState<Question>();
  const [wines, setWines] = useState<Wine[]>();
  const [favourites, setFavourites] = useState<Wine[]>([]);
  const [api, contextHolder] = notification.useNotification();
  const { user }: UserContext = useOutletContext();

  const startQuiz = async () => {
    try {
      const { data } = await getRequestWithoutAuthorization(
        `/api/wine/quiz/start/`
      );
      setQuestion(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        api.error({
          message: (err.response?.data.detail) || 'Помилка',
          placement: 'top',
        });
      }
    }
  };

  const selectAnswer = async (answerId: number) => {
    if (!question) return;

    const answer = question.answers.find((answer) => answer.id === answerId);
    if (!answer) return;

    if (!answer.next_question) {
      let fetchWinePromises: Promise<Wine>[] = [];
      for (let i = 0; i < 3 && answer.results[i]; i++) {
        fetchWinePromises.push(fetchWine(answer.results[i]));
      }
      const wines = await Promise.all(fetchWinePromises);
      setWines(wines.filter((wine) => wine));
      return;
    }

    try {
      const { data } = await getRequestWithoutAuthorization(
        `/api/wine/quiz/questions/${answer.next_question}/`
      );
      setQuestion(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        api.error({
          message: (err.response?.data.detail) || 'Помилка',
          placement: 'top',
        });
      }
    }
  };

  const fetchWine = async (id: number) => {
    try {
      const { data } = await getRequestWithoutAuthorization(`/api/wine/${id}/`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        api.error({
          message: (err.response?.data.detail) || 'Помилка',
          placement: 'top',
        });
      }
    }
  };

  const getFavourites = async () => {
    try {
      const { data } = await getRequest(`/api/wine/favourites/`);
      setFavourites(data ? data : []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        api.error({
          message: (err.response?.data.detail) || 'Помилка',
          placement: 'top',
        });
      }
    }
  };

  useEffect(() => {
    if (user) {
      getFavourites();
    }
  }, [user]);

  return (
    <div className="quiz-container">
      {contextHolder}
      <img src={Squares} className="quiz-squares-img" alt="LWINE" />
      <div className="quiz">
        {!question ? (
          <>
            <div className="quiz-question">
              Цей тест чекав на тебе, щоб підібрати ідеальне вино для твого
              настрою 🍷
            </div>
            <Button
              type="primary"
              style={{ width: '500px', fontSize: '18px' }}
              onClick={startQuiz}
            >
              Почати тест
            </Button>
          </>
        ) : wines ? (
          <>
            <div className="quiz-final">
              Ось вибір вин, які можуть Вам сподобатись 👇
            </div>
            <div className="quiz-wines">
              {wines.map((wine) => (
                <div key={wine.id}>
                  <WineCard
                    isFavourite={favourites.map((x) => x.id).includes(wine.id)}
                    reloadFavourites={getFavourites}
                    wine={wine}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="quiz-question">{question.text}</div>
            <div className="quiz-answers">
              {question.answers.map((answer) => (
                <Button
                  key={answer.id}
                  type="primary"
                  className="quiz-answer"
                  onClick={() => selectAnswer(answer.id)}
                >
                  {answer.text}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
