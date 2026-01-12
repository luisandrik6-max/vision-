
// ===== Crear canvas =====
const canvas = new fabric.Canvas('canvas', {
  selection: false,           // solo un objeto activo
  preserveObjectStacking: true,
  allowTouchScrolling: false  // dejar false para iPad mover/rotar
});

// ===== Ajustar tamaño del canvas =====
function resizeCanvas() {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight - 60);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== Deseleccionar al tocar fondo =====
canvas.on('mouse:down', () => {
  canvas.discardActiveObject();
});

// ===== Posiciones suaves (10% overlap) =====
function getSoftPosition(index, itemWidth, itemHeight) {
  const padding = 40;
  const overlap = 0.1; // 10%
  const cols = Math.floor(canvas.width / (itemWidth * (1 - overlap))) || 1;
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    left: col * itemWidth * (1 - overlap) + padding,
    top: row * itemHeight * (1 - overlap) + padding
  };
}

// ===== Cargar imágenes =====
const imageInput = document.getElementById('imageInput');

imageInput.addEventListener('change', e => {
  const files = Array.from(e.target.files);

  files.forEach(() => {
    const file = files.shift();  // tomar primero y removerlo
    if (!file) return;
    const reader = new FileReader();

    reader.onload = () => {
      fabric.Image.fromURL(reader.result, (img) => {
        const scale = 0.75 + Math.random() * 0.15;
        img.scale(scale);

        const pos = getSoftPosition(
          canvas.getObjects().length,
          img.width * scale,
          img.height * scale
        );

        img.set({
          left: pos.left,
          top: pos.top,
          angle: Math.random() * 10 - 5,
          hasControls: true,
          hasBorders: true,
          selectable: true,
          lockScalingFlip: true
        });

        img.setControlsVisibility({
          mt: true, mb: true, ml: true, mr: true,
          tl: true, tr: true, bl: true, br: true
        });

        canvas.add(img);
        canvas.renderAll();  // asegurar que se dibuje
      });
    };

    reader.readAsDataURL(file);
  });

  e.target.value = ''; // limpiar input para subir las mismas imágenes otra vez
});

// ===== Texto editable =====
document.getElementById('addText').onclick = () => {
  const text = new fabric.IText('Tu palabra', {
    left: canvas.width/2,
    top: canvas.height/2,
    fontSize: 32,
    fill: '#000',
    fontWeight: 'bold',
    hasControls: true,
    hasBorders: true,
    selectable: true
  });

  text.setControlsVisibility({
    mt: true, mb: true, ml: true, mr: true,
    tl: true, tr: true, bl: true, br: true
  });

  canvas.add(text);
  canvas.setActiveObject(text);
};

// ===== Collage aleatorio =====
document.getElementById('generate').onclick = () => {
  canvas.getObjects().forEach((obj, i) => {
    const scale = obj.scaleX;
    const pos = getSoftPosition(
      i,
      obj.width * scale,
      obj.height * scale
    );

    obj.animate({
      left: pos.left,
      top: pos.top,
      angle: Math.random() * 10 - 5
    }, {
      duration: 400,
      onChange: canvas.renderAll.bind(canvas)
    });
  });
};

// ===== Cambiar fondo =====
document.getElementById('bgColor').addEventListener('input', (e) => {
  canvas.setBackgroundColor(e.target.value, canvas.renderAll.bind(canvas));
});

// ===== Exportar imagen =====
document.getElementById('export').onclick = () => {
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1
  });

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'vision-board.png';
  link.click();
};
