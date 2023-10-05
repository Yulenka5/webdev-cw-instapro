import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { postLikesRemove, postLikesAdd } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { el, id, ru } from "date-fns/locale";



export const displayLikes = (likes) => {
  const numberOfLikes = likes.length;

  if (numberOfLikes === 0) {
    return 0;
  }

  if (numberOfLikes === 1) {
    return `${likes[0].name}`;
  }

  return `${likes[numberOfLikes - 1].name} и еще ${numberOfLikes - 1}`;
};

export function renderPostsPageComponent({ appEl }) {
 
  console.log("Актуальный список постов:", posts);
 
const appHtml = posts.map((post)=> {

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ru
  });
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
   
 return  `<div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  <li class="post">
                    <div class="post-header" data-user-id='${post.user.id}'>
                        <img src='${post.user.imageUrl}' class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src='${post.imageUrl}'>
                    </div>
                    <div class="post-likes">
                      <button data-post-id='${post.id}' data-post-like=${post.isLiked} class="like-button">
                        ${post.isLiked ? `<img src="./assets/images/like-active.svg">` :
                        `<img src="./assets/images/like-not-active.svg">`}
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${displayLikes(post.likes)}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${formattedDate}
                    </p>
                  </li>
                </ul>
              </div>`;}).join("");

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  document.querySelectorAll(".like-button").forEach((likeBtn) => {
    likeBtn.addEventListener("click", async () => {
      const id = likeBtn.dataset.postId;
      const isLiked = likeBtn.dataset.postLike === "true";
      try {
        const token = getToken();

        if (isLiked) {
          await postLikesRemove({ token, ID: id }).then(() => {
            goToPage(POSTS_PAGE);
          });
        } else {
          await postLikesAdd({ token, ID: id }).then(() => {
            goToPage(POSTS_PAGE);
          });
        }
        goToPage(undefined, "like");
      } catch (error) {
        console.error("Произошла ошибка:", error);
      }
    });
  });
}

