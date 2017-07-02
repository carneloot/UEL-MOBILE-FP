window.onload = function () {
  $.getJSON(`./assets/js/minibanco.json?v=${Math.floor(Math.random() * 1000 + 1)}`, function (json) {
    var divCentros = document.querySelector(".centros");

    var centros = divCentros.innerHTML;

    for (let local in json.locais) {
      centros += `<a class="centro-unit" href="./mapa/?local=${local}"><span>${local.replace(/-/g, ' ').toUpperCase()}</span></a>`;
    }

    divCentros.innerHTML = centros;

  });
}