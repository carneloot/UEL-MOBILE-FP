function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
    e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
  var keys = {
    37: 1,
    38: 1,
    39: 1,
    40: 1
  };
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

function disableScroll() {
  if (window.addEventListener) // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove = preventDefault; // mobile
  document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
  if (window.removeEventListener)
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
}

let btnMenu = document.getElementById('btnMenu');
btnMenu.addEventListener('click', function () {
  let menu = document.querySelector('.menu');
  btnMenu.classList.toggle('open');
  menu.classList.toggle('open');
  let body = document.getElementsByTagName("body")[0];
  console.log(body);

  if (btnMenu.classList.contains('open'))
    body.style.overflowY = "hidden";
  else
    body.style.overflowY = "scroll";
});