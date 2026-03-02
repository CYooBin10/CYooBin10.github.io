const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1400);
}

const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const targetId = button.dataset.copyTarget;
    const target = targetId ? document.getElementById(targetId) : null;

    if (!target) {
      showToast('Không tìm thấy nội dung để copy.');
      return;
    }

    const rawText = target.textContent?.trim();

    if (!rawText) {
      showToast('Nội dung đang trống.');
      return;
    }

    const label = button.textContent;

    try {
      await navigator.clipboard.writeText(rawText);
      button.textContent = 'Đã copy';
      button.classList.add('copied');
      showToast('Đã copy prompt vào clipboard.');
    } catch {
      button.textContent = 'Copy lỗi';
      showToast('Copy thất bại. Hãy thử lại.');
    }

    setTimeout(() => {
      button.textContent = label;
      button.classList.remove('copied');
    }, 1300);
  });
});

const videos = document.querySelectorAll('video');

videos.forEach((video) => {
  video.addEventListener('error', () => {
    const fallback = document.createElement('div');
    fallback.className = 'video-fallback';
    fallback.textContent = 'Không tải được video. Hãy bấm link "Mở video" bên dưới.';
    fallback.style.padding = '20px';
    fallback.style.color = '#ffc988';
    fallback.style.background = 'rgba(0, 0, 0, 0.35)';

    video.replaceWith(fallback);
  });
});
