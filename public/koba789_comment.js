var koba789 = {};

(function () {
  /**
   * Const Variables
   */
  var muteMessage = '###このコメントは表示されません###',
      destination = '' || null;

  /**
   * Initial Function
   */
  function init () {
    this.commentList = document.getElementById('koba789-comment-list');
    
    var socket = io.connect(destnation);
    socket.on('comment', onCommentReceived);
  }

  /**
   * Comment Received Handler
   */
  function onCommentReceived (comment) {
    var text = comment.text;
    var isMuted = filter(text);
    addComment(text, isMuted);
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
  function addCommnet (text, isMuted) {
    var newComment = document.createElement('li');
    newComment.textContent = newComment.innerText = isMuted ? muteMessage : text;
    this.commentList.appendChild(newComment);
  }

  koba789.init = init;
})();