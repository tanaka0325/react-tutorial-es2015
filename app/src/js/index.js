import React from 'react';
import { render } from 'react-dom';

class CommentBox extends React.Component {
  render() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    )
  }
};

render(
  <CommentBox />,
  document.getElementById('content')
);
