var map;

function getUrlParams() {
  var e, o = {},
    t = window.location.search;
  e = (t = t.substring(1, t.length)).split(/&/);
  for (let t = 0; t < e.length; t++) {
    let a, n, l = e[t];
    a = (l = l.split(/=/))[0], n = l[1], o[a] = n
  }
  return o
}

function initMap() {
  let uel = new google.maps.LatLng(-23.324607, -51.203205);
  map = new GoogleMap(document.getElementById("map"), uel, 18);
}

function GoogleMap(element, center, zoom) {
  this.map = new google.maps.Map(element, {
    center: center instanceof google.maps.LatLng ? center : new google.maps.LatLng(center.lat, center.lng),
    zoom: zoom,
    disableDefaultUI: true,
    draggable: true,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: false
  });

  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(this.map);
  this.marcadores = [];
}

GoogleMap.prototype.setCenter = function (pos) {
  if (pos instanceof google.maps.LatLng)
    this.map.setCenter(pos);
  else
    this.map.setCenter(new google.maps.LatLng(pos.lat, pos.lng))
}

GoogleMap.prototype.addMarker = function (pos, title = "", info = "") {
  let marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    position: pos instanceof google.maps.LatLng ? pos : new google.maps.LatLng(pos.lat, pos.lng),
    map: this.map,
    title: title
  });

  if (info != "") {
    marker.infoWindow = new google.maps.InfoWindow({
      content: info
    });
    marker.infoWindow.isOpen = false;
    marker.addListener('click', () => {
      marker.infoWindow.isOpen = !marker.infoWindow.isOpen;
      if (marker.infoWindow.isOpen)
        marker.infoWindow.open(this.map, marker);
      else
        marker.infoWindow.close();
    });
  }
  this.marcadores.push(marker);
}

GoogleMap.prototype.removeMarker = function (index) {
  if (this.marcadores.length > index) {
    this.marcadores[index].setMap(null);
    this.marcadores.splice(index, 1);
  }
}

GoogleMap.prototype.setRoute = function (from, to, travelMode) {
  this.directionsService.route({
    origin: (from instanceof google.maps.LatLng) ? from : new google.maps.LatLng(from.lat, from.lng),
    destination: (to instanceof google.maps.LatLng) ? to : new google.maps.LatLng(to.lat, to.lng),
    travelMode: google.maps.TravelMode[travelMode]
  }, (response, status) => {
    if (status === "OK")
      this.directionsDisplay.setDirections(response);
    else
      window.alert("Directions request failed due to " + status);
  });
}
GoogleMap.prototype.setZoom = function (z) {
  this.map.setZoom(z)
}
Object.defineProperty(GoogleMap, "FOOT", {
  value: "WALKING"
});
Object.defineProperty(GoogleMap, "CAR", {
  value: "DRIVING"
});
Object.defineProperty(GoogleMap, "DEFAULT_ZOOM", {
  value: 18
});

window.onload = function () {
  $.getJSON(`./../assets/js/minibanco.json?v=${Math.floor(1000*Math.random()+1)}`, function (json) {
    var local, params = getUrlParams(),
      wtgMenu = document.getElementById("wtgMenu");

    // Preenche o menu
    if (params.local != null) {
      for (let local in json.locais) {
        if (local != params.local) {
          let link = "./../mapa/?local=" + params.local + "&dest=" + local;
          wtgMenu.innerHTML += `<li class="wtg-link"><a href="${link}">${local.toUpperCase().replace(/-/g," ")}</a></li>`
        }
      }
    }

    // Se nao tiver local
    if (params.local == null)
      document.location.href = "./../";
    else {
      let localInfo = json.locais[params.local];
      local = new google.maps.LatLng(localInfo.lat, localInfo.lng);

      let divTitulo = document.getElementById("titulo"),
        divDescricao = document.getElementById("descricao"),
        divCursos = document.getElementById("cursos"),
        divImagens = document.getElementById("imagens"),
        btnSalas = document.querySelector(".btn-salas");

      if (params.dest == null || params.dest == params.local) {
        map.addMarker(local, params.local.toUpperCase().replace(/-/g, ' '), localInfo.titulo);
        map.setCenter(local);

        if (localInfo.salas == null)
          btnSalas.style.display = 'none';
        else {
          // Ativa o botao
          btnSalas.style.opacity = '1';
          let ativo = false;

          btnSalas.addEventListener('click', () => {
            // Altera o estado do botao
            btnSalas.classList.toggle('ativo');
            ativo = !ativo;
            if (ativo) {
              map.removeMarker(0);
              map.setCenter(localInfo.salas.center);
              map.setZoom(localInfo.salas.zoom);
              for (sala in localInfo.salas)
                if (/^\d+$/.test(sala))
                  map.addMarker(localInfo.salas[sala].pos, localInfo.salas[sala].info, localInfo.salas[sala].info);
            } else {
              for (let i = map.marcadores.length - 1; i >= 0; i--)
                map.removeMarker(i);
              map.setCenter(local);
              map.setZoom(GoogleMap.DEFAULT_ZOOM);
              map.addMarker(local, params.local.toUpperCase().replace(/-/g, ' '), localInfo.titulo);
            }
          });
        }
      } else {
        localInfo = json.locais[params.dest];
        let dest = new google.maps.LatLng(localInfo.lat, localInfo.lng);
        btnSalas.style.display = 'none';

        map.setRoute(local, dest, GoogleMap.FOOT);
      }

      /* INICIO PREENCIMENTO DA PAGINA */
      divTitulo.innerHTML = localInfo.titulo;
      divDescricao.innerHTML = localInfo.descricao;
      let cursos = "";
      if (localInfo.cursos != null) {
        cursos += "<h3>Cursos oferecidos:</h3>";
        cursos += "<ul>";
        for (let curso in localInfo.cursos)
          cursos += `<li>${localInfo.cursos[curso]}</li>`;
        cursos += "</ul>";
      }
      divCursos.innerHTML = cursos;

      divImagens.innerHTML = "";
      for (let img in localInfo.imagens) {
        let arq = localInfo.imagens[img];
        divImagens.innerHTML += `<img src="./../assets/images/${arq}" alt="${arq.split(/\./)[0]}">`
      }
      /* FIM PREENCIMENTO DA PAGINA */
    }
  });
};