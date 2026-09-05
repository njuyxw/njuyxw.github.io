(() => {
  "use strict";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motionButtons = Array.from(document.querySelectorAll(".motion-toggle"));
  // Research years are an artistic arrangement of Three-Body imagery, not plot dates.
  const eras = {
    all: {
      key: "all",
      name: "纪元总览",
      english: "THE CIVILIZATION ARCHIVE",
      chapter: "OBSERVATORY / ALL ERAS",
      orbit: "三日引力交错",
      civilization: "文明档案",
      color: "#eac383",
      sky: ["#555333", "#2b3524", "#111610"],
      terrain: ["#313b29", "#202c20", "#111b15"],
      suns: [
        [0.76, 0.4, 1],
        [0.55, 0.2, 0.26],
        [0.92, 0.14, 0.15],
      ],
      scene: "observatory",
    },
    earlier: {
      key: "frozen",
      name: "乱纪元 · 长夜",
      english: "CHAOTIC ERA / THE LONG NIGHT",
      chapter: "ARCHIVE I / BEFORE 2024",
      orbit: "三日远离 · 严寒",
      civilization: "脱水封存",
      color: "#a8cce8",
      sky: ["#30465a", "#182737", "#0c141e"],
      terrain: ["#3e5362", "#243948", "#12212f"],
      suns: [
        [0.6, 0.22, 0.09],
        [0.79, 0.32, 0.07],
        [0.91, 0.17, 0.06],
      ],
      scene: "frozen",
    },
    2024: {
      key: "chaotic",
      name: "乱纪元 · 三日凌空",
      english: "CHAOTIC ERA / THREE SUNS",
      chapter: "ARCHIVE II / 2024",
      orbit: "三日临近 · 炽热",
      civilization: "保存知识火种",
      color: "#f2a078",
      sky: ["#915131", "#512c22", "#211510"],
      terrain: ["#76452e", "#492b21", "#261b17"],
      suns: [
        [0.63, 0.29, 0.63],
        [0.78, 0.38, 0.9],
        [0.94, 0.2, 0.5],
      ],
      scene: "chaotic",
    },
    2025: {
      key: "stable",
      name: "恒纪元 · 文明复苏",
      english: "STABLE ERA / REHYDRATION",
      chapter: "ARCHIVE III / 2025",
      orbit: "单日主导 · 温和",
      civilization: "浸泡复苏",
      color: "#c6daa1",
      sky: ["#637048", "#344a36", "#122019"],
      terrain: ["#506746", "#304c37", "#182e24"],
      suns: [
        [0.76, 0.32, 0.86],
        [0.56, 0.14, 0.065],
        [0.96, 0.13, 0.05],
      ],
      scene: "stable",
    },
    2026: {
      key: "voyage",
      name: "星海 · 向未知远航",
      english: "BEYOND THE THREE SUNS",
      chapter: "ARCHIVE IV / 2026",
      orbit: "离开三日引力场",
      civilization: "星际航行",
      color: "#b9b5f3",
      sky: ["#414667", "#222b46", "#101422"],
      terrain: ["#343b52", "#242c43", "#141c2e"],
      suns: [
        [0.9, 0.59, 0.16],
        [0.94, 0.53, 0.1],
        [0.97, 0.61, 0.07],
      ],
      scene: "voyage",
    },
  };
  let activeEra = eras.all;
  let paused = reducedMotion.matches;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let scenes = [];
  function random(seed) {
    return () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function ellipse(c, x, y, rx, ry, rotation, color, dash = []) {
    c.strokeStyle = color;
    c.lineWidth = 0.6;
    c.setLineDash(dash);
    c.beginPath();
    c.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
    c.stroke();
    c.setLineDash([]);
  }
  function planet(c, x, y, radius, palette, seed) {
    const rng = random(seed);
    for (let py = -radius; py <= radius; py++) {
      for (let px = -radius; px <= radius; px++) {
        const d = (px * px + py * py) / (radius * radius);
        if (d > 1) continue;
        const texture =
          Math.sin(px * 0.11 + Math.sin(py * 0.12) * 3) * 0.12 +
          Math.sin(py * 0.22 + px * 0.07) * 0.1;
        const shade =
          0.72 -
          (px / radius) * 0.24 -
          (py / radius) * 0.2 -
          d * 0.16 +
          texture +
          (rng() - 0.5) * 0.32;
        c.fillStyle =
          palette[
            Math.max(
              0,
              Math.min(palette.length - 1, Math.floor(shade * palette.length)),
            )
          ];
        c.fillRect(Math.round(x + px), Math.round(y + py), 1, 1);
      }
    }
  }
  function makeScene(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const bounds = canvas.getBoundingClientRect();
    const w = Math.ceil(bounds.width / 2),
      h = Math.ceil(bounds.height / 2);
    if (!w || !h) return null;
    canvas.width = w;
    canvas.height = h;
    const bg = document.createElement("canvas");
    bg.width = w;
    bg.height = h;
    const c = bg.getContext("2d"),
      rng = random(306);
    const mobile = bounds.width < 761;
    const archive = canvas.id === "era-universe";
    const cx = w * 0.76,
      cy = h * (mobile ? 0.64 : 0.38);
    const radius = Math.min(w * 0.104, h * 0.23, 78);
    const glow = c.createRadialGradient(cx, cy, radius * 0.3, cx, cy, w * 0.7);
    activeEra.sky.forEach((color, i) =>
      glow.addColorStop([0, 0.4, 1][i], color),
    );
    c.fillStyle = glow;
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < w * h * 0.065; i++) {
      c.fillStyle = rng() > 0.5 ? activeEra.color + "0a" : "#030a0722";
      c.fillRect(Math.floor(rng() * w), Math.floor(rng() * h), 1, 1);
    }
    const stars = [];
    for (let i = 0; i < (w * h) / 460; i++) {
      const x = Math.floor(rng() * w),
        y = Math.floor(rng() * h * 0.88),
        bright = rng();
      c.fillStyle = activeEra.color + (bright > 0.8 ? "b0" : "50");
      c.fillRect(x, y, 1, 1);
      if (bright > 0.97) {
        c.fillStyle = activeEra.color + "80";
        c.fillRect(x - 2, y, 5, 1);
        c.fillRect(x, y - 2, 1, 5);
      }
      if (bright > 0.85) stars.push({ x, y, phase: rng() * 7 });
    }
    const suns = activeEra.suns.map(([x, y, size], i) => {
      const r = Math.max(1.5, radius * size);
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = Math.ceil(r * 2 + 4);
      const palette =
        activeEra.scene === "chaotic"
          ? ["#945037", "#be6846", "#dc8c58", "#edb16f", "#f6d498", "#fbe7bd"]
          : activeEra.scene === "frozen"
            ? ["#93acca", "#b7ccde", "#e2ecfa"]
            : [
                "#887244",
                "#aa8c52",
                "#c6a264",
                "#dfba79",
                "#efcf8e",
                "#f6dda7",
              ];
      planet(
        sprite.getContext("2d"),
        sprite.width / 2,
        sprite.height / 2,
        r,
        palette,
        12 + i * 11,
      );
      return {
        sprite,
        x: w * x,
        y: h * (mobile ? 0.55 + y * 0.28 : y),
        phase: i * 2.2,
      };
    });
    if (activeEra.scene === "observatory" || activeEra.scene === "stable") {
      ellipse(
        c,
        cx,
        cy,
        radius * 2.2,
        radius * 0.62,
        -0.43,
        activeEra.color + "60",
      );
      ellipse(
        c,
        cx,
        cy,
        radius * 2.8,
        radius * 0.92,
        -0.43,
        activeEra.color + "35",
        [2, 4],
      );
    }
    if (activeEra.scene === "chaotic") {
      for (let i = 0; i < 3; i++)
        ellipse(
          c,
          w * (0.63 + i * 0.14),
          h * (mobile ? 0.65 : 0.36),
          radius * (1.6 + i * 0.2),
          radius * 0.5,
          -0.6 + i * 0.6,
          "#f3b18a35",
          [2, 3],
        );
    }
    if (activeEra.scene === "voyage") {
      // A fleet departing the stellar system; no imagery is tied to a paper's venue.
      const fx = w * (mobile ? 0.55 : 0.72),
        fy = h * (mobile ? 0.69 : 0.38);
      for (let ship = 0; ship < 6; ship++) {
        const x = fx + (ship % 3) * 18 - Math.floor(ship / 3) * 25,
          y = fy + ship * 7;
        c.fillStyle = activeEra.color + "30";
        c.fillRect(x, y, 60 + ship * 4, 1);
        c.fillStyle = activeEra.color;
        c.fillRect(x - 4, y - 1, 8, 3);
        c.fillRect(x - 7, y, 3, 1);
        c.fillStyle = "#f2e6c5";
        c.fillRect(x + 4, y, 2, 1);
      }
      ellipse(
        c,
        w * 0.85,
        h * 0.58,
        radius * 2.6,
        radius * 0.95,
        -0.3,
        activeEra.color + "30",
        [1, 5],
      );
    }
    const terrain = document.createElement("canvas");
    terrain.width = w;
    terrain.height = h;
    const t = terrain.getContext("2d");
    const layers = mobile ? [0.84, 0.91, 0.97] : [0.77, 0.87, 0.96];
    layers.forEach((level, layer) => {
      t.fillStyle = activeEra.terrain[layer];
      let previous = h * level;
      for (let x = 0; x < w; x += 3) {
        const target =
          h * level +
          Math.sin(x * 0.017 + layer * 2) * 10 +
          Math.sin(x * 0.057 + layer) * 4 +
          (rng() - 0.5) * 3;
        previous += (target - previous) * 0.5;
        t.fillRect(x, Math.floor(previous), 3, h - previous + 5);
      }
    });
    const tx = Math.floor(w * (mobile ? 0.24 : 0.6)),
      ty = Math.floor(h * (mobile ? 0.86 : 0.8));
    if (activeEra.scene === "frozen") {
      t.fillStyle = "#7f9dad";
      for (let i = 0; i < 6; i++) {
        const x = tx + i * 8;
        t.fillRect(x, ty - (i % 2) * 3, 6, 12);
        t.fillRect(x + 1, ty - (i % 2) * 3 - 2, 4, 2);
      }
      for (let i = 0; i < 40; i++) {
        t.fillStyle = "#c1dbea60";
        t.fillRect(
          Math.floor(rng() * w),
          Math.floor(h * 0.85 + rng() * h * 0.15),
          3,
          1,
        );
      }
    } else if (activeEra.scene === "stable") {
      for (let i = 0; i < 7; i++) {
        const x = tx + i * 9,
          ht = 7 + (i % 3) * 4;
        t.fillStyle = "#182e24";
        t.fillRect(x, ty - ht, 6, ht + 15);
        t.fillStyle = "#c6daa1";
        t.fillRect(x + 2, ty - ht + 3, 1, 2);
      }
      t.fillStyle = "#92bfa650";
      t.fillRect(tx - 22, ty + 17, 92, 2);
      for (let i = 0; i < 5; i++) {
        t.fillStyle = "#668c58";
        t.fillRect(tx - 20 - i * 9, ty + 5 - (i % 2) * 4, 1, 9);
        t.fillRect(tx - 23 - i * 9, ty + 3 - (i % 2) * 4, 7, 3);
      }
    } else if (activeEra.scene !== "voyage") {
      t.fillStyle = activeEra.scene === "chaotic" ? "#201610" : "#101b14";
      t.fillRect(tx - 8, ty, 17, 30);
      t.fillRect(tx - 5, ty - 4, 11, 6);
      t.fillRect(tx, ty - 21, 1, 22);
      for (let i = 0; i < 10; i++)
        t.fillRect(tx - 10 + i, ty - 20 + Math.floor(i * 0.6), 20 - i * 2, 1);
      t.fillStyle = activeEra.color;
      t.fillRect(tx - 3, ty + 3, 2, 2);
      t.fillRect(tx + 2, ty + 3, 2, 2);
    }
    return { canvas, ctx, bg, terrain, suns, stars, w, h, archive };
  }
  function renderScene(scene) {
    const { ctx, bg, terrain, suns, stars, w, h } = scene;
    ctx.drawImage(bg, 0, 0);
    stars.forEach((star) => {
      ctx.fillStyle = activeEra.color + "70";
      ctx.globalAlpha =
        0.25 + (0.45 * (1 + Math.sin(elapsed * 0.0006 + star.phase))) / 2;
      ctx.fillRect(star.x, star.y, 1, 1);
    });
    ctx.globalAlpha = 1;
    suns.forEach((sun) => {
      const drift = activeEra.scene === "chaotic" ? 5 : 1.5;
      ctx.drawImage(
        sun.sprite,
        Math.round(
          sun.x -
            sun.sprite.width / 2 +
            Math.sin(elapsed * 0.0002 + sun.phase) * drift,
        ),
        Math.round(
          sun.y -
            sun.sprite.height / 2 +
            Math.cos(elapsed * 0.00015 + sun.phase) * drift,
        ),
      );
    });
    ctx.drawImage(terrain, 0, 0);
    if (activeEra.scene === "chaotic") {
      ctx.fillStyle = "#e8a06570";
      for (let i = 0; i < 16; i++) {
        const x = (i * 47 + elapsed * 0.008) % w,
          y = h * 0.7 + Math.sin(i * 3 + elapsed * 0.0003) * h * 0.08;
        ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
      }
    }
  }
  function buildSky() {
    scenes = Array.from(document.querySelectorAll("#universe, #era-universe"))
      .map(makeScene)
      .filter(Boolean);
    scenes.forEach(renderScene);
  }
  function animate(time) {
    if (time - lastTime > 100) {
      elapsed += Math.min(time - lastTime, 150);
      lastTime = time;
      scenes.forEach((scene) => {
        const r = scene.canvas.getBoundingClientRect();
        if (r.bottom > 0 && r.top < innerHeight) renderScene(scene);
      });
    }
    frame = requestAnimationFrame(animate);
  }
  function syncMotion() {
    cancelAnimationFrame(frame);
    lastTime = performance.now();
    motionButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(paused));
      button.textContent = paused ? "Resume cosmos ▷" : "Pause cosmos Ⅱ";
      button.hidden = !scenes.length;
    });
    scenes.forEach(renderScene);
    if (scenes.length && !paused && !document.hidden)
      frame = requestAnimationFrame(animate);
  }
  function selectEra(year, transition = false) {
    activeEra = eras[year] || eras.all;
    document.body.dataset.era = activeEra.key;
    document.getElementById("era-title").textContent = activeEra.name;
    document.getElementById("era-civilization").textContent =
      activeEra.civilization;
    document.getElementById("hero-era-caption").textContent = activeEra.name;
    elapsed = 0;
    buildSky();
    if (transition && !paused && !reducedMotion.matches) {
      const panel = document.querySelector(".era-observatory");
      panel.getAnimations().forEach((animation) => animation.cancel());
      panel.animate([{ opacity: 0.45 }, { opacity: 1 }], {
        duration: 550,
        easing: "ease-out",
      });
    }
    syncMotion();
  }
  motionButtons.forEach((button) =>
    button.addEventListener("click", () => {
      paused = !paused;
      syncMotion();
    }),
  );
  reducedMotion.addEventListener("change", (event) => {
    paused = event.matches;
    syncMotion();
  });
  document.addEventListener("visibilitychange", syncMotion);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildSky, 120);
  });
  document.querySelectorAll(".archive-art").forEach((art) => {
    const c = art.getContext("2d");
    if (!c) return;
    art.width = 360;
    art.height = 170;
    const scene = Number(art.dataset.scene),
      rng = random(scene * 173);
    c.fillStyle = ["#141d18", "#1b2119", "#171e1a"][(scene - 1) % 3];
    c.fillRect(0, 0, 360, 170);
    for (let i = 0; i < 140; i++) {
      c.fillStyle = i % 5 ? "#586747" : "#bdc995";
      c.fillRect(Math.floor(rng() * 360), Math.floor(rng() * 170), 1, 1);
    }
    if (scene === 1) {
      const points = [
        [180, 29],
        [121, 60],
        [232, 62],
        [88, 103],
        [155, 110],
        [212, 100],
        [280, 106],
        [180, 75],
      ];
      [
        [0, 1],
        [0, 2],
        [1, 3],
        [1, 4],
        [2, 5],
        [2, 6],
        [1, 7],
        [2, 7],
        [7, 4],
        [7, 5],
        [4, 5],
      ].forEach(([a, b]) => {
        c.strokeStyle = "#778658";
        c.lineWidth = 0.7;
        c.beginPath();
        c.moveTo(...points[a]);
        c.lineTo(...points[b]);
        c.stroke();
      });
      points.forEach(([x, y], i) => {
        c.fillStyle = i === 0 ? "#f1d597" : "#b4c28a";
        c.fillRect(x - 3, y - 3, 6, 6);
        c.strokeStyle = "#82945d50";
        c.strokeRect(x - 7, y - 7, 14, 14);
      });
      ellipse(c, 180, 77, 113, 59, 0, "#8e9f5930", [2, 5]);
    } else if (scene === 2) {
      planet(
        c,
        180,
        77,
        49,
        ["#303f2b", "#52643d", "#7f8b51", "#a1ad6b", "#c7ca86"],
        63,
      );
      ellipse(c, 180, 77, 105, 24, -0.3, "#c7c387");
      ellipse(c, 180, 77, 119, 36, -0.3, "#78845465", [2, 3]);
      [
        [84, 94],
        [263, 42],
        [214, 124],
      ].forEach(([x, y]) => {
        c.fillStyle = "#eac383";
        c.fillRect(x - 2, y - 2, 4, 4);
      });
    } else if (scene === 4) {
      // Recurrent trajectories contract toward a stable fixed point.
      for (let arm = 0; arm < 3; arm++) {
        for (let step = 0; step < 220; step++) {
          const angle = step * 0.048 + (arm * Math.PI * 2) / 3;
          const radius = 100 * Math.exp(-step * 0.013);
          c.fillStyle = ["#eac383", "#a8bb7a", "#778f65"][arm];
          c.fillRect(
            Math.round(180 + Math.cos(angle) * radius),
            Math.round(77 + Math.sin(angle) * radius * 0.57),
            1,
            1,
          );
        }
      }
      ellipse(c, 180, 77, 112, 64, 0, "#a4b67a40", [2, 4]);
      c.fillStyle = "#f3d89b";
      c.fillRect(177, 74, 6, 6);
      c.fillStyle = "#eac38340";
      c.fillRect(173, 70, 14, 14);
    } else if (scene === 5) {
      // A piano-roll constellation links expressive timing to stellar rhythm.
      for (let row = 0; row < 5; row++) {
        c.fillStyle = "#8e9f5930";
        c.fillRect(55, 38 + row * 18, 250, 1);
      }
      for (let note = 0; note < 19; note++) {
        const x = 63 + note * 12;
        const y = 77 - Math.round(Math.sin(note * 0.55) * 3) * 9;
        c.fillStyle = note % 3 ? "#b8c78c" : "#f0ce90";
        c.fillRect(x, y, 8 + (note % 4) * 2, 4);
        c.fillStyle = "#a8bc6940";
        c.fillRect(x, y + 5, 1, 115 - y);
      }
      for (let key = 0; key < 25; key++) {
        c.fillStyle = "#aaba7d";
        c.fillRect(56 + key * 10, 120, 9, 14);
        if (![2, 6].includes(key % 7)) {
          c.fillStyle = "#24321f";
          c.fillRect(62 + key * 10, 120, 5, 8);
        }
      }
    } else {
      for (let i = 0; i < 3; i++)
        ellipse(
          c,
          180,
          77,
          42 + i * 28,
          26 + i * 10,
          -0.3,
          "#889966" + ["88", "66", "44"][i],
          [2, 3],
        );
      c.strokeStyle = "#c8bd83";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(86, 112);
      c.lineTo(136, 65);
      c.lineTo(185, 91);
      c.lineTo(234, 42);
      c.stroke();
      [
        [86, 112],
        [136, 65],
        [185, 91],
        [234, 42],
      ].forEach(([x, y], i) => {
        c.fillStyle = i === 3 ? "#f2d598" : "#b2be8a";
        c.fillRect(x - 3, y - 3, 6, 6);
      });
      c.strokeStyle = "#e3c38a";
      c.beginPath();
      c.moveTo(181, 68);
      c.lineTo(140, 66);
      c.lineTo(150, 57);
      c.moveTo(140, 66);
      c.lineTo(151, 74);
      c.stroke();
    }
  });

  const controls = document.querySelector(".archive-controls");
  const search = document.getElementById("paper-search");
  const cards = Array.from(document.querySelectorAll(".paper-card"));
  const filters = Array.from(
    document.querySelectorAll('[data-year][type="button"]'),
  );
  const requestedYear = new URL(window.location.href).searchParams.get("year");
  let year = Object.hasOwn(eras, requestedYear) ? requestedYear : "all";
  function filterPapers() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    cards.forEach((card) => {
      const matchYear =
        year === "all" ||
        (year === "earlier"
          ? Number(card.dataset.year) < 2024
          : card.dataset.year === year);
      const visible =
        matchYear && card.textContent.toLowerCase().includes(query);
      card.hidden = !visible;
      if (visible) count++;
    });
    document.getElementById("paper-count").textContent =
      `${count} PUBLICATION${count === 1 ? "" : "S"}`;
    document.getElementById("no-results").hidden = count > 0;
    document.getElementById("era-announcement").textContent =
      `${activeEra.name}，${count} 篇论文。`;
  }
  if (controls && search) {
    controls.hidden = false;
    filters.forEach((button) =>
      button.addEventListener("click", () => {
        year = button.dataset.year;
        selectEra(year, true);
        const url = new URL(window.location.href);
        if (year === "all") url.searchParams.delete("year");
        else url.searchParams.set("year", year);
        window.history.replaceState(null, "", url);
        filters.forEach((filter) => {
          const active = filter === button;
          filter.classList.toggle("active", active);
          filter.setAttribute("aria-pressed", String(active));
        });
        filterPapers();
      }),
    );
    selectEra(year);
    filters.forEach((filter) => {
      const active = filter.dataset.year === year;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    filterPapers();
    search.addEventListener("input", filterPapers);
  }
})();
