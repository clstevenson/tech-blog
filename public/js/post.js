// calback function for "create post" button
const addPost = async (event) => {
  const title = document.querySelector('div.post-title input').value;
  const summary = document.querySelector('div.post-summary input').value;
  const content = document.querySelector('div.post-content textarea').value;

  // title and summary cannot be null
  if (title && summary) {
    const response = await fetch('/api/blogposts', {
      method: 'POST',
      body: JSON.stringify({ title, summary, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to create post.')
    };
  }; // end IF block
}; // end addPost function declaration

// calback function for "edit post" button
const editPost = async (event) => {
  const title = document.querySelector('div.post-title input').value;
  const summary = document.querySelector('div.post-summary input').value;
  const content = document.querySelector('div.post-content textarea').value;
  const postID = event.target.dataset.id;

  // title and summary cannot be null
  if (title && summary) {
    const response = await fetch(`/api/blogposts/${postID}`, {
      method: 'PUT',
      body: JSON.stringify({ title, summary, content }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to update post.');
    }
  }; // end IF block
}; // end editPost function definition

// only one of the following works, the other throws an error
try {
  document
    .querySelector('button.add-post')
    .addEventListener('click', addPost);
} catch (err) {
  document
    .querySelector('button.edit-post')
    .addEventListener('click', editPost);
}
