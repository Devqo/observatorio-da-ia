let slideCounter = 0;
let globalAuthor = '@creador';
let globalLogo = 'logo.svg';

window.onload = () => {
    addSlide('titulo');
    setupCleanPaste();
    initSortable();
    setupAutoResize();
};

function changeTheme() {
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => {
        slide.className = slide.className.replace(/tpl-[a-z]+/g, '').trim();
        slide.classList.add(selectedTheme);
    });
    showToast("Tema actualizado", "ph-palette");
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
}

function updateGlobalAuthor(val) {
    globalAuthor = val;
    document.querySelectorAll('.global-author-text').forEach(el => {
        el.innerText = globalAuthor;
    });
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

    // BOTONES DE ACCIÓN (¡Nuevo botón de añadir imagen incluido!)
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
                    <img src="${globalLogo}" class="tweet-avatar slide-logo" alt="Avatar">
                    <div>
                        <b class="global-author-text">${globalAuthor}</b>
                        <span contenteditable="true">Creador Digital</span>
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
    if(document.querySelectorAll('.slide-wrapper').length > 1) {
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
    btns[0].setAttribute('onclick', `moveSlide('${clone.id}', -1)`);
    btns[1].setAttribute('onclick', `moveSlide('${clone.id}', 1)`);
    btns[2].setAttribute('onclick', `duplicateSlide('${clone.id}')`);
    btns[3].setAttribute('onclick', `triggerImageUpload('${clone.id}')`);
    btns[4].setAttribute('onclick', `deleteSlide('${clone.id}')`);
    
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
    document.addEventListener('paste', function(e) {
        if (e.target.isContentEditable) {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        }
    });
}

function setupAutoResize() {
    document.addEventListener('input', function(e) {
        if (e.target.isContentEditable) {
            let el = e.target;
            // Solo redimensionar si es un contenedor de párrafo o lista
            if(el.tagName === 'P' || el.tagName === 'UL') {
                let currentSize = parseFloat(window.getComputedStyle(el).fontSize);
                while(el.scrollHeight > el.clientHeight && currentSize > 12) {
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
