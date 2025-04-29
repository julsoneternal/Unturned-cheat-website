// Particles.js - Add this before </body>
document.addEventListener('DOMContentLoaded', function() {
    // Particle system configuration
    const config = {
      particleCount: 100,
      particleSize: 3,
      particleColor: 'rgba(255, 58, 127, 0.5)',
      lineColor: 'rgba(0, 209, 255, 0.3)',
      lineDistance: 100,
      mouseRadius: 100,
      speed: 0.5
    };
  
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
  
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
  
    // Mouse movement tracker
    window.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  
    // Handle window resize
    window.addEventListener('resize', function() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  
    // Particle constructor
    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * config.particleSize + 1;
      this.speedX = Math.random() * (config.speed * 2) - config.speed;
      this.speedY = Math.random() * (config.speed * 2) - config.speed;
      this.color = config.particleColor;
    }
  
    // Initialize particles
    function init() {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
      }
    }
  
    // Draw particles and connections
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < config.lineDistance) {
            ctx.beginPath();
            ctx.strokeStyle = config.lineColor;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Mouse interaction
        if (mouse.x && mouse.y) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < config.mouseRadius) {
            // Push particles away from mouse
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (config.mouseRadius - distance) / config.mouseRadius;
            
            p.x -= forceDirectionX * force * 5;
            p.y -= forceDirectionY * force * 5;
          }
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Update particle position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      }
      
      requestAnimationFrame(draw);
    }
  
    init();
    draw();
  });