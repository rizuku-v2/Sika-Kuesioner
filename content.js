let currentLang = 'id';
const dict = {
    id: { title: "MySika Kuesioner", subtitle: "Otomatisasi v3.5", stats: "Kuesioner Diselesaikan", l1: "1. Pilih Opsi Penilaian", l2: "2. Pilih Aksi", sb: "Sangat Baik", b: "Baik", a: "Acak", fE: "Isi Semua EDOM", fL: "Isi Form Layanan", t0: "Tidak ada kuesioner EDOM yang perlu diisi.", t1: "Memulai pengisian otomatis...", t2: "Semua kuesioner EDOM telah selesai diisi!", t3: "Buka halaman kuesioner EDOM terlebih dahulu!", t4: "Buka halaman kuesioner Layanan terlebih dahulu!", t5: "Tidak dapat menemukan tombol 'Jawab' berikutnya.", t6: "Mengisi:", t7: "Terjadi kesalahan: " },
    en: { title: "MySika Auto-Fill", subtitle: "Automation v3.5", stats: "Surveys Completed", l1: "1. Select Rating Option", l2: "2. Select Action", sb: "Excellent", b: "Good", a: "Random", fE: "Fill All EDOM", fL: "Fill Services Form", t0: "No EDOM surveys to fill.", t1: "Starting automatic filling...", t2: "All EDOM surveys completed!", t3: "Open the EDOM survey page first!", t4: "Open the Services survey page first!", t5: "Cannot find the next 'Jawab' button.", t6: "Filling:", t7: "An error occurred: " }
};

function applyThemeToElement(el, theme) {
    if (el) {
        el.classList.remove('mysika-theme-dark', 'mysika-theme-hacker');
        if (theme !== 'default') el.classList.add(`mysika-theme-${theme}`);
    }
}

function getCurrentTheme(callback) {
    chrome.storage.local.get(['mysikaTheme'], function(result) { callback(result.mysikaTheme || 'default'); });
}

function updateLanguageUI() {
    const t = dict[currentLang];
    const el = (q, text) => { const e = document.querySelector(q); if (e) e.innerText = text; };
    el('.mysika-title', t.title);
    el('.mysika-subtitle', t.subtitle);
    el('.mysika-stats-title', t.stats);
    const labels = document.querySelectorAll('.mysika-options-label');
    if(labels.length > 1) { labels[0].innerText = t.l1; labels[1].innerText = t.l2; }
    el('label[for="mysika-sangat-baik"]', t.sb);
    el('label[for="mysika-baik"]', t.b);
    el('label[for="mysika-acak"]', t.a);
    el('#mysika-fill-edom', t.fE);
    el('#mysika-fill-layanan', t.fL);
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-lang') === currentLang) b.classList.add('active');
    });
}

function showToast(message, type = 'info', duration = 3000) {
    const existing = document.getElementById('mysika-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'mysika-toast';
    toast.className = `mysika-toast mysika-toast-${type}`;
    toast.innerHTML = `<div class="mysika-toast-content"><div class="mysika-toast-icon"></div><div class="mysika-toast-message">${message}</div></div><div class="mysika-toast-progress"><div class="mysika-toast-progress-bar"></div></div>`;
    document.body.appendChild(toast);
    getCurrentTheme((theme) => applyThemeToElement(toast, theme));
    const pBar = toast.querySelector('.mysika-toast-progress-bar');
    setTimeout(() => {
        toast.classList.add('mysika-toast-visible');
        pBar.style.transitionDuration = `${duration}ms`;
        setTimeout(() => { pBar.style.width = '0%'; }, 50);
    }, 10);
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.remove('mysika-toast-visible');
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    }
}

function incrementStats() {
    chrome.storage.local.get(['mysikaStats'], function(result) {
        let count = result.mysikaStats || 0;
        count++;
        chrome.storage.local.set({ 'mysikaStats': count }, function() {
            const disp = document.getElementById('mysika-stats-display');
            if (disp) disp.innerText = count;
        });
    });
}

async function fillCurrentForm(ratingOption) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const isEdomForm = document.querySelector('button.button.is-success');
    const isLayananForm = document.querySelector('button.btn-simpan.is-primary');
    const formType = isEdomForm ? 'EDOM' : 'Layanan';
    try {
        const allRows = document.querySelectorAll('.soal-kuesioner-table tbody tr');
        for (const row of allRows) {
            let radioToClick = null;
            if (ratingOption === 'sangat-baik') {
                radioToClick = row.querySelector('td:nth-child(3) input[type="radio"]');
            } else if (ratingOption === 'baik') {
                radioToClick = row.querySelector('td:nth-child(4) input[type="radio"]');
            } else if (ratingOption === 'acak') {
                const choice = Math.random() < 0.7 ? 'sangat-baik' : 'baik';
                const selector = choice === 'sangat-baik' ? 'td:nth-child(3) input[type="radio"]' : 'td:nth-child(4) input[type="radio"]';
                radioToClick = row.querySelector(selector);
            }
            if (radioToClick) {
                radioToClick.click();
                await sleep(10);
            }
        }
        if (isEdomForm) {
            const textareaSaran = document.querySelector('textarea.textarea');
            if (textareaSaran) {
                textareaSaran.value = "Pengajaran sudah sangat baik, materi mudah dipahami, dan dosen sangat membantu. Terima kasih.";
                textareaSaran.dispatchEvent(new Event('input', { bubbles: true }));
            }
            const radioYa = document.querySelector('input[type="radio"][value="Y"]');
            if (radioYa) radioYa.click();
        } else if (isLayananForm) {
            const textareas = document.querySelectorAll('textarea.textarea');
            for (const textarea of textareas) {
                textarea.value = "Secara keseluruhan sudah sangat baik dan memenuhi harapan. Terima kasih.";
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        const finishButton = isEdomForm ? isEdomForm : isLayananForm;
        if (finishButton) {
            await sleep(250);
            finishButton.click();
            await sleep(500);
            const activeModal = document.querySelector('div.modal.is-active');
            if (activeModal) {
                const confirmButton = activeModal.querySelector('button.is-success') || Array.from(activeModal.querySelectorAll('button')).find(btn => btn.innerText.trim() === 'Ya, selesai');
                if (confirmButton) {
                    confirmButton.click();
                    incrementStats();
                }
            }
        }
    } catch (error) {
        showToast(dict[currentLang].t7 + error.message, 'error', 5000);
    }
}

async function fillAllEdomSequentially(ratingOption) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const jawabButtons = Array.from(document.querySelectorAll('td[data-label="Aksi"] button')).filter(btn => btn.innerText.trim().includes('Jawab'));
    if (jawabButtons.length === 0) {
        showToast(dict[currentLang].t0, 'info', 4000);
        return;
    }
    showToast(`${dict[currentLang].t1}`, 'info', 5000);
    await sleep(2000);
    for (let i = 0; i < jawabButtons.length; i++) {
        const currentJawabButtons = Array.from(document.querySelectorAll('td[data-label="Aksi"] button')).filter(btn => btn.innerText.trim().includes('Jawab'));
        const buttonToClick = currentJawabButtons[0];
        if (!buttonToClick) {
            showToast(dict[currentLang].t5, 'error', 4000);
            break;
        }
        const matkul = buttonToClick.closest('tr').querySelector('td[data-label="Mata Kuliah"]').innerText;
        showToast(`(${i + 1}/${jawabButtons.length}) ${dict[currentLang].t6} ${matkul}`, 'info', 4000);
        buttonToClick.click();
        await sleep(2500);
        await fillCurrentForm(ratingOption);
        await sleep(3000);
    }
    showToast(dict[currentLang].t2, 'success', 5000);
}

function createFloatingUI() {
    const fab = document.createElement('div');
    fab.id = 'mysika-fab';
    fab.innerHTML = `<img src="${chrome.runtime.getURL("images/icon48.png")}" alt="MySika">`;
    const panel = document.createElement('div');
    panel.id = 'mysika-panel';
    panel.classList.add('mysika-hidden');
    panel.innerHTML = `
        <div class="mysika-header">
            <div class="mysika-title">MySika Kuesioner</div>
            <div class="mysika-subtitle">Otomatisasi v3.5</div>
            <div class="mysika-lang-selector">
                <button class="lang-btn" data-lang="id">ID</button>
                <button class="lang-btn" data-lang="en">EN</button>
            </div>
            <div id="mysika-theme-selector" style="display:flex; justify-content:center; gap: 12px; margin-top: 12px;">
                <div data-theme="default" style="cursor:pointer; font-size:18px; filter: grayscale(100%); transition: all 0.2s;" class="theme-btn" title="Default">🔵</div>
                <div data-theme="dark" style="cursor:pointer; font-size:18px; filter: grayscale(100%); transition: all 0.2s;" class="theme-btn" title="Dark Mode">🌙</div>
                <div data-theme="hacker" style="cursor:pointer; font-size:18px; filter: grayscale(100%); transition: all 0.2s;" class="theme-btn" title="Hacker">👨‍💻</div>
            </div>
        </div>
        <div class="mysika-content">
            <div class="mysika-stats-container">
                <div class="mysika-stats-title">Kuesioner Diselesaikan</div>
                <div class="mysika-stats-value" id="mysika-stats-display">0</div>
            </div>
            <div class="mysika-options-label">1. Pilih Opsi Penilaian</div>
            <div class="mysika-radio-group">
                <div class="mysika-radio-option">
                    <input type="radio" id="mysika-sangat-baik" name="mysika-rating" value="sangat-baik" checked>
                    <label for="mysika-sangat-baik">Sangat Baik</label>
                </div>
                <div class="mysika-radio-option">
                    <input type="radio" id="mysika-baik" name="mysika-rating" value="baik">
                    <label for="mysika-baik">Baik</label>
                </div>
                <div class="mysika-radio-option">
                    <input type="radio" id="mysika-acak" name="mysika-rating" value="acak">
                    <label for="mysika-acak">Acak</label>
                </div>
            </div>
            <div class="mysika-options-label">2. Pilih Aksi</div>
            <div class="mysika-button-group">
                <button id="mysika-fill-edom" class="mysika-action-button special">Isi Semua EDOM</button>
                <button id="mysika-fill-layanan" class="mysika-action-button">Isi Form Layanan</button>
            </div>
        </div>
        <div class="mysika-footer">
            Dibuat oleh <a href="https://www.instagram.com/dandisubhani_" target="_blank">@dandisubhani_</a>
        </div>
    `;
    document.body.appendChild(fab);
    document.body.appendChild(panel);
    
    chrome.storage.local.get(['mysikaStats', 'mysikaLang'], function(result) {
        const count = result.mysikaStats || 0;
        document.getElementById('mysika-stats-display').innerText = count;
        if (result.mysikaLang) currentLang = result.mysikaLang;
        updateLanguageUI();
    });
    
    const updateThemeUI = (theme) => {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            if (btn.getAttribute('data-theme') === theme) {
                btn.style.filter = 'grayscale(0%)';
                btn.style.transform = 'scale(1.2)';
            } else {
                btn.style.filter = 'grayscale(100%)';
                btn.style.transform = 'scale(1)';
            }
        });
        applyThemeToElement(fab, theme);
        applyThemeToElement(panel, theme);
    };
    
    getCurrentTheme((theme) => updateThemeUI(theme));
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedTheme = e.target.getAttribute('data-theme');
            chrome.storage.local.set({ 'mysikaTheme': selectedTheme }, () => updateThemeUI(selectedTheme));
        });
    });
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLang = e.target.getAttribute('data-lang');
            chrome.storage.local.set({ 'mysikaLang': currentLang }, () => updateLanguageUI());
        });
    });
    
    fab.addEventListener('click', () => {
        panel.classList.toggle('mysika-hidden');
        fab.classList.toggle('mysika-fab-active');
    });
    
    const handleFill = async (formType) => {
        const rating = document.querySelector('input[name="mysika-rating"]:checked').value;
        const isEdomListPage = document.querySelector('td[data-label="Aksi"] button');
        const isEdomFormPage = document.querySelector('button.button.is-success');
        const isLayananPage = document.querySelector('button.btn-simpan.is-primary');
        panel.classList.add('mysika-hidden');
        fab.classList.remove('mysika-fab-active');
        if (formType === 'edom') {
            const jawabButtons = Array.from(document.querySelectorAll('td[data-label="Aksi"] button')).filter(btn => btn.innerText.trim().includes('Jawab'));
            if (jawabButtons.length > 0) {
                await fillAllEdomSequentially(rating);
            } else if (isEdomFormPage) {
                await fillCurrentForm(rating);
            } else {
                showToast(dict[currentLang].t3, 'error', 4000);
            }
        } else if (formType === 'layanan') {
            if (isLayananPage) {
                await fillCurrentForm(rating);
            } else {
                showToast(dict[currentLang].t4, 'error', 4000);
            }
        }
    };
    document.getElementById('mysika-fill-edom').addEventListener('click', () => handleFill('edom'));
    document.getElementById('mysika-fill-layanan').addEventListener('click', () => handleFill('layanan'));
}
window.addEventListener('load', () => setTimeout(createFloatingUI, 500));