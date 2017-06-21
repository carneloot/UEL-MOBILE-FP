window.onload = function () {
  $.getJSON("./assets/js/minibanco.json", function (json) {
    var divCentros = document.querySelector(".centros");

    var centros = "";

    for (let local in json.locais) {
      centros += `<a class="centro-unit" href="./mapa/?local=${local}"><span>${local.replace(/-/g, ' ').toUpperCase()}</span></a>`;
    }

    divCentros.innerHTML = centros;

  });
}