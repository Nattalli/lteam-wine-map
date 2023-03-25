import { useEffect, useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Alert, Row, Col, Image, Input, Form, Button } from 'antd';
import { getRequestWithoutAuthorization, postRequest } from '../../api';
import CommentCard from '../../components/layout/CommentCard';
import './Wine.scoped.scss';

interface Wine {
  id: number;
  image_url: string;
  name: string;
  wine_type: string;
  country: {
    name: string;
  };
  region: string;
  brand: {
    name: string;
  };
  tastes: string;
  sweetness: string;
  pairs_with: string;
}

interface Comment {
  id: number;
  author: string;
  timestamp: string;
  content: string;
}

interface UserContext {
  user: {
    first_name: string;
  };
}

const { TextArea } = Input;

export default function WinePage() {
  let params = useParams();
  const { user }: UserContext = useOutletContext();

  const [id, setId] = useState<String>();
  const [wineError, setWineError] = useState<String>();
  const [commentError, setCommentError] = useState<String>();
  const [commentCreateError, setCommentCreateError] = useState<String>();
  const [wine, setWine] = useState<Wine>();
  const [comments, setComments] = useState<Comment[]>();
  const [form] = Form.useForm();

  const fetchWine = async () => {
    try {
      const result = await getRequestWithoutAuthorization(`/api/wine/${id}/`);
      setWine(result.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        setWineError(err.response ? err.response.data.detail : '');
      }
    }
  };

  const fetchComments = async () => {
    try {
      const result = await getRequestWithoutAuthorization(
        `/api/wine/${id}/comments/`
      );
      setComments(result.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        setCommentError(err.response ? err.response.data.detail : '');
      }
    }
  };

  useEffect(() => {
    setId(params.id);
  }, []);

  useEffect(() => {
    if (!id) return;

    fetchWine();
    fetchComments();
  }, [id]);

  const postComment = async ({ content }: any) => {
    try {
      await postRequest(`/api/wine/${wine && wine.id}/comments/create/`, {
        content,
      });
      await fetchComments();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ email: string[] }>;
        setCommentCreateError(err.response ? err.response.data.email[0] : '');
      }
    }
  };

  return (
    <div className="content">
      <Row className="wine-section">
        {wineError && <Alert message="Error" type="error" showIcon />}
        {wine && (
          <>
            <Col span={10} className="wine-img">
              <Image src={wine.image_url} />
            </Col>
            <Col span={12}>
              <div className="main-info-section">
                <span className="name">{wine.name}</span>
                <div className="property">
                  <span>Тип вина</span>
                  <span>{wine.wine_type}</span>
                </div>
                <div className="property">
                  <span>Країна</span>
                  <span>{wine.country.name}</span>
                </div>
                <div className="property">
                  <span>Регіон</span>
                  <span>{wine.region}</span>
                </div>
                <div className="property">
                  <span>Бренд</span>
                  <span>{wine.brand.name}</span>
                </div>
                <div className="property">
                  <span>Смаки</span>
                  <span>{wine.tastes}</span>
                </div>
                <div className="property">
                  <span>Солодкість</span>
                  <span>{wine.sweetness}</span>
                </div>
                <div className="property">
                  <span>Поєднання</span>
                  <span>{wine.pairs_with}</span>
                </div>
              </div>
              <div className="shop-availability">
                <span className="name">Наявність в магазинах</span>
              </div>
            </Col>
          </>
        )}
      </Row>
      <Row className="comment-section">
        <Col span={10}>
          {commentError && <Alert message="Error" type="error" showIcon />}
          {comments && (
            <div>
              <div className="comment-length">{comments.length} коментарів</div>
              {comments.length === 0 && (
                <div className="no-comments">
                  <span>У цього продукту коментарі відсутні. </span>
                  {!user.first_name && (
                    <span>
                      <Link to="/login" className="login-link">
                        Увійдіть,
                      </Link>
                      &nbsp; щоб залишити свій коментар.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          {user.first_name && (
            <div className="input-section">
              {commentCreateError && (
                <Alert message="Error" type="error" showIcon />
              )}
              <span>Залиште свій коментар</span>
              <Form
                layout={'vertical'}
                form={form}
                initialValues={{ layout: 'vertical' }}
                onInput={() => setCommentCreateError('')}
                onFinish={postComment}
              >
                <Form.Item name="content">
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" size="large" block htmlType="submit">
                    Додати коментар
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
          {comments && (
            <div className="comment-list">
              {comments.map((comment) => (
                <CommentCard comment={comment} key={comment.id} />
              ))}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
