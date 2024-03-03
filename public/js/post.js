// calback function for "create post" button
const addPost = async (event) => {
  const title = document.querySelector('div.post-title input').value;
  const summary = document.querySelector('div.post-summary input').value;
  const content = document.querySelector('div.post-content textarea').value;

  console.log({ title, summary, content });

  // title and summary cannot be null
  if (title && summary) {
    const response = await fetch('api/blogposts', {
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
} // end addPost function declaration

document
  .querySelector('button.add-post')
  .addEventListener('click', addPost);
