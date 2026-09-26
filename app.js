const state={page:'home',query:"women's fall outfits",products:[],pins:[],schedule:{},detail:null};

const boards=[
  'Classy Minimal Outfits',
  'Chic Everyday Outfit Ideas',
  'Capsule wardrobe outfit ideas',
  'Women’s Outfit Ideas'
];

const categories=[
  'dresses','tops','blouses','shirts','sweaters','cardigans',
  'jackets','blazers','puffer jackets','coats','trench coats',
  'jumpsuits','rompers','two piece sets','loungewear'
];

const blocked=[
  'jeans','pants','trousers','leggings','skirt','activewear',
  'sportswear','workout','swimsuit','bikini','swimwear',
  'shoes','boots','sneakers','sandals','handbag','purse',
  'backpack','jewelry','necklace','earrings','bracelet',
  'watch','belt','scarf','hat'
];

const demo=[
{
  asin:'DEMO-DRESS-01',
  title:'Women’s Casual Denim Shirt Dress',
  price:'$49.99',
  category:'dresses',
  images:[
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'
  ]
},
{
  asin:'DEMO-TOP-02',
  title:'Women’s Soft Knit Long Sleeve Top',
  price:'$29.99',
  category:'tops',
  images:[
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'
  ]
},
{
  asin:'DEMO-BLAZER-03',
  title:'Women’s Classic Tailored Blazer',
  price:'$64.99',
  category:'blazers',
  images:[
    'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80'
  ]
},
{
  asin:'DEMO-SWEATER-04',
  title:'Women’s Ribbed Oversized Sweater',
  price:'$39.99',
  category:'sweaters',
  images:[
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80'
  ]
}
];

function load(){
  try{
    state.pins=JSON.parse(localStorage.getItem('ap_pins')||'[]');
    state.schedule=JSON.parse(localStorage.getItem('ap_schedule')||'{}');
  }catch(e){}

  state.products=demo;
}

function save(){
  localStorage.setItem('ap_pins',JSON.stringify(state.pins));
  localStorage.setItem('ap_schedule',JSON.stringify(state.schedule));
}

function esc(s){
  return String(s??'').replace(
    /[&<>"']/g,
    m=>({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#039;'
    }[m])
  );
}

function key(d){
  return d.toISOString().slice(0,10);
}

function pretty(k){
  return new Date(k+'T12:00:00').toLocaleDateString(
    'lv-LV',
    {
      day:'2-digit',
      month:'2-digit',
      year:'numeric'
    }
  );
}

function nextSlot(type){
  let d=new Date();

  d.setHours(12,0,0,0);

  for(let i=0;i<30;i++){

    let k=key(d);
    let a=state.schedule[k]||[];

    let links=a.filter(x=>x.type==='LINK').length;

    if(
      a.length<3 &&
      (type!=='LINK'||links<1)
    ){
      return k;
    }

    d.setDate(d.getDate()+1);
  }

  return key(d);
}

function render(){

  document
    .querySelectorAll('.bottom-nav button')
    .forEach(
      b=>b.classList.toggle(
        'active',
        b.dataset.page===state.page
      )
    );

  let a=document.getElementById('app');

  if(state.detail){
    return detail(a);
  }

  if(state.page==='home'){
    a.innerHTML=home();
  }

  if(state.page==='products'){
    a.innerHTML=products();
  }

  if(state.page==='pins'){
    a.innerHTML=pins();
  }

  if(state.page==='schedule'){
    a.innerHTML=schedule();
  }

  if(state.page==='more'){
    a.innerHTML=more();
  }

  bind();
}

function home(){

  let l=state.pins.filter(
    p=>p.type==='LINK'
  ).length;

  return `
    <section class="hero">

      <h1>Tava Pinterest Fashion AI</h1>

      <p>
        Atrodi Amazon apģērbu,
        apskati visas pieejamās produkta bildes
        un izveido 3 pilnīgi atšķirīgus Pin.
      </p>

      <button class="btn" data-a="products">
        Meklēt produktus
      </button>

    </section>

    <section class="card">

      <h2>Šodienas plāns</h2>

      <div class="stat">

        <div class="stat-row">
          <span>Gatavie Pini</span>
          <b>${state.pins.length}/3</b>
        </div>

        <div class="bar">
          <i style="width:${Math.min(
            state.pins.length/3*100,
            100
          )}%"></i>
        </div>

      </div>

      <div class="stat-row">
        <span>LINK Pini</span>
        <b>${l}/1</b>
      </div>

    </section>

    <section class="card">

      <h2>Pin informācija</h2>

      <p class="meta">
        Katram Pin: angļu virsraksts,
        apraksts, dēlis, laiks,
        Tag Topics, Alt Text,
        affiliate link un AI status.
      </p>

    </section>
  `;
}

function products(){

  let list=state.products.filter(
    p=>!blocked.some(
      x=>p.title.toLowerCase().includes(x)
    )
  );

  return `

    <button class="back" data-a="home">
      ‹ Atpakaļ
    </button>

    <h1>Amazon produkti</h1>

    <div class="searchrow">

      <input
        id="q"
        value="${esc(state.query)}"
      >

      <button
        class="btn"
        data-a="search"
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

    <div class="chips">

      ${categories.map(
        c=>`
          <button
            class="chip"
            data-cat="${c}"
          >
            ${c}
          </button>
        `
      ).join('')}

    </div>

    <h2>Produkti</h2>

    <div class="grid">

      ${list.map(
        p=>`

          <article class="product">

            <img
              src="${p.images[0]}"
              alt="${esc(p.title)}"
            >

            <div class="product-body">

              <div class="product-title">
                ${esc(p.title)}
              </div>

              <div class="price">
                ${p.price}
              </div>

              <button
                class="btn small"
                data-open="${p.asin}"
              >
                Apskatīt
              </button>

            </div>

          </article>

        `
      ).join('')}

    </div>
  `;
}

function detail(a){

  let p=state.detail;

  let s=p.sel||[0,1,2];

  a.innerHTML=`

    <button
      class="back"
      data-a="products"
    >
      ‹ Atpakaļ uz produktiem
    </button>

    <section class="card">

      <h1>
        ${esc(p.title)}
      </h1>

      <div class="price">
        ${p.price}
      </div>

      <p class="meta">
        Amazon produkta bildes:
        ${p.images.length}.
        Izvēlies 3 atšķirīgas bildes
        dažādiem Pin.
      </p>

      <div class="detail-images">

        ${p.images.map(
          (im,i)=>`

            <button
              class="image-option ${
                s.includes(i)
                ? 'selected'
                : ''
              }"
              data-img="${i}"
            >

              <img
                src="${im}"
                alt="Amazon attēls ${i+1}"
              >

              ${
                s.includes(i)
                ? '<span class="check">✓</span>'
                : ''
              }

            </button>

          `
        ).join('')}

      </div>

      <div class="notice">

        Izvēlies tieši 3 dažādus attēlus.
        Ja ir 4 bildes, vari jebkuru no
        3 izvēlētajām nomainīt ar ceturto.

      </div>

      <button
        class="btn"
        style="width:100%"
        data-a="create"
      >
        Izveidot 3 atšķirīgus Pin
      </button>

    </section>
  `;

  bind();
}

function makePin(p,type,img,n){

  let titles=[
    `Easy ${p.category} outfit ideas for everyday style`,
    `Chic ${p.category} outfit inspiration for a polished wardrobe`,
    `A versatile ${p.category} piece to wear this season`
  ];

  let descriptions=[
    `A polished everyday look featuring this versatile ${p.category}. Save this outfit idea for your next wardrobe refresh. Paid link. #ad`,
    `Simple, feminine styling inspiration for a modern wardrobe. Save this look for outfit ideas. Paid link. #ad`,
    `An easy-to-style fashion find for an elevated everyday wardrobe. Discover the
