---
layout: cosmic
permalink: /
title: "Xiao-Wen Yang"
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

<section id="about" class="hero" aria-labelledby="hero-title">
  <canvas id="universe" aria-hidden="true"></canvas>
  <div class="hero-copy">
    <div class="hero-identity">
      <div class="avatar-frame"><img class="pixel-avatar" src="{{ '/images/xiaowen-pixel-avatar.png' | relative_url }}" width="176" height="176" alt="Pixel portrait of Xiao-Wen Yang, with short black hair and glasses" fetchpriority="high"></div>
      <div><h1 id="hero-title">Xiao-Wen Yang<span lang="zh-CN">杨骁文</span></h1><p class="hero-affiliation"><strong>Xiaohongshu · AllSpark</strong><br>Research Intern · Agent post-training · Jun 2026–present<br>Ph.D. Student · Nanjing University<br><a href="http://www.lamda.nju.edu.cn/">LAMDA</a> · Advisor: <a href="http://www.lamda.nju.edu.cn/liyf/">Yu-Feng Li</a></p></div>
    </div>
    <ul class="research-tags" aria-label="Research interests"><li>AI for Math</li><li>LLM Reasoning</li><li>Neuro-Symbolic Learning</li></ul>
    <div class="hero-actions"><a class="button primary" href="#publications">Publications <span>↗</span></a><a class="text-link" href="https://scholar.google.com/citations?user=QLnf8eQAAAAJ">Scholar ↗</a><a class="text-link" href="https://github.com/njuyxw">GitHub ↗</a><a class="text-link" href="mailto:yangxw@lamda.nju.edu.cn">Email ↗</a></div>
  </div>
  <div class="scene-caption"><span class="tiny-cross" aria-hidden="true">+</span><small id="hero-era-caption" lang="zh-CN">纪元总览</small></div>
  <div class="hero-bottom"><span>NANJING, CHINA</span><a href="#publications" aria-label="Scroll to publications">↓ PUBLICATIONS</a></div>
  <button class="motion-toggle" type="button" aria-pressed="false" hidden>Pause cosmos Ⅱ</button>
</section>

<div class="page-shell">
  <section class="transmissions" aria-labelledby="news-title">
    <h2 id="news-title">News</h2>
    <div class="news-list">
      {% for news in site.data.cosmic_news limit: 2 %}
      <p><time datetime="{{ news.date }}">{{ news.date | replace: '-', '.' }}</time><span>{% if news.url %}<a href="{{ news.url }}">{{ news.text }}</a>{% else %}{{ news.text }}{% endif %}</span></p>
      {% endfor %}
      <details><summary>Earlier news <span>+</span></summary>
        {% for news in site.data.cosmic_news offset: 2 %}
        <p><time datetime="{{ news.date }}">{{ news.date | replace: '-', '.' }}</time><span>{% if news.url %}<a href="{{ news.url }}">{{ news.text }}</a>{% else %}{{ news.text }}{% endif %}</span></p>
        {% endfor %}
      </details>
    </div>
  </section>

  <section id="publications" class="section-block publications" aria-labelledby="publications-title">
    <div class="section-heading"><h2 id="publications-title">Publications<span class="accent">.</span></h2></div>
    <div class="archive-controls" hidden>
      <div class="filters" role="group" aria-label="Choose an era and filter publications by year">
        <button class="active" type="button" data-year="all" aria-pressed="true"><span class="era-node" aria-hidden="true"></span><strong>All years</strong><small>总览</small></button>
        <button type="button" data-year="earlier" aria-pressed="false"><span class="era-node" aria-hidden="true"></span><strong>≤ 2023</strong><small>长夜</small></button>
        <button type="button" data-year="2024" aria-pressed="false"><span class="era-node" aria-hidden="true"></span><strong>2024</strong><small>乱纪元</small></button>
        <button type="button" data-year="2025" aria-pressed="false"><span class="era-node" aria-hidden="true"></span><strong>2025</strong><small>恒纪元</small></button>
        <button type="button" data-year="2026" aria-pressed="false"><span class="era-node" aria-hidden="true"></span><strong>2026</strong><small>远航</small></button>
      </div>
      <label class="search-box"><span aria-hidden="true">⌕</span><input type="search" id="paper-search" placeholder="Search papers" aria-label="Search publications"></label>
    </div>
    <div class="era-observatory" aria-labelledby="era-title">
      <canvas id="era-universe" aria-hidden="true"></canvas>
      <div class="era-narrative"><h3 id="era-title" lang="zh-CN">纪元总览</h3><span id="era-civilization" lang="zh-CN">文明档案</span></div>
      <button class="motion-toggle era-motion" type="button" aria-pressed="false" hidden>Pause cosmos Ⅱ</button>
    </div>
    <span lang="zh-CN" id="era-announcement" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></span>
    <div class="archive-meta"><span id="paper-count" role="status" aria-live="polite">{{ site.data.cosmic_publications.size }} PUBLICATIONS</span></div>
    <div class="paper-grid">
    {% for paper in site.data.cosmic_publications %}
      <article class="paper-card{% if paper.art_scene %} featured{% endif %}" data-year="{{ paper.year }}">
        {% if paper.art_scene %}<div class="paper-art"><canvas class="archive-art" data-scene="{{ paper.art_scene }}" aria-hidden="true"></canvas></div>{% endif %}
        <div class="paper-body">
          <div class="paper-meta"><span class="venue">{{ paper.label }}</span></div>
          <h3>{{ paper.title }}</h3>
          <details class="paper-details"><summary>Authors &amp; venue</summary><div class="paper-authors">{{ paper.authors | markdownify }}</div><div class="paper-venue">{{ paper.venue | markdownify }}</div>{% if paper.authors contains '\*' %}<small>* Equal contribution</small>{% endif %}{% if paper.authors contains '†' %}<small>† Corresponding author</small>{% endif %}</details>
          {% if paper.links.size > 0 %}<div class="paper-footer"><div class="paper-links">{% for link in paper.links %}<a href="{% if link.url contains '://' %}{{ link.url }}{% else %}{{ link.url | relative_url }}{% endif %}">{{ link.label }} <span aria-hidden="true">↗</span><span class="sr-only">: {{ paper.title }}</span></a>{% endfor %}</div></div>{% endif %}
        </div>
      </article>
    {% endfor %}
    </div>
    <p id="no-results" class="no-results" hidden>No papers found.</p>
  </section>

  <details id="service" class="academic-details"><summary>More about me <span>+</span></summary><div class="academic-content"><div class="biography">{% include cosmic-bio.html %}</div><div class="service-grid">{% include cosmic-service.html %}</div></div></details>
</div>
