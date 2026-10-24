import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Petal3D {
  x: number;
  y: number;
  z: number;
  size: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedRotX: number;
  speedRotY: number;
  speedRotZ: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  opacity: number;
  baseColor: { r: number; g: number; b: number };
  backColor: { r: number; g: number; b: number };
  type: 'rose' | 'marigold' | 'gold_sparkle';
  sparklePhase?: number;
  isTransient?: boolean;
  life?: number;
}

@Component({
  selector: 'app-floating-petals',
  standalone: true,
  template: `
    <canvas #petalCanvas class="petal-canvas" aria-hidden="true"></canvas>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
      overflow: hidden;
    }
    .petal-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class FloatingPetalsComponent implements OnInit, OnDestroy {
  @ViewChild('petalCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private petals: Petal3D[] = [];
  private mouseX = 0;
  private mouseY = 0;
  private mouseSpeedX = 0;
  private mouseSpeedY = 0;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private isBrowser = false;

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.initCanvas();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.resizeCanvas();
    this.createPetals();

    this.ngZone.runOutsideAngular(() => {
      this.animate();
      window.addEventListener('resize', this.onResize, { passive: true });
      window.addEventListener('mousemove', this.onMouseMove, { passive: true });
      window.addEventListener('touchmove', this.onTouchMove, { passive: true });
      window.addEventListener('click', this.onClick, { passive: true });
    });
  }

  private onResize = () => {
    this.resizeCanvas();
  };

  private onClick = (e: MouseEvent) => {
    if (!this.canvasRef?.nativeElement) return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spawn 3-4 delicate gold dust sparkles at click position
    for (let i = 0; i < 4; i++) {
      this.petals.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        z: Math.random() * 80,
        size: Math.random() * 2.5 + 1.8,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: -(Math.random() * 0.7 + 0.3),
        speedZ: (Math.random() - 0.5) * 0.2,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        speedRotX: 0.02,
        speedRotY: 0.02,
        speedRotZ: 0.01,
        swayFreq: 0.01,
        swayAmp: 0.4,
        swayPhase: 0,
        opacity: 0.65,
        baseColor: { r: 255, g: 225, b: 130 },
        backColor: { r: 220, g: 180, b: 80 },
        type: 'gold_sparkle',
        sparklePhase: 0,
        isTransient: true,
        life: 1.0
      });
    }
  };

  private onMouseMove = (e: MouseEvent) => {
    this.mouseSpeedX = e.clientX - this.lastMouseX;
    this.mouseSpeedY = e.clientY - this.lastMouseY;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.mouseSpeedX = (touch.clientX - this.lastMouseX) * 0.5;
      this.mouseSpeedY = (touch.clientY - this.lastMouseY) * 0.5;
      this.lastMouseX = touch.clientX;
      this.lastMouseY = touch.clientY;
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;
    }
  };

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (parent) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      if (this.ctx) {
        this.ctx.scale(dpr, dpr);
      }
    }
  }

  private createPetals(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    const width = parent ? parent.clientWidth : 1200;
    const height = parent ? parent.clientHeight : 800;

    const isMobile = width < 768;
    const count = isMobile ? Math.min(26, Math.max(18, Math.floor(width / 40))) : Math.min(40, Math.max(28, Math.floor(width / 35)));
    this.petals = [];

    const rosePalettes = [
      { base: { r: 235, g: 110, b: 135 }, back: { r: 200, g: 70, b: 95 } },
      { base: { r: 248, g: 165, b: 180 }, back: { r: 220, g: 120, b: 140 } },
      { base: { r: 215, g: 75, b: 100 }, back: { r: 180, g: 50, b: 75 } }
    ];

    const marigoldPalettes = [
      { base: { r: 250, g: 170, b: 35 }, back: { r: 225, g: 135, b: 20 } },
      { base: { r: 255, g: 205, b: 70 }, back: { r: 230, g: 175, b: 40 } },
      { base: { r: 245, g: 145, b: 25 }, back: { r: 210, g: 110, b: 15 } }
    ];

    for (let i = 0; i < count; i++) {
      const isSparkle = Math.random() < 0.25;
      const isRose = !isSparkle && Math.random() < 0.65;
      
      let baseColor = { r: 255, g: 220, b: 120 };
      let backColor = { r: 220, g: 180, b: 80 };

      if (!isSparkle) {
        if (isRose) {
          const pal = rosePalettes[Math.floor(Math.random() * rosePalettes.length)];
          baseColor = pal.base;
          backColor = pal.back;
        } else {
          const pal = marigoldPalettes[Math.floor(Math.random() * marigoldPalettes.length)];
          baseColor = pal.base;
          backColor = pal.back;
        }
      }

      this.petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 260 - 40, // 3D depth layer
        size: isSparkle ? Math.random() * 3 + 1.8 : Math.random() * 8 + 7,
        speedX: (Math.random() - 0.5) * 0.4 + 0.25,
        speedY: isSparkle ? Math.random() * 0.3 + 0.2 : Math.random() * 0.6 + 0.35,
        speedZ: (Math.random() - 0.5) * 0.2,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        speedRotX: (Math.random() - 0.5) * 0.018 + 0.008,
        speedRotY: (Math.random() - 0.5) * 0.024 + 0.01,
        speedRotZ: (Math.random() - 0.5) * 0.01,
        swayFreq: Math.random() * 0.008 + 0.005,
        swayAmp: Math.random() * 0.9 + 0.6,
        swayPhase: Math.random() * Math.PI * 2,
        opacity: isSparkle ? Math.random() * 0.5 + 0.25 : Math.random() * 0.4 + 0.35,
        baseColor,
        backColor,
        type: isSparkle ? 'gold_sparkle' : (isRose ? 'rose' : 'marigold'),
        sparklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  private animate = () => {
    if (!this.ctx) return;
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    const width = parent ? parent.clientWidth : 1200;
    const height = parent ? parent.clientHeight : 800;

    this.ctx.clearRect(0, 0, width, height);

    // Decay mouse breeze speed
    this.mouseSpeedX *= 0.94;
    this.mouseSpeedY *= 0.94;

    // Sort by 3D depth (Z-order) so farther petals render behind nearer ones
    this.petals.sort((a, b) => b.z - a.z);

    const fov = 500; // 3D field of view

    for (let i = this.petals.length - 1; i >= 0; i--) {
      const petal = this.petals[i];

      if (petal.isTransient) {
        petal.life = (petal.life || 1) - 0.02;
        petal.opacity = Math.max(0, petal.life * 0.7);
        if (petal.life <= 0) {
          this.petals.splice(i, 1);
          continue;
        }
      }

      // 3D swaying physics
      petal.swayPhase += petal.swayFreq;
      const swayOffset = Math.sin(petal.swayPhase) * petal.swayAmp;

      // Mouse interactive wind force (within 180px radius)
      const dx = petal.x - this.mouseX;
      const dy = petal.y - this.mouseY;
      const distSq = dx * dx + dy * dy;
      if (distSq < 32400 && distSq > 0) { // 180^2
        const force = (1 - Math.sqrt(distSq) / 180) * 0.8;
        petal.x += (dx > 0 ? 1 : -1) * force * 1.5 + this.mouseSpeedX * 0.08;
        petal.y += this.mouseSpeedY * 0.08;
        petal.rotY += force * 0.1;
        petal.rotX += force * 0.1;
      }

      petal.x += petal.speedX + swayOffset;
      petal.y += petal.speedY;
      petal.z += petal.speedZ;

      // 3D rotations (pitch, roll, yaw)
      petal.rotX += petal.speedRotX;
      petal.rotY += petal.speedRotY;
      petal.rotZ += petal.speedRotZ;

      // 3D boundary wrap-around
      if (!petal.isTransient) {
        if (petal.y > height + 40) {
          petal.y = -30;
          petal.x = Math.random() * width;
          petal.z = Math.random() * 260 - 40;
        }
        if (petal.x > width + 40) {
          petal.x = -30;
        } else if (petal.x < -40) {
          petal.x = width + 30;
        }
        if (petal.z < -80) {
          petal.speedZ = Math.abs(petal.speedZ);
        } else if (petal.z > 320) {
          petal.speedZ = -Math.abs(petal.speedZ);
        }
      }

      // 3D Perspective Projection
      const scaleZ = fov / (fov + Math.max(-100, petal.z));
      const projX = petal.x;
      const projY = petal.y;

      this.drawPetal3D(petal, projX, projY, scaleZ);
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private drawPetal3D(petal: Petal3D, x: number, y: number, scaleZ: number): void {
    if (!this.ctx) return;
    this.ctx.save();
    this.ctx.translate(x, y);

    // 2D Rotation (Yaw)
    this.ctx.rotate(petal.rotZ);

    // 3D Pitch & Roll compression (perspective scaling on X & Y)
    const cosY = Math.cos(petal.rotY); // Roll compression (-1 to 1)
    const cosX = Math.cos(petal.rotX); // Pitch compression (-1 to 1)
    const sinY = Math.sin(petal.rotY);

    const scaleX = scaleZ * (0.15 + Math.abs(cosY) * 0.85);
    const scaleY = scaleZ * (0.2 + Math.abs(cosX) * 0.8);
    this.ctx.scale(scaleX, scaleY);

    if (petal.type === 'gold_sparkle') {
      // 3D Gold Dust particle with twinkling light
      petal.sparklePhase = (petal.sparklePhase || 0) + 0.05;
      const twinkle = Math.sin(petal.sparklePhase) * 0.35 + 0.65;
      const rad = petal.size * scaleZ;

      const grad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, rad * 2);
      grad.addColorStop(0, `rgba(255, 245, 190, ${petal.opacity * twinkle})`);
      grad.addColorStop(0.4, `rgba(245, 185, 55, ${petal.opacity * twinkle * 0.7})`);
      grad.addColorStop(1, 'rgba(215, 140, 20, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, rad * 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      return;
    }

    // Dynamic 3D lighting calculation (Front vs Back surface shading)
    const isFrontSide = cosY * cosX >= 0;
    const color = isFrontSide ? petal.baseColor : petal.backColor;

    // Light shading factor based on 3D orientation angle
    const lightAngle = (sinY + 1) * 0.5; // 0 to 1
    const r = Math.min(255, Math.floor(color.r * (0.8 + lightAngle * 0.3)));
    const g = Math.min(255, Math.floor(color.g * (0.8 + lightAngle * 0.3)));
    const b = Math.min(255, Math.floor(color.b * (0.8 + lightAngle * 0.3)));

    const alpha = Math.max(0.15, Math.min(0.9, petal.opacity * (scaleZ * 0.7 + 0.3)));

    // Create 3D gradient across petal curvature
    const grad = this.ctx.createLinearGradient(-petal.size, -petal.size, petal.size, petal.size);
    grad.addColorStop(0, `rgba(${Math.min(255, r + 25)}, ${Math.min(255, g + 25)}, ${Math.min(255, b + 25)}, ${alpha})`);
    grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha})`);
    grad.addColorStop(1, `rgba(${Math.max(0, r - 35)}, ${Math.max(0, g - 35)}, ${Math.max(0, b - 35)}, ${alpha * 0.85})`);

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();

    if (petal.type === 'rose') {
      // 3D Curved Velvet Rose Petal
      this.ctx.moveTo(0, -petal.size * 1.1);
      this.ctx.bezierCurveTo(
        petal.size * 0.8, -petal.size * 0.7,
        petal.size * 0.95, petal.size * 0.45,
        0, petal.size * 1.05
      );
      this.ctx.bezierCurveTo(
        -petal.size * 0.95, petal.size * 0.45,
        -petal.size * 0.8, -petal.size * 0.7,
        0, -petal.size * 1.1
      );
    } else {
      // 3D Layered Festive Marigold Petal
      this.ctx.ellipse(0, 0, petal.size * 0.65, petal.size * 1.05, 0, 0, Math.PI * 2);
    }

    this.ctx.fill();

    // Subtle 3D center vein / specular highlight on front-facing petals
    if (isFrontSide && petal.type === 'rose' && Math.abs(cosY) > 0.4) {
      this.ctx.strokeStyle = `rgba(255, 235, 240, ${alpha * 0.35})`;
      this.ctx.lineWidth = 0.8;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -petal.size * 0.8);
      this.ctx.quadraticCurveTo(petal.size * 0.1, 0, 0, petal.size * 0.7);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.isBrowser && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('click', this.onClick);
    }
  }
}


