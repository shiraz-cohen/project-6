import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Posts.css";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [newPostFormVisible, setNewPostFormVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [newCommentFormVisible, setNewCommentFormVisible] = useState({});
  const [editingPost, setEditingPost] = useState(null); // New state for editing post
  const [updatedPostTitle, setUpdatedPostTitle] = useState("");
  const [updatedPostBody, setUpdatedPostBody] = useState("");
  const [editingComment, setEditingComment] = useState(null); // New state for editing post
  const [updatedCommentName, setUpdatedCommentName] = useState("");
  const [updatedCommentEmail, setUpdatedCommentEmail] = useState("");
  const [updatedCommentBody, setUpdatedCommentBody] = useState("");

  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${id}/posts`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [id]);

  const handleBold = (postId) => {
    if (selectedPostId === postId) {
      setSelectedPostId(null);
      setComments([]);
    } else {
      setSelectedPostId(postId);
      if (commentsMap[postId]) {
        setComments(commentsMap[postId]);
      } else {
        fetch(`http://localhost:3000/api/posts/${postId}/comments`)
          .then((response) => response.json())
          .then((data) => {
            setComments(data);
            setCommentsMap({ ...commentsMap, [postId]: data });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: "DELETE",
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await fetch(
        `http://localhost:3000/api/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${id}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newPostTitle, body: newPostBody }),
        }
      );

      const data = await response.json();

      setPosts((prevPosts) => [...prevPosts, data]);

      setNewPostTitle("");
      setNewPostBody("");

      setNewPostFormVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateComment = async (e, postId) => {
    e.preventDefault();

    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const body = e.target.elements.body.value;

    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, body }),
        }
      );

      const data = await response.json();

      setComments((prevComments) => [...prevComments, data]);

      setNewCommentFormVisible((prevVisibility) => ({
        ...prevVisibility,
        [postId]: false,
      }));

      e.target.reset();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdatePost = async (postId) => {
    // Find the post being edited
    const post = posts.find((post) => post.id === postId);

    // Set the initial values of the update title and body
    setUpdatedPostTitle(post.title);
    setUpdatedPostBody(post.body);
    console.log(updatedPostTitle);
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedPostTitle,
            body: updatedPostBody,
          }),
        }
      );

      if (response.ok) {
        const updatedPost = {
          id: postId,
          title: updatedPostTitle,
          body: updatedPostBody,
        };
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === postId ? updatedPost : post))
        );
        setEditingPost(null);
        setUpdatedPostTitle("");
        setUpdatedPostBody("");
      } else {
        console.error("Error updating post:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async (postId) => {
    setEditingPost(postId);
    // Find the post being edited
    const post = posts.find((post) => post.id === postId);

    // Set the initial values of the update title and body
    setUpdatedPostTitle(post.title);
    setUpdatedPostBody(post.body);
    console.log(updatedPostTitle);
  };

  const handleUpdateComment = async (commentId) => {
    // Find the comment being edited
    const comment = comments.find((comment) => comment.id === commentId);

    // Set the initial values of the update title and body
    setUpdatedCommentName(comment.name);
    setUpdatedCommentEmail(comment.email);
    setUpdatedCommentBody(comment.body);
    try {
      const response = await fetch(
        `http://localhost:3000/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedCommentName,
            email: updatedCommentEmail,
            body: updatedCommentBody,
          }),
        }
      );

      if (response.ok) {
        const updatedComment = {
          id: commentId,
          name: updatedCommentName,
          email: updatedCommentEmail,
          body: updatedCommentBody,
        };
        setComments((prevComments) =>
          prevComments.map((Comment) =>
            Comment.id === commentId ? updatedComment : Comment
          )
        );
        setEditingComment(null);
        setUpdatedCommentName("");
        setUpdatedCommentEmail("");
        setUpdatedCommentBody("");
      } else {
        console.error("Error updating Comment:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateCommentGeneral = async (CommentId) => {
    setEditingComment(CommentId);
    // Find the Comment being edited
    const Comment = comments.find((Comment) => Comment.id === CommentId);

    // Set the initial values of the update title and body
    setUpdatedCommentName(Comment.name);
    setUpdatedCommentEmail(Comment.email);
    setUpdatedCommentBody(Comment.body);
  };

  return (
    <div className="posts-container">
      <h1 className="post-header">Posts</h1>

      {newPostFormVisible ? (
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Enter post title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
          />
          <br />
          <textarea
            className="textarea-enlarge"
            placeholder="Enter post body"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
          ></textarea>
          <br />
          <button type="submit">Create Post</button>
        </form>
      ) : (
        <button onClick={() => setNewPostFormVisible(true)}>
          Create New Post
        </button>
      )}

      <ul
        className="posts-list"
        style={{ listStyleType: "none", paddingLeft: 0 }}
      >
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <div>
              {editingPost === post.id ? (
                <div>
                  <input
                    type="text"
                    value={updatedPostTitle}
                    onChange={(e) => setUpdatedPostTitle(e.target.value)}
                  />
                  <br />
                  <textarea
                    className="textarea-enlarge"
                    value={updatedPostBody}
                    onChange={(e) => setUpdatedPostBody(e.target.value)}
                  ></textarea>
                  <br />
                  <button onClick={() => handleUpdatePost(post.id)}>
                    Save Changes
                  </button>
                  <button onClick={() => setEditingPost(null)}>
                    Cancel Editing
                  </button>
                </div>
              ) : (
                <div>
                  <button onClick={() => handleDeletePost(post.id)}>
                    Delete Post
                  </button>
                  <button onClick={() => handleUpdate(post.id)}>
                    Update Post
                  </button>
                  <button
                    onClick={() =>
                      setNewCommentFormVisible((prevVisibility) => ({
                        ...prevVisibility,
                        [post.id]: true,
                      }))
                    }
                  >
                    Add New Comment
                  </button>
                </div>
              )}
            </div>
            <span
              style={{
                fontWeight: selectedPostId === post.id ? "bold" : "normal",
              }}
            >
              <div className="post-title">{post.title}</div>
              <br />
              <div className="post-body">{post.body}</div>
            </span>
            <button onClick={() => handleBold(post.id)}>
              {selectedPostId === post.id ? "Hide Comments" : "Show Comments"}
            </button>

            {selectedPostId === post.id && (
              <ul className="comments-list">
                {comments.map((comment) => (
                  <li key={comment.id} className="comment-item">
                    <div>
                      {editingComment === comment.id ? (
                        <div>
                          <input
                            type="text"
                            value={updatedCommentName}
                            onChange={(e) =>
                              setUpdatedCommentName(e.target.value)
                            }
                          />
                          <br />
                          <input
                            type="text"
                            value={updatedCommentEmail}
                            onChange={(e) =>
                              setUpdatedCommentEmail(e.target.value)
                            }
                          />
                          <br />
                          <textarea
                            className="textarea-enlarge"
                            value={updatedCommentBody}
                            onChange={(e) =>
                              setUpdatedCommentBody(e.target.value)
                            }
                          ></textarea>
                          <br />
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                          >
                            Save Changes
                          </button>
                          <button onClick={() => setEditingComment(null)}>
                            Cancel Editing
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className="comment-info">
                            name: {comment.name}
                            <br />
                            email: {comment.email}
                            <br />
                          </span>
                          <span className="comment-body">
                            body: {comment.body}
                            <br />
                          </span>
                          <div className="button-container">
                            <button
                              onClick={() =>
                                handleDeleteComment(comment.id, post.id)
                              }
                            >
                              Delete Comment
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateCommentGeneral(comment.id)
                              }
                            >
                              Update Comment
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {newCommentFormVisible[post.id] && (
              <form onSubmit={(e) => handleCreateComment(e, post.id)}>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
                <br />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
                <br />
                <textarea
                  className="textarea-enlarge"
                  name="body"
                  placeholder="Enter your comment"
                  required
                ></textarea>
                <br />
                <button type="submit">Add Comment</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
