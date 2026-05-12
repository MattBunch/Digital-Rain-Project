export class AnimationManager {
  requestId: number | null = null;
  lastTime: number = 0;
  animationOn: boolean = false;
  intervalSpeed: number = 50;
  fps: number = 0;
  private fpsFrameCount: number = 0;
  private fpsLastTime: number = 0;

  constructor(private loopCallback: (timestamp: number) => void) {}

  start(): void {
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
    }
    this.lastTime = performance.now();
    this.fpsLastTime = this.lastTime;
    this.fpsFrameCount = 0;
    this.animationOn = true;
    this.requestId = requestAnimationFrame(this.loopCallback);
  }

  stop(): void {
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
    this.animationOn = false;
  }

  pause(): boolean {
    if (this.animationOn) {
      this.stop();
    } else {
      this.start();
    }
    return this.animationOn;
  }

  getDeltaTime(timestamp: number): number {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // FPS calculation
    this.fpsFrameCount++;
    if (timestamp > this.fpsLastTime + 1000) {
      this.fps = Math.round((this.fpsFrameCount * 1000) / (timestamp - this.fpsLastTime));
      this.fpsLastTime = timestamp;
      this.fpsFrameCount = 0;
    }

    return deltaTime;
  }

  getSpeedFactor(deltaTime: number): number {
    return deltaTime / this.intervalSpeed;
  }
}
