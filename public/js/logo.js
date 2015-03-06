function createLogo(s, scale) {
  var s = s;
  setTimeout(function() {
    var circle1 = createCircle(s, 200*scale, 200*scale, 60*scale, "#bada55", 20*scale);
    circle1.animate({r: 35}, 1200, mina.elastic);
  }, 0);

  setTimeout(function() {
    var circle2 = createCircle(s, 400*scale, 200*scale, 60*scale, "#e68d53", 20*scale);
    circle2.animate({r: 35}, 1000, mina.elastic);
  }, 200);
  
  setTimeout(function() {
    var circle3 = createCircle(s, 300*scale, 373*scale, 60*scale, "#4775ff", 20*scale);
    circle3.animate({r: 35}, 800, mina.elastic);
  }, 400);
  
  setTimeout(function() {
    var line1 = createLine(s, 235*scale, 200*scale, 235*scale, 200*scale, 2*scale);
    var line2 = createLine(s, 218*scale, 230*scale, 218*scale, 230*scale, 2*scale);
    var line3 = createLine(s, 382*scale, 230*scale, 382*scale, 230*scale, 2*scale);
    line1.animate({'x2': 365*scale}, 200*scale, mina.easein);
    line2.animate({'x2': 282*scale}, 200*scale, mina.easein);
    line2.animate({'y2': 343*scale}, 200*scale, mina.easein);
    line3.animate({'x2': 318*scale}, 200*scale, mina.easein);
    line3.animate({'y2': 343*scale}, 200*scale, mina.easein);
  }, 600);
};

function LogoObject(s, scale) {
  var s = s;
  this.circle1 = createCircle(s, (200-120)*scale, (200-120)*scale, 35*scale, "#bada55", 20*scale);
  this.circle2 = createCircle(s, (400-120)*scale, (200-120)*scale, 35*scale, "#e68d53", 20*scale);
  this.circle3 = createCircle(s, (300-120)*scale, (373-120)*scale, 35*scale, "#4775ff", 20*scale);
  this.line1 = createLine(s, (235-120)*scale, (200-120)*scale, (235-120)*scale, (200-120)*scale, 2*scale);
  this.line2 = createLine(s, (218-120)*scale, (230-120)*scale, (218-120)*scale, (230-120)*scale, 2*scale);
  this.line3 = createLine(s, (382-120)*scale, (230-120)*scale, (382-120)*scale, (230-120)*scale, 2*scale);
  this.line1 = this.line1.animate({'x2': (365-120)*scale}, 200*scale, mina.easein);
  this.line2 = this.line2.animate({'x2': (282-120)*scale}, 200*scale, mina.easein);
  this.line2 = this.line2.animate({'y2': (343-120)*scale}, 200*scale, mina.easein);
  this.line3 = this.line3.animate({'x2': (318-120)*scale}, 200*scale, mina.easein);
  this.line3 = this.line3.animate({'y2': (343-120)*scale}, 200*scale, mina.easein);

  this.animate = function() {
    s.clear();
    
    setTimeout(function() {
      var circle1 = createCircle(s, (200-120)*scale, (200-120)*scale, 60*scale, "#bada55", 20*scale);
      circle1.animate({r: 35*scale}, 1200, mina.elastic);
    }, 0);

    setTimeout(function() {
      var circle2 = createCircle(s, (400-120)*scale, (200-120)*scale, 60*scale, "#e68d53", 20*scale);
      circle2.animate({r: 35*scale}, 1000, mina.elastic);
    }, 200);
    
    setTimeout(function() {
      var circle3 = createCircle(s, (300-120)*scale, (373-120)*scale, 60*scale, "#4775ff", 20*scale);
      circle3.animate({r: 35*scale}, 800, mina.elastic);
    }, 400);
    
    setTimeout(function() {
      var line1 = createLine(s, (235-120)*scale, (200-120)*scale, (235-120)*scale, (200-120)*scale, 2*scale);
      var line2 = createLine(s, (218-120)*scale, (230-120)*scale, (218-120)*scale, (230-120)*scale, 2*scale);
      var line3 = createLine(s, (382-120)*scale, (230-120)*scale, (382-120)*scale, (230-120)*scale, 2*scale);
      line1.animate({'x2': (365-120)*scale}, 200*scale, mina.easein);
      line2.animate({'x2': (282-120)*scale}, 200*scale, mina.easein);
      line2.animate({'y2': (343-120)*scale}, 200*scale, mina.easein);
      line3.animate({'x2': (318-120)*scale}, 200*scale, mina.easein);
      line3.animate({'y2': (343-120)*scale}, 200*scale, mina.easein);
    }, 600);
  };
}

function createCircle(s, x, y, r, color, thickness) {
  var s = s;
  var circle = s.circle(x, y, r);
  var c = circle.use();
  var p = s.path("M110,95,95,110M115,100,100,115").attr({
        fill: "none",
        stroke: color,
        strokeWidth: 5
    });
  var ptrn = p.pattern(100, 100, 10, 10);
  c.attr({
    fill: ptrn
  });
  var c2 = circle.use();
  c2.attr({
    fill: "none",
    stroke: "#000",
    strokeWidth: thickness/5
  });
  var ring = circle.use();
  ring.attr({
    fill: "none",
    stroke: "#000",
    strokeWidth: thickness
  });
  circle.toDefs();
  var mask = s.mask();
  mask.add(s.rect(0, 0, "100%", "100%").attr({fill: "#fff"}));
  mask.add(ring);
  c.attr({
    mask: mask
  });
  return circle;
};

function createLine(s, x1, y1, x2, y2, thickness) {
  var s = s;
  var line = s.line(x1, y1, x2, y2).attr({
    fill: "none",
    stroke: "#000",
    strokeWidth: thickness
  });
  return line;
};