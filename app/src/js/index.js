import React from 'react';
import { render } from 'react-dom';

import CommentBox from './components/CommentBox.js';

render(
  <CommentBox url="http://localhost:3000/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
