import './CommentCard.scoped.scss';

interface CommentProps {
  comment: {
    author: string;
    content: string;
    timestamp: string;
  };
}

export default function CommentCard({ comment }: CommentProps) {
  return (
    <div className="comment">
      <div className="comment-header">
        <span>{comment.author}</span>
        <span>{new Date(comment.timestamp).toLocaleString('uk-UA')}</span>
      </div>
      <div className="content">{comment.content}</div>
    </div>
  );
}
