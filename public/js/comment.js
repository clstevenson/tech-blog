// client-side JS to add or edit comments

const updateComment = async (evt) => {

  const content = document.querySelector('textarea.update-comment').value;
  const commentID = evt.target.dataset.id;

  // need some content in order to update
  if (content) {
    response = await fetch(`/api/comments/${commentID}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to update comment.');
    }; // end inner IF
  }; // end outer IF
};

// set event listeners; only one of the following will work
try {
  document
    .querySelector('button.update')
    .addEventListener('click', updateComment);
} catch (err) {
  // Do something
}
