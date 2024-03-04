/*
 * Client-side JS for dashboard:
 * - delete post or comment (with confirmation)
 * - launch edit post/comment routes
 */

const deletePost = async (post_id) => {
  const OK = confirm("Are you sure you want to delete this post?");
  if (OK) {
    const response =  await fetch(`/api/blogposts/${post_id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      document.location.reload();
    } else {
      alert('Failed to delete project.');
      console.log(`Response status: ${response.status}`);
    };
  };
}

const deleteComment = async (comment_id) => {
  const OK = confirm("Are you sure you want to delete this comment?");
  if (OK) {
    const response =  await fetch(`/api/comments/${comment_id}`, {
      method: 'DELETE'
    });
    if (response.ok) {
      document.location.reload();
    } else {
      alert('Failed to delete comment.');
      console.log(`Response status: ${response.status}`);
    };
  };
}

/*
 * Event listeners: there may be multiple buttons, need to supply
 * listeners for each one and get the ID from the data attribute
 */
document.querySelectorAll('button.delete-post').forEach((el) => {
  el.addEventListener('click', (evt) => deletePost(evt.target.dataset.id));
});

document.querySelectorAll('button.delete-comment').forEach((el) => {
  el.addEventListener('click', (evt) => deleteComment(evt.target.dataset.id));
});
