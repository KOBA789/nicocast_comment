var koba789 = {};

(function () {
  /**
   * Const Variables
   */
  var muteMessage = '###このコメントは表示されません###',
      destination = '' || null;

  var commentList, commentContainer;

  /**
   * Initial Function
   */
  function init () {
    commentList = document.getElementById('koba789-comment-list');
    commentContainer = document.getElementById('koba789-comment-container');

    if (location.href.match(/^file:/)) return;

    var socket = io.connect(destnation);
    socket.on('comment', onCommentReceived);
  }

  /**
   * Test
   */
  function test () {
    for (var i = 1; i <= 100; i ++) {
      onCommentReceived({text: 'テストメッセージ' + i.toString()});
    }
  }

  /**
   * Comment Received Handler
   */
  function onCommentReceived (comment) {
    var text = comment.text;
    var isMuted = filter(text);

    var isScrolled = isScrolledBottom();
    addComment(text, isMuted);
    if (isScrolled) scrollToBottom();
  }

  /**
   * Comment Filter
   */
  function filter () {
    return false;
  }

  /**
   * Append Comment
   */
  function addComment (text, isMuted) {
    var newComment = document.createElement('li');
    newComment.textContent = newComment.innerText = isMuted ? muteMessage : text;
    commentList.appendChild(newComment);
  }

  function scrollToBottom () {
    commentContainer.scrollTop = commentContainer.scrollHeight - commentContainer.clientHeight;
  }

  function isScrolledBottom () {
    var scrollHeight = commentContainer.scrollHeight,
	scrollTop = commentContainer.scrollTop,
	clientHeight = commentContainer.clientHeight;
    return scrollHeight <= clientHeight || scrollTop >= scrollHeight - clientHeight;
  }

  koba789.init = init;
  koba789.test = test;
})();