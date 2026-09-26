const state = {
  page: "home",
  products: [],
  pins: [],
  schedule: {},
  detail: null
};

const boards = [
  "Classy Minimal Outfits",
  "Chic Everyday Outfit Ideas",
  "Capsule wardrobe outfit ideas",
  "Women’s Outfit Ideas"
];

const demo = [
  {
    asin: "DEMO-DRESS-01",
    title: "Women’s Casual Denim Shirt Dress",
    price: "$49.99",
    category: "dresses",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    asin: "DEMO-TOP-02",
    title: "Women’s Soft Knit Long Sleeve Top",
    price: "$29.99",
    category: "tops",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    asin: "DEMO-BLAZER-03",
    title: "Women’s Classic Tailored Blazer",
    price: "$64.99",
    category: "blazers",
    images: [
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    asin: "DEMO-SWEATER-04",
    title: "Women’s Ribbed Oversized Sweater",
    price: "$39.99",
    category: "sweaters",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80"
    ]
  }
];

function loadData() {
  try {
    const pins = JSON.parse(
      localStorage.getItem("ap_pins") || "[]"
    );

    const schedule = JSON.parse(
      localStorage.getItem("ap_schedule") || "{}"
    );

    state.pins = Array.isArray(pins) ? pins : [];

    state.schedule =
      schedule &&
      typeof schedule === "object" &&
      !Array.isArray(schedule)
        ? schedule
        : {};

  } catch (error) {
    state.pins = [];
    state.schedule = {};
  }

  state.products = demo.slice();
}

function saveData() {
  try {
    localStorage.setItem(
      "ap_pins",
      JSON.stringify(state.pins)
    );

    localStorage.setItem(
      "ap_schedule",
      JSON.stringify(state.schedule)
    );
  } catch (error) {}
}

function esc(text) {
  return String(text || "").replace(
    /[&<>"']/g,
    function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char];
    }
  );
}

function todayKey() {
  const d = new Date();

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

function formatDate(value) {
  if (!value) return "";

  return new Date(
    value + "T12:00:00"
  ).toLocaleDateString(
    "lv-LV",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );
}

function render() {
  const app = document.getElementById("app");

  if (!app) {
    return;
  }

  if (state.detail) {
    renderDetail(app);
    bind();
    return;
  }

  if (state.page === "home") {
    app.innerHTML = renderHome();
  }

  else if (state.page === "products") {
    app.innerHTML = renderProducts();
  }

  else if (state.page === "pins") {
    app.innerHTML = renderPins();
  }

  else if (state.page === "schedule") {
    app.innerHTML = renderSchedule();
  }

  else if (state.page === "more") {
    app.innerHTML = renderMore();
  }

  bind();
}

function renderHome() {
  const total = state.pins.length;

  const links = state.pins.filter(
    function (pin) {
      return pin.type === "LINK";
    }
  ).length;

  return `
    <section class="hero">

      <h1>
        Tava Pinterest Fashion AI
      </h1>

      <p>
        Atrodi Amazon apģērbu,
        apskati produkta bildes
        un izveido 3 dažādus Pinterest Pin.
      </p>

      <button
        class="btn"
        data-action="products"
      >
        Meklēt produktus
      </button>

    </section>

    <section class="card">

      <h2>
        Šodienas plāns
      </h2>

      <div class="stat-row">
        <span>
          Gatavie Pini
        </span>

        <b>
          ${total}/3
        </b>
      </div>

      <div class="bar">
        <i
          style="width:${Math.min(
            total / 3 * 100,
            100
          )}%"
        ></i>
      </div>

      <div class="stat-row">

        <span>
          LINK Pini
        </span>

        <b>
          ${links}/1
        </b>

      </div>

    </section>

    <section class="card">

      <h2>
        Pin informācija
      </h2>

      <p class="meta">
        Katram Pin būs virsraksts,
        apraksts, dēlis, laiks,
        Tag Topics, Alt Text,
        affiliate link un AI statuss.
      </p>

    </section>
  `;
}

function renderProducts() {
  return `
    <button
      class="back"
      data-action="home"
    >
      ‹ Atpakaļ
    </button>

    <h1>
      Amazon produkti
    </h1>

    <div class="searchrow">

      <input
        id="productSearch"
        value="women's fall outfits"
        placeholder="Meklēt Amazon produktus"
      >

      <button
        class="btn"
        data-action="search"
      >
        Meklēt
      </button>

    </div>

    <div class="filters">

      <select class="select">

        <option>
          All Women's Fashion
        </option>

      </select>

      <select class="select">

        <option>
          Best Match
        </option>

      </select>

    </div>

    <h2>
      Produkti
    </h2>

    <div class="grid">

      ${state.products.map(
        function (product) {
          return `
            <article class="product">

              <img
                src="${product.images[0]}"
                alt="${esc(product.title)}"
              >

              <div class="product-body">

                <div class="product-title">
                  ${esc(product.title)}
                </div>

                <div class="price">
                  ${product.price}
                </div>

                <button
                  class="btn small"
                  data-product="${product.asin}"
                >
                  Apskatīt
                </button>

              </div>

            </article>
          `;
        }
      ).join("")}

    </div>
  `;
}

function renderDetail(app) {
  const product = state.detail;

  const selected =
    product.selected || [0, 1, 2];

  app.innerHTML = `
    <button
      class="back"
      data-action="products"
    >
      ‹ Atpakaļ uz produktiem
    </button>

    <section class="card">

      <h1>
        ${esc(product.title)}
      </h1>

      <div class="price">
        ${product.price}
      </div>

      <p class="meta">
        Amazon produkta bildes:
        ${product.images.length}.
        Izvēlies 3 atšķirīgas bildes
        dažādiem Pin.
      </p>

      <div class="detail-images">

        ${product.images.map(
          function (image, index) {

            const active =
              selected.includes(index);

            return `
              <button
                class="image-option ${
                  active ? "selected" : ""
                }"
                data-image="${index}"
              >

                <img
                  src="${image}"
                  alt="Amazon attēls ${index + 1}"
                >

                ${
                  active
                    ? '<span class="check">✓</span>'
                    : ""
                }

              </button>
            `;
          }
        ).join("")}

      </div>

      <div class="notice">

        Izvēlies tieši 3 dažādus attēlus.

      </div>

      <button
        class="btn"
        style="width:100%"
        data-action="create"
      >
        Izveidot 3 atšķirīgus Pin
      </button>

    </section>
  `;
}

function createPins() {
  const product = state.detail;

  const selected =
    product.selected || [];

  if (selected.length !== 3) {
    alert(
      "Izvēlies tieši 3 bildes."
    );
    return;
  }

  const types = [
    "SAVE",
    "SAVE",
    "LINK"
  ];

  for (let i = 0; i < 3; i++) {

    const pin = {
      id:
        "pin-" +
        Date.now() +
        "-" +
        i,

      type: types[i],

      image:
        product.images[selected[i]],

      title:
        "Chic everyday outfit inspiration",

      description:
        "Simple and polished outfit inspiration for a modern wardrobe. Paid link. #ad",

      keywords: [
        product.category,
        "women's outfit ideas",
        "fall outfits",
        "capsule wardrobe",
        "everyday style"
      ],

      board:
        boards[i],

      tagTopics: [
        "Women's Fashion",
        "Outfit Ideas",
        "Capsule Wardrobe"
      ],

      altText:
        "Woman wearing a stylish " +
        product.category +
        " outfit",

      affiliateLink:
        "https://www.amazon.com/dp/" +
        product.asin +
        "?tag=evafinds04f-20",

      aiStatus:
        "Not modified",

      date:
        findSlot(types[i]),

      time:
        [
          "18:00",
          "19:00",
          "20:00"
        ][i]
    };

    state.pins.push(pin);

    if (!state.schedule[pin.date]) {
      state.schedule[pin.date] = [];
    }

    state.schedule[pin.date].push(pin);
  }

  saveData();

  state.detail = null;
  state.page = "pins";

  render();
}

function findSlot(type) {
  const date = new Date();

  for (let i = 0; i < 30; i++) {

    const key =
      date.getFullYear() +
      "-" +
      String(
        date.getMonth() + 1
      ).padStart(2, "0") +
      "-" +
      String(
        date.getDate()
      ).padStart(2, "0");

    const list =
      state.schedule[key] || [];

    const linkCount =
      list.filter(
        function (pin) {
          return pin.type === "LINK";
        }
      ).length;

    if (
      list.length < 3 &&
      (
        type !== "LINK" ||
        linkCount < 1
      )
    ) {
      return key;
    }

    date.setDate(
      date.getDate() + 1
    );
  }

  return todayKey();
}

function renderPins() {
  if (state.pins.length === 0) {
    return `
      <h1>
        Mani Pini
      </h1>

      <section class="card">

        <p class="meta">
          Vēl nav izveidotu Pin.
        </p>

      </section>
    `;
  }

  return `
    <h1>
      Mani Pini
    </h1>

    <section class="card">

      ${state.pins.map(
        function (pin) {

          return `
            <article class="pin-card">

              <img
                src="${pin.image}"
                alt=""
              >

              <div>

                <span
                  class="badge ${
                    pin.type === "LINK"
                      ? "link"
                      : "save"
                  }"
                >
                  ${pin.type}
                </span>

                <h3>
                  ${esc(pin.title)}
                </h3>

                <p class="meta">
                  ${esc(pin.board)}
                  ·
                  ${formatDate(pin.date)}
                  ·
                  ${esc(pin.time)}
                </p>

                <p class="meta">
                  ${esc(pin.description)}
                </p>

                <div class="ai">
                  AI: ${esc(pin.aiStatus)}
                </div>

              </div>

            </article>
          `;
        }
      ).join("")}

    </section>
  `;
}

function renderSchedule() {
  const dates =
    Object.keys(
      state.schedule
    ).sort();

  return `
    <h1>
      Grafiks
    </h1>

    <section class="card">

      <p class="meta">
        Maksimums 3 Pin dienā
        un 1 LINK Pin dienā.
      </p>

      ${
        dates.length === 0
          ? `
            <p class="meta">
              Grafiks vēl ir tukšs.
            </p>
          `
          : dates.map(
              function (date) {

                const items =
                  state.schedule[date] || [];

                return `
                  <div>

                    <div class="day-head">

                      <h3>
                        ${formatDate(date)}
                      </h3>

                      <b>
                        ${items.length}/3
                      </b>

                    </div>

                    ${items.map(
                      function (pin) {

                        return `
                          <div class="slot">

                            <span>
                              <b>
                                ${pin.type}
                              </b>

                              ·

                              ${esc(
                                pin.title
                              )}
                            </span>

                            <span>
                              ${esc(
                                pin.time
                              )}
                            </span>

                          </div>
                        `;
                      }
                    ).join("")}

                  </div>
                `;
              }
            ).join("")
      }

    </section>
  `;
}

function renderMore() {
  return `
    <h1>
      Vairāk
    </h1>

    <section class="card">

      <h2>
        Iestatījumi
      </h2>

      <p class="meta">
        Amazon Partner Tag:
        evafinds04f-20
      </p>

      <p class="meta">
        Amazon API:
        testa režīms
      </p>

      <p class="meta">
        Boards:
        ${boards.join(" · ")}
      </p>

    </section>
  `;
}

function bind() {

  document
    .querySelectorAll(
      "[data-page]"
    )
    .forEach(
      function (button) {

        button.onclick =
          function () {

            state.page =
              button.dataset.page;

            state.detail = null;

            render();
          };
      }
    );

  document
    .querySelectorAll(
      "[data-action]"
    )
    .forEach(
      function (button) {

        button.onclick =
          function () {

            const action =
              button.dataset.action;

            if (
              action === "home"
            ) {

              state.page = "home";
              state.detail = null;
              render();

            }

            else if (
              action === "products"
            ) {

              state.page = "products";
              state.detail = null;
              render();

            }

            else if (
              action === "pins"
            ) {

              state.page = "pins";
              state.detail = null;
              render();

            }

            else if (
              action === "schedule"
            ) {

              state.page = "schedule";
              state.detail = null;
              render();

            }

            else if (
              action === "more"
            ) {

              state.page = "more";
              state.detail = null;
              render();

            }

            else if (
              action === "search"
            ) {

              render();

            }

            else if (
              action === "create"
            ) {

              createPins();

            }

          };
      }
    );

  document
    .querySelectorAll(
      "[data-product]"
    )
    .forEach(
      function (button) {

        button.onclick =
          function () {

            const product =
              state.products.find(
                function (item) {
                  return (
                    item.asin ===
                    button.dataset.product
                  );
                }
              );

            if (!product) {
              return;
            }

            state.detail =
              JSON.parse(
                JSON.stringify(product)
              );

            state.detail.selected = [
              0,
              1,
              2
            ];

            render();

          };
      }
    );

  document
    .querySelectorAll(
      "[data-image]"
    )
    .forEach(
      function (button) {

        button.onclick =
          function () {

            const index =
              Number(
                button.dataset.image
              );

            let selected =
              state.detail.selected || [];

            const existing =
              selected.indexOf(index);

            if (existing >= 0) {

              selected.splice(
                existing,
                1
              );

            }

            else if (
              selected.length < 3
            ) {

              selected.push(index);

            }

            else {

              selected.shift();
              selected.push(index);

            }

            state.detail.selected =
              selected;

            render();

          };
      }
    );
}

loadData();
render();
