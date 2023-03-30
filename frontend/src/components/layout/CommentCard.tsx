import { useEffect } from 'react';
import editIcon from '../../assets/img/edit.svg';
import deleteIcon from '../../assets/img/delete.svg';
import { Form, Button, Input } from 'antd';
import './CommentCard.scoped.scss';

interface CommentProps {
  comment: {
    id: number;
    author: string;
    content: string;
    timestamp: string;
  };
  editable: boolean;
  editableId: number;
  setEditableId: Function;
  editComment: Function;
  requestDeleteComment: Function;
}

const { TextArea } = Input;

export default function CommentCard({
  comment,
  editable,
  editableId,
  setEditableId,
  editComment,
  requestDeleteComment,
}: CommentProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editableId === comment.id) {
      form.setFieldsValue({
        content: comment.content,
      });
    }
  }, [editableId]);

  return (
    <div className="comment">
      <div className="comment-header">
        <span>{comment.author}</span>
        <span>{new Date(comment.timestamp).toLocaleString('uk-UA')}</span>
        {editable && (
          <>
            <img
              src={editIcon}
              alt="editComment"
              onClick={() => setEditableId(!editableId ? comment.id : 0)}
            />
            <img
              src={deleteIcon}
              alt="deleteComment"
              onClick={() => requestDeleteComment(comment.id)}
            />
          </>
        )}
      </div>
      {editableId !== comment.id ? (
        <div className="content">{comment.content}</div>
      ) : (
        <Form
          layout={'vertical'}
          form={form}
          initialValues={{ layout: 'vertical' }}
          onFinish={() => editComment(form.getFieldValue('content'))}
          className="edit-form"
        >
          <Form.Item name="content">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" block htmlType="submit">
              Зберегти
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
