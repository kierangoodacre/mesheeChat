window.onload = function() {
  var s = Snap("#logo");
  createLogo(s, 1);
  setTimeout(function() {
    var text = s.text(300, 750, "MESHEE").attr({
      fontSize: '40px',
      'font-family': 'HelveticaNeue-Light',
      textAnchor: "middle"
    });
    text.animate({'y': 490}, 200, mina.easein);
  }, 600);
}