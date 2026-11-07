
/* Editable settings. Empty email = local consultation memo only, never a send form. */
const SITE_CONFIG = Object.freeze({
  contactEmail: "pizastudio5539@gmail.com", // Public business email already listed on the existing Pizastudio website.
  brandName: "Pizastudio",
  edition: "山梨版",
});
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menuButton = $("#menu-toggle"), nav = $("#site-nav");
  function closeMenu(returnFocus = false) {
    nav.classList.remove("is-open"); menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "メニューを開く");
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    nav.classList.toggle("is-open", open);
  });
  $$("a", nav).forEach(a => a.addEventListener("click", () => closeMenu()));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
  document.addEventListener("click", e => {
    if (!nav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
  });
  const desktop = matchMedia("(min-width: 701px)");
  if (desktop.addEventListener) desktop.addEventListener("change", e => { if (e.matches) closeMenu(); });

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = reducedMotion.matches;
  const motionButton = $("#motion-toggle");
  function updateMotion() {
    document.documentElement.classList.toggle("motion-paused", paused);
    document.documentElement.style.scrollBehavior = paused ? "auto" : "";
    motionButton.setAttribute("aria-pressed", String(paused));
    $(".motion-text", motionButton).textContent = paused ? "動きを再開" : "動きを止める";
    if (reducedMotion.matches) {
      $(".motion-text", motionButton).textContent = "動きを抑制中";
      motionButton.title = "端末の「視差効果を減らす」設定を優先しています。";
    } else motionButton.title = "ページの装飾アニメーションを切り替えます。";
  }
  motionButton.addEventListener("click", () => { if (!reducedMotion.matches) paused = !paused; updateMotion(); });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", e => { paused = e.matches; updateMotion(); });
  updateMotion();

  const filters = $$(".filter"), cards = $$(".idea-card");
  filters.forEach(button => button.addEventListener("click", () => {
    filters.forEach(b => b.setAttribute("aria-pressed", String(b === button)));
    let count = 0;
    cards.forEach(card => { const show = button.dataset.filter === "all" || card.dataset.category === button.dataset.filter; card.hidden = !show; if (show) count++; });
    $("#filter-status").textContent = `${button.textContent}：${count}件の提案イメージを表示しています。`;
  }));

  const content = {
    local: { kicker: "CONCEPT 01 / FILM", title: "その場所に、行きたくなる映像。", body: `<p>宿やお店の空間、人の表情、その場所に流れる時間を、一つの物語にまとめる制作のご提案です。</p><h3>例えば、こんな構成に</h3><ul><li>周辺の風景から、店内の雰囲気へ。</li><li>商品やサービスのこだわりを、寄りのカットで。</li><li>店主の言葉とともに、お店の想いを伝える。</li></ul><h3>組み合わせられるもの</h3><p>紹介動画、SNS向けの縦型動画、ホームページ用のビジュアル。掲載先に合わせた画角・尺から相談できます。</p><p class="credit-tag">これは制作内容の提案です。実在する施設の受注実績・完成映像ではありません。</p>`, service: "撮影・動画編集" },
    product: { kicker: "CONCEPT 02 / MOTION", title: "つくり手の想いまで、届ける。", body: `<p>商品の美しさだけでなく、使うシーンや生まれた背景も伝えるブランド表現のご提案です。</p><h3>例えば、こんな構成に</h3><ul><li>質感・形・使い方を丁寧に見せる商品カット。</li><li>特徴をわかりやすく整理した図解やアニメーション。</li><li>ロゴの動きで締めくくる、統一されたブランド表現。</li></ul><h3>組み合わせられるもの</h3><p>商品紹介動画、ロゴアニメーション、サービス説明用のモーショングラフィックス、必要に応じた3DCG・立体表現。</p><p class="credit-tag">画面の商品はオリジナルの図形による提案イメージです。販売商品・クライアント実績ではありません。</p>`, service: "モーショングラフィックス" },
    web: { kicker: "CONCEPT 03 / WEB", title: "映像とウェブで、らしさをつなぐ。", body: `<p>事業や商品の魅力を伝えるページから、相談・予約への入口まで。写真や映像と言葉を一つの世界観でまとめるご提案です。</p><h3>例えば、こんな構成に</h3><ul><li>誰の、どんな悩みに応えるサービスかを整理。</li><li>魅力や制作の背景を、文章・写真・動画で紹介。</li><li>スマートフォンでも迷わない問い合わせへの導線。</li></ul><h3>制作前に一緒に決めること</h3><p>ページ数、更新方法、公開先、ドメイン、フォームの送信先。予約や決済などの外部サービス連携は、必要な内容と費用を確認してから設計します。</p><p class="credit-tag">表示している画面は自主制作のデザインイメージです。導入実績や成果を示すものではありません。</p>`, service: "LP・ホームページ" },
    motion: { kicker: "PIZASTUDIO / MOTION IDENTITY", title: "想いから、動きへ。", body: `<div class="motion-film-player" tabindex="0" aria-label="Pizastudio ブランドモーションの動画プレーヤー"><div class="motion-film-screen"><video class="motion-film-video" controls playsinline muted preload="metadata" poster="/assets/art-3c5d2a59a4f6.webp" aria-label="24秒のブランドムービー。想いが動きだす文字表現、立体造形、多彩な図形、山並み、Pizastudioのロゴへと展開。音声は音楽のみで、ナレーションはありません。"></video><button type="button" class="motion-film-start" aria-label="モーションを再生する"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 3 15 9-15 9Z"/></svg></span><span data-start-label>再生する</span></button><p class="motion-film-error" role="status" hidden>この環境では映像を読み込めませんでした。同梱のMP4を動画プレーヤーで開いてご確認ください。</p></div><div class="motion-film-toolbar"><button type="button" class="film-play" aria-label="一時停止"><svg data-play-icon viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke-width="3"/></svg></button><button type="button" class="film-restart" aria-label="最初から再生"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8a8 8 0 1 1-1 7M5 3v6h6"/></svg></button><span class="film-time">00:00 / 00:24</span><input class="film-scrub" type="range" min="0" max="24" step="0.01" value="0" aria-label="動画の再生位置"><button type="button" class="film-sound" aria-pressed="false" aria-label="音声をオンにする"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 5 8H2v8h3l6 4ZM15 8q5 4 0 8m3-12q8 8 0 16"/></svg><span>音声オン</span></button><button type="button" class="film-full" aria-label="全画面表示"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3H3v6m12-6h6v6M3 15v6h6m6 0h6v-6"/></svg></button></div><div class="motion-film-chapters" role="group" aria-label="シーンを選ぶ"><button type="button" data-film-time="0" aria-current="true" aria-label="0秒から：想いのはじまり"><small>01 / 00s</small>IDEA</button><button type="button" data-film-time="4" aria-current="false" aria-label="4秒から：文字のリズム"><small>02 / 04s</small>TYPE</button><button type="button" data-film-time="8" aria-current="false" aria-label="8秒から：立体のかたち"><small>03 / 08s</small>FORM</button><button type="button" data-film-time="12" aria-current="false" aria-label="12秒から：表現の広がり"><small>04 / 12s</small>SYSTEM</button><button type="button" data-film-time="16" aria-current="false" aria-label="16秒から：山梨から"><small>05 / 16s</small>LOCAL</button><button type="button" data-film-time="20" aria-current="false" aria-label="20秒から：ブランドへ"><small>06 / 20s</small>IDENTITY</button></div></div><div class="motion-film-meta"><span>1920 × 1080 / 60 fps / 24 sec</span><span>オリジナルサウンド付き · 初期はミュート</span></div><p class="motion-film-note">文字のリズム、立体的なかたち、山並みからブランドへ。このサイト用に新規制作したモーションです。受注実績・クライアント納品映像ではありません。</p>`, service: "モーショングラフィックス" },
    privacy: { kicker: "PRIVACY", title: "個人情報の取り扱い", body: `<p>詳しくは<a href="/privacy/">プライバシーポリシー</a>をご覧ください。</p>`, service: null }
  };
  const dialog = $("#detail-dialog");
  let dialogOpener = null, currentService = null;
  let previousOverflow = "";
  function openDialog(key, opener) {
    const data = content[key]; if (!data) return;
    window.PizaFilm.destroy();
    dialog.classList.toggle("is-motion", key === "motion");
    dialogOpener = opener; currentService = data.service;
    $("#dialog-kicker").textContent = data.kicker;
    $("#dialog-title").textContent = data.title;
    // Only static, developer-owned markup is inserted. User input is never parsed as HTML.
    $("#dialog-copy").innerHTML = data.body;
    $("#dialog-consult").hidden = !data.service;
    if (typeof dialog.showModal === "function") {
      previousOverflow = document.body.style.overflow;
      dialog.showModal(); document.body.style.overflow = "hidden";
      $("#dialog-close").focus();
    } else {
      dialog.setAttribute("open", ""); dialog.scrollIntoView();
    }
    if (key === "motion") window.PizaFilm.mount(dialog);
  }
  function closeDialog() {
    window.PizaFilm.destroy();
    if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
    document.body.style.overflow = previousOverflow;
    if (dialogOpener) dialogOpener.focus({ preventScroll: true });
  }
  $$("[data-dialog]").forEach(button => button.addEventListener("click", () => openDialog(button.dataset.dialog, button)));
  $("#dialog-close").addEventListener("click", closeDialog);
  dialog.addEventListener("close", () => { window.PizaFilm.destroy(); document.body.style.overflow = previousOverflow; dialog.classList.remove("is-motion"); });
  dialog.addEventListener("cancel", e => { e.preventDefault(); closeDialog(); });
  dialog.addEventListener("click", e => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) closeDialog();
  });
  $("#dialog-consult").addEventListener("click", () => {
    if (currentService) {
      const choice = $$("input[name=service]").find(input => input.value === currentService);
      if (choice) choice.checked = true;
    }
    closeDialog(); $("#contact").scrollIntoView({ behavior: paused ? "instant" : "smooth" });
    // Focus the first field without immediately snapping away from the contact heading.
    $("#name").focus({ preventScroll: true });
  });

  const form = $("#consult-form"), output = $("#memo-output"), memo = $("#memo-text"), status = $("#memo-status");
  const configuredEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(SITE_CONFIG.contactEmail) ? SITE_CONFIG.contactEmail : "";
  if (configuredEmail) {
    $("#form-notice-text").textContent = "相談内容からメール文を作成した後、メールアプリを開けます。内容をご確認のうえ送信してください。";
    
  }
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const clean = (name, max = 200) => String(data.get(name) || "").trim().slice(0, max);
    const details = clean("details", 3000);
    if (!details) { $("#details").setCustomValidity("ご相談内容を入力してください。"); $("#details").reportValidity(); return; }
    const services = data.getAll("service").join(" / ") || "相談して決めたい";
    const lines = ["Pizastudio 山梨版｜制作の相談メモ", "", `お名前・屋号：${clean("name") || "未記入"}`, `メールアドレス：${clean("email") || "未記入"}`, `相談したい内容：${services}`, `希望時期：${clean("timing") || "相談して決めたい"}`, `予算の目安：${clean("budget") || "相談して決めたい"}`, "", "【ご相談内容】", details, "", "※このメモを作成しただけでは、Pizastudioに送信されません。"];
    memo.value = lines.join("\n"); output.hidden = false;
    status.textContent = "相談メモを作成しました。内容はまだ送信されていません。";
    const emailLink = $("#open-mail");
    if (configuredEmail) {
      emailLink.href = `mailto:${configuredEmail}?subject=${encodeURIComponent("【制作のご相談】" + (clean("name") || "山梨版サイトより"))}&body=${encodeURIComponent(memo.value)}`;
      emailLink.hidden = false;
    }
    output.scrollIntoView({ behavior: paused ? "instant" : "smooth", block: "center" });
    $("#memo-title").focus({ preventScroll: true });
  });
  $("#details").addEventListener("input", () => $("#details").setCustomValidity(""));
  $("#copy-memo").addEventListener("click", async () => {
    if (!memo.value) return;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(memo.value);
      status.textContent = "相談メモをコピーしました。まだ送信はされていません。";
    } catch {
      memo.focus(); memo.select(); memo.setSelectionRange(0, memo.value.length);
      let copied = false;
      try { copied = document.execCommand("copy"); } catch { /* manual fallback below */ }
      status.textContent = copied ? "相談メモをコピーしました。まだ送信はされていません。" : "本文を選択しました。端末のコピー操作でコピーしてください。";
    }
  });
  $("#save-memo").addEventListener("click", () => {
    if (!memo.value) return;
    const blob = new Blob(["\ufeff", memo.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob), link = document.createElement("a");
    link.href = url; link.download = "Pizastudio_制作の相談メモ.txt";
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = "テキストファイルの保存を開始しました。まだ送信はされていません。";
  });
})();


// Photos enhance the original graphic; a failed load never hides the content.
(() => {
  document.querySelectorAll(".scenic-photo").forEach(image => {
    const ready = () => {
      if (!image.naturalWidth) return;
      image.classList.add("is-loaded");
      const frame = image.closest(".art-window");
      if (frame) {
        frame.classList.add("has-photo");
        const artwork = frame.querySelector(".landscape");
        if (artwork) artwork.setAttribute("aria-hidden", "true");
      }
    };
    const failed = () => {
      if (image.dataset.fallback && !image.dataset.retried) {
        image.dataset.retried = "true";
        image.src = image.dataset.fallback;
      } else { image.hidden = true; }
    };
    image.addEventListener("load", ready);
    image.addEventListener("error", failed);
    if (image.complete) { if (image.naturalWidth) ready(); else failed(); }
  });
})();


// Isolated, accessible slideshow. No libraries, tracking, form submission or image generation.
(() => {
 'use strict';
 const root=document.querySelector('#hero-gallery'); if(!root) return;
 const frame=root.querySelector('#hero-window');
 const slides=[...root.querySelectorAll('.gallery-slide')];
 const images=slides.map(s=>s.querySelector('img'));
 const thumbs=[...root.querySelectorAll('.gallery-thumb')];
 const play=root.querySelector('#gallery-play');
 const status=root.querySelector('#gallery-status');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const ready=images.map(()=>false), failed=images.map(()=>false);
 const interval=6000;
 let index=0, pending=0, timer=0, userPaused=false, hover=false, focusHold=false, visible=true;
 const globalPaused=()=>reduced.matches||document.documentElement.classList.contains('motion-paused');
 const available=()=>ready.reduce((n,r,i)=>n+(r&&!failed[i]?1:0),0);
 function updatePlayback(){
   clearTimeout(timer);timer=0;
   const stopped=userPaused||globalPaused();
   play.setAttribute('aria-pressed',String(stopped));
   play.setAttribute('aria-label',stopped?'写真の自動切り替えを再開':'写真の自動切り替えを停止');
   play.title=reduced.matches?'端末の動きを抑える設定を優先しています。手動では切り替えられます。':globalPaused()?'ページ下の「動きを再開」で自動切り替えを再開できます。':stopped?'写真を自動で切り替える':'写真の自動切り替えを止める';
   const run=!stopped&&!hover&&!focusHold&&visible&&!document.hidden&&available()>1;
   root.dataset.playing=String(run);
   if(run) timer=setTimeout(()=>step(1,false),interval);
 }
 function show(i,announce=false){
   if(!ready[i]||failed[i]) return;
   index=i;pending=null;
   slides.forEach((s,j)=>{s.classList.toggle('is-active',j===i);s.setAttribute('aria-hidden',String(j!==i));});
   thumbs.forEach((b,j)=>b.setAttribute('aria-current',String(j===i)));
   frame.classList.add('has-photo');
   frame.querySelector('.landscape')?.setAttribute('aria-hidden','true');
   root.querySelector('#gallery-place').textContent=slides[i].dataset.name;
   root.querySelector('#gallery-place-en').textContent=slides[i].dataset.english+' / YAMANASHI';
   root.querySelector('#gallery-current').textContent=String(i+1).padStart(2,'0');
   root.dataset.current=String(i);
   if(announce)status.textContent=`${i+1} / ${slides.length}：${slides[i].dataset.name}を表示しています。`;
   updatePlayback();
 }
 function select(i,manual=true){
   if(manual)userPaused=true;
   if(failed[i]){status.textContent='この写真を読み込めませんでした。ほかの写真をお選びください。';updatePlayback();return;}
   if(ready[i])show(i,manual);
   else{pending=i;status.textContent=slides[i].dataset.name+'を読み込んでいます。';updatePlayback();}
 }
 function step(delta,manual=true){
   for(let n=1;n<=slides.length;n++){
     const i=(index+delta*n+slides.length*2)%slides.length;
     if(ready[i]&&!failed[i]){select(i,manual);return;}
   }
   updatePlayback();
 }
 thumbs.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
 root.querySelector('#gallery-prev').addEventListener('click',()=>step(-1));
 root.querySelector('#gallery-next').addEventListener('click',()=>step(1));
 play.addEventListener('click',()=>{
   if(globalPaused()){status.textContent=reduced.matches?'端末の設定に合わせ、自動切り替えを停止しています。写真は手動で選べます。':'ページの「動きを再開」ボタンで停止を解除できます。';return;}
   userPaused=!userPaused;focusHold=false;updatePlayback();
 });
 root.addEventListener('keydown',e=>{
   let i=null;
   if(e.key==='ArrowRight'){e.preventDefault();step(1);return;}
   if(e.key==='ArrowLeft'){e.preventDefault();step(-1);return;}
   if(e.key==='Home')i=0;
   if(e.key==='End')i=slides.length-1;
   if(i!==null){e.preventDefault();select(i);}
 });
 root.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hover=true;updatePlayback();}});
 root.addEventListener('pointerleave',()=>{hover=false;updatePlayback();});
 root.addEventListener('focusin',()=>{focusHold=true;updatePlayback();});
 root.addEventListener('focusout',()=>setTimeout(()=>{if(!root.contains(document.activeElement)){focusHold=false;updatePlayback();}},0));
 let pointer=null;
 frame.addEventListener('pointerdown',e=>{if(e.target.closest('button,a')||!e.isPrimary||e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};try{frame.setPointerCapture(e.pointerId);}catch{}});
 frame.addEventListener('pointerup',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.35)step(dx<0?1:-1);});
 frame.addEventListener('pointercancel',()=>{pointer=null;});
 document.addEventListener('visibilitychange',updatePlayback);
 new MutationObserver(updatePlayback).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 if(reduced.addEventListener)reduced.addEventListener('change',updatePlayback);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;updatePlayback();},{threshold:.1}).observe(root);
 images.forEach((img,i)=>{
   const loaded=()=>{if(!img.naturalWidth)return;ready[i]=true;failed[i]=false;img.style.visibility='';thumbs[i].disabled=false;
     if(pending===i||!ready[index])show(i,pending===i&&userPaused);else updatePlayback();};
   const error=()=>{
     if(img.dataset.fallback&&!img.dataset.retried){img.dataset.retried='true';img.src=img.dataset.fallback;return;}
     ready[i]=false;failed[i]=true;img.style.visibility='hidden';thumbs[i].disabled=true;
     if(index===i){const other=ready.findIndex((r,j)=>r&&!failed[j]);if(other>=0)show(other);else{frame.classList.remove('has-photo');frame.querySelector('.landscape')?.removeAttribute('aria-hidden');}}
     if(pending===i){pending=null;status.textContent='一部の写真を読み込めませんでした。ほかの写真は引き続きご覧いただけます。';}
     updatePlayback();
   };
   img.addEventListener('load',loaded);img.addEventListener('error',error);
   if(img.complete){if(img.naturalWidth)loaded();else error();}
 });
 thumbs.forEach((thumb,i)=>{const img=thumb.querySelector('img');img.addEventListener('error',()=>{if(!img.dataset.retried){img.dataset.retried='true';img.src=images[i].dataset.fallback;}else img.style.visibility='hidden';});});
 updatePlayback();
})();

