// view.js — Renderiza a interface, modal de adição e emite eventos para o Controller

const View = (() => {
  const grid        = document.getElementById('gallery-grid');
  const filterWrap  = document.getElementById('filter-buttons');
  const pagination  = document.getElementById('pagination');
  const status      = document.getElementById('gallery-status');
  const searchInput = document.getElementById('search-input');

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbTitle  = document.getElementById('lb-title');
  const lbTag    = document.getElementById('lb-tag');
  const lbClose  = document.getElementById('lb-close');

  // Modal de adição
  const modal         = document.getElementById('modal-add');
  const modalClose    = document.getElementById('modal-close');
  const btnOpenModal  = document.getElementById('btn-add');
  const formAdd       = document.getElementById('form-add');
  const inputFile     = document.getElementById('input-file');
  const inputPreview  = document.getElementById('input-preview');
  const inputTitle    = document.getElementById('input-title');
  const inputCategory = document.getElementById('input-category');
  const inputDesc     = document.getElementById('input-desc');
  const inputCatNew   = document.getElementById('input-cat-new');
  const catNewWrap    = document.getElementById('cat-new-wrap');

  // Callbacks definidos pelo Controller
  let onFilter    = () => {};
  let onSearch    = () => {};
  let onPage      = () => {};
  let onAdd       = () => {};
  let onRemove    = () => {};

  function renderFilters(categories, active) {
    filterWrap.innerHTML = categories.map(cat =>
      `<button class="filter-btn ${cat === active ? 'active' : ''}" data-cat="${cat}">
        ${cat.charAt(0).toUpperCase() + cat.slice(1)}
      </button>`
    ).join('');
    filterWrap.querySelectorAll('.filter-btn').forEach(btn =>
      btn.addEventListener('click', () => onFilter(btn.dataset.cat))
    );

    // Atualiza também o <select> de categorias do modal
    _populateCategorySelect(categories.filter(c => c !== 'todos'));
  }

  function _populateCategorySelect(categories) {
    const current = inputCategory.value;
    inputCategory.innerHTML =
      categories.map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('') +
      `<option value="__nova__">+ Nova categoria…</option>`;
    if (current && [...inputCategory.options].some(o => o.value === current)) {
      inputCategory.value = current;
    }
  }

  function renderGallery(images) {
    const existing = grid.querySelectorAll('.img-card');
    existing.forEach(c => c.classList.add('card-exit'));

    setTimeout(() => {
      grid.innerHTML = '';

      if (!images.length) {
        grid.innerHTML = '<div class="empty-state"><p>Nenhuma imagem encontrada.</p></div>';
        return;
      }

      images.forEach((img, idx) => {
        const card = document.createElement('div');
        card.className = 'img-card';
        card.style.animationDelay = `${idx * 0.05 + 0.05}s`;
        card.dataset.id = img.id;
        card.innerHTML = `
          <div class="card-img-wrap">
            <img src="${img.src}" alt="${img.title}" loading="lazy" />
            <button class="card-delete" data-id="${img.id}" title="Remover">✕</button>
          </div>
          <div class="card-info">
            <div class="card-tag">${img.category}</div>
            <div class="card-title">${img.title}</div>
            <div class="card-desc">${img.desc}</div>
          </div>`;

        card.querySelector('img').addEventListener('click', () => openLightbox(img));
        card.querySelector('.card-delete').addEventListener('click', e => {
          e.stopPropagation();
          onRemove(img.id);
        });

        grid.appendChild(card);
      });
    }, existing.length ? 200 : 0);
  }

  function renderPagination(current, total) {
    pagination.innerHTML = '';
    if (total <= 1) return;

    const prev = document.createElement('button');
    prev.className = 'page-btn'; prev.textContent = '← Anterior';
    prev.disabled = current === 1;
    prev.addEventListener('click', () => onPage(current - 1));
    pagination.appendChild(prev);

    for (let i = 1; i <= total; i++) {
      const btn = document.createElement('button');
      btn.className = `page-btn ${i === current ? 'active' : ''}`;
      btn.textContent = i;
      btn.addEventListener('click', () => onPage(i));
      pagination.appendChild(btn);
    }

    const next = document.createElement('button');
    next.className = 'page-btn'; next.textContent = 'Próximo →';
    next.disabled = current === total;
    next.addEventListener('click', () => onPage(current + 1));
    pagination.appendChild(next);
  }

  function renderStatus(total, page, totalPages) {
    status.innerHTML =
      `<strong>${total}</strong> imagem${total !== 1 ? 'ns' : ''} encontrada${total !== 1 ? 's' : ''}
       · Página <strong>${page}</strong> de <strong>${totalPages}</strong>`;
  }

  function openLightbox(img) {
    lbImg.src = img.src; lbImg.alt = img.title;
    lbTitle.textContent = img.title;
    lbTag.textContent   = img.category;
    lightbox.classList.add('open');
  }

  lbClose.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

  btnOpenModal.addEventListener('click', () => modal.classList.add('open'));
  modalClose.addEventListener('click', () => _closeModal());
  modal.addEventListener('click', e => { if (e.target === modal) _closeModal(); });

  // Mostra/oculta campo "nova categoria"
  inputCategory.addEventListener('change', () => {
    catNewWrap.style.display = inputCategory.value === '__nova__' ? 'block' : 'none';
  });

  // Preview da imagem selecionada
  inputFile.addEventListener('change', () => {
    const file = inputFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      inputPreview.src = e.target.result;
      inputPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  // Submit do formulário
  formAdd.addEventListener('submit', e => {
    e.preventDefault();

    const file = inputFile.files[0];
    if (!file) { alert('Selecione uma imagem.'); return; }

    const title = inputTitle.value.trim();
    if (!title) { alert('Informe um título.'); return; }

    let category = inputCategory.value;
    if (category === '__nova__') {
      category = inputCatNew.value.trim();
      if (!category) { alert('Informe o nome da nova categoria.'); return; }
    }

    const desc = inputDesc.value.trim();

    const reader = new FileReader();
    reader.onload = ev => {
      onAdd({ src: ev.target.result, title, category, desc });
      _closeModal();
    };
    reader.readAsDataURL(file);
  });

  function _closeModal() {
    modal.classList.remove('open');
    formAdd.reset();
    inputPreview.style.display = 'none';
    catNewWrap.style.display   = 'none';
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('open');
      _closeModal();
    }
  });

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => onSearch(searchInput.value), 280);
  });

  function bindFilter(fn)  { onFilter = fn; }
  function bindSearch(fn)  { onSearch = fn; }
  function bindPage(fn)    { onPage   = fn; }
  function bindAdd(fn)     { onAdd    = fn; }
  function bindRemove(fn)  { onRemove = fn; }

  return {
    renderFilters,
    renderGallery,
    renderPagination,
    renderStatus,
    bindFilter,
    bindSearch,
    bindPage,
    bindAdd,
    bindRemove,
  };
})();
