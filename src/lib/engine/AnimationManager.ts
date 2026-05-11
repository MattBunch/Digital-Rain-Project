export class AnimationManager {
  requestId: number | null = null;
  lastTime: number = 0;
  animationOn: boolean = false;
  intervalSpeed: number = 50;

  constructor(private loopCallback: (timestamp: number) => void) {}

  start(): void {
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
    }
    this.lastTime = performance.now();
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
    return deltaTime;
  }

  getSpeedFactor(deltaTime: number): number {
    return deltaTime / this.intervalSpeed;
  }
}
