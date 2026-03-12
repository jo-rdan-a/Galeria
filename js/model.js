// model.js — Armazena os dados e aplica a lógica de filtragem, paginação e adição de imagens

const Model = (() => {
  let images = [
    { id: 1, src: 'img/1.jpg', title: 'Floresta', category: 'natureza', desc: 'Paisagem verde da mata.' },
    { id: 2, src: 'img/2.jpg', title: 'Skyline', category: 'cidade', desc: 'Prédios ao entardecer.' },
    { id: 3, src: 'img/3.jpg', title: 'Animal', category: 'animais', desc: 'Retrato na natureza.' },
    { id: 4, src: 'img/4.jpg', title: 'Retrato', category: 'pessoas', desc: 'Foto de pessoa.' },
    { id: 5, src: 'img/5.jpg', title: 'Tech', category: 'tecnologia', desc: 'Elementos tecnológicos.' },
    { id: 6, src: 'img/6.jpg', title: 'Paisagem', category: 'paisagem', desc: 'Céu e horizonte.' },
  ];
  let nextId = 7;

  const PER_PAGE = 4;
  let _category = 'todos';
  let _search   = '';
  let _page     = 1;

  function getCategories() {
    return ['todos', ...[...new Set(images.map(i => i.category))]];
  }

  function getFiltered() {
    return images.filter(img => {
      const matchCat    = _category === 'todos' || img.category === _category;
      const term        = _search.toLowerCase().trim();
      const matchSearch = !term
        || img.title.toLowerCase().includes(term)
        || img.desc.toLowerCase().includes(term)
        || img.category.toLowerCase().includes(term);
      return matchCat && matchSearch;
    });
  }

  function getPage() {
    const filtered = getFiltered();
    const start    = (_page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }

  function addImage({ src, title, category, desc }) {
    images.push({
      id:       nextId++,
      src,
      title:    title.trim(),
      category: category.trim().toLowerCase(),
      desc:     desc ? desc.trim() : '',
    });
    _page = 1;
  }

  function removeImage(id) {
    images = images.filter(img => img.id !== id);
    const total = getTotalPages();
    if (_page > total) _page = total;
  }

  function getTotalPages()  { return Math.max(1, Math.ceil(getFiltered().length / PER_PAGE)); }
  function getTotalCount()  { return getFiltered().length; }
  function getCurrentPage() { return _page; }
  function getState()       { return { category: _category, search: _search, page: _page }; }

  function setCategory(cat) { _category = cat; _page = 1; }
  function setSearch(term)  { _search   = term; _page = 1; }
  function setPage(p)       { _page = p; }

  return {
    getCategories,
    getPage,
    getTotalPages,
    getTotalCount,
    getCurrentPage,
    getState,
    setCategory,
    setSearch,
    setPage,
    addImage,
    removeImage,
  };
})();
