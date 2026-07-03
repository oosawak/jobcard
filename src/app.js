const STORAGE_KEYS = {
  saved: 'jobcard:saved-v1',
  entries: 'jobcard:entries-v1',
};

const DEFAULT_JOBS = [
  {
    id: 'nebula-foundry',
    company: 'Nebula Foundry',
    title: 'Product Engineer',
    location: '山形県山形市',
    type: 'Full-time',
    salary: '¥8.4M - ¥11.2M',
    summary: 'プロダクト体験を高速に回しながら、カード型の採用導線を磨くエンジニアを募集。',
    description:
      'UI と API の境界を整えながら、スマートフォン中心の体験を短いサイクルで更新します。デザイン、実装、計測をひとつのループで回す役割です。',
    highlights: ['React-free SPA', 'Analytics first', 'Small product team'],
    responsibilities: [
      'カードスワイプ体験とデータ保存の設計',
      'エントリーフォームの UX 改善と軽量な状態管理',
      'GitHub Pages で動く静的配信の最適化',
    ],
    requirements: ['Pointer Events を使った UI 実装経験', 'モバイルファーストの設計経験', '静的ホスティング運用の理解'],
    perks: ['裁量の大きい小さなチーム', '週次の高速リリース', 'リモートワーク中心'],
  },
  {
    id: 'arc-lift',
    company: 'Arc Lift',
    title: 'Mobile UX Designer',
    location: '山形県鶴岡市',
    type: 'Hybrid',
    salary: '¥7.2M - ¥9.0M',
    summary: 'シンプルだけど印象に残るモバイル UI を、表層だけでなく操作感まで作り込みます。',
    description:
      'インタラクションデザイン、モーション、タイポグラフィをまとめて扱い、カードを触る体験そのものに意味を持たせます。',
    highlights: ['Motion direction', 'System design', 'Design QA'],
    responsibilities: [
      'カード、詳細、エントリーまでの画面遷移設計',
      '視線誘導を意識した UI コンポーネントの整備',
      'A/B テスト前提のレイアウト改善',
    ],
    requirements: ['Figma と実装の往復', 'スマホ向け UI の経験', 'デザインシステムの理解'],
    perks: ['フルフレックス', 'デザインレビュー毎日', '最新端末支給'],
  },
  {
    id: 'signal-harbor',
    company: 'Signal Harbor',
    title: 'Frontend Platform Engineer',
    location: '山形県酒田市',
    type: 'Contract',
    salary: '¥9.5M - ¥13.0M',
    summary: '軽量なフロントエンド基盤を作り、静的配信でも強い体験を提供します。',
    description:
      'ブラウザの標準機能を最大限に使い、ビルドに頼り切らないアーキテクチャを整えます。将来の拡張にも耐える構成が前提です。',
    highlights: ['Web Components', 'Edge-ready', 'Performance budget'],
    responsibilities: [
      'アプリの分割方針と配信戦略の設計',
      'アクセシビリティとパフォーマンスの改善',
      '将来の拡張に備えた API の整備',
    ],
    requirements: ['HTML/CSS/JS の深い理解', '計測と最適化の経験', '静的ホスティングに強いこと'],
    perks: ['自由な作業環境', '短期集中の開発文化', '成果報酬あり'],
  },
  {
    id: 'lumen-grid',
    company: 'Lumen Grid',
    title: 'Creative Technologist',
    location: '山形県米沢市',
    type: 'Part-time',
    salary: '¥4.8M - ¥7.0M',
    summary: '見た目と動きの両方で、プロダクトの第一印象を強くする仕事です。',
    description:
      'プロトタイプ制作から実装までを横断し、ブランド感と使いやすさのバランスを取ります。静的サイトでも強い表現を狙います。',
    highlights: ['Prototype first', 'Motion systems', 'Brand polish'],
    responsibilities: [
      'ランディングと採用導線の体験設計',
      '軽量なアニメーションの実装',
      '静的ページのアートディレクション',
    ],
    requirements: ['表現と構造の両立', 'モーションの基礎', '短いサイクルでの検証'],
    perks: ['案件ベース', '副業可', 'クリエイティブ支援'],
  },
  {
    id: 'atlas-nine',
    company: 'Atlas Nine',
    title: 'Backend Engineer',
    location: '山形県天童市',
    type: 'Full-time',
    salary: '¥8.0M - ¥12.5M',
    summary: '保存、送信、集計の基盤を安定して支えるバックエンドを設計します。',
    description:
      'フォーム送信や保存済みデータの永続化など、プロダクトの信頼性を決める部分を扱います。',
    highlights: ['API design', 'Data safety', 'Observability'],
    responsibilities: [
      'フォーム送信 API と保存ロジックの設計',
      '監査しやすいデータスキーマの構築',
      '可観測性を踏まえた運用',
    ],
    requirements: ['API 設計経験', 'データモデル設計', '運用を見据えた実装'],
    perks: ['ストックオプション', 'フルリモート可', 'レビュー文化が強い'],
  },
];

const dom = {
  app: document.getElementById('app'),
  savedButton: document.getElementById('saved-button'),
};

const state = {
  index: 0,
  route: parseRoute(),
  saved: loadSaved(),
  entries: loadEntries(),
  jobs: [],
  loaded: false,
  toast: null,
  toastTimer: null,
};

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('hashchange', render);
window.addEventListener('keydown', handleGlobalKeydown);
dom.savedButton.addEventListener('click', () => {
  location.hash = '#saved';
});

init();

async function init() {
  state.jobs = await loadJobs();
  state.loaded = true;
  render();
}

async function loadJobs() {
  try {
    const response = await fetch(new URL('./jobs.json', import.meta.url));
    if (!response.ok) {
      throw new Error(`Failed to load jobs.json: ${response.status}`);
    }

    const jobs = await response.json();
    if (!Array.isArray(jobs) || jobs.length === 0) {
      throw new Error('jobs.json must contain a non-empty array');
    }

    return jobs;
  } catch {
    return DEFAULT_JOBS;
  }
}

function parseRoute() {
  const raw = location.hash.replace(/^#/, '');

  if (!raw || raw === 'home') {
    return { page: 'home' };
  }

  const [page, id] = raw.split('/');
  return { page, id: id ?? null };
}

function handleGlobalKeydown(event) {
  if (event.key !== 'Escape') {
    return;
  }

  if (state.route.page !== 'home') {
    location.hash = '';
  }
}

function loadSaved() {
  return readJson(STORAGE_KEYS.saved, []);
}

function loadEntries() {
  return readJson(STORAGE_KEYS.entries, []);
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function render() {
  if (!state.loaded) {
    dom.app.innerHTML = '';
    dom.app.append(renderLoadingState());
    return;
  }

  state.route = parseRoute();

  if (state.jobs.length === 0) {
    dom.app.innerHTML = '';
    dom.app.append(renderEmptyState());
    renderToast();
    return;
  }

  const currentJob = getCurrentJob();
  const savedCount = state.saved.length;

  dom.savedButton.textContent = `保存 ${savedCount}`;
  dom.app.innerHTML = '';

  if (!currentJob) {
    dom.app.append(renderEmptyState());
    renderToast();
    return;
  }

  const view = document.createElement('section');
  view.className = 'view';

  if (state.route.page === 'home') {
    view.append(renderHome(currentJob));
  } else if (state.route.page === 'job') {
    view.append(renderHome(currentJob));
    view.append(renderJobSheet(getJobById(state.route.id) ?? currentJob));
  } else if (state.route.page === 'apply') {
    view.append(renderHome(currentJob));
    view.append(renderApplySheet(getJobById(state.route.id) ?? currentJob));
  } else if (state.route.page === 'saved') {
    view.append(renderHome(currentJob));
    view.append(renderSavedSheet());
  } else {
    location.hash = '';
    return;
  }

  dom.app.append(view);
  bindHomeInteractions();
  bindOverlayInteractions();
  renderToast();
}

function renderHome(currentJob) {
  const wrapper = document.createElement('section');
  wrapper.className = 'deck-shell';

  const stats = document.createElement('div');
  stats.className = 'stats';
  stats.innerHTML = `
    <div class="chip"><strong>${state.jobs.length}</strong> 件の候補</div>
    <div class="chip"><strong>${state.saved.length}</strong> 件保存済み</div>
    <div class="chip"><strong>${state.entries.length}</strong> 件エントリー下書き</div>
  `;

  const scene = document.createElement('div');
  scene.className = 'scene';

  const stack = document.createElement('div');
  stack.className = 'stack';
  stack.setAttribute('aria-label', '仕事カード');

  const visibleJobs = [currentJob, ...getNextJobs(currentJob.id, 2)];
  visibleJobs.forEach((job, depth) => {
    stack.append(renderCard(job, depth));
  });

  const hint = document.createElement('div');
  hint.className = 'gesture-hint';
  hint.innerHTML = `
    <span><strong>右</strong> スワイプで削除</span>
    <span><strong>左</strong> スワイプで保存</span>
    <span>タップで詳細</span>
  `;

  scene.append(stack);
  wrapper.append(stats, scene, hint);
  return wrapper;
}

function renderCard(job, depth) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.jobId = job.id;
  card.dataset.depth = String(depth);

  if (depth === 0) {
    card.classList.add('is-top');
  } else {
    const scale = 1 - depth * 0.04;
    const y = depth * 14;
    card.style.transform = `translateY(${y}px) scale(${scale})`;
    card.style.opacity = String(1 - depth * 0.18);
    card.style.filter = `blur(${depth * 0.25}px)`;
  }

  const saved = state.saved.some((item) => item.id === job.id);

  card.innerHTML = `
    <div>
      <div class="card__topline">
        <div>
          <p class="job-company">${job.company}</p>
          <h2 class="job-title">${job.title}</h2>
          <a class="card__location" href="${makeMapsUrl(job.location)}" target="_blank" rel="noreferrer noopener">
            ${job.location}
          </a>
        </div>
        <span class="badge ${saved ? 'badge--secondary' : ''}">${saved ? 'Saved' : job.type}</span>
      </div>
      <p class="job-summary">${job.summary}</p>
    </div>
    <div class="card__footer">
      <div class="meta-grid">
        <div class="meta">
          <span>Location</span>
          <strong>${job.location}</strong>
        </div>
        <div class="meta">
          <span>Salary</span>
          <strong>${job.salary}</strong>
        </div>
      </div>
      <div class="tag-row">
        ${job.highlights.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;

  return card;
}

function renderJobSheet(job) {
  const overlay = document.createElement('section');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="overlay__backdrop" data-action="close"></div>
    <article class="sheet">
      <button class="sheet__close" type="button" aria-label="閉じる" data-action="close">×</button>
      <header class="sheet__header">
        <p class="eyebrow">Job detail</p>
        <h2>${job.title}</h2>
        <p>
          ${job.company} ・
          <a class="sheet__location-link" href="${makeMapsUrl(job.location)}" target="_blank" rel="noreferrer noopener">${job.location}</a>
          ・ ${job.type}
        </p>
        <p>${job.description}</p>
      </header>
      <div class="detail-grid">
        <div class="detail-item">
          <span>想定年収</span>
          <strong>${job.salary}</strong>
        </div>
        <div class="detail-item">
          <span>仕事の要点</span>
          <p>${job.summary}</p>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-item">
          <span>主な業務</span>
          <ul class="list">
            ${job.responsibilities.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="detail-item">
          <span>必要スキル</span>
          <ul class="list">
            ${job.requirements.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="tag-row">
        ${job.perks.map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <footer class="sheet__footer">
        <a class="primary-button" href="#apply/${job.id}">エントリーする</a>
        <button class="secondary-button" type="button" data-action="close">カードに戻る</button>
      </footer>
    </article>
  `;

  return overlay;
}

function renderApplySheet(job) {
  const overlay = document.createElement('section');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="overlay__backdrop" data-action="close"></div>
    <article class="sheet sheet--full">
      <button class="sheet__close" type="button" aria-label="閉じる" data-action="close">×</button>
      <header class="sheet__header">
        <p class="eyebrow">Entry form</p>
        <h2>${job.title}</h2>
        <p>${job.company} にエントリーする内容を入力してください。</p>
      </header>
      <form class="form" id="entry-form">
        <div class="field">
          <label for="name">お名前</label>
          <input id="name" name="name" autocomplete="name" required placeholder="山田 太郎">
        </div>
        <div class="field">
          <label for="email">メールアドレス</label>
          <input id="email" name="email" type="email" autocomplete="email" required placeholder="taro@example.com">
        </div>
        <div class="field">
          <label for="start">希望開始日</label>
          <input id="start" name="start" type="date" required>
        </div>
        <div class="field">
          <label for="portfolio">ポートフォリオ / URL</label>
          <input id="portfolio" name="portfolio" type="url" placeholder="https://example.com">
        </div>
        <div class="field">
          <label for="note">メッセージ</label>
          <textarea id="note" name="note" required placeholder="仕事への意気込みや補足を書いてください。"></textarea>
        </div>
        <input type="hidden" name="jobId" value="${job.id}">
        <button class="primary-button" type="submit">送信する</button>
        <button class="secondary-button" type="button" data-action="close">キャンセル</button>
      </form>
    </article>
  `;

  return overlay;
}

function renderSavedSheet() {
  const overlay = document.createElement('section');
  overlay.className = 'overlay';

  if (state.saved.length === 0) {
    overlay.innerHTML = `
      <div class="overlay__backdrop" data-action="close"></div>
      <article class="sheet">
        <button class="sheet__close" type="button" aria-label="閉じる" data-action="close">×</button>
        <header class="sheet__header">
          <p class="eyebrow">Saved jobs</p>
          <h2>保存済みはまだありません</h2>
          <p>右スワイプで気になる仕事を保存すると、この一覧に残ります。</p>
        </header>
        <footer class="sheet__footer">
          <button class="secondary-button" type="button" data-action="close">カードに戻る</button>
        </footer>
      </article>
    `;
    return overlay;
  }

  overlay.innerHTML = `
    <div class="overlay__backdrop" data-action="close"></div>
    <article class="sheet">
      <button class="sheet__close" type="button" aria-label="閉じる" data-action="close">×</button>
      <header class="sheet__header">
        <p class="eyebrow">Saved jobs</p>
        <h2>保存済みの仕事</h2>
        <p>右スワイプで残した候補を確認できます。</p>
      </header>
      <div class="saved-list">
        ${state.saved
          .map(
            (item) => `
              <article class="saved-card">
                <h3>${item.title}</h3>
                <p>${item.company} ・ ${item.location} ・ ${formatSavedAt(item.savedAt)}</p>
                <p>${item.summary}</p>
                <div class="saved-card__actions">
                  <a class="secondary-button" href="#job/${item.id}">詳細</a>
                  <button class="secondary-button" type="button" data-remove-saved="${item.id}">削除</button>
                </div>
              </article>
            `,
          )
          .join('')}
      </div>
      <footer class="sheet__footer">
        <button class="secondary-button" type="button" data-action="clear-saved">すべて削除</button>
        <button class="primary-button" type="button" data-action="close">カードに戻る</button>
      </footer>
    </article>
  `;

  return overlay;
}

function renderEmptyState() {
  const empty = document.createElement('section');
  empty.className = 'empty-state';
  empty.innerHTML = `
    <div class="empty-state__panel">
      <p class="eyebrow">No jobs</p>
      <h2>候補がありません</h2>
      <p>デモデータを読み込めませんでした。ページを再読み込みしてください。</p>
      <div class="action-row">
        <button class="primary-button" type="button" data-action="reload">再読み込み</button>
      </div>
    </div>
  `;
  return empty;
}

function renderLoadingState() {
  const loading = document.createElement('section');
  loading.className = 'empty-state';
  loading.innerHTML = `
    <div class="empty-state__panel">
      <p class="eyebrow">Loading</p>
      <h2>求人データを読み込み中</h2>
      <p>JSON からカードを組み立てています。</p>
    </div>
  `;
  return loading;
}

function bindHomeInteractions() {
  const topCard = document.querySelector('.card.is-top');
  if (!topCard || state.route.page !== 'home') {
    return;
  }

  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let moved = false;

  const reset = () => {
    topCard.classList.remove('is-dragging');
    topCard.style.transition = '';
    topCard.style.transform = '';
    topCard.style.opacity = '';
    pointerId = null;
  };

  const animateAway = (mode, onFinish) => {
    const rotation = Math.max(-14, Math.min(14, deltaX / 16));
    const duration = reduceMotion ? 1 : 260;
    const transforms = {
      delete: `translate(${window.innerWidth * 1.1}px, ${deltaY * 0.4}px) rotate(${rotation}deg) scale(0.96)`,
      save: `scale(0.94)`,
    };
    const finalTransform = transforms[mode] ?? transforms.delete;

    topCard.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${duration}ms ease`;
    topCard.style.transform = finalTransform;
    topCard.style.opacity = '0';

    window.setTimeout(() => {
      onFinish();
    }, duration);
  };

  const updateTransform = () => {
    const rotate = deltaX / 22;
    const lift = Math.min(deltaY, 40) * 0.12;
    topCard.style.transform = `translate(${deltaX}px, ${deltaY - lift}px) rotate(${rotate}deg)`;
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) {
      return;
    }

    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    deltaX = 0;
    deltaY = 0;
    moved = false;
    topCard.classList.add('is-dragging');
    topCard.setPointerCapture(pointerId);
  };

  const onPointerMove = (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    deltaX = event.clientX - startX;
    deltaY = event.clientY - startY;
    if (Math.hypot(deltaX, deltaY) > 8) {
      moved = true;
    }

    updateTransform();
  };

  const onPointerEnd = (event) => {
    if (pointerId !== event.pointerId) {
      return;
    }

    const job = getCurrentJob();
    const cardWidth = topCard.getBoundingClientRect().width;
    const cardHeight = topCard.getBoundingClientRect().height;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!moved && absX < 12 && absY < 12) {
      reset();
      openRoute(`job/${job.id}`);
      return;
    }

    if (deltaX > Math.max(110, cardWidth * 0.24) && absX > absY) {
      animateAway('delete', () => {
        removeCurrentJob();
        advanceCard();
      });
      return;
    }

    if (deltaX < -Math.max(110, cardWidth * 0.24) && absX > absY) {
      saveCurrentJob();
      reset();
      advanceCard();
      return;
    }

    if (deltaY > Math.max(110, cardHeight * 0.2) && absY > absX) {
      saveCurrentJob();
      reset();
      advanceCard();
      return;
    }

    reset();
  };

  topCard.addEventListener('pointerdown', onPointerDown);
  topCard.addEventListener('pointermove', onPointerMove);
  topCard.addEventListener('pointerup', onPointerEnd);
  topCard.addEventListener('pointercancel', reset);
}

function bindOverlayInteractions() {
  const overlay = document.querySelector('.overlay');
  if (!overlay) {
    const reloadButton = document.querySelector('[data-action="reload"]');
    reloadButton?.addEventListener('click', () => {
      location.reload();
    });
    return;
  }

  overlay.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action], [data-remove-saved]');
    if (!target) {
      return;
    }

    const action = target.dataset.action;
    if (action === 'close') {
      location.hash = '';
      return;
    }

    if (action === 'clear-saved') {
      state.saved = [];
      persistSaved();
      showToast('保存済みをすべて削除しました', 'ローカル保存を更新しました。');
      render();
      return;
    }

    if (target.dataset.removeSaved) {
      removeSaved(target.dataset.removeSaved);
    }
  });

  const form = overlay.querySelector('#entry-form');
  if (form) {
    const startInput = form.querySelector('#start');
    startInput.value = new Date().toISOString().slice(0, 10);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      state.entries.unshift({
        id: createId(),
        createdAt: new Date().toISOString(),
        ...payload,
      });
      persistEntries();

      showToast('エントリーを送信しました', '内容はローカルに保存されています。');
      location.hash = `job/${payload.jobId}`;
      form.reset();
    });
  }
}

function openRoute(path) {
  location.hash = path;
}

function advanceCard() {
  state.index = (state.index + 1) % state.jobs.length;
  render();
}

function saveCurrentJob() {
  const job = getCurrentJob();
  const savedEntry = {
    ...job,
    savedAt: new Date().toISOString(),
  };
  state.saved = [savedEntry, ...state.saved.filter((item) => item.id !== job.id)];
  persistSaved();
  showToast('保存しました', `${job.company} を保存済みに追加しました。`);
}

function removeCurrentJob() {
  const job = getCurrentJob();
  state.jobs = state.jobs.filter((item) => item.id !== job.id);
  state.index = Math.min(state.index, Math.max(state.jobs.length - 1, 0));
  showToast('削除しました', `${job.company} を候補から外しました。`);
}

function removeSaved(jobId) {
  state.saved = state.saved.filter((item) => item.id !== jobId);
  persistSaved();
  showToast('保存済みから削除しました', '一覧を更新しました。');
  render();
}

function persistSaved() {
  writeJson(STORAGE_KEYS.saved, state.saved);
  dom.savedButton.textContent = `保存 ${state.saved.length}`;
}

function persistEntries() {
  writeJson(STORAGE_KEYS.entries, state.entries);
}

function showToast(title, message) {
  clearTimeout(state.toastTimer);
  state.toast = { title, message };
  renderToast();
  state.toastTimer = window.setTimeout(() => {
    state.toast = null;
    renderToast();
  }, 2200);
}

function renderToast() {
  const existing = document.querySelector('.toast');
  if (existing) {
    existing.remove();
  }

  if (!state.toast) {
    return;
  }

  const toast = document.createElement('aside');
  toast.className = 'toast';
  toast.innerHTML = `
    <strong>${state.toast.title}</strong>
    <p>${state.toast.message}</p>
  `;
  document.body.append(toast);
}

function getCurrentJob() {
  return state.jobs[state.index % state.jobs.length];
}

function getJobById(jobId) {
  return state.jobs.find((job) => job.id === jobId) ?? null;
}

function getNextJobs(jobId, count) {
  const startIndex = state.jobs.findIndex((job) => job.id === jobId);
  const results = [];

  for (let offset = 1; offset <= count; offset += 1) {
    const job = state.jobs[(startIndex + offset) % state.jobs.length];
    if (job) {
      results.push(job);
    }
  }

  return results;
}

function formatSavedAt(isoString) {
  return dateFormatter.format(new Date(isoString));
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `entry-${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

function makeMapsUrl(location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}
