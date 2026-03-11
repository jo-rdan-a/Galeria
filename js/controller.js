// controller.js — Recebe eventos da View, consulta o Model e manda a View atualizar

const Controller = (() => {

  function init() {
    View.bindFilter(cat => {
      Model.setCategory(cat);
      refresh();
    });

    View.bindSearch(term => {
      Model.setSearch(term);
      refresh();
    });

    View.bindPage(p => {
      Model.setPage(p);
      refresh();
    });

    View.bindAdd(data => {
      Model.addImage(data);
      refresh();
    });

    View.bindRemove(id => {
      Model.removeImage(id);
      refresh();
    });

    refresh();
  }

  function refresh() {
    const state      = Model.getState();
    const page       = Model.getPage();
    const current    = Model.getCurrentPage();
    const totalPages = Model.getTotalPages();
    const total      = Model.getTotalCount();

    View.renderFilters(Model.getCategories(), state.category);
    View.renderGallery(page);
    View.renderPagination(current, totalPages);
    View.renderStatus(total, current, totalPages);
  }

  return { init };
})();
