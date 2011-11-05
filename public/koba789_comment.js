var koba789 = {};

(function () {
  /**
   * Const Variables
   */
  var muteMessage = '###このコメントは表示されません###',
      destination = '' || null;

  /**
   * DOM Elements
   */
  var commentList, listContainer, commentInput;

  /**
   * Global Variables
   */

  var socket, isLocal = false;

  /**
   * Initial Function
   */
  function init () {
    commentList = document.getElementById('koba789-comment-list');
    listContainer = document.getElementById('koba789-comment-list-container');
    commentInput = document.getElementById('koba789-comment-input');

    commentInput.onkeypress = function (event) {
      if (event.keyCode === 13) {
	return onEnterComment.apply(this, arguments);
      } else {
	return true;
      }
    };

    /**
     *  socket.io settings
     */
    if (window.location.href.match(/^file:/)) {
      isLocal = true;
      setTimeout(onConnect, 0);
    } else {
      socket = io.connect(destination);
      socket.on('connect', onConnect);
      socket.on('comment', onCommentReceive);
      socket.on('log', onLogReceive);
    }
  }

  /**
   * Test
   */
  function test () {
    for (var i = 1; i <= 100; i ++) {
      onCommentReceive({text: 'テストメッセージ' + i.toString()});
    }
    socket.set('channel', 'koba789');
  }

  /**
   * Socket.IO Connect Handler
   */
  function onConnect () {
    commentInput.value = '';
    commentInput.disabled = false;
  }

  /**
   * Comment Receive Handler
   */
  function onCommentReceive (comment) {
    var text = comment.text;
    var isMuted = muteFilter(text);

    var scrollFlg = isScrolledToBottom();
    addComment(text, scrollFlg, isMuted);
  }

  /**
   * Log Receive Handler
   */
  function onLogReceive (log) {
    
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
  function onEnterComment() {
    var text = commentInput.value;
    commentInput.value = '';
    addComment(text, true);
    
    if (!isLocal) socket.emit('post', text);
  }

  koba789.init = init;
  koba789.test = test;
})();