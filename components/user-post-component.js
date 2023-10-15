import { renderHeaderComponent } from "./header-component.js";
import { posts, getToken, goToPage } from "../index.js";
import { postLikesRemove, postLikesAdd} from "../api.js";
import { displayLikes} from "./posts-page-component.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { USER_POSTS_PAGE } from "../routes.js";

export function renderUserPostsPageComponent({ appEl }) {
  const userPostsHtml = posts
    .map((post) => {
      const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: ru,
      });
      return `
      <ul class="posts">
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
              <img src="${
                post.user.imageUrl
              }" class="posts-user-header__user-image">
              <p class="posts-user-header__user-name">${post.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
            ${
              post.isLiked
                ? `<img src="./assets/images/like-active.svg">`
                : `<img src="./assets/images/like-not-active.svg">`
            }
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
    `;
    })
    .join("");

  const postPageHtml = `
      <div class="page-container" >
      <div class="header-container"></div>
      ${userPostsHtml}
      </div>
      `;

  appEl.innerHTML = postPageHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  const userEl = document.querySelector(".post-header");

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", () => {
      const userId = userEl.dataset.userId;
      const id = likeBtn.dataset.postId;
      const isLiked = likeBtn.dataset.postLike === "true";
      const token = getToken();

      if (!isLiked) {
        postLikesAdd({ token, ID: id }).then(() => {
          return goToPage(USER_POSTS_PAGE, { userId });
        });
      } else {
        postLikesRemove({ token, ID: id }).then(() => {
          return goToPage(USER_POSTS_PAGE, { userId });
        });
      }
    });
  }
}
