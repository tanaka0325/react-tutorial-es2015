import React from 'react';
import { render } from 'react-dom';
import marked from 'marked';

const data = [
  {author: "Pete Hunt", text: "This is one comment from data."},
  {author: "Jordan Walke", text: "This is *another* comment from data."},
];

class CommentBox extends React.Component {
  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.props.data} />
        <CommentForm />
      </div>
    )
  }
};

class CommentList extends React.Component {
  render() {
    const commentNodes = this.props.data.map((comment) => {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      )
    })
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    )
  }
};

class CommentForm extends React.Component {
  render() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    )
  }
};

class Comment extends React.Component {
  rawMarkup() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  }

  render() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    )
  }
};

render(
  <CommentBox data={data} />,
  document.getElementById('content')
);
