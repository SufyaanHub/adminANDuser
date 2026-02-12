import React, { useEffect, useRef } from 'react';

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);
  const shapes = useRef([]);
  const animationFrameId = useRef(0);

  const colors = [
    'rgba(59, 130, 246, 0.3)',  // Blue
    'rgba(14, 165, 233, 0.3)',   // Light blue
    'rgba(249, 115, 22, 0.3)',  // Orange
    'rgba(168, 85, 247, 0.3)',  // Purple
    'rgba(236, 72, 153, 0.3)',  // Pink
  ];

  const createShapes = (width, height) => {
    const newShapes = [];
    const count = Math.floor(width * height / 30000);

    for (let i = 0; i < count; i++) {
      const types = ['square', 'circle', 'triangle'];
      const type = types[Math.floor(Math.random() * types.length)];

      newShapes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 30 + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        type,
      });
    }

    return newShapes;
  };

  const drawShapes = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);

    shapes.current.forEach((shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;
      ctx.fillStyle = shape.color;

      if (shape.type === 'square') {
        ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      } else if (shape.type === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape.type === 'triangle') {
        ctx.beginPath();
        ctx.moveTo(0, -shape.size / 2);
        ctx.lineTo(shape.size / 2, shape.size / 2);
        ctx.lineTo(-shape.size / 2, shape.size / 2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    });
  };

  const updateShapes = (width, height) => {
    shapes.current.forEach((shape) => {
      shape.y -= shape.speed;
      shape.rotation += shape.rotationSpeed;

      if (shape.y + shape.size < 0) {
        shape.y = height + shape.size;
        shape.x = Math.random() * width;
      }
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    updateShapes(width, height);
    drawShapes(ctx, width, height);

    animationFrameId.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    shapes.current = createShapes(canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    shapes.current = createShapes(canvas.width, canvas.height);
    animationFrameId.current = requestAnimationFrame(animate);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 z-0"
    />
  );
};

export default BackgroundAnimation;
