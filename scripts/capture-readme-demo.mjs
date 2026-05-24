import { chromium } from '@playwright/test';
import { execFile, spawn } from 'node:child_process';
import { mkdir, rm, rmdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const rootDir = resolve(import.meta.dirname, '..');
const tempRootDir = join(rootDir, '.tmp');
const tempDir = join(tempRootDir, 'readme-demo');
const framesDir = join(tempDir, 'frames');
const palettePath = join(tempDir, 'palette.png');
const outputPath = join(rootDir, 'docs', 'assets', 'demo.gif');
const serverUrl = 'http://127.0.0.1:5173';
const frameRate = 10;

async function waitForServer(url, server, serverLogs, timeoutMs = 30000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    if (server.exitCode !== null) {
      throw new Error(
        `Dev server exited before ${url} responded.\n${serverLogs.join('').slice(-4000)}`,
      );
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // The dev server is still starting.
    }

    await delay(250);
  }

  throw new Error(`Timed out waiting for ${url}.\n${serverLogs.join('').slice(-4000)}`);
}

async function runFfmpeg(args) {
  try {
    await execFileAsync('ffmpeg', args, {
      cwd: rootDir,
      maxBuffer: 1024 * 1024 * 8,
    });
  } catch (error) {
    const stderr = error?.stderr ? `\n${error.stderr}` : '';
    throw new Error(`ffmpeg failed.${stderr}`, { cause: error });
  }
}

let frameIndex = 0;

async function captureFor(page, durationMs) {
  const frameDelayMs = 1000 / frameRate;
  const endTime = Date.now() + durationMs;

  while (Date.now() < endTime) {
    const frameStart = Date.now();
    const frameName = `frame-${String(frameIndex).padStart(4, '0')}.png`;

    await page.screenshot({
      path: join(framesDir, frameName),
      animations: 'allow',
      caret: 'hide',
      scale: 'css',
    });

    frameIndex += 1;

    const remainingDelay = frameDelayMs - (Date.now() - frameStart);
    if (remainingDelay > 0) {
      await delay(remainingDelay);
    }
  }
}

async function main() {
  await rm(tempDir, { force: true, recursive: true });
  await mkdir(framesDir, { recursive: true });
  await mkdir(join(rootDir, 'docs', 'assets'), { recursive: true });
  frameIndex = 0;

  const server = spawn('pnpm', ['run', 'dev', '--host', '127.0.0.1'], {
    cwd: rootDir,
    env: { ...process.env, BROWSER: 'none' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const serverLogs = [];
  const captureLog = (chunk) => {
    serverLogs.push(chunk.toString());
  };

  server.stdout.on('data', captureLog);
  server.stderr.on('data', captureLog);

  try {
    await waitForServer(serverUrl, server, serverLogs);

    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
      colorScheme: 'dark',
    });

    const page = await context.newPage();
    await page.goto(`${serverUrl}/?hash-settings=1#c=green&fc=6&v=55&s=20&i=95`);
    await page.waitForLoadState('networkidle');
    await captureFor(page, 900);

    await page.getByRole('button', { name: 'START' }).first().click();
    await page.locator('main > canvas').waitFor({ state: 'visible' });
    await captureFor(page, 1800);

    await page.keyboard.press('d');
    await captureFor(page, 1700);

    await page.keyboard.press('t');
    await captureFor(page, 1600);

    await page.keyboard.press('m');
    await captureFor(page, 1600);

    await context.close();
    await browser.close();

    const framePattern = join(framesDir, 'frame-%04d.png');
    const paletteFilter = 'scale=720:-1:flags=lanczos,palettegen=max_colors=128';
    const gifFilter = 'scale=720:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4';

    await runFfmpeg([
      '-y',
      '-framerate',
      String(frameRate),
      '-i',
      framePattern,
      '-vf',
      paletteFilter,
      palettePath,
    ]);
    await runFfmpeg([
      '-y',
      '-framerate',
      String(frameRate),
      '-i',
      framePattern,
      '-i',
      palettePath,
      '-lavfi',
      gifFilter,
      outputPath,
    ]);
  } finally {
    server.kill('SIGTERM');

    await new Promise((resolveKill) => {
      const timeout = setTimeout(() => {
        server.kill('SIGKILL');
        resolveKill();
      }, 3000);

      server.once('exit', () => {
        clearTimeout(timeout);
        resolveKill();
      });
    });

    await rm(tempDir, { force: true, recursive: true });
    await rmdir(tempRootDir).catch(() => undefined);
  }

  console.log(`Created ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
