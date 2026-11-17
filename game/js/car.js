// A drivable car: simple arcade physics (accelerate, turn, friction) and a few parked spawns.
import { CITY_W, CITY_H } from './city.js';

export function spawnCars(n) {
  const cars = [];
  const colors = ['#e63946', '#2a9d8f', '#f4a261', '#264653', '#e9c46a'];
  for (let i = 0; i < n; i++) {
    cars.push({
      x: 60 + Math.random() * (CITY_W - 120),
      y: 60 + Math.random() * (CITY_H - 120),
      angle: Math.random() * Math.PI * 2,
      speed: 0,
      color: colors[i % colors.length],
      occupied: false,
    });
  }
  return cars;
}

export function updateCar(car, dt, forward, turn) {
  const ACCEL = 260, MAX_SPEED = 320, FRICTION = 140, TURN_RATE = 2.4;
  car.speed += forward * ACCEL * dt;
  car.speed -= Math.sign(car.speed) * FRICTION * dt * (forward === 0 ? 1 : 0.2);
  car.speed = Math.max(-MAX_SPEED * 0.5, Math.min(MAX_SPEED, car.speed));
  if (Math.abs(car.speed) < 4) car.speed = 0;
  car.angle += turn * TURN_RATE * dt * (car.speed >= 0 ? 1 : -1) * Math.min(1, Math.abs(car.speed) / 60);
  car.x += Math.cos(car.angle) * car.speed * dt;
  car.y += Math.sin(car.angle) * car.speed * dt;
  car.x = Math.max(10, Math.min(CITY_W - 10, car.x));
  car.y = Math.max(10, Math.min(CITY_H - 10, car.y));
}

export function drawCar(ctx, car, camX, camY) {
  ctx.save();
  ctx.translate(car.x - camX, car.y - camY);
  ctx.rotate(car.angle);
  ctx.fillStyle = car.color;
  ctx.fillRect(-16, -9, 32, 18);
  ctx.fillStyle = '#111';
  ctx.fillRect(-10, -9, 10, 18);
  ctx.fillStyle = '#9fd8ff';
  ctx.fillRect(2, -7, 8, 14);
  ctx.restore();
}
