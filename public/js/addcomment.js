// client-side JS to add a comment
// It does this on the "showpost" page so the user can see the post and other comments
document.addEventListener('DOMContentLoaded', () => {
  /////////////////////////////////////////////////////////////////////////////
  //                             Global Variables                            //
  /////////////////////////////////////////////////////////////////////////////

  const commentTextboxEl = document.querySelector('#add-comment-content textarea');
  const addCommentBtnsEl = document.querySelectorAll('#add-comment-content button');
  const createBtnEl = document.querySelector('button.create_comment');

  /////////////////////////////////////////////////////////////////////////////
  //                            Callback Functions                           //
  /////////////////////////////////////////////////////////////////////////////
  const getComment = () => {
    // display the textbox to get comment
    commentTextboxEl.style.display = "block";

    // display the buttons to submit (or cancel) comment
    for (const btn of addCommentBtnsEl) {
      btn.style.display = "inline-block";
    }

    // hide the original "create comment" button
    document.querySelector('button.create_comment').style.display = "none";

  }; // end getComment function

  const cancelComment = () => {
    // hide the elements to collect comment content and associated buttons
    commentTextboxEl.style.display = "none";
    for (const btn of addCommentBtnsEl) {
      btn.style.display = "none";
    }

    // and show the "create comment" button again
    document.querySelector('button.create_comment').style.display = "inline-block";
  }; // end cancelComment function

  const addComment = async (evt) => {
    // get the ID of the post to which the comment is attached
    const post_id = evt.target.dataset.id;
    const content = commentTextboxEl.value;

    if (content) {
      response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ post_id, content }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        document.location.reload();
      } else {
        cancelComment();
        alert('Failed to create comment.');
      }
    };
    // success or failure, still need to clean up display elements
  }; // end addComment function

  /////////////////////////////////////////////////////////////////////////////
  //                             Executable Code                             //
  /////////////////////////////////////////////////////////////////////////////

  // on document load, turn on the create-comment button
  createBtnEl.style.display = "inline-block";
  // and turn of the textbox and other buttons
  commentTextboxEl.style.display = "none";
  for (const btn of addCommentBtnsEl) {
    btn.style.display = "none";
  }

  /////////////////////////////////////////////////////////////////////////////
  //                             Event Listeners                             //
  /////////////////////////////////////////////////////////////////////////////

  // clicking "add a comment" button
  createBtnEl.addEventListener('click', getComment);
  // cancelling the add-comment
  document
    .querySelector('button.cancel_comment')
    .addEventListener('click', cancelComment);
  // submitting a comment to the dB
  document
    .querySelector('button.submit_comment')
    .addEventListener('click', addComment);

}, false);  // end DOM ready
