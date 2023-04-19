import { useEffect, useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import {
  Row,
  Col,
  Image,
  Input,
  Form,
  Button,
  Modal,
  notification
} from 'antd';
import {
  deleteRequest,
  getRequestWithoutAuthorization,
  postRequest,
  putRequest
} from '../../api';
import CommentCard from '../../components/layout/CommentCard';
import { UserContext } from '../../App';

import backArrow from '../../assets/img/back.svg';
import heartImg from '../../assets/img/heart_59.svg';
import heartImgFilled from '../../assets/img/heart_filled_59.svg';
import './Wine.scoped.scss';

export interface Wine {
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
  percent_of_alcohol: number;
  tastes: string;
  sweetness: string;
  pairs_with: string;
}

interface Price {
  shop_name: string;
  min_price: number;
  max_price: number;
  url: string;
}

interface Comment {
  id: number;
  author: string;
  timestamp: string;
  content: string;
}

const { TextArea } = Input;

export default function WinePage() {
  let params = useParams();
  const { user }: UserContext = useOutletContext();
  const [api, contextHolder] = notification.useNotification();

  const [id, setId] = useState<String>();

  const [wine, setWine] = useState<Wine>();
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [prices, setPrices] = useState<Price[]>();
  const [comments, setComments] = useState<Comment[]>();
  const [editableId, setEditableId] = useState<number>(0);
  const [idToDelete, setIdToDelete] = useState<number>(0);

  const [form] = Form.useForm();
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  useEffect(() => {
    setId(params.id);
  }, []);

  useEffect(() => {
    if (!id) return;

    fetchWine();
    fetchWinePrices();
    fetchComments();
  }, [id]);

  const fetchWine = async () => {
    try {
      const { data } = await getRequestWithoutAuthorization(`/api/wine/${id}/`);
      setWine(data);
      setIsFavourite(data.in_favourites_of.includes(user?.id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const fetchWinePrices = async () => {
    try {
      const result = await getRequestWithoutAuthorization(
        `/api/wine/${id}/prices/`
      );
      setPrices(result.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
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
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const postComment = async ({ content }: any) => {
    try {
      await postRequest(`/api/wine/${wine && wine.id}/comments/create/`, {
        content
      });
      form.resetFields();
      openSuccessNotification('Коментар успішно додано');
      await fetchComments();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const editComment = async (content: string) => {
    try {
      await putRequest(
        `/api/wine/${wine && wine.id}/comments/update/${editableId}/`,
        {
          content
        }
      );
      setEditableId(0);
      openSuccessNotification('Коментар успішно змінено');
      await fetchComments();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const requestDeleteComment = (commentId: number) => {
    setIdToDelete(commentId);
    setModalOpened(true);
  };

  const deleteComment = async () => {
    try {
      await deleteRequest(
        `/api/wine/${wine && wine.id}/comments/delete/${idToDelete}/`
      );
      setModalOpened(false);
      setIdToDelete(0);
      openSuccessNotification('Коментар успішно видалено');
      await fetchComments();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const updateFavourites = async () => {
    try {
      await putRequest(`/api/wine/favourites/${wine && wine.id}/`, {});
      const ntfMessage = isFavourite
        ? 'Вино вилучено з обраних'
        : 'Вино додано до обраних';
      openSuccessNotification(ntfMessage);
      setIsFavourite(!isFavourite);
      await fetchWine();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ detail: string }>;
        openErrorNotification(err.response ? err.response.data.detail : '');
      }
    }
  };

  const openSuccessNotification = (msg: string) => {
    api.success({
      message: msg,
      placement: 'top'
    });
  };

  const openErrorNotification = (msg: string) => {
    api.error({
      message: msg || 'Помилка',
      placement: 'top'
    });
  };

  return (
    <Row className="container">
      <Link to="/wines" className="back-to-catalog">
        <img src={backArrow} alt="fav" className="fav" />
        <span>Повернутися до каталогу</span>
      </Link>
    <Row className="content">
      {contextHolder}
      {wine && (
        <>
          <Col span={10} className="wine-img">
            <Image src={wine.image_url} className="main-img" />
            {user?.id && (
              <>
                {isFavourite ? (
                  <img
                    src={heartImgFilled}
                    alt="fav"
                    className="fav"
                    onClick={updateFavourites}
                  />
                ) : (
                  <img
                    src={heartImg}
                    alt="fav"
                    className="fav"
                    onClick={updateFavourites}
                  />
                )}
              </>
            )}
          </Col>
          <Col span={12} style={{ position: 'sticky', top: 60 }}>
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
                <span>{wine.brand && wine.brand.name}</span>
              </div>
              <div className="property">
                <span>Смаки</span>
                <span>{wine.tastes}</span>
              </div>
              <div className="property">
                  <span>Відсоток алкоголю</span>
                  <span>{wine.percent_of_alcohol} %</span>
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
              {prices && prices.length === 0 && (
                <span className="not-available">
                  На жаль, даного товару зараз немає в наявності в магазинах,
                  які ми використовуємо для порівняння
                </span>
              )}
              {prices &&
                prices.map((priceItem, index) => (
                  <div className="price-item" key={index}>
                    <span>{priceItem.shop_name}</span>
                    <a href={priceItem.url} target="_blank" rel="noreferrer">
                      {priceItem.min_price === priceItem.max_price ? (
                        <span> {priceItem.max_price} грн</span>
                      ) : (
                        <span>
                          {priceItem.min_price} - {priceItem.max_price} грн
                        </span>
                      )}
                    </a>
                  </div>
                ))}
            </div>
          </Col>
          <Col span={10}>
            {comments && (
              <div>
                <div className="comment-length">
                  {comments.length} коментарів
                </div>
                {comments.length === 0 && (
                  <div>
                    <span>У цього продукту коментарі відсутні. </span>
                  </div>
                )}
                {!user && (
                  <span className="login-to-leave-comment">
                    <Link to="/login" className="login-link">
                      Увійдіть,
                    </Link>
                    &nbsp; щоб залишити свій коментар.
                  </span>
                )}
              </div>
            )}
            {user && (
              <div className="input-section">
                <span>Залиште свій коментар</span>
                <Form
                  layout={'vertical'}
                  form={form}
                  initialValues={{ layout: 'vertical' }}
                  onFinish={postComment}
                >
                  <Form.Item name="content">
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item>
                      <Button
                        type="primary"
                        size="large"
                        block
                        htmlType="submit"
                      >
                      Додати коментар
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
            {comments && (
              <div className="comment-list">
                {comments.map((comment) => (
                  <CommentCard
                    comment={comment}
                    key={comment.id}
                    editable={user?.username === comment.author}
                    editComment={editComment}
                    requestDeleteComment={requestDeleteComment}
                    setEditableId={setEditableId}
                    editableId={editableId}
                  />
                ))}
              </div>
            )}
          </Col>
        </>
      )}
      <Modal
        title="Ви впевнені, що хочете видалити коментар?"
        centered
        okText="Так, я хочу видалити цей коментар"
        cancelText="Ні, повернутись до сторінки"
        open={modalOpened}
        onOk={deleteComment}
        onCancel={() => setModalOpened(false)}
      />
      </Row>
    </Row>
  );
}
