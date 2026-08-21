(function(){
  var cta = document.querySelector('.cta-circle');
  if (cta) cta.innerHTML = 'Start Your<br>Journey';

  function pageFile(){
    var p = (location.pathname || '').split('/').pop() || '';
    return p.toLowerCase();
  }
  function isHomePage(){
    var p = pageFile();
    return p === '' || p === 'index.html' || p === 'index.htm';
  }

  var t = document.querySelector('.nav-toggle');
  var n = document.querySelector('.primary');
  if (t && n){
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'nav-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.appendChild(document.createTextNode('\u00d7'));
    document.body.appendChild(closeBtn);

    if (!n.id) n.id = 'primary-nav';
    t.setAttribute('aria-controls', n.id);
    t.setAttribute('aria-expanded', 'false');
    t.setAttribute('aria-label', 'Menu');

    function labels(){
      return Array.prototype.map.call(n.children, function(li){
        var a = firstChildLink(li);
        return a ? (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase() : '';
      });
    }
    function firstChildLink(li){
      for (var i = 0; i < li.children.length; i++){
        if (li.children[i].tagName === 'A') return li.children[i];
      }
      return null;
    }
    function childDropdown(li){
      for (var i = 0; i < li.children.length; i++){
        if (li.children[i].classList && li.children[i].classList.contains('dropdown')) return li.children[i];
      }
      return null;
    }
    var have = labels();
    function addExtra(label, href, where, attrs){
      if (have.indexOf(label.toLowerCase()) !== -1) return;
      var li = document.createElement('li');
      li.className = 'nav-mobile-extra';
      var a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      if (attrs) Object.keys(attrs).forEach(function(k){ a.setAttribute(k, attrs[k]); });
      li.appendChild(a);
      if (where === 'start') n.insertBefore(li, n.firstChild);
      else n.appendChild(li);
      have = labels();
    }
    addExtra('Home', 'index.html', 'start');
    addExtra('Start Your Journey', 'apply.html', 'end');
    addExtra("Children's Business Fair", 'https://www.childrensbusinessfair.org/porter-texas', 'end', {target:'_blank', rel:'noopener'});

    Array.prototype.forEach.call(n.children, function(li){
      var a = firstChildLink(li);
      var label = a ? (a.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase() : '';
      if (label === 'enroll/tuition' && !childDropdown(li)){
        var dd = document.createElement('div');
        dd.className = 'dropdown nav-mobile-sub';
        var child = document.createElement('a');
        child.href = 'enrollment.html';
        child.textContent = 'Enrollment/Tuition';
        dd.appendChild(child);
        li.appendChild(dd);
      }
      if (label === 'home'){
        li.classList.add('nav-home');
        if (isHomePage()){ li.classList.add('is-current'); li.classList.add('current'); }
      }
      if (childDropdown(li)) li.classList.add('has-sub');
      li.classList.remove('open');
      li.classList.remove('active');
    });

    var scrollY = 0;
    var navHome = n.parentNode;
    var navNext = n.nextSibling;
    function isMobile(){ return window.innerWidth <= 980; }
    function isOpen(){ return n.classList.contains('open'); }
    function collapseSubs(){
      Array.prototype.forEach.call(n.children, function(li){
        li.classList.remove('open');
        li.classList.remove('active');
      });
    }
    function parkNav(open){
      if (open){
        document.body.appendChild(n);
      } else if (n.parentNode !== navHome){
        if (navNext && navNext.parentNode === navHome) navHome.insertBefore(n, navNext);
        else navHome.appendChild(n);
      }
    }
    function setOpen(open){
      n.classList.toggle('open', open);
      t.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
      document.documentElement.classList.toggle('nav-open', open);
      backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      t.setAttribute('aria-label', open ? 'Close' : 'Menu');
      collapseSubs();
      parkNav(open);
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
    closeBtn.addEventListener('click', function(){ setOpen(false); });
    backdrop.addEventListener('click', function(){ setOpen(false); });
    document.addEventListener('keydown', function(e){
      if ((e.key === 'Escape' || e.key === 'Esc') && isOpen()) setOpen(false);
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth > 980 && isOpen()) setOpen(false);
    });
    n.addEventListener('click', function(e){
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a || !n.contains(a)) return;
      var li = a.parentElement;
      var isTop = li && li.parentElement === n;
      if (isTop && li.classList.contains('has-sub') && isMobile()){
        e.preventDefault();
        e.stopPropagation();
        var next = !(li.classList.contains('open') || li.classList.contains('active'));
        li.classList.toggle('open', next);
        li.classList.toggle('active', next);
        return;
      }
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
