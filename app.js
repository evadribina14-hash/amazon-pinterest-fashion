const state = {
  apiBase: localStorage.getItem("apiBase") || "",
  products: [],
  pins: [],
  selected: null
};

const blocked = [
  "jeans",
  "jean",
  "pants",
  "trousers",
  "leggings",
  "skirt",
  "activewear",
  "sportswear",
  "workout",
  "swimsuit",
  "bikini",
  "swimwear",
  "shoes",
  "shoe",
  "boots",
  "sneakers",
  "sandals",
  "handbag",
  "purse",
  "backpack",
  "jewelry",
  "necklace",
  "earrings",
  "bracelet",
  "belt",
  "scarf",
  "hat",
  "accessory"
];

function go(page) {
  document.querySelectorAll(".page").forEach(function (x) {
    x.classList.remove("active");
  });

  document.getElementById(page).classList.add("active");
  window.scrollTo(0, 0);
}

document.querySelectorAll("[data-page]").forEach(function (button) {
  button.onclick = function () {
    go(button.dataset.page);
  };
});

async function search(q) {
  const status = document.getElementById("status");
  const box = document.getElementById("products");

  status.textContent = "Meklēju Amazon...";
  box.innerHTML = "";

  if (!state.apiBase) {
    status.textContent =
      "Vispirms Iestatījumos ievadi backend URL.";
    return;
  }

  try {
    const url =
      state.apiBase.replace(/\/$/, "") +
      "/api/amazon/search?q=" +
      encodeURIComponent(q);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();

    state.products = (data.products || []).filter(function (product) {
      const title = (product.title || "").toLowerCase();

      return !blocked.some(function (word) {
        return title.includes(word);
      });
    });

    if (!state.products.length) {
      status.textContent = "Produkti nav atrasti.";
      return;
    }

    status.textContent =
      "Atrasti " + state.products.length + " produkti.";

    state.products.forEach(renderProduct);

  } catch (error) {
    console.error(error);

    status.textContent =
      "Savienojuma kļūda. Pārbaudi backend URL.";
  }
}

function renderProduct(product) {
  const box = document.getElementById("products");

  const element = document.createElement("article");
  element.className = "product";

  const image =
    product.images && product.images.length
      ? product.images[0]
      : "";

  element.innerHTML = `
    <img
      src="${image}"
      alt=""
    >

    <h3>
      ${escapeHtml(product.title || "Amazon product")}
    </h3>

    <div class="small">
      ASIN: ${escapeHtml(product.asin || "")}
    </div>

    <button>Atvērt</button>
  `;

  element.querySelector("button").onclick = function () {
    openProduct(product);
  };

  box.appendChild(element);
}

async function openProduct(product) {
  state.selected = product;

  go("product");

  renderProductDetail(product);

  if (
    state.apiBase &&
    product.asin
  ) {
    try {
      const url =
        state.apiBase.replace(/\/$/, "") +
        "/api/amazon/item/" +
        encodeURIComponent(product.asin);

      const response = await fetch(url);

      if (response.ok) {
        const fullProduct = await response.json();

        state.selected = fullProduct;

        renderProductDetail(fullProduct);
      }

    } catch (error) {
      console.error(error);
    }
  }
}

function renderProductDetail(product) {
  const detail =
    document.getElementById("productDetail");

  const images = product.images || [];

  const firstImage =
    images.length ? images[0] : "";

  detail.innerHTML = `
    <h1>
      ${escapeHtml(product.title || "Produkts")}
    </h1>

    <img
      class="heroImg"
      id="hero"
      src="${firstImage}"
      alt=""
    >

    <div class="thumbs">
      ${images
        .map(function (image, index) {
          return `
            <img
              src="${image}"
              class="${index === 0 ? "selected" : ""}"
              data-index="${index}"
              alt=""
            >
          `;
        })
        .join("")}
    </div>

    <div class="card">

      <div class="muted">
        ASIN:
        ${escapeHtml(product.asin || "")}
      </div>

      <a
        href="${product.url || "#"}"
        target="_blank"
        rel="noopener"
      >
        Atvērt Amazon
      </a>

      <button
        id="createPins"
        style="width:100%;margin-top:12px"
      >
        Izveidot 3 Pinus
      </button>

    </div>
  `;

  detail
    .querySelectorAll(".thumbs img")
    .forEach(function (thumbnail) {

      thumbnail.onclick = function () {

        const index =
          Number(thumbnail.dataset.index);

        document.getElementById("hero").src =
          images[index];

        detail
          .querySelectorAll(".thumbs img")
          .forEach(function (image) {
            image.classList.remove("selected");
          });

        thumbnail.classList.add("selected");
      };

    });

  document.getElementById("createPins").onclick =
    function () {
      createPins(product);
    };
}

function createPins(product) {
  const images =
    (product.images || []).slice(0, 3);

  state.pins = images.map(function (image, index) {

    return {
      product: product,

      image: image,

      type:
        index === 2
          ? "LINK"
          : "SAVE",

      title: makeTitle(
        product.title,
        index
      ),

      description:
        "A chic " +
        shortTitle(product.title) +
        " outfit idea for women. Paid link. #ad",

      keywords:
        "women's fashion, outfit ideas, capsule wardrobe, chic style",

      board:
        [
          "Classy Minimal Outfits",
          "Chic Everyday Outfit Ideas",
          "Capsule wardrobe outfit ideas"
        ][index % 3],

      tagTopics:
        "women's fashion, outfit ideas, chic outfits",

      altText:
        "Women's fashion outfit featuring " +
        shortTitle(product.title),

      time:
        ["09:00", "13:00", "19:00"][index],

      ai: false
    };

  });

  renderPins();

  go("pins");
}

function renderPins() {
  const box =
    document.getElementById("pinsList");

  box.innerHTML = "";

  state.pins.forEach(function (pin, index) {

    const element =
      document.createElement("article");

    element.className = "card pin";

    element.innerHTML = `
      <img
        src="${pin.image}"
        alt=""
      >

      <h3>
        Pin ${index + 1} • ${pin.type}
      </h3>

      <span class="label">
        Title
      </span>

      <div>
        ${escapeHtml(pin.title)}
      </div>

      <span class="label">
        Description
      </span>

      <div>
        ${escapeHtml(pin.description)}
      </div>

      <span class="label">
        Keywords
      </span>

      <div>
        ${escapeHtml(pin.keywords)}
      </div>

      <span class="label">
        Board
      </span>

      <div>
        ${escapeHtml(pin.board)}
      </div>

      <span class="label">
        Tag Topics
      </span>

      <div>
        ${escapeHtml(pin.tagTopics)}
      </div>

      <span class="label">
        Alt Text
      </span>

      <div>
        ${escapeHtml(pin.altText)}
      </div>

      <span class="label">
        Publishing time
      </span>

      <div>
        ${pin.time}
      </div>
    `;

    box.appendChild(element);
  });
}

function makeTitle(title, index) {
  const name = shortTitle(title);

  const titles = [
    "Chic Women's " +
      name +
      " Outfit Ideas",

    "Elegant " +
      name +
      " Looks for Women",

    "How to Style a " +
      name
  ];

  return titles[index] || titles[0];
}

function shortTitle(title) {
  return String(title || "Fashion Piece")
    .replace(/\s+/g, " ")
    .slice(0, 70);
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    function (character) {

      const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return characters[character];
    }
  );
}

document.getElementById("searchBtn").onclick =
  function () {

    const query =
      document
        .getElementById("searchInput")
        .value
        .trim();

    if (query) {
      search(query);
    }
  };

document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
      document.getElementById("searchBtn").click();
    }

  });

document
  .querySelectorAll(".filters button")
  .forEach(function (button) {

    button.onclick = function () {

      const query =
        button.dataset.q;

      document.getElementById(
        "searchInput"
      ).value = query;

      search(query);
    };

  });

document.getElementById("apiBase").value =
  state.apiBase;

document.getElementById("saveApi").onclick =
  function () {

    state.apiBase =
      document
        .getElementById("apiBase")
        .value
        .trim();

    localStorage.setItem(
      "apiBase",
      state.apiBase
    );

    alert("Saglabāts");
  };
