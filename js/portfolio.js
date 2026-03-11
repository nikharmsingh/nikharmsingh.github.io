/* ═══ Portfolio JavaScript ═══ */
(function () {
  'use strict';

  /* ─── Mobile Nav Toggle ─── */
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  /* ─── Typing Effect ─── */
  const roles = ['Data Engineer', 'Pipeline Architect', 'Cloud Data Builder', 'ETL Developer', 'API Engineer'];
  const typed = document.getElementById('typed-role');
  if (typed) {
    let ri = 0, ci = 0, deleting = false;
    function typeLoop() {
      const word = roles[ri];
      if (!deleting) {
        typed.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
      } else {
        typed.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(typeLoop, deleting ? 40 : 80);
    }
    typeLoop();
  }

  /* ─── Hero Canvas Particles ─── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticles() {
      particles = [];
      const count = Math.min(80, Math.floor(w * h / 12000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.5
        });
      }
    }
    createParticles();

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(91, 141, 237, 0.4)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = dx * dx + dy * dy;
          if (dist < 15000) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(91, 141, 237,' + (1 - dist / 15000) * 0.15 + ')';
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ─── Scroll Fade-In ─── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section, .pipe-stage, .project-card, .timeline-item, .stack-category, .contact-card, .edu-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  /* ─── Terminal Typing ─── */
  const termCode = document.getElementById('terminal-code');
  if (termCode) {
    const lines = [
      '# etl_pipeline.py',
      'from pyspark.sql import SparkSession',
      'from airflow.decorators import dag, task',
      '',
      'spark = SparkSession.builder \\',
      '    .appName("sales_etl") \\',
      '    .config("spark.jars", "redshift-jdbc.jar") \\',
      '    .getOrCreate()',
      '',
      '@dag(schedule="0 2 * * *", catchup=False)',
      'def sales_pipeline():',
      '',
      '    @task()',
      '    def extract():',
      '        df = spark.read.parquet("s3://data-raw/sales/")',
      '        return df.filter("event_date >= current_date - 1")',
      '',
      '    @task()',
      '    def transform(df):',
      '        return df.groupBy("dealer_id", "region") \\',
      '            .agg({"revenue": "sum", "units": "count"})',
      '',
      '    @task()',
      '    def load(df):',
      '        df.write.format("jdbc") \\',
      '            .option("url", "jdbc:redshift://cluster.amazonaws.com") \\',
      '            .mode("append").save()',
      '',
      '    load(transform(extract()))',
      '',
      'sales_pipeline()',
      '# Pipeline deployed ✓  |  500GB+ daily  |  99.9% uptime'
    ];
    let li = 0, lci = 0, buf = '';
    const termObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        termObserver.disconnect();
        typeTerm();
      }
    }, { threshold: 0.3 });
    termObserver.observe(termCode.closest('.terminal'));

    function typeTerm() {
      if (li >= lines.length) return;
      const line = lines[li];
      if (lci <= line.length) {
        buf = lines.slice(0, li).join('\n') + (li > 0 ? '\n' : '') + line.slice(0, lci);
        termCode.textContent = buf + '█';
        lci++;
        setTimeout(typeTerm, 18);
      } else {
        li++; lci = 0;
        setTimeout(typeTerm, 80);
      }
    }
  }

  /* ─── Nav active on scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(s => {
      const top = s.offsetTop, height = s.offsetHeight, id = s.id;
      const link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollY >= top && scrollY < top + height) link.style.color = '#5b8dee';
        else link.style.color = '';
      }
    });
  });
})();
