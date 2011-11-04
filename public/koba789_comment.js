var koba789 = {};

(function () {
  /**
   * Const Variables
   */
  var muteMessage = '###このコメントは表示されません###',
      destination = '' || null;

  var commentList;

  /**
   * Initial Function
   */
  function init () {
    commentList = document.getElementById('koba789-comment-list');
    
    if (location.href.match(/^file:/)) return;

    var socket = io.connect(destnation);
    socket.on('comment', onCommentReceived);
  }

  /**
   * Test
   */
  function test () {
    for (var i = 1; i <= 10; i ++) {
      onCommentReceived({text: 'テストメッセージ' + i.toString()});
    }
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
  function addComment (text, isMuted) {
    var newComment = document.createElement('li');
    newComment.textContent = newComment.innerText = isMuted ? muteMessage : text;
    commentList.appendChild(newComment);
  }

  koba789.init = init;
  koba789.test = test;
})();