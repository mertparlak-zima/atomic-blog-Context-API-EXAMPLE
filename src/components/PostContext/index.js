import { createContext, useState, useContext } from "react";
import { faker } from "@faker-js/faker";

const PostContext = createContext();

function PostProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  function createRandomPost() {
    return {
      title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      body: faker.hacker.phrase(),
    };
  }

  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );

  // 1) Create context

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
        onAddPost: handleAddPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  if (context === "undefined") {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
}

export { PostProvider, usePosts };
