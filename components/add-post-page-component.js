import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";

let imageUrl = "";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container text-post-input">Добавить пост
      </div>
      <div class="upLoad-img-conteiner"></div>
      <p class="text-post-input">Опишите фотографию:</p>
      <textarea
            id="comment-input"
            value=""
            type="textarea"
            class="add-form-text"
            rows="4"
          ></textarea>
      <button class="button get-button" id="add-button">Добавить</button>
    </div>
  `;

    appEl.innerHTML = appHtml;


    renderHeaderComponent({
      element: document.querySelector(".header-container")
    });

renderUploadImageComponent({
  element: appEl.querySelector(".upLoad-img-conteiner"), 
onImageUrlChange(newImgUrl) {
  imageUrl = newImgUrl;
}
});


    document.getElementById("add-button").addEventListener("click", () => {
      const textareaElement = document.querySelector(".add-form-text");

      onAddPostClick({
        description: textareaElement.value,
        imageUrl,
      });
    });
  };
  render();
}
