/* ==========================================================
   THREE-HERO.JS
   Subtle 3D particle/node network for the hero section.
   Requires: three.js (r128). Degrades silently if missing,
   if WebGL is unavailable, or if the user prefers reduced motion.
   ========================================================== */

(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var container = canvas.closest('.hero');
  if (!container) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
  } catch (e) {
    return; // no WebGL support — canvas simply stays empty/transparent
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
  camera.position.z = 60;

  /* ---------- Build the point/node network ---------- */
  var NODE_COUNT = window.innerWidth < 700 ? 28 : 46;
  var LINK_DISTANCE = 17;
  var SPREAD = { x: 70, y: 55, z: 40 };

  var positions = new Float32Array(NODE_COUNT * 3);
  var velocities = [];

  for (var i = 0; i < NODE_COUNT; i++) {
    var x = (Math.random() - 0.5) * SPREAD.x;
    var y = (Math.random() - 0.5) * SPREAD.y;
    var z = (Math.random() - 0.5) * SPREAD.z;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    velocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.005
    });
  }

  var pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  var pointsMat = new THREE.PointsMaterial({
    color: 0x2fd6c0,
    size: 1.6,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  });

  var points = new THREE.Points(pointsGeo, pointsMat);
  scene.add(points);

  // Line segments connecting nearby nodes — rebuilt each frame is costly,
  // so we use a generous static max-buffer and rewrite only used entries.
  var maxLines = NODE_COUNT * 6;
  var lineGeo = new THREE.BufferGeometry();
  var linePositions = new Float32Array(maxLines * 2 * 3);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  var lineMat = new THREE.LineBasicMaterial({
    color: 0x0f5f56,
    transparent: true,
    opacity: 0.22
  });

  var lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  var group = new THREE.Group();
  group.add(points);
  group.add(lines);
  scene.remove(points);
  scene.remove(lines);
  scene.add(group);

  /* ---------- Sizing ---------- */
  function resize() {
    var w = container.clientWidth;
    var h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---------- Mouse parallax ---------- */
  var targetRotX = 0, targetRotY = 0;
  var currentRotX = 0, currentRotY = 0;

  if (!reducedMotion) {
    container.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      var nx = (e.clientX - rect.left) / rect.width - 0.5;
      var ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 0.35;
      targetRotX = ny * 0.2;
    });
  }

  /* ---------- Animation loop ---------- */
  var running = true;
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) animate();
  });

  function updateLinks() {
    var pos = pointsGeo.attributes.position.array;
    var linePos = lineGeo.attributes.position.array;
    var idx = 0;

    for (var i = 0; i < NODE_COUNT && idx < maxLines; i++) {
      var xi = pos[i * 3], yi = pos[i * 3 + 1], zi = pos[i * 3 + 2];
      for (var j = i + 1; j < NODE_COUNT && idx < maxLines; j++) {
        var xj = pos[j * 3], yj = pos[j * 3 + 1], zj = pos[j * 3 + 2];
        var dx = xi - xj, dy = yi - yj, dz = zi - zj;
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < LINK_DISTANCE) {
          linePos[idx * 6] = xi;
          linePos[idx * 6 + 1] = yi;
          linePos[idx * 6 + 2] = zi;
          linePos[idx * 6 + 3] = xj;
          linePos[idx * 6 + 4] = yj;
          linePos[idx * 6 + 5] = zj;
          idx++;
        }
      }
    }
    lineGeo.setDrawRange(0, idx * 2);
    lineGeo.attributes.position.needsUpdate = true;
  }

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    if (!reducedMotion) {
      var pos = pointsGeo.attributes.position.array;
      for (var i = 0; i < NODE_COUNT; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        if (Math.abs(pos[i * 3]) > SPREAD.x / 2) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > SPREAD.y / 2) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > SPREAD.z / 2) velocities[i].z *= -1;
      }
      pointsGeo.attributes.position.needsUpdate = true;

      currentRotX += (targetRotX - currentRotX) * 0.04;
      currentRotY += (targetRotY - currentRotY) * 0.04;
      group.rotation.x = currentRotX;
      group.rotation.y = currentRotY + Math.sin(Date.now() * 0.00012) * 0.08;
    }

    updateLinks();
    renderer.render(scene, camera);
  }

  // Reduced-motion: render one static frame with links resolved, then stop.
  if (reducedMotion) {
    updateLinks();
    renderer.render(scene, camera);
  } else {
    animate();
  }
})();