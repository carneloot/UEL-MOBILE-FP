window.onload = function () {
  $.getJSON(`./assets/js/minibanco.json?v=${Math.floor(Math.random() * 1000 + 1)}`, function (json) {
    var divLocais = document.querySelector(".locais");

    var locais = "";

    for (let cat in json) {
      locais += `<div class="cat-unit">`;
      locais += `<h2>${cat.replace(/-/g,' ')}</h2>`;
      for (let local in json[cat]) {
        locais += `<a class="local-unit" href="./mapa/?local=${local}"><span>${local.replace(/-/g, ' ').toUpperCase()}</span></a>`;
      }
      locais += `</div>`;
    }
    divLocais.innerHTML = locais;

  });
}