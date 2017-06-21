var map, uel, dc, ctu, directionsDisplay, directionsService;

function getUrlParams() {
  var params = {},
    pageURL = window.location.search,
    stringParams;

  pageURL = pageURL.substring(1, pageURL.length);

  stringParams = pageURL.split(/&/);

  for (let i = 0; i < stringParams.length; i++) {
    let param = stringParams[i],
      key,
      val;
    param = param.split(/=/);

    key = param[0];
    val = param[1];

    params[key] = val;
  }

  return params;
}

function initMap() {
  uel = {
    lat: -23.324607,
    lng: -51.203205
  }

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  map = new google.maps.Map(document.getElementById('map'), {
    center: uel,
    zoom: 18,
    disableDefaultUI: true,
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  });

  directionsDisplay.setMap(map);
}

window.onload = function () {
  $.getJSON("./../assets/js/minibanco.json", function (json) {
    var params = getUrlParams(),
      local;
    var wtgMenu = document.getElementById("wtgMenu");
    wtgMenu.innerHTML = "";

    // Preencher o menu de acordo com o JSON
    if (params.local != null) {
      for (let local in json.locais) {
        if (local != params.local) {
          let link = "./../mapa/?local=" + params.local + "&dest=" + local;
          wtgMenu.innerHTML += `<li class="wtg-link"><a href="${link}">${local.toUpperCase().replace(/-/g, ' ')}</a></li>`;
        }
      }
    }

    // Se houver um local
    if (params.local == null) {
      window.location.href = "./../";
    } else {
      let localInfo = json.locais[params.local];

      local = {
        lat: localInfo.lat,
        lng: localInfo.long,
      };

      // Preenche os dados com as informações do local atual
      let divTitulo = document.getElementById("titulo");
      let divDescricao = document.getElementById("descricao");
      let divCursos = document.getElementById("cursos");
      let divImagens = document.getElementById("imagens");

      // Caso o destino seja nulo ou local = destino
      if (params.dest == null || params.dest == params.local) {
        if (params.dest == params.local)
          document.getElementById('aviso').innerHTML = "Você ja está no " + params.local.toUpperCase() + "!!";

        map.setCenter(local);

        var marker = new google.maps.Marker({
          position: local,
          map: map
        });

      } else {
        localInfo = json.locais[params.dest];
        var dest = {
          lat: json.locais[params.dest].lat,
          lng: json.locais[params.dest].long,
        };

        directionsService.route({
          origin: local,
          destination: dest,
          travelMode: google.maps.TravelMode['WALKING']
        }, function (response, status) {
          if (status === 'OK')
            directionsDisplay.setDirections(response);
          else
            window.alert('Directions request failed due to ' + status);
        });
      }

      divTitulo.innerHTML = localInfo.titulo;
      divDescricao.innerHTML = localInfo.descricao;

      let cursos = "";
      if (localInfo.cursos != null) {
        cursos += "<h3>Cursos oferecidos:</h3>";
        cursos += "<ul>";
        for (let key in localInfo.cursos)
          cursos += `<li>${localInfo.cursos[key]}</li>`;
        cursos += "</ul>";
      }

      divCursos.innerHTML = cursos;

      divImagens.innerHTML = "";
      for (let key in localInfo.imagens) {
        let imagem = localInfo.imagens[key];
        divImagens.innerHTML += `<img src="./../assets/images/${imagem}" alt="${imagem.split(/\./)[0]}">`;
      }

    }
  });
}