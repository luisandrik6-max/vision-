const canvas = new fabric.Canvas('canvas', {
  selection: true
});

// Ajustar tamaño real
function resizeCanvas() {
  canvas.setWidth(window.innerWidth);
  canvas.setHeight(window.innerHeight - 60);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const imageInput = document.getElementById('imageInput');

imageInput.addEventListener('change', e => {
  Array.from(e.target.files).forEach(file => {
    const reader = new FileReader();

    reader.onload = () => {
      fabric.Image.fromURL(reader.result, img => {
        img.set({
          left: Math.random() * canvas.width,
          top: Math.random() * canvas.height,
          scaleX: 0.5 + Math.random() * 0.5,
          scaleY: 0.5 + Math.random() * 0.5,
          angle: Math.random() * 20 - 10
        });
        canvas.add(img);
      });
    };

    reader.readAsDataURL(file);
  });
});

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

document.getElementById('generate').onclick = () => {
  canvas.getObjects().forEach(obj => {
    obj.animate({
      left: Math.random() * canvas.width,
      top: Math.random() * canvas.height,
      angle: Math.random() * 20 - 10
    }, {
      duration: 400,
      onChange: canvas.renderAll.bind(canvas)
    });
  });
};

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