// ===== Crear canvas =====
const canvas = new fabric.Canvas('canvas', {
  selection: false,        // solo 1 objeto a la vez
  preserveObjectStacking: true
});

// Ajuste tamaño
function resizeCanvas() {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight - 60);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mejor comportamiento touch
canvas.on('mouse:down', () => {
  canvas.discardActiveObject();
});

// ===== Función para posiciones suaves (10% overlap) =====
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
  Array.from(e.target.files).forEach(file => {
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
          angle: Math.random() * 10 - 5
        });

        canvas.add(img);
      });
    };

    reader.readAsDataURL(file);
  });
});

// ===== Texto editable =====
document.getElementById('addText').onclick = () => {
  const text = new fabric.IText('Tu palabra', {
    left: canvas.width / 2,
    top: canvas.height / 2,
    fontSize: 32,
    fill: '#000',
    fontWeight: 'bold'
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
