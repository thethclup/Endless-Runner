// GameEngine.ts - The core logic for Endless Runner Dash
import { ScoreData } from '../types';

interface EngineConfig {
  onScoreUpdate: (state: ScoreData) => void;
  onGameOver: (finalScore: ScoreData) => void;
}

// Simple vector
class Vec2 {
    constructor(public x: number, public y: number) {}
}

interface Obstacle {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'SPIKE' | 'WALL';
    passed: boolean;
}

interface Collectible {
    x: number;
    y: number;
    radius: number;
    type: 'COIN' | 'MULTIPLIER';
    collected: boolean;
}

export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: EngineConfig;
  private animationFrameId: number = 0;
  private running: boolean = false;
  
  private lastTime: number = 0;
  
  // Dimensions
  private width: number = 0;
  private height: number = 0;

  // Game State
  private distance: number = 0;
  private score: number = 0;
  private combo: number = 1.0;
  
  private speed: number = 400; // units per second
  private gravity: number = 2000;
  private jumpForce: number = -800;
  private floorY: number = 0;

  // Player
  private player = {
      x: 100,
      y: 0,
      width: 40,
      height: 60,
      vy: 0,
      state: 'RUN' as 'RUN' | 'JUMP' | 'SLIDE' | 'DASH',
      slideTimer: 0
  };

  // World
  private obstacles: Obstacle[] = [];
  private collectibles: Collectible[] = [];
  private particles: {x:number, y:number, vx:number, vy:number, life:number, color:string}[] = [];
  
  private obstacleTimer: number = 0;

  // Input handling
  private touchStartY: number = 0;
  private touchStartX: number = 0;

  constructor(canvas: HTMLCanvasElement, config: EngineConfig) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2d context");
    this.ctx = ctx;
    this.config = config;

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
    
    this.player.y = this.floorY - this.player.height;
  }

  private resize() {
      // Setup high DPI canvas
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      
      this.width = rect.width;
      this.height = rect.height;
      
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      
      this.ctx.scale(dpr, dpr);
      
      this.floorY = this.height * 0.75;
      
      // Keep player strictly positioned vertically if not jumping
      if (this.player.state === 'RUN') {
          this.player.y = this.floorY - this.player.height;
      }
  }

  public start() {
      this.running = true;
      this.lastTime = performance.now();
      this.loop(this.lastTime);
  }

  public destroy() {
      this.running = false;
      cancelAnimationFrame(this.animationFrameId);
      window.removeEventListener('resize', this.resize);
  }

  public handleInput(type: 'start' | 'move' | 'end', y: number) {
      if (!this.running) return;

      if (type === 'start') {
          this.touchStartY = y;
          this.touchStartX = 0; // Using 0 for start X in simplistic call
          // Actually we don't have X from GameScreen currently. Let's adapt handling.
          // TAP to jump
          if (this.player.state === 'RUN') {
              this.player.vy = this.jumpForce;
              this.player.state = 'JUMP';
              this.spawnParticles(this.player.x + this.player.width/2, this.player.y + this.player.height, 10, '#E8A020');
          }
      } else if (type === 'move') {
          const dy = y - this.touchStartY;
          // Swipe up or down logic - simplest way to trigger warp without full swipe logic
          // So if we are in air and swiped enough distance, WARP!
          if (Math.abs(dy) > 50 && this.player.state === 'JUMP') {
              this.player.state = 'DASH';
              this.player.slideTimer = 0.3; // Warp duration 0.3s
              this.player.vy = 0; // stop gravity
              this.touchStartY = y; // reset
              this.spawnParticles(this.player.x, this.player.y, 20, '#E8A020');
          }
      }
  }

  private spawnParticles(x: number, y: number, count: number, color: string) {
      for(let i=0; i<count; i++) {
          this.particles.push({
              x, y,
              vx: (Math.random() - 0.5) * 200,
              vy: (Math.random() - 1) * 200,
              life: 1.0,
              color
          });
      }
  }

  private loop(time: number) {
      if (!this.running) return;
      const dt = Math.min((time - this.lastTime) / 1000, 0.1); // max dt 100ms
      this.lastTime = time;

      this.update(dt, time);
      this.draw();

      this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  private update(dt: number, time: number) {
      // Increase difficulty
      this.speed += dt * 5; // slow speedup
      const currentSpeed = this.speed * (this.player.state === 'DASH' ? 1.5 : 1);
      
      const distIncr = (currentSpeed * dt) / 100;
      this.distance += distIncr;
      this.score += distIncr * 10 * this.combo;

      // Update player physics
      if (this.player.state === 'JUMP') {
          this.player.vy += this.gravity * dt;
          this.player.y += this.player.vy * dt;

          if (this.player.y >= this.floorY - this.player.height) {
              this.player.y = this.floorY - this.player.height;
              this.player.vy = 0;
              this.player.state = 'RUN';
              this.combo += 0.1; // combo up on successful landing
              if(this.combo > 5) this.combo = 5;
              this.spawnParticles(this.player.x + this.player.width/2, this.player.y + this.player.height, 5, '#E8A020');
          }
      } else if (this.player.state === 'DASH') {
          this.player.slideTimer -= dt;
          // spawn small particle trail
          if (Math.random() > 0.5) {
              this.spawnParticles(this.player.x, this.player.y + this.player.height/2, 2, '#fff');
          }
          if (this.player.slideTimer <= 0) {
              this.player.state = 'JUMP';
              this.player.vy = 0; // slight hover before falling again
          }
      } else {
         // RUN
         if(Math.random() < 0.1) {
             this.spawnParticles(this.player.x - 10, this.player.y + this.player.height, 1, '#fff'); // trail
         }
      }

      // Spawning
      this.obstacleTimer -= dt;
      if (this.obstacleTimer <= 0) {
          this.obstacleTimer = Math.random() * 1.5 + 0.8;
          
          if (Math.random() > 0.3) {
              // Spike/Drone
              this.obstacles.push({
                  x: this.width + 50,
                  y: this.floorY - 40,
                  width: 30,
                  height: 40,
                  type: 'SPIKE',
                  passed: false
              });
          } else {
               // Wall (needs sliding)
              this.obstacles.push({
                  x: this.width + 50,
                  y: this.floorY - 80, // floating wall
                  width: 40,
                  height: 80,
                  type: 'WALL',
                  passed: false
              });
          }

          // Spawn collectible maybe
          if (Math.random() > 0.5) {
              this.collectibles.push({
                  x: this.width + 100,
                  y: this.floorY - 60 - Math.random() * 100,
                  radius: 12,
                  type: Math.random() > 0.9 ? 'MULTIPLIER' : 'COIN',
                  collected: false
              })
          }
      }

      const pRect = {
          x: this.player.x + 10, // hitbox margin
          y: this.player.y,
          width: this.player.width - 20,
          height: this.player.height
      };

      // Move and collide obstacles
      for (let i = this.obstacles.length - 1; i >= 0; i--) {
          const obs = this.obstacles[i];
          obs.x -= currentSpeed * dt;

          const oRect = { x: obs.x, y: obs.y, width: obs.width, height: obs.height };

          if (this.player.state !== 'DASH' && this.checkCollision(pRect, oRect)) {
              this.combo = 1.0;
              this.running = false;
              this.config.onGameOver({ distance: this.distance, score: this.score, combo: this.combo });
              return;
          }

          if (!obs.passed && obs.x + obs.width < this.player.x) {
              obs.passed = true;
          }

          if (obs.x < -100) {
              this.obstacles.splice(i, 1);
          }
      }

      // Move and collect
      for (let i = this.collectibles.length - 1; i >= 0; i--) {
          const col = this.collectibles[i];
          col.x -= currentSpeed * dt;

          const cRect = { x: col.x - col.radius, y: col.y - col.radius, width: col.radius*2, height: col.radius*2 };

          if (!col.collected && this.checkCollision(pRect, cRect)) {
              col.collected = true;
              this.spawnParticles(col.x, col.y, 10, col.type === 'MULTIPLIER' ? '#eab308' : '#3b82f6');
              if (col.type === 'MULTIPLIER') {
                  this.combo += 1.0;
              } else {
                  this.score += 100 * this.combo;
              }
          }

          if (col.x < -50 || col.collected) {
              this.collectibles.splice(i, 1);
          }
      }

      // Particles
      for (let i = this.particles.length -1; i >=0; i--) {
          const p = this.particles[i];
          p.x += p.vx * dt - (currentSpeed * dt);
          p.y += p.vy * dt;
          p.life -= dt * 2;
          if(p.life <= 0) this.particles.splice(i, 1);
      }

      // HUD update (throttle maybe?)
      if (Math.floor(time) % 5 === 0) {
          this.config.onScoreUpdate({ distance: this.distance, score: this.score, combo: this.combo });
      }
  }

  private checkCollision(r1: {x:number,y:number,width:number,height:number}, r2: {x:number,y:number,width:number,height:number}) {
       return r1.x < r2.x + r2.width &&
         r1.x + r1.width > r2.x &&
         r1.y < r2.y + r2.height &&
         r1.y + r1.height > r2.y;
  }

  private draw() {
      // Draw Base/Grid
      this.ctx.fillStyle = 'rgba(5, 5, 5, 0.5)'; // dark with opacity
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.ctx.strokeStyle = '#E8A020'; // neon orange grid
      this.ctx.globalAlpha = 0.3;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.floorY);
      this.ctx.lineTo(this.width, this.floorY);
      this.ctx.stroke();

      const offset = (this.distance * 100) % 40;
      for(let i=0; i<this.width; i+=40) {
         this.ctx.beginPath();
         this.ctx.moveTo(i - offset, this.floorY);
         this.ctx.lineTo(i - offset - 40, this.height);
         this.ctx.stroke();
      }
      this.ctx.globalAlpha = 1.0;

      // Draw Collectibles
      for (const col of this.collectibles) {
          this.ctx.fillStyle = col.type === 'MULTIPLIER' ? '#E8A020' : '#4ade80';
          this.ctx.shadowColor = this.ctx.fillStyle;
          this.ctx.shadowBlur = 10;
          this.ctx.beginPath();
          this.ctx.arc(col.x, col.y + Math.sin(this.lastTime/200)*5, col.radius, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.shadowBlur = 0;
      }

      // Draw Obstacles
      for (const obs of this.obstacles) {
          this.ctx.fillStyle = '#ef4444'; // Red lasers/spikes
          this.ctx.shadowColor = this.ctx.fillStyle;
          this.ctx.shadowBlur = 15;
          this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          
          if(obs.type === 'SPIKE') {
              this.ctx.beginPath();
              this.ctx.moveTo(obs.x + obs.width/2, obs.y - 10);
              this.ctx.lineTo(obs.x + obs.width, obs.y);
              this.ctx.lineTo(obs.x, obs.y);
              this.ctx.fill();
          }
          this.ctx.shadowBlur = 0;
      }

      // Particles
      for (const p of this.particles) {
          this.ctx.fillStyle = p.color;
          this.ctx.globalAlpha = Math.max(0, p.life);
          this.ctx.fillRect(p.x, p.y, 4, 4);
      }
      this.ctx.globalAlpha = 1.0;

      // Draw Warp Jumper (Player)
      this.ctx.shadowColor = '#E8A020';
      this.ctx.shadowBlur = this.player.state === 'DASH' ? 25 : 10;
      this.ctx.fillStyle = this.player.state === 'DASH' ? '#fff' : '#E8A020';
      
      const pRect = {
          x: this.player.x,
          y: this.player.y,
          width: this.player.width,
          height: this.player.height
      };
      
      this.ctx.fillRect(pRect.x, pRect.y, pRect.width, pRect.height);
      
      // Cyberpunk runner detail
      this.ctx.fillStyle = '#fff';
      this.ctx.shadowBlur = 0;
      this.ctx.fillRect(pRect.x + pRect.width/2 + 5, pRect.y + 10, 10, 4); // eye visor
  }
}
