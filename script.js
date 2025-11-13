/* ============================================================
   LOOPYIT | Full Script (인트로 + 기능 + 카드)
============================================================ */

// ✅ 공통 초기화
AOS.init();
gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   [1] 인트로 / 마우스 트레일 / 스크롤 인터랙션
============================================================ */
$(document).ready(function () {
  const $glassyCircle = $(".glassy-circle");
  const $canvas = $("canvas");
  const ctx = $canvas[0].getContext("2d");

  // 마우스 블러 원
  $(window).on("mousemove", function (e) {
    $glassyCircle.css(
      "transform",
      `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`
    );
  });

  // 캔버스 리사이즈
  function resizeCanvas() {
    $canvas[0].width = window.innerWidth;
    $canvas[0].height = window.innerHeight;
  }
  resizeCanvas();
  $(window).on("resize", resizeCanvas);

  // 네온 트레일
  let mouseMoved = false;
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const params = { pointsNumber: 15, widthFactor: 20, spring: 0.5, friction: 0.45 };
  const trail = new Array(params.pointsNumber).fill().map(() => ({
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0,
  }));

  $(window).on("mousemove", (e) => {
    mouseMoved = true;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  function update(t) {
    if (!mouseMoved) {
      pointer.x =
        (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * window.innerWidth;
      pointer.y =
        (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.sin(0.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
    trail.forEach((p, i) => {
      const prev = i === 0 ? pointer : trail[i - 1];
      const spring = i === 0 ? 0.4 * params.spring : params.spring;
      p.dx += (prev.x - p.x) * spring;
      p.dy += (prev.y - p.y) * spring;
      p.dx *= params.friction;
      p.dy *= params.friction;
      p.x += p.dx;
      p.y += p.dy;
    });

    ctx.shadowColor = "#00ff66";
    ctx.shadowBlur = 30;
    ctx.strokeStyle = "#00ff66";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
      const xc = 0.5 * (trail[i].x + trail[i + 1].x);
      const yc = 0.5 * (trail[i].y + trail[i + 1].y);
      ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      ctx.lineWidth = params.widthFactor * (params.pointsNumber - i) * 0.02;
      ctx.stroke();
    }

    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    requestAnimationFrame(update);
  }
  update(0);

  // 스크롤 색상 전환
  const $section2 = $(".section2");
  const $section3 = $(".section3");
  const $circle = $(".circle");
  const $textStep1 = $(".text-step-1");
  const $textStep2Hw = $(".highlight-word");
  
  $(window).on("scroll", function () {
    const scrollTop = $(window).scrollTop();
    const sectionTop = $section2.offset().top;
    const sectionHeight = $section2.outerHeight();
    let progress = (scrollTop - sectionTop) / sectionHeight;
    progress = Math.max(0, Math.min(progress, 1));

    const sectionTop3 = $section3.offset().top;
    const sectionHeight3 = $section3.outerHeight();
    let progress3 = (scrollTop - sectionTop3) / sectionHeight3;
    progress3 = Math.max(0, Math.min(progress3, 1));

    if (progress > 0 && progress < 0.2) {
      $textStep1.css("opacity", 1);
      $circle.css("opacity", 1);
    } else if (progress < 0.2) {
      $textStep1.css("opacity", 0);
      $circle.css("opacity", 0);
    }

    // ✅ 화면의 절반 정도 스크롤 시 색상 변경
    if (progress3 >= 0.15) {
      $textStep2Hw.css("color", "#00ff66");
    } else {
      $textStep2Hw.css("color", "#fff");
    }

    if (progress >= 0.2 && progress < 0.45) {
      $textStep1.css("opacity", 0);
      $circle.css("opacity", 1);
      const initialSize = 90;
      const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
      const maxScale = screenDiagonal / initialSize;
      const scale = 1 + ((progress - 0.2) / 0.25) * (maxScale - 1);
      $circle.css("transform", `translate(-50%, -50%) scale(${scale})`);
    }

    if (progress < 0.45) {
      $section2.css("background", "#fff");
    } else {
      $section2.css("background", "#000");
    }

    if (progress >= 0.5 && progress < 0.6) {
      $circle.css("opacity", 0);
    }
  });
});

/* ============================================================
   [2] Key Features (GSAP ScrollTrigger + Swiper + 커서)
============================================================ */
function SectionGroup__init() {
  $(".con").each(function (index, node) {
    var $group = $(node);
    var $section = $group.find(" > .sec:not(:first-child)");

    $section.each(function (index, node) {
      var $sectionOne = $(node);
      gsap.to($sectionOne, {
        ease: "none",
        scrollTrigger: {
          trigger: $sectionOne,
          start: "top 100%",
          end: "bottom 100%",
          pin: $sectionOne.prev(),
          pinSpacing: false,
          scrub: true,
        },
      });
    });
  });
}
SectionGroup__init();

// Swiper
const swiper = new Swiper(".swiper-container", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 40,
    stretch: 0,
    depth: -200,
    modifier: 1,
    slideShadows: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// 클릭 활성화
$(".swiper-slide > *").click(function () {
  const $this = $(this);
  if ($this.hasClass("active")) {
    $this.removeClass("active");
  } else {
    $(".swiper-slide > *").removeClass("active");
    $this.addClass("active");
  }
});

// 커서 인터랙션
const $cursorShadow = $(".cursor-shadow");
let isActive = false;

$(window).mousemove((e) => {
  $cursorShadow.css({ top: e.clientY, left: e.clientX });
});

$(".swiper-slide").mouseenter(function () {
  if (!isActive) {
    $("html").addClass("need-to-cursor-big");
    $cursorShadow.text("맞춤형 건강 관리 시작");
  }
});

$(".swiper-slide").mouseleave(function () {
  if (!isActive) {
    $("html").removeClass("need-to-cursor-big");
    $cursorShadow.text("");
  }
});

$(".swiper-slide").click(function () {
  isActive = !isActive;
  if (isActive) {
    $("html").removeClass("need-to-cursor-big");
    $cursorShadow.text("");
  } else {
    $("html").addClass("need-to-cursor-big");
    $cursorShadow.text("맞춤형 건강 관리 시작");
  }
});

/* ============================================================
   [3] 카드 섹션 애니메이션 + 감속 스크롤
============================================================ */
const section = document.querySelector(".sec_wrap_3");
const cards = document.querySelectorAll(".cards-wrapper .card");
const body = document.body;

if (section && cards.length === 3) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sec_wrap_3",
      start: "top top",
      end: "+=150%",
      scrub: 0.8,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (self.progress > 0.55) body.classList.add("scrolled-3");
        else body.classList.remove("scrolled-3");
      },
      onLeave: () => cards.forEach((c) => c.classList.remove("hover-active")),
      onEnterBack: () => cards.forEach((c) => c.classList.remove("hover-active")),
    },
    onComplete: () => cards.forEach((c) => c.classList.add("hover-active")),
  });

  tl.fromTo(
    cards,
    { y: 160, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 0.3, scale: 1, duration: 0.8, stagger: 0.08, ease: "power2.out" },
    0
  )
    .to(
      cards,
      { x: 0, scale: 1.12, opacity: 1, duration: 0.9, ease: "power2.inOut", stagger: 0.02 },
      "+=0.1"
    )
    .to(".card.card_1", { x: -550, duration: 1.1, ease: "power2.inOut" }, "+=0.3")
    .to(".card.card_2", { scale: 1, duration: 1.1, ease: "power2.inOut" }, "<")
    .to(".card.card_3", { x: 550, duration: 1.1, ease: "power2.inOut" }, "<")
    .to(cards, { y: 0, duration: 0.4, ease: "sine.out" }, ">-0.1");
}

// 반응형 대응
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

// 감속 스크롤 (Lenis)
const lenis = new Lenis({
  duration: 1,
  smooth: true,
  direction: "vertical",
});

// Lenis 스크롤이 일어날 때마다 ScrollTrigger에 알림
lenis.on('scroll', ScrollTrigger.update);

// GSAP 타이머에 Lenis를 물려서 한 타임라인에서 갱신
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // gsap time(s) → ms
});
gsap.ticker.lagSmoothing(0);


// 슬라이드 데이터
const slides = [
  {
    role: "직장인 / 데이터 중시형",
    name: "이현우 (32세, 마케터)",
    text:
      "출퇴근 시간이 길어서 식습관도 운동도 항상 엉망이었는데, AI가 제 건강 데이터를 분석해 매일 필요한 영양소랑 운동을 추천해주니까 고민이 줄었고, 한달째는 일주일 단위로 루틴 변화를 확인하는 재미도 있어요. 단순 앱이 아니라 생활 코치 같아요.",
    color: "#00ff4a",
  },
  {
    role: "육아+자기관리 병행형",
    name: "박세린 (38세, 두 아이 엄마)",
    text:
      "애들 챙기다 보면 제 루틴은 항상 뒤로 밀렸거든요. 근데 루피잇이 ‘지금은 5분만 이것만 해요’ 식으로 현실적인 미션을 주니까, 부담 없이 따라가게 돼요. 눈치 안 보면서 나를 챙길 수 있는 첫 서비스였어요.",
    color: "#4affff",
  },
  {
    role: "운동 초보 / 의지 부족형",
    name: "정유성 (27세, 대학원생)",
    text:
      "PT 받으면 그때만 불타오르고 금방 흐지부지됐는데, 루틴을 자꾸 체크해주고 ‘오늘 이 정도면 충분해요’라고 말해주는 게 생각보다 멘탈이 되게 든든했어요. 혼자 하는 것 같은데 혼자가 아닌 느낌?",
    color: "#bfff00",
  },
];

let currentIndex = 0;
let isAnimating = false;

// DOM 잡기
const dots = document.querySelectorAll(".indicator-dot");

// 현재 front/back 카드 참조용 헬퍼
const frontCardRef = () => document.querySelector(".card-front");
const backCardRef = () => document.querySelector(".card-back");

// 카드 안 내용 채우기
function fillCard(cardEl, data) {
  const avatar = cardEl.querySelector(".avatar");
  const role = cardEl.querySelector(".role-line");
  const name = cardEl.querySelector(".name-line");
  const text = cardEl.querySelector(".review-text");

  avatar.style.backgroundColor = data.color;
  role.textContent = data.role;
  name.textContent = data.name;
  text.textContent = data.text;
}

// 점 active 업데이트
function updateDots(index) {
  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

// 초기 세팅
fillCard(frontCardRef(), slides[currentIndex]);
fillCard(backCardRef(), slides[(currentIndex + 1) % slides.length]);
updateDots(currentIndex);

// 슬라이드 전환 함수
function goToSlide(nextIndex) {
  if (isAnimating || nextIndex === currentIndex) return;
  isAnimating = true;

  // 다음 카드 내용 백카드에 채워넣기
  fillCard(backCardRef(), slides[nextIndex]);

  const frontCard = frontCardRef();
  const backCard = backCardRef();

  // 애니메이션 실행
  frontCard.classList.add("anim-out");
  backCard.classList.add("anim-in");

  // 애니 끝나면 교체
  setTimeout(() => {
    frontCard.classList.remove("anim-out", "card-front");
    backCard.classList.remove("anim-in", "card-back");

    // 역할 교체
    frontCard.classList.add("card-back");
    backCard.classList.add("card-front");

    // 다음 인덱스 갱신
    currentIndex = nextIndex;
    updateDots(currentIndex);

    // 다음 카드 미리 준비
    const nextUp = (currentIndex + 1) % slides.length;
    fillCard(backCardRef(), slides[nextUp]);

    // 상태 초기화
    frontCardRef().classList.remove("anim-out", "anim-in");
    backCardRef().classList.remove("anim-out", "anim-in");

    isAnimating = false;
  }, 700);
}

// 🔹 Hover 이벤트로 카드 전환
dots.forEach(dot => {
  dot.addEventListener("mouseenter", () => {
    const idx = Number(dot.getAttribute("data-index"));
    goToSlide(idx);
  });
});

// 4섹션------
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.random_box');
  const boxes   = document.querySelector('.random_box_up');
  if (!section || !boxes) return;

  const add    = () => { boxes.classList.add('in-view'); };
  const remove = () => { boxes.classList.remove('in-view'); };

  // 상태
  let wasVisible    = null;   // 섹션 가시 여부 기록 (IO 기준)
  let inViewApplied = false;  // 실제로 .in-view 클래스가 적용돼 있는지
  let lastY         = window.scrollY || window.pageYOffset;

  const THRESH = 0.22; // 섹션 가시 판정 임계값
  const ioOpts = {
    root: null,
    rootMargin: '-20% 0px -20% 0px',
    threshold: [0, THRESH, 0.5, 1],
  };

  // 가시 중에도 스크롤 방향으로 즉시 토글 (요구사항)
  const applyDirectionLogic = (scrollingUp, visible) => {
    if (!visible) return; // 가시 아닐 땐 IO 로직이 처리
    if (scrollingUp && inViewApplied) {
      // ↑ 위로 스크롤하면, 섹션 안에 있어도 숨김
      remove();
      inViewApplied = false;
    } else if (!scrollingUp && !inViewApplied) {
      // ↓ 아래로 스크롤하면서 다시 보이게
      add();
      inViewApplied = true;
    }
  };

  // IO: 진입/이탈 판정
  const io = new IntersectionObserver((entries) => {
    const e = entries[0];
    const visible = e.isIntersecting && e.intersectionRatio >= THRESH;

    if (wasVisible === null) { // 초기 1회: 상태만 기록
      wasVisible = visible;
      return;
    }

    // 안 보였다가 → 보임: 등장
    if (!wasVisible && visible) {
      add();
      inViewApplied = true;
    }

    // 보이다가 → 안 보임: 숨김
    if (wasVisible && !visible) {
      remove();
      inViewApplied = false;
    }

    wasVisible = visible;
  }, ioOpts);

  io.observe(section);

  // 폴백 + 방향 판정 (iOS Safari 등 초기 딜레이 보정 및 방향 토글)
  const fallbackCheck = () => {
    const r  = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const visibleH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    const ratio = Math.max(0, Math.min(visibleH / r.height, 1));
    const visible = ratio >= THRESH;

    const currentY   = window.scrollY || window.pageYOffset;
    const scrollingUp = currentY < lastY;
    lastY = currentY;

    if (wasVisible === null) { // 초기 1회: 상태만 기록
      wasVisible = visible;
      return;
    }

    // IO와 동일한 전이 처리 (안정성)
    if (!wasVisible && visible) {
      add();
      inViewApplied = true;
    }
    if (wasVisible && !visible) {
      remove();
      inViewApplied = false;
    }

    // 가시 상태에서도 '방향'으로 즉시 토글
    applyDirectionLogic(scrollingUp, visible);

    wasVisible = visible;
  };

  window.addEventListener('scroll', fallbackCheck, { passive: true });
  window.addEventListener('resize', fallbackCheck);

  // (선택) 페이지 숨김 시 정리
  // document.addEventListener('pagehide', () => {
  //   io.disconnect();
  //   window.removeEventListener('scroll', fallbackCheck);
  //   window.removeEventListener('resize', fallbackCheck);
  // });
});
