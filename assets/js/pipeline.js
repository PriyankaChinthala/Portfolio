/* Animated data-pipeline backdrop: a DAG of nodes with data packets
   streaming along the edges. Lightweight canvas, respects reduced-motion. */
(function () {
  const canvas = document.getElementById('pipeline-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W, H, dpr, nodes = [], edges = [], packets = [];

  const readColor = (v, fallback) =>
    (getComputedStyle(document.documentElement).getPropertyValue(v).trim() || fallback);

  function palette() {
    return {
      teal: readColor('--teal', '#1ABC9C'),
      node: readColor('--navy-2', '#34495E'),
      line: 'rgba(26,188,156,0.16)',
      lineDim: 'rgba(127,140,141,0.14)'
    };
  }
  let COL = palette();

  // Layout: layered DAG (left -> right), evokes an ingest -> transform -> serve flow
  function build() {
    nodes = [];
    edges = [];
    packets = [];
    const layers = [1, 3, 4, 3, 2, 1];      // node count per layer
    const marginX = W * 0.08, usableW = W * 0.84;
    layers.forEach((count, li) => {
      const x = marginX + (usableW * (li / (layers.length - 1)));
      for (let i = 0; i < count; i++) {
        const gap = H / (count + 1);
        const jitter = (Math.random() - 0.5) * gap * 0.35;
        nodes.push({
          x,
          y: gap * (i + 1) + jitter,
          layer: li,
          r: 3 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2
        });
      }
    });
    // connect each node to 1-2 nodes in the next layer
    const byLayer = layers.map((_, li) => nodes.filter(n => n.layer === li));
    for (let li = 0; li < layers.length - 1; li++) {
      byLayer[li].forEach(a => {
        const next = byLayer[li + 1];
        const picks = new Set();
        const k = 1 + (Math.random() < 0.6 ? 1 : 0);
        for (let j = 0; j < k && next.length; j++) {
          picks.add(next[Math.floor(Math.random() * next.length)]);
        }
        picks.forEach(b => edges.push({ a, b }));
      });
    }
    // seed packets
    const packetCount = Math.min(edges.length, W < 700 ? 14 : 26);
    for (let i = 0; i < packetCount; i++) spawnPacket();
  }

  function spawnPacket() {
    if (!edges.length) return;
    const e = edges[Math.floor(Math.random() * edges.length)];
    packets.push({ e, t: Math.random(), speed: 0.0016 + Math.random() * 0.0026 });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height || 520;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    COL = palette();
    build();
  }

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    // edges
    edges.forEach(e => {
      ctx.beginPath();
      ctx.moveTo(e.a.x, e.a.y);
      const midX = (e.a.x + e.b.x) / 2;
      ctx.bezierCurveTo(midX, e.a.y, midX, e.b.y, e.b.x, e.b.y);
      ctx.strokeStyle = COL.line;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // packets
    packets.forEach(p => {
      p.t += p.speed;
      if (p.t >= 1) { p.t = 0; p.e = edges[Math.floor(Math.random() * edges.length)]; }
      const { a, b } = p.e;
      const midX = (a.x + b.x) / 2;
      const t = p.t, mt = 1 - t;
      // quadratic-ish position along bezier
      const x = mt*mt*mt*a.x + 3*mt*mt*t*midX + 3*mt*t*t*midX + t*t*t*b.x;
      const y = mt*mt*mt*a.y + 3*mt*mt*t*a.y + 3*mt*t*t*b.y + t*t*t*b.y;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 7);
      glow.addColorStop(0, COL.teal);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#EAFBF6';
      ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
    });

    // nodes
    nodes.forEach(n => {
      const pulse = reduce ? 0 : Math.sin(time * 0.0016 + n.phase) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + pulse * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = COL.node;
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = `rgba(26,188,156,${0.35 + pulse * 0.45})`;
      ctx.stroke();
    });

    if (!reduce) raf = requestAnimationFrame(draw);
  }

  let raf;
  function start() {
    resize();
    cancelAnimationFrame(raf);
    if (reduce) { draw(0); } else { raf = requestAnimationFrame(draw); }
  }

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(start, 200); });
  document.addEventListener('themechange', () => { COL = palette(); });
  start();
})();
