import React from 'react';
import { render, findDOMNode } from 'react-dom';
import marked from 'marked';
import request from 'superagent';

class CommentBox extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    }

    this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
  }

  loadCommentsFromServer() {
    request
      .get(this.props.url)
      .end((err, res) => {
        if (err) {
          throw err
        }
        this.setState({data: res.body})
      })
  }

  handleCommentSubmit(comment) {
    const comments = this.state.data;
    const newComments = comments.concat([comment]);
    this.setState({data: newComments});
    request
      .post(this.props.url)
      .send(comment)
      .end((err, res) => {
        if (err) {
          this.setState({data: comments})
          throw err
        }
        this.setState({data: res.body})
      })
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }

  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
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
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const author = findDOMNode(this.refs.author).value.trim();
    const text = findDOMNode(this.refs.text).value.trim();

    if (!text || !author) {
      return;
    }

    this.props.onCommentSubmit({author: author, text: text});
    findDOMNode(this.refs.author).value = '';
    findDOMNode(this.refs.text).value = '';
    return;
  }

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
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
  <CommentBox url="http://localhost:3000/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
