var koba789 = {};

(function () {
  /**
   * Const Variables
   */
  var muteMessage = '###このコメントは表示されません###',
      destination = 'http://koba789.node-ninja.com:2525/' || null;

  /**
   * DOM Elements
   */
  var commentList, listContainer, commentInput;

  /**
   * Global Variables
   */

  var socket, isLocal = false;

  var dev = {
    channelName: 'debug-channel',
    isLocal: false
  };

  /**
   * Initial Function
   */
  function init () {
    /**
     * Switch debug mode
     */
    if (location.hostname !== 'live.nicocast.com') {
      dev.isLocal = true;
    }

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
    socket = io.connect(destination);
    socket.on('connect', onConnect);
    socket.on('comment', onCommentReceive);
    socket.on('log', onLogReceive);
    socket.emit('channelName', getChannelName());
  }

  /**
   * Test
   */
  function test () {
    for (var i = 1; i <= 100; i ++) {
      onCommentReceive({text: 'テストメッセージ' + i.toString()});
    }
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
    for (var i = 0; i < log.length; i ++) {
      var comment = JSON.parse(log[i]);
      var text = comment.text;
      var isMuted = muteFilter(text);
      addComment(text, true, isMuted);
    }
  }

  /**
   * Get the Channel Name
   */
  function getChannelName () {
    if (!dev.isLocal) {
      return location.pathname.match(/\/channel\/([a-zA-Z0-9_-]+)/)[1];
    } else {
      return location.search.substring(1) || dev.channelName;
    }
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
    socket.emit('post', text);
    return true;
  }

  koba789.init = init;
})();