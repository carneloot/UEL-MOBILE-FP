let btnMenu = document.getElementById('btnMenu');
btnMenu.addEventListener('click', function () {
  let menu = document.querySelector('.menu');
  btnMenu.classList.toggle('open');
  menu.classList.toggle('open');
  let body = document.getElementsByTagName("body")[0];

  if (btnMenu.classList.contains('open'))
    body.style.overflowY = "hidden"; // Bloqueia o scroll
  else
    body.style.overflowY = "scroll"; // Ativa o scroll
});