import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ContentWrapper from "../../../components/ContentWrapper";

export default function EditPostPage(): JSX.Element {
  const [postBody, editPostBody] = useState("");
  const [postId, setPostId] = useState("");
  const [posts, setPosts] = useState([]);
  const { query } = useRouter();

  useEffect(() => {
    const postId = query.postId;
    if (postId == undefined) {
      return;
    }

    fetch(`/api/post/${postId}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
      })
      .catch(reason => console.log(reason));
  }, [query]); // query is an empty object initially; need to rerun effect when it's populated

  useEffect(() => {
    //caching postid
    if (query.postId == undefined) {
      return;
    }
    setPostId(query.postId as string);
  }, [query]);

  async function submitEdit(): Promise<void> {
    await fetch("/api/post/edit_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postId: postId, postBody })
    });
    window.location.href = `/post/${postId}`; // go back to home page
  }

  return (
    <ContentWrapper>
      <h1>Edit the post here!</h1>
      <textarea
        style={{
          width: 750,
          height: 150,
          padding: 10,
          resize: "none"
        }}
        value={postBody}
        onChange={e => editPostBody(e.target.value)}
      />
      <div>
        <button style={{ cursor: "pointer" }} onClick={submitEdit}>
          Submit edit!
        </button>
      </div>
    </ContentWrapper>
  );
}
