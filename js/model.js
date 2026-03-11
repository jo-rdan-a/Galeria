// model.js — Armazena os dados e aplica a lógica de filtragem, paginação e adição de imagens

const Model = (() => {
  let images = [
    { id:1,  src:'https://picsum.photos/seed/nat1/600/440', title:'Floresta Tropical',     category:'natureza',   desc:'Exuberante mata atlântica em plena estação chuvosa.' },
    { id:2,  src:'https://picsum.photos/seed/nat2/600/440', title:'Vale das Pedras',       category:'natureza',   desc:'Formações rochosas esculpidas por milênios.' },
    { id:3,  src:'https://picsum.photos/seed/cid1/600/440', title:'Skyline Noturno',       category:'cidade',     desc:'Arranha-céus iluminados cortam a noite urbana.' },
    { id:4,  src:'https://picsum.photos/seed/cid2/600/440', title:'Rua dos Grafites',      category:'cidade',     desc:'Arte de rua transforma o cotidiano cinza.' },
    { id:5,  src:'https://picsum.photos/seed/ani1/600/440', title:'Onça Pintada',          category:'animais',    desc:'Rainha do Pantanal em plena savana.' },
    { id:6,  src:'https://picsum.photos/seed/ani2/600/440', title:'Arara Azul',            category:'animais',    desc:'Plumagem vibrante nos céus do Brasil Central.' },
    { id:7,  src:'https://picsum.photos/seed/pes1/600/440', title:'Retrato Nordestino',    category:'pessoas',    desc:'Olhar profundo carregado de história e resistência.' },
    { id:8,  src:'https://picsum.photos/seed/pes2/600/440', title:'Artesã da Renda',       category:'pessoas',    desc:'Mãos habilidosas preservam cultura centenária.' },
    { id:9,  src:'https://picsum.photos/seed/tec1/600/440', title:'Circuito Quântico',     category:'tecnologia', desc:'Microeletrônica além da escala humana.' },
    { id:10, src:'https://picsum.photos/seed/tec2/600/440', title:'Data Center',           category:'tecnologia', desc:'Corredores gelados de servidores em atividade.' },
  ];

  let nextId = 11;

  const PER_PAGE = 4;
  let _category = 'todos';
  let _search   = '';
  let _page     = 1;

  // Retorna categorias únicas presentes nas imagens + "todos"
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

  // Adiciona uma nova imagem
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

  // Remove imagem pelo id
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
