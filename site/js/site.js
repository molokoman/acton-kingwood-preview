(function(){
  var t = document.querySelector('.nav-toggle');
  var n = document.querySelector('.primary');
  if (t && n) t.addEventListener('click', function(){ n.classList.toggle('open'); });

  document.querySelectorAll('.carousel').forEach(function(c){
    var track = c.querySelector('.carousel-track');
    var slides = track ? track.children : [];
    if (!slides.length) return;
    var i = 0;
    function go(d){
      i = (i + d + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      c.querySelectorAll('.dots i').forEach(function(dot, idx){
        dot.classList.toggle('on', idx === i);
      });
    }
    var prev = c.querySelector('.prev');
    var next = c.querySelector('.next');
    if (prev) prev.addEventListener('click', function(){ go(-1); });
    if (next) next.addEventListener('click', function(){ go(1); });
    var dots = c.querySelector('.dots');
    if (dots && !dots.children.length){
      for (var k=0;k<slides.length;k++){
        var el = document.createElement('i');
        if (k===0) el.className='on';
        dots.appendChild(el);
      }
    }
  });

  var form = document.getElementById('apply-form');
  if (form){
    var steps = form.querySelectorAll('.form-step');
    var step = 0;
    function show(){
      steps.forEach(function(s, idx){ s.classList.toggle('hidden', idx !== step); });
    }
    form.addEventListener('click', function(e){
      if (e.target.matches('[data-next]')){
        e.preventDefault();
        if (step < steps.length-1){ step++; show(); }
      }
      if (e.target.matches('[data-back]')){
        e.preventDefault();
        if (step > 0){ step--; show(); }
      }
    });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var last = form.querySelector('.form-done');
      steps.forEach(function(s){ s.classList.add('hidden'); });
      if (last) last.classList.remove('hidden');
    });
    var extra = form.querySelector('[name="more_children"]');
    if (extra){
      extra.addEventListener('change', function(){
        var box = form.querySelector('.child2-fields');
        if (box) box.classList.toggle('hidden', extra.value !== 'Yes');
      });
    }
  }
})();
