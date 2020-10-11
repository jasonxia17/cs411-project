import React from "react";

class ViewPostsPage extends React.Component {
  state = {
    posts: []
  };

  componentDidMount(): void {
    fetch("/api/view_posts")
      .then(res => res.json())
      .then(data => {
        this.setState({ posts: data.posts });
      })
      .catch(reason => console.log(reason));
  }

  render(): JSX.Element {
    return (
      <ul>
        {this.state.posts.map(post => (
          <li key={post.PostId}>
            <h2>
              Post {post.PostId} by User {post.UserId}: {post.Title}
            </h2>
            <p>{post.Body}</p>
          </li>
        ))}
      </ul>
    );
  }
}

export default ViewPostsPage;
