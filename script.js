const menu=document.querySelector('.menu');
const nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}));
const dialog=document.querySelector('#details');
document.querySelectorAll('[data-admissions],[data-program]').forEach(button=>button.addEventListener('click',()=>{const program=button.dataset.program;document.querySelector('#dialog-title').textContent=program?`Discover ${program} at Ceema.`:'Let’s explore admissions.';document.querySelector('#dialog-copy').textContent=program?`Interested in ${program}? Use this checklist to prepare for a conversation with Ceema Eagles Academy.`:'A little preparation can help you find the right next step for your child.';dialog.showModal()}));
dialog.querySelectorAll('.close,.close-action').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});

document.querySelector('.dialog-contact').addEventListener('click',()=>dialog.close());

// Set only after the school provides its receiving address.
const SCHOOL_EMAIL = 'support@adventle.tech';
const currentPage = location.pathname.split('/').pop() || 'index.html';
nav.querySelectorAll('a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.setAttribute('aria-current', 'page');
});

const carousel = document.querySelector('.school-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.gallery-slide')];
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  let slideIndex = 0;
  let paused = motionPreference.matches;
  let hovering = false;
  let inView = false;
  let timer;
  function scheduleSlide() {
    clearTimeout(timer);
    if (!paused && !hovering && inView && !document.hidden && !carousel.contains(document.activeElement)) timer = setTimeout(() => showSlide(slideIndex + 1), 5500);
  }
  function showSlide(nextIndex, manual = false) {
    slideIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide,index) => {
      const active = index === slideIndex;
      slide.classList.toggle('is-active',active);
      slide.setAttribute('aria-hidden',String(!active));
    });
    scheduleSlide();
  }
  carousel.addEventListener('mouseenter',()=>{hovering=true;scheduleSlide();});
  carousel.addEventListener('mouseleave',()=>{hovering=false;scheduleSlide();});
  carousel.addEventListener('focusin',()=>clearTimeout(timer));
  carousel.addEventListener('focusout',()=>setTimeout(scheduleSlide,0));
  document.addEventListener('visibilitychange',scheduleSlide);
  motionPreference.addEventListener('change',()=>{paused=motionPreference.matches;scheduleSlide();});
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;scheduleSlide();},{threshold:.15}).observe(carousel);
}
const enquiryForm = document.querySelector('#enquiry-form');
if (enquiryForm) {
  if (SCHOOL_EMAIL && document.querySelector('#delivery-note')) {
    document.querySelector('#delivery-note').textContent = 'Prepare your enquiry, then open it in your email app. Press Send in your email app to deliver it to the academy.';
  }
  enquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const fields = new FormData(enquiryForm);
    const message = `Hello Ceema Eagles Academy,\n\nEnquiry: ${fields.get('topic')}\n\n${String(fields.get('message')).trim()}\n\nName: ${String(fields.get('name')).trim()}\nEmail: ${String(fields.get('email')).trim()}${fields.get('phone') ? '\nPhone: ' + String(fields.get('phone')).trim() : ''}`;
    document.querySelector('#draft-text').value = message;
    const draft = document.querySelector('#message-draft');
    draft.hidden = false;
    document.querySelector('#message-status').textContent = 'Message prepared. It has not been sent.';
    if (SCHOOL_EMAIL) {
      let emailLink = document.querySelector('#email-message');
      if (!emailLink) {
        emailLink = document.createElement('a');
        emailLink.id = 'email-message';
        emailLink.className = 'button';
        emailLink.textContent = 'Open in email app';
        document.querySelector('.draft-actions').prepend(emailLink);
      }
      emailLink.href = `mailto:${SCHOOL_EMAIL}?subject=${encodeURIComponent('Ceema enquiry: ' + fields.get('topic'))}&body=${encodeURIComponent(message)}`;
    }
    draft.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(document.querySelector('#draft-text').value);
      document.querySelector('#message-status').textContent = 'Copied. Paste your message into an email to support@adventle.tech.';
    } catch {
      document.querySelector('#draft-text').focus();
      document.querySelector('#draft-text').select();
      document.querySelector('#message-status').textContent = 'Select and copy the message above, then paste it into your email app.';
    }
  });
}

if (document.body.matches('.home-page, .about-page')) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const word = document.querySelector('.word-current');
  const homeWords = [
    {text: 'soar.', color: '#9a671b'},
    {text: 'grow.', color: '#77501b'},
    {text: 'shine.', color: '#a76b12'},
    {text: 'thrive.', color: '#574020'},
    {text: 'excel.', color: '#8c5c16'}
  ];
  const aboutWords = [
    {text: 'Growing together.', color: '#9a671b'},
    {text: 'Learning with joy.', color: '#77501b'},
    {text: 'Room to flourish.', color: '#a76b12'},
    {text: 'Ready to soar.', color: '#574020'}
  ];
  const words = document.body.classList.contains('about-page') ? aboutWords : homeWords;
  let wordPaused = false;
  const wordToggle = document.querySelector('#headline-toggle');
  let wordIndex = 0;
  let wordTimer;
  let activeAnimation;
  let runningWord = false;
  const scheduleWord = () => {
    clearTimeout(wordTimer);
    if (!wordPaused && !reducedMotion.matches && !document.hidden) wordTimer = setTimeout(changeWord, 3200);
  };
  async function changeWord() {
    if (wordPaused || runningWord || reducedMotion.matches || document.hidden) return;
    runningWord = true;
    try {
      activeAnimation = word.animate([
        {opacity:1,transform:'translateY(0) rotateX(0deg)',filter:'blur(0)'},
        {opacity:0,transform:'translateY(-65%) rotateX(25deg)',filter:'blur(4px)'}
      ],{duration:260,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
      await activeAnimation.finished;
      wordIndex = (wordIndex + 1) % words.length;
      word.textContent = words[wordIndex].text;
      word.style.setProperty('--word-color',words[wordIndex].color);
      word.closest('.rotating-word')?.setAttribute('aria-label',words[wordIndex].text.replace(/\.$/,''));
      activeAnimation.cancel();
      activeAnimation = word.animate([
        {opacity:0,transform:'translateY(65%) rotateX(-25deg)',filter:'blur(4px)'},
        {opacity:1,transform:'translateY(0) rotateX(0deg)',filter:'blur(0)'}
      ],{duration:480,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
      await activeAnimation.finished;
      activeAnimation.cancel();
    } catch { /* A motion preference or tab change can cancel the transition. */ }
    finally { runningWord = false; scheduleWord(); }
  }
  const sections = document.querySelectorAll('.home-page .section-top,.home-page .program,.home-page .why-visual,.home-page .why-copy,.home-page .life-card,.home-page .abacus-feature,.home-page .admissions,.home-page .contact-grid');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.dataset.motionSeen) entry.target.classList.add('motion-return');
        entry.target.dataset.motionSeen = 'true';
        entry.target.classList.add('motion-visible');
        } else if ((entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= innerHeight) && !entry.target.contains(document.activeElement)) {
        entry.target.classList.remove('motion-visible');
      }
    });
  },{threshold:[0,.08]});
  if (!reducedMotion.matches) sections.forEach((section,index) => {
    section.classList.add('motion-ready');
    section.style.setProperty('--reveal-delay',`${section.matches('.program,.life-card') ? index % 3 * 90 : 0}ms`);
    revealObserver.observe(section);
  });
  function handleMotionPreference() {
    clearTimeout(wordTimer);
    activeAnimation?.cancel();
    if (reducedMotion.matches) {
      wordIndex = 0;
      word.textContent = words[0].text;
      word.style.setProperty('--word-color',words[0].color);
      word.closest('.rotating-word')?.setAttribute('aria-label',words[0].text.replace(/\.$/,''));
      sections.forEach(section => section.classList.add('motion-visible'));
      revealObserver.disconnect();
    } else scheduleWord();
  }
  reducedMotion.addEventListener('change',handleMotionPreference);
  document.addEventListener('visibilitychange',() => {
    if (document.hidden) { clearTimeout(wordTimer); activeAnimation?.cancel(); }
    else scheduleWord();
  });
  wordToggle?.addEventListener('click', () => {
    wordPaused = !wordPaused;
    wordToggle.setAttribute('aria-pressed', String(wordPaused));
    wordToggle.innerHTML = wordPaused ? 'Play headline' : 'Pause headline';
    clearTimeout(wordTimer);
    activeAnimation?.cancel();
    if (!wordPaused) scheduleWord();
  });
  scheduleWord();
}

// Reveal interior content once; keep all content visible without JavaScript or with reduced motion.
if (document.body.classList.contains('interior-page')) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const elements = [...document.querySelectorAll('.about-intro,.activities .section-top,.activity-card,.campus-story,.direct-details,.contact-map-panel,.contact-admissions')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.dataset.motionSeen) entry.target.classList.add('motion-return');
        entry.target.dataset.motionSeen = 'true';
        entry.target.classList.add('is-revealed');
        } else if ((entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= innerHeight) && !entry.target.contains(document.activeElement)) {
        entry.target.classList.remove('is-revealed');
      }
    });
  }, {threshold: [0,.06]});
  if (!preference.matches) elements.forEach((element,index) => {
    element.style.setProperty('--interior-delay', `${element.matches('.activity-card') ? index % 3 * 75 : 0}ms`);
    element.classList.add('interior-reveal');
    observer.observe(element);
  });
  preference.addEventListener('change', () => {
    if (preference.matches) {
      elements.forEach(element => element.classList.add('is-revealed'));
      observer.disconnect();
    }
  });
}

// Lightweight scroll choreography. Work runs only after a scroll/resize, never in a continuous loop.
{
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden','true');
  document.body.append(progress);
  const photos = [...document.querySelectorAll('.campus-photo,.page-hero>img,.campus-story>img,.school-why>img')];
  const accents = [...document.querySelectorAll('.contact-row,.about-intro .eyebrow,.about-intro h2,.about-intro p,.campus-story>div>*')];
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.dataset.motionSeen) entry.target.classList.add('motion-return');
        entry.target.dataset.motionSeen = 'true';
        entry.target.classList.add('scroll-entered');
      } else if ((entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= innerHeight) && !entry.target.contains(document.activeElement)) {
      entry.target.classList.remove('scroll-entered');
    }
  }),{threshold:[0,.12]});
  if (!motion.matches) {
    photos.forEach(photo => photo.classList.add('scroll-drift'));
    accents.forEach((element,index) => {
      element.classList.add('scroll-heading');
      element.style.setProperty('--scroll-delay', `${index % 3 * 65}ms`);
      observer.observe(element);
    });
  }
  let pending = false;
  function updateScroll() {
    pending = false;
    if (motion.matches || document.hidden) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1,Math.max(0,scrollY/max)) : 0})`;
    photos.forEach(photo => {
      const rect = photo.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) {
        const offset = Math.max(-7,Math.min(7,((innerHeight/2 - rect.top - rect.height/2)/innerHeight)*14));
        photo.style.setProperty('--scroll-drift', `${offset.toFixed(2)}px`);
      }
    });
  }
  function requestScroll() {
    if (!pending && !motion.matches) { pending = true; requestAnimationFrame(updateScroll); }
  }
  addEventListener('scroll',requestScroll,{passive:true});
  addEventListener('resize',requestScroll,{passive:true});
  document.addEventListener('visibilitychange',requestScroll);
  motion.addEventListener('change',() => {
    if (motion.matches) {
      observer.disconnect();
      accents.forEach(element => element.classList.add('scroll-entered'));
      photos.forEach(photo => photo.style.removeProperty('--scroll-drift'));
    } else requestScroll();
  });
  requestScroll();
}

// Coordinate section headings and supporting copy; each group resets only after fully leaving view.
{
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const headers = [...document.querySelectorAll('.section-top h2,.why-copy h2,.about-intro h2,.campus-story h2,.direct-details h2,.admissions h2,.contact-admissions h2')];
  const copies = [...document.querySelectorAll('.section-top>p,.why-copy>p,.admissions>p,.contact-admissions p')];
  const seen = new WeakSet();
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (seen.has(entry.target)) entry.target.classList.add('sequence-return');
      entry.target.classList.add('sequence-in');
      seen.add(entry.target);
    } else if ((entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= innerHeight) && !entry.target.contains(document.activeElement)) {
      entry.target.classList.remove('sequence-in');
    }
  }),{threshold:[0,.15]});
  if (!reduced.matches) {
    headers.forEach(heading => {
      heading.setAttribute('aria-label',heading.innerText.trim().replace(/\s+/g,' '));
      const walker = document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
      const nodes = [];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      let index = 0;
      nodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(piece => {
          if (!piece.trim()) fragment.append(document.createTextNode(piece));
          else {
            const span = document.createElement('span');
            span.className = 'heading-word';
            span.setAttribute('aria-hidden','true');
            span.style.setProperty('--word-delay', `${Math.min(index++,8)*40}ms`);
            span.textContent = piece;
            fragment.append(span);
          }
        });
        node.replaceWith(fragment);
      });
      heading.classList.add('sequence-heading');
      const rule = document.createElement('span');
      rule.className = 'section-rule';
      rule.setAttribute('aria-hidden','true');
      heading.after(rule);
      observer.observe(heading);
    });
    copies.forEach(copy => {copy.classList.add('sequence-copy');observer.observe(copy);});
  }
  reduced.addEventListener('change',() => {
    if(reduced.matches){observer.disconnect();[...headers,...copies].forEach(e=>e.classList.add('sequence-in'));}
  });
  document.addEventListener('focusin',event => {
    let element = event.target;
    while(element && element !== document.body){
      element.classList.add('motion-visible','is-revealed','scroll-entered','sequence-in');
      element = element.parentElement;
    }
  });
  const header = document.querySelector('.header');
  const navLinks = [...document.querySelectorAll('#nav a')];
  const targets = navLinks.map(link=>({link,target:link.hash && document.querySelector(link.hash)})).filter(item=>item.target);
  let scheduled = false;
  function refreshNavigation(){
    scheduled = false;
    header.classList.toggle('header-scrolled',scrollY>20);
    let current;
    targets.forEach(item=>{if(item.target.getBoundingClientRect().top<=innerHeight*.4)current=item;});
    navLinks.forEach(link=>link.classList.toggle('section-active',current?.link===link));
  }
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(refreshNavigation);}},{passive:true});
  refreshNavigation();
}

// Hero settles as it leaves view; keep scrolling under the visitor's control.
{
  const hero = document.querySelector('.home-page .hero');
  const art = document.querySelector('.school-hero');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  function settleHero(){
    frame = null;
    if(!hero || reduced.matches) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1,Math.max(0,(110-rect.top)/Math.max(rect.height*.65,1)));
    art.style.setProperty('--hero-settle',progress.toFixed(3));
    art.style.setProperty('--hero-photo-settle',`${(-8*progress).toFixed(2)}px`);
  }
  if(hero){
    addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(settleHero);},{passive:true});
    addEventListener('resize',settleHero,{passive:true});
    reduced.addEventListener('change',()=>{art.style.removeProperty('--hero-settle');art.style.removeProperty('--hero-photo-settle');settleHero();});
    settleHero();
  }
  function closeNavigation(restoreFocus=false){
    if(menu.getAttribute('aria-expanded')!=='true')return;
    menu.setAttribute('aria-expanded','false');nav.classList.remove('open');
    if(restoreFocus)menu.focus();
  }
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeNavigation(true);});
  document.addEventListener('click',event=>{if(!nav.contains(event.target)&&!menu.contains(event.target))closeNavigation();});
  nav.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>closeNavigation()));
}

// The hero uses locally saved photos from the academy's social posts.
{
  const heroArt = document.querySelector('.school-hero');
  const toggle = document.querySelector('.hero-slides-toggle');
  if(heroArt){
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = preference.matches;
    let visible = false;
    let hovering = false;
    const groups = [...heroArt.querySelectorAll('[data-hero-slides]')].map((element,index)=>({element,slides:[...element.querySelectorAll('.hero-slide')],index:0,timer:null,delay:6500+index*1800}));
    function schedule(){
      groups.forEach(queueGroup);
    }
    function queueGroup(group){
      clearTimeout(group.timer);
      if(paused || !visible || hovering || document.hidden || heroArt.contains(document.activeElement))return;
      group.timer=setTimeout(async()=>{
        const next=(group.index+1)%group.slides.length;
        try{await group.slides[next].decode();}catch{queueGroup(group);return;}
        if(paused || !visible || hovering || document.hidden || heroArt.contains(document.activeElement))return;
        group.index=next;
        group.slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===next);slide.setAttribute('aria-hidden',String(i!==next));});
        queueGroup(group);
      },group.delay);
    }
    function label(){if(toggle){toggle.textContent=paused?'Play photos':'Pause photos';toggle.setAttribute('aria-pressed',String(paused));}}
    toggle?.addEventListener('click',()=>{paused=!paused;label();schedule();});
    heroArt.addEventListener('mouseenter',()=>{hovering=true;schedule();});
    heroArt.addEventListener('mouseleave',()=>{hovering=false;schedule();});
    heroArt.addEventListener('focusin',schedule);
    heroArt.addEventListener('focusout',()=>setTimeout(schedule,0));
    document.addEventListener('visibilitychange',schedule);
    preference.addEventListener('change',()=>{paused=preference.matches;label();schedule();});
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(heroArt);
    label();
  }
}
