(function(){
  var t = document.querySelector('.nav-toggle');
  var n = document.querySelector('.primary');
  if (t && n){
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
    if (!n.id) n.id = 'primary-nav';
    t.setAttribute('aria-controls', n.id);
    t.setAttribute('aria-expanded', 'false');
    t.setAttribute('aria-label', 'Menu');

    var scrollY = 0;
    function isOpen(){ return n.classList.contains('open'); }
    function setOpen(open){
      n.classList.toggle('open', open);
      t.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
      document.documentElement.classList.toggle('nav-open', open);
      backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      t.setAttribute('aria-label', open ? 'Close' : 'Menu');
      var header = document.querySelector('.site-header');
      if (header){
        document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
      }
      if (open){
        scrollY = window.scrollY || window.pageYOffset;
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + scrollY + 'px';
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      }
    }
    t.addEventListener('click', function(){ setOpen(!isOpen()); });
    backdrop.addEventListener('click', function(){ setOpen(false); });
    document.addEventListener('keydown', function(e){
      if ((e.key === 'Escape' || e.key === 'Esc') && isOpen()) setOpen(false);
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth > 980 && isOpen()) setOpen(false);
    });
    n.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if (!a){ setOpen(false); return; }
      if (a.getAttribute('href') === '#') e.preventDefault();
    });
  }

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
