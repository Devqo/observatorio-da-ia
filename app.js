let slideCounter = 0;
let globalAuthor = '@observatoriodaia';
let globalLogo = 'logo.svg';

window.onload = () => {
    if (!restoreFromStorage()) {
        addSlide('titulo');
    }
    setupCleanPaste();
    initSortable();
    setupAutoResize();
    setupFormattingToolbar();
    setupAutoSave();
};

function changeTheme() {
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    const slides = document.querySelectorAll('.slide');

    slides.forEach(slide => {
        slide.className = slide.className.replace(/tpl-[a-z]+/g, '').trim();
        slide.classList.add(selectedTheme);
    });
    showToast("Tema actualizado", "ph-palette");
    saveToStorage();
}

function setRatio(ratio) {
    document.querySelectorAll('.ratio-btn').forEach(btn => btn.classList.remove('active'));
    const container = document.getElementById('slides-wrapper');

    if (ratio === '4:5') {
        document.getElementById('btn-ratio-45').classList.add('active');
        container.classList.add('ratio-portrait');
    } else {
        document.getElementById('btn-ratio-11').classList.add('active');
        container.classList.remove('ratio-portrait');
    }
    showToast(`Formato cambiado a ${ratio}`, "ph-aspect-ratio");
    saveToStorage();
}

function updateGlobalAuthor(val) {
    globalAuthor = val;
    document.querySelectorAll('.global-author-text').forEach(el => {
        el.innerText = globalAuthor;
    });
    saveToStorage();
}

function updateGlobalLogo(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
        globalLogo = event.target.result;
        document.querySelectorAll('.slide-logo').forEach(img => {
            img.src = globalLogo;
        });
        showToast("Logo global actualizado", "ph-image-square");
        saveToStorage();
    };
    reader.readAsDataURL(file);
}

function initSortable() {
    const container = document.getElementById('slides-wrapper');
    Sortable.create(container, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag',
        onEnd: () => {
            updateSlideNumbers();
        }
    });
}

function updateSlideNumbers() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.setAttribute('data-slide-num', `${index + 1}/${slides.length}`);
    });
}

function addSlide(layout) {
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    const container = document.getElementById('slides-wrapper');
    slideCounter++;
    const slideId = `slide-${slideCounter}`;

    const wrapper = document.createElement('div');
    wrapper.className = 'slide-wrapper';
    wrapper.id = slideId;

    // BOTONES DE ACCIÓN
    const actionsPanel = document.createElement('div');
    actionsPanel.className = 'slide-actions';
    actionsPanel.innerHTML = `
        <button class="action-btn" onclick="moveSlide('${slideId}', -1)" title="Subir"><i class="ph ph-caret-up"></i></button>
        <button class="action-btn" onclick="moveSlide('${slideId}', 1)" title="Bajar"><i class="ph ph-caret-down"></i></button>
        <button class="action-btn" onclick="duplicateSlide('${slideId}')" title="Duplicar"><i class="ph ph-copy"></i></button>
        <button class="action-btn" onclick="triggerImageUpload('${slideId}')" title="Añadir Imagen"><i class="ph ph-image"></i></button>
        <button class="action-btn delete" onclick="deleteSlide('${slideId}')" title="Borrar"><i class="ph ph-trash"></i></button>
    `;

    const slide = document.createElement('div');
    slide.className = `slide ${selectedTheme} layout-${layout}`;

    let innerHTML = '';
    if (layout === 'titulo') {
        innerHTML = `
            <span class="mono" contenteditable="true">GUÍA PASO A PASO</span>
            <h1 contenteditable="true">CÓMO CREAR<br><i>POSTS VIRALES</i></h1>
            <p contenteditable="true">Un sistema probado para enganchar a tu audiencia desde la primera diapositiva.</p>
            <span class="author-tag global-author-text">${globalAuthor}</span>
        `;
    } else if (layout === 'texto') {
        innerHTML = `
            <span class="mono" contenteditable="true">EL CONTEXTO</span>
            <h2 contenteditable="true">El error número 1</h2>
            <p contenteditable="true">La mayoría de los creadores se centran demasiado en el diseño y olvidan el <b>copywriting</b>.<br><br>Haz clic en el icono de imagen de la izquierda si quieres añadir una foto aquí.</p>
        `;
    } else if (layout === 'lista') {
        innerHTML = `
            <span class="mono" contenteditable="true">LA SOLUCIÓN</span>
            <h2 contenteditable="true">Mi Framework Exacto</h2>
            <ul contenteditable="true">
                <li>Gancho visual e intriga.</li>
                <li>Desarrollo de un solo concepto clave.</li>
                <li>Ejemplo práctico y aplicable.</li>
            </ul>
        `;
    } else if (layout === 'cita') {
        innerHTML = `
            <p contenteditable="true">"Una imagen vale más que mil palabras, pero combínalas y tendrás un imperio."</p>
            <span class="mono global-author-text" contenteditable="true" style="text-align:center;">${globalAuthor}</span>
        `;
    } else if (layout === 'cierre') {
        innerHTML = `
            <h2 contenteditable="true">¿Listo para aplicar esto?</h2>
            <p contenteditable="true">Guarda este post para consultarlo luego o compártelo.</p>
            <div class="social-icons">✈️ 💾</div>
        `;
    } else if (layout === 'comparativa') {
        innerHTML = `
            <h2 contenteditable="true">Comparativa</h2>
            <div class="col-2">
                <div>
                    <h3 contenteditable="true" style="color: #ef4444;">Opción A</h3>
                    <ul contenteditable="true">
                        <li>Falta de claridad</li>
                        <li>Poco alcance</li>
                    </ul>
                </div>
                <div>
                    <h3 contenteditable="true" style="color: #22c55e;">Opción B</h3>
                    <ul contenteditable="true">
                        <li>Estrategia clara</li>
                        <li>Crecimiento orgánico</li>
                    </ul>
                </div>
            </div>
        `;
    } else if (layout === 'tweet') {
        innerHTML = `
            <div class="tweet-box">
                <div class="tweet-header">
                    <img src="logo.svg" class="tweet-avatar" alt="Avatar">
                    <div>
                        <b contenteditable="true">Nombre de Usuario</b>
                        <span contenteditable="true">@handle_ejemplo</span>
                    </div>
                </div>
                <p contenteditable="true">Este formato simula un tweet o post de Threads. Funciona increíblemente bien para compartir pensamientos breves o "hot takes" que la gente quiere compartir en sus historias.</p>
            </div>
        `;
    } else if (layout === 'cifra') {
        innerHTML = `
            <span class="mono" contenteditable="true">EL DATO CLAVE</span>
            <div class="big-number" contenteditable="true">85%</div>
            <p contenteditable="true" style="text-align:center;">De los usuarios en Instagram consumen carruseles completos si la primera diapositiva captura su atención en los primeros 3 segundos.</p>
        `;
    } else if (layout === 'timeline') {
        innerHTML = `
            <h2 contenteditable="true">Paso a Paso</h2>
            <div class="timeline" contenteditable="true">
                <div class="item"><b>1.</b> Define tu nicho</div>
                <div class="item"><b>2.</b> Crea tu framework</div>
                <div class="item"><b>3.</b> Diseña en PostForge</div>
            </div>
        `;
    } else if (layout === 'media') {
        innerHTML = `
            <div class="media-focus-text" contenteditable="true">
                <h2>El elemento principal</h2>
                <p>Escribe una breve leyenda aquí.</p>
            </div>
        `;
    }

    slide.innerHTML = `
        <div class="slide-content">${innerHTML}</div>
        ${layout !== 'tweet' ? `<img src="${globalLogo}" class="slide-logo" alt="Logo de la cuenta">` : ''}
    `;

    wrapper.appendChild(actionsPanel);
    wrapper.appendChild(slide);
    container.appendChild(wrapper);

    updateSlideNumbers();

    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
}

// ==========================================
// NUEVO: LÓGICA DE IMÁGENES
// ==========================================
function triggerImageUpload(slideId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // Cuando el usuario elige un archivo
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;

        // Leemos la imagen localmente sin enviarla a ningún servidor
        const reader = new FileReader();
        reader.onload = event => {
            insertImageToSlide(slideId, event.target.result);
        };
        reader.readAsDataURL(file);
    };

    // Simulamos el clic para abrir la ventana de archivos
    input.click();
}

function insertImageToSlide(slideId, imageUrl) {
    const slideContent = document.querySelector(`#${slideId} .slide-content`);

    // Comprobamos si ya hay una imagen en esta slide para reemplazarla
    let imgWrapper = slideContent.querySelector('.slide-media');

    if (!imgWrapper) {
        // Si no hay, creamos el contenedor
        imgWrapper = document.createElement('div');
        imgWrapper.className = 'slide-media';
        imgWrapper.innerHTML = `
            <img src="${imageUrl}" alt="Media">
            <button class="remove-media" onclick="this.parentElement.remove()" title="Quitar imagen"><i class="ph-bold ph-x"></i></button>
        `;
        slideContent.appendChild(imgWrapper);
    } else {
        // Si ya hay, solo cambiamos el origen de la imagen
        imgWrapper.querySelector('img').src = imageUrl;
    }

    showToast("Imagen insertada", "ph-image");
}

// ==========================================
// FUNCIONES DE CONTROL DE SLIDES
// ==========================================
function deleteSlide(id) {
    const slide = document.getElementById(id);
    if (document.querySelectorAll('.slide-wrapper').length > 1) {
        slide.style.opacity = 0;
        setTimeout(() => {
            slide.remove();
            updateSlideNumbers();
        }, 200);
        showToast("Diapositiva eliminada", "ph-trash");
    } else {
        showToast("No puedes borrar la última slide", "ph-warning-circle");
    }
}

function moveSlide(id, direction) {
    const wrapper = document.getElementById(id);
    if (direction === -1 && wrapper.previousElementSibling) {
        wrapper.parentNode.insertBefore(wrapper, wrapper.previousElementSibling);
    } else if (direction === 1 && wrapper.nextElementSibling) {
        wrapper.parentNode.insertBefore(wrapper.nextElementSibling, wrapper);
    }
    updateSlideNumbers();
}

function duplicateSlide(id) {
    const original = document.getElementById(id);
    const clone = original.cloneNode(true);
    slideCounter++;
    clone.id = `slide-${slideCounter}`;

    // Actualizamos las funciones onclick del clon
    const btns = clone.querySelectorAll('.action-btn');
    if (btns.length >= 5) {
        btns[0].setAttribute('onclick', `moveSlide('${clone.id}', -1)`);
        btns[1].setAttribute('onclick', `moveSlide('${clone.id}', 1)`);
        btns[2].setAttribute('onclick', `duplicateSlide('${clone.id}')`);
        btns[3].setAttribute('onclick', `triggerImageUpload('${clone.id}')`);
        btns[4].setAttribute('onclick', `deleteSlide('${clone.id}')`);
    }

    original.parentNode.insertBefore(clone, original.nextSibling);
    updateSlideNumbers();
    showToast("Diapositiva duplicada", "ph-copy");
}

// ==========================================
// EXPORTACIÓN Y UTILIDADES
// ==========================================
async function exportSlides() {
    const slides = document.querySelectorAll('.slide');
    const btn = document.getElementById('btn-export');

    btn.innerHTML = `<i class="ph ph-spinner ph-spin"></i> Generando...`;
    btn.disabled = true;
    window.getSelection().removeAllRanges();

    // 1. Ocultamos los botones de borrar imagen para que no salgan en el PNG
    const removeMediaBtns = document.querySelectorAll('.remove-media');
    removeMediaBtns.forEach(b => b.style.display = 'none');

    for (let i = 0; i < slides.length; i++) {
        showToast(`Exportando slide ${i + 1} de ${slides.length}...`, "ph-hourglass");

        const canvas = await html2canvas(slides[i], {
            scale: 2,
            useCORS: true,
            backgroundColor: null
        });

        const link = document.createElement('a');
        link.download = `post_${i + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        await new Promise(r => setTimeout(r, 800));
    }

    // 2. Volvemos a mostrar los botones de borrar imagen
    removeMediaBtns.forEach(b => b.style.display = 'flex');

    btn.innerHTML = `<i class="ph-bold ph-download-simple"></i> Exportar Carrusel`;
    btn.disabled = false;
    showToast("¡Carrusel descargado con éxito!", "ph-check-circle");
}

function setupCleanPaste() {
    document.addEventListener('paste', function (e) {
        if (e.target.isContentEditable) {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        }
    });
}

function setupAutoResize() {
    document.addEventListener('input', function (e) {
        if (e.target.isContentEditable) {
            let el = e.target;
            // Solo redimensionar si es un contenedor de párrafo o lista
            if (el.tagName === 'P' || el.tagName === 'UL') {
                let currentSize = parseFloat(window.getComputedStyle(el).fontSize);
                while (el.scrollHeight > el.clientHeight && currentSize > 12) {
                    currentSize -= 1;
                    el.style.fontSize = currentSize + 'px';
                }
            }
        }
    });
}

function showToast(message, iconClass) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${iconClass}" style="font-size: 20px;"></i> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==========================================
// LÓGICA DE BARRA DE FORMATO FLOTANTE
// ==========================================
let activeFormatElement = null;

function setupFormattingToolbar() {
    const toolbar = document.getElementById('formatting-toolbar');
    
    document.addEventListener('click', (e) => {
        if (!toolbar) return;
        
        // Ignorar clics dentro de la propia barra de herramientas o botones para ella
        if (toolbar.contains(e.target) || e.target.closest('.tool-btn') || e.target.closest('.tool-color-picker')) {
            return;
        }
        
        // Si hacemos clic en una imagen de la slide
        if (e.target.tagName === 'IMG' && e.target.closest('.slide-media')) {
            showToolbar(e.target);
            document.querySelector('.img-tools').style.display = 'flex';
            document.querySelector('.img-tools-divider').style.display = 'block';
            document.querySelector('.align-tools').style.display = 'none';
            document.querySelector('.align-tools-divider').style.display = 'none';
            return;
        }
        
        // Si hacemos clic en o dentro de un elemento editable
        const editableElement = e.target.closest('[contenteditable="true"]');
        if (editableElement) {
            showToolbar(editableElement);
            document.querySelector('.img-tools').style.display = 'none';
            document.querySelector('.img-tools-divider').style.display = 'none';
            document.querySelector('.align-tools').style.display = 'flex';
            document.querySelector('.align-tools-divider').style.display = 'block';
            
            // Sincronizar color actual en el picker
            const colorPicker = document.getElementById('text-color-picker');
            if (colorPicker) {
                const currentColor = window.getComputedStyle(editableElement).color;
                if (currentColor) {
                    const rgb = currentColor.match(/\d+/g);
                    if (rgb && rgb.length >= 3) {
                        const hex = '#' + ((1 << 24) + (+rgb[0] << 16) + (+rgb[1] << 8) + +rgb[2]).toString(16).slice(1);
                        colorPicker.value = hex;
                    }
                }
            }
            return;
        }

        // Si hacemos clic fuera y no estamos arrastrando, esconder la barra
        hideToolbar();
    });

    // También mostrar al enfocar por teclado
    document.addEventListener('focusin', (e) => {
        if (e.target.isContentEditable) {
            showToolbar(e.target);
            document.querySelector('.img-tools').style.display = 'none';
            document.querySelector('.img-tools-divider').style.display = 'none';
            document.querySelector('.align-tools').style.display = 'flex';
            document.querySelector('.align-tools-divider').style.display = 'block';
        }
    });
}

function showToolbar(element) {
    activeFormatElement = element;
    const toolbar = document.getElementById('formatting-toolbar');
    if (toolbar) toolbar.classList.add('active');
}

function hideToolbar() {
    activeFormatElement = null;
    const toolbar = document.getElementById('formatting-toolbar');
    if (toolbar) toolbar.classList.remove('active');
}

function changeFontSize(delta) {
    if (!activeFormatElement) return;
    let currentSize = parseFloat(window.getComputedStyle(activeFormatElement).fontSize);
    activeFormatElement.style.fontSize = (currentSize + delta) + 'px';
}

function changeTextAlign(align) {
    if (!activeFormatElement) return;
    activeFormatElement.style.textAlign = align;
}

function changeTextColor(color) {
    if (!activeFormatElement) return;
    
    // Quitar gradientes y clips si existen (útil para sobreescribir estilos por defecto como Aura)
    activeFormatElement.style.background = 'none';
    activeFormatElement.style.webkitBackgroundClip = 'unset';
    activeFormatElement.style.backgroundClip = 'unset';
    activeFormatElement.style.webkitTextFillColor = 'unset';
    
    // Queremos usar el comando execCommand si hay selección dentro del elemento
    const selection = window.getSelection();
    if (selection.rangeCount > 0 && !selection.isCollapsed && activeFormatElement.contains(selection.anchorNode)) {
        document.execCommand('foreColor', false, color);
    } else {
        // En caso de que no haya selección o esté colapsada, aplicar al elemento completo
        activeFormatElement.style.color = color;
    }
}

function changeImageFit(fit) {
    if (!activeFormatElement || activeFormatElement.tagName !== 'IMG') return;
    activeFormatElement.style.objectFit = fit;
}

function moveImageLayer(dir) {
    if (!activeFormatElement || activeFormatElement.tagName !== 'IMG') return;
    const mediaContainer = activeFormatElement.closest('.slide-media');
    if (!mediaContainer) return;
    
    if (dir === -1 && mediaContainer.previousElementSibling) {
        mediaContainer.parentNode.insertBefore(mediaContainer, mediaContainer.previousElementSibling);
    } else if (dir === 1 && mediaContainer.nextElementSibling) {
        mediaContainer.parentNode.insertBefore(mediaContainer.nextElementSibling, mediaContainer);
    }
}

function alignActiveSlide(alignment) {
    if (!activeFormatElement) return;
    const slideContent = activeFormatElement.closest('.slide-content');
    if (slideContent) {
        slideContent.style.justifyContent = alignment;
        showToast("Alineación vertical actualizada", "ph-arrows-vertical");
    }
}

// ==========================================
// PALETAS DE COLOR CURADAS
// ==========================================
const palettes = {
    dark: { bg: '#121212', text: '#f3f4f6', accent: '#6366f1', name: 'dark' },
    light: { bg: '#f8fafc', text: '#111827', accent: '#3b82f6', name: 'light' },
    neon: { bg: '#000000', text: '#d4ff00', accent: '#d4ff00', name: 'neon' },
    ocean: { bg: '#eff6ff', text: '#1e3a8a', accent: '#3b82f6', name: 'ocean' },
    cream: { bg: '#EAE6DF', text: '#2c2c2c', accent: '#6B5B49', name: 'cream' }
};

function setGlobalPalette(name, btn) {
    document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    let styleEl = document.getElementById('palette-override');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'palette-override';
        document.head.appendChild(styleEl);
    }
    
    if (name === 'default') {
        styleEl.innerHTML = '';
        showToast("Paleta por defecto restaurada", "ph-palette");
        return;
    }
    
    const p = palettes[name];
    const isDark = p.bg === '#121212' || p.bg === '#000000';
    
    styleEl.innerHTML = `
        /* Overrides Globales */
        .slide { background: ${p.bg} !important; color: ${p.text} !important; }
        .slide h1, .slide h2, .slide p, .slide ul li { color: ${p.text} !important; border-color: ${p.text} !important; }
        
        /* Fixes específicos para limpiar text-shadows y gradients (Ej: Aura, Acid) */
        .slide h1, .slide .big-number { background: none !important; -webkit-text-fill-color: ${p.text} !important; text-shadow: none !important; }
        .tpl-acid h2 { background: ${p.text} !important; color: ${p.bg} !important; }
        .tpl-acid p, .tpl-acid ul li { background: ${p.bg} !important; box-shadow: 4px 4px 0px ${p.text} !important; border: 3px solid ${p.text} !important; }
        .tpl-acid { border-color: ${p.text} !important; }
        
        /* Fondos decorativos */
        .tpl-aura::before { background: ${p.accent} !important; }
        .tpl-aura::after { background: ${p.text} !important; opacity: 0.1 !important; }
        .tpl-startup::before { background: ${p.accent} !important; opacity: 0.1 !important; }
        .tpl-startup .slide-content { background: ${p.bg} !important; border-color: rgba(${isDark ? '255,255,255' : '0,0,0'}, 0.1) !important; }
        .tpl-bento .slide-content { background: ${p.bg} !important; border-color: rgba(${isDark ? '255,255,255' : '0,0,0'}, 0.1) !important; }
        .tpl-editorial::before { border-color: ${p.text} !important; opacity: 0.3 !important; }
        
        /* Logo */
        .slide-logo { filter: ${isDark ? 'brightness(0) invert(1)' : 'brightness(0)'} !important; opacity: 0.8 !important; }
        
        /* Timeline paso a paso */
        .timeline .item::before { background: ${p.text} !important; border-color: ${p.bg} !important; }
        .timeline { border-left-color: rgba(${isDark ? '255,255,255' : '0,0,0'}, 0.2) !important; }
    `;
    
    showToast("Paleta aplicada correctamente", "ph-palette");
    saveToStorage();
}

// ==========================================
// PERSISTENCIA: LOCALSTORAGE
// ==========================================
const STORAGE_KEY = 'postforge_v1';

function saveToStorage() {
    try {
        const wrapper = document.getElementById('slides-wrapper');
        const selectedTheme = document.querySelector('input[name="theme"]:checked')?.value || 'tpl-aura';
        const paletteOverride = document.getElementById('palette-override')?.innerHTML || '';
        const activePaletteBtn = document.querySelector('.palette-btn.active');
        const activePaletteName = activePaletteBtn?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1] || 'default';
        const isPortrait = document.getElementById('slides-wrapper').classList.contains('ratio-portrait');

        const state = {
            slidesHtml: wrapper.innerHTML,
            slideCounter,
            selectedTheme,
            paletteOverride,
            activePaletteName,
            isPortrait,
            globalAuthor,
            globalLogo
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        // Fallo silencioso (ej: cuota excedida por imágenes en base64)
        console.warn('PostForge: No se pudo guardar en localStorage:', e.message);
    }
}

function restoreFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;

        const state = JSON.parse(raw);
        if (!state.slidesHtml) return false;

        // Restaurar slides
        const wrapper = document.getElementById('slides-wrapper');
        wrapper.innerHTML = state.slidesHtml;
        slideCounter = state.slideCounter || 0;

        // Restaurar tema visual
        if (state.selectedTheme) {
            const themeRadio = document.querySelector(`input[name="theme"][value="${state.selectedTheme}"]`);
            if (themeRadio) themeRadio.checked = true;
        }

        // Restaurar override de paleta
        if (state.paletteOverride) {
            let styleEl = document.getElementById('palette-override');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'palette-override';
                document.head.appendChild(styleEl);
            }
            styleEl.innerHTML = state.paletteOverride;
        }

        // Marcar botón de paleta activa
        if (state.activePaletteName) {
            document.querySelectorAll('.palette-btn').forEach(btn => {
                const name = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                btn.classList.toggle('active', name === state.activePaletteName);
            });
        }

        // Restaurar ratio
        if (state.isPortrait) {
            wrapper.classList.add('ratio-portrait');
            document.getElementById('btn-ratio-45')?.classList.add('active');
            document.getElementById('btn-ratio-11')?.classList.remove('active');
        }

        // Restaurar autor y logo
        if (state.globalAuthor) {
            globalAuthor = state.globalAuthor;
            const authorInput = document.getElementById('global-author');
            if (authorInput) authorInput.value = globalAuthor;
        }
        if (state.globalLogo && state.globalLogo !== 'logo.svg') {
            globalLogo = state.globalLogo;
        }

        updateSlideNumbers();
        return true;

    } catch (e) {
        console.warn('PostForge: Error al restaurar desde localStorage:', e.message);
        return false;
    }
}

function setupAutoSave() {
    const wrapper = document.getElementById('slides-wrapper');
    let debounceTimer = null;

    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(saveToStorage, 800);
    });

    observer.observe(wrapper, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    });
}

