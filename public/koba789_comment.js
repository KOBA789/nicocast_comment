var koba789 = {};

(function () {
  /**
   * Const Variables
   */
  var muteMessage = '###このコメントは表示されません###',
      destination = '' || null;

  var commentList, listContainer, commentInput;

  /**
   * Initial Function
   */
  function init () {
    commentList = document.getElementById('koba789-comment-list');
    listContainer = document.getElementById('koba789-comment-list-container');
    commentInput = document.getElementById('koba789-comment-input');

    commentInput.onkeypress = function (event) {
      if (event.keyCode === 13) {
	return onNewComment.apply(this, arguments);
      } else {
	return true;
      }
    };

    /**
     *  socket.io settings
     */
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
    var isMuted = muteFilter(text);

    var scrollFlg = isScrolledToBottom();
    addComment(text, scrollFlg, isMuted);
  }

  /**
   * Comment filter
   */
  function muteFilter () {
    return false;
  }

  /**
   * Append comment
   */
  function addComment (text, scrollFlg, isMuted) {
    var newComment = document.createElement('li');
    newComment.textContent = newComment.innerText = isMuted ? muteMessage : text;
    commentList.appendChild(newComment);
    if (scrollFlg) scrollToBottom();
  }
  
  /**
   * Scroll comment container to bottom
   */
  function scrollToBottom () {
    var scrollHeight = listContainer.scrollHeight,
	clientHeight = listContainer.clientHeight;
    listContainer.scrollTop = scrollHeight - clientHeight;
  }

  /**
   * Was scrolled to bottom
   */
  function isScrolledToBottom () {
    var scrollHeight = listContainer.scrollHeight,
	scrollTop = listContainer.scrollTop,
	clientHeight = listContainer.clientHeight;
    return scrollHeight <= clientHeight || scrollTop >= scrollHeight - clientHeight;
  }

  /**
   * Enter a new comment Handler
   */
  function onNewComment() {
    var text = commentInput.value;
    commentInput.value = '';
    addComment(text, true);
  }

  koba789.init = init;
  koba789.test = test;
})();