import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { VipPackage, VipPackageSize } from "@shared/events/types";
import type {
  VipVenueMapDefinition,
  VipVenueViewId,
} from "@/data/vipVenueMaps";

export type VipVenueLighting = "sunset" | "day";

type CastawaysVenueSceneProps = {
  map: VipVenueMapDefinition;
  packages: VipPackage[];
  selectedSize: VipPackageSize | null;
  view: VipVenueViewId;
  lighting: VipVenueLighting;
  onSelect: (size: VipPackageSize) => void;
  onReady?: () => void;
  onError?: () => void;
};

type SceneRuntime = {
  setSelection: (size: VipPackageSize | null) => void;
  setView: (view: VipVenueViewId) => void;
  setLighting: (lighting: VipVenueLighting) => void;
};

type MarkerRuntime = {
  size: VipPackageSize;
  sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
  light: THREE.PointLight;
  pickTarget: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  baseColor: THREE.Color;
  soldOut: boolean;
};

const STATUS_COLORS = {
  available: new THREE.Color("#58e2b4"),
  limited: new THREE.Color("#f4c45e"),
  "sold-out": new THREE.Color("#737780"),
};
const SELECTED_COLOR = new THREE.Color("#ee5525");

function buildHullShape(scale = 1) {
  const width = 5.6 * scale;
  const shape = new THREE.Shape();
  shape.moveTo(-21 * scale, 0);
  shape.quadraticCurveTo(-21 * scale, width, -14 * scale, width);
  shape.lineTo(12 * scale, width);
  shape.quadraticCurveTo(19 * scale, width * 0.92, 24 * scale, 0);
  shape.quadraticCurveTo(19 * scale, -width * 0.92, 12 * scale, -width);
  shape.lineTo(-14 * scale, -width);
  shape.quadraticCurveTo(-21 * scale, -width, -21 * scale, 0);
  return shape;
}

function getPackageStatus(packages: VipPackage[], size: VipPackageSize) {
  return packages.find(item => item.size === size)?.availability ?? "sold-out";
}

export default function CastawaysVenueScene({
  map,
  packages,
  selectedSize,
  view,
  lighting,
  onSelect,
  onReady,
  onError,
}: CastawaysVenueSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<SceneRuntime | null>(null);
  const selectRef = useRef(onSelect);
  const readyRef = useRef(onReady);
  const errorRef = useRef(onError);

  selectRef.current = onSelect;
  readyRef.current = onReady;
  errorRef.current = onError;

  useEffect(() => {
    runtimeRef.current?.setSelection(selectedSize);
  }, [selectedSize]);

  useEffect(() => {
    runtimeRef.current?.setView(view);
  }, [view]);

  useEffect(() => {
    runtimeRef.current?.setLighting(lighting);
  }, [lighting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      errorRef.current?.();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = window.innerWidth >= 768;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x5c2b32, 78, 190);
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 400);
    const world = new THREE.Group();
    world.rotation.y = -0.06;
    scene.add(world);

    const resources: Array<{ dispose: () => void }> = [];
    const register = <T extends { dispose: () => void }>(resource: T) => {
      resources.push(resource);
      return resource;
    };
    const material = (
      color: THREE.ColorRepresentation,
      options: Partial<THREE.MeshStandardMaterialParameters> = {}
    ) =>
      register(
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.82,
          metalness: 0.03,
          ...options,
        })
      );

    const white = material(0xe8e2d7, { roughness: 0.58 });
    const bone = material(0xcfc6b6, { roughness: 0.88 });
    const black = material(0x08090b, { roughness: 0.54 });
    const charcoal = material(0x181a1f, { roughness: 0.7 });
    const navy = material(0x182b3b, { roughness: 0.56 });
    const orange = material(0xee5525, { roughness: 0.5 });
    const wood = material(0x9a7144, { roughness: 0.8 });
    const moss = material(0x3f6348, { roughness: 0.94 });
    const sandMaterial = material(0xa8875c, { roughness: 1 });
    const waterMaterial = material(0x0b5165, {
      roughness: 0.36,
      metalness: 0.12,
    });

    const hemi = new THREE.HemisphereLight(0xffa47e, 0x261b27, 1.18);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xff985f, 2.55);
    sun.position.set(-48, 34, -38);
    sun.castShadow = renderer.shadowMap.enabled;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -42;
    sun.shadow.camera.right = 42;
    sun.shadow.camera.top = 42;
    sun.shadow.camera.bottom = -42;
    sun.shadow.camera.far = 180;
    sun.shadow.bias = -0.0005;
    scene.add(sun);
    const fill = new THREE.PointLight(0xffb26f, 16, 70, 2);
    fill.position.set(2, 13, 5);
    scene.add(fill);

    const sandGeometry = register(new THREE.PlaneGeometry(240, 90, 28, 12));
    const sandPositions = sandGeometry.attributes.position;
    for (let index = 0; index < sandPositions.count; index += 1) {
      const x = sandPositions.getX(index);
      const y = sandPositions.getY(index);
      sandPositions.setZ(
        index,
        Math.sin(x * 0.055) * 0.32 + Math.cos(y * 0.08) * 0.28
      );
    }
    sandGeometry.computeVertexNormals();
    const sand = new THREE.Mesh(sandGeometry, sandMaterial);
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(0, -0.15, 37);
    sand.receiveShadow = true;
    world.add(sand);

    const waterGeometry = register(new THREE.PlaneGeometry(260, 120, 54, 24));
    const waterBase = Float32Array.from(
      waterGeometry.attributes.position.array as ArrayLike<number>
    );
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.42, -69);
    world.add(water);

    const shallowMaterial = material(0x167b91, {
      transparent: true,
      opacity: 0.6,
      roughness: 0.44,
    });
    const shallow = new THREE.Mesh(
      register(new THREE.PlaneGeometry(260, 18)),
      shallowMaterial
    );
    shallow.rotation.x = -Math.PI / 2;
    shallow.position.set(0, -0.3, -28);
    world.add(shallow);

    const foamMaterial = register(
      new THREE.MeshBasicMaterial({
        color: 0xf8eee2,
        transparent: true,
        opacity: 0.26,
      })
    );
    const foam = new THREE.Mesh(
      register(new THREE.PlaneGeometry(260, 2.1)),
      foamMaterial
    );
    foam.rotation.x = -Math.PI / 2;
    foam.position.set(0, -0.2, -23.4);
    world.add(foam);

    const boat = new THREE.Group();
    boat.position.y = 0.08;
    world.add(boat);
    const deckTop = 3.72;

    const extrudeHull = (
      scale: number,
      depth: number,
      surface: THREE.Material,
      y: number
    ) => {
      const geometry = register(
        new THREE.ExtrudeGeometry(buildHullShape(scale), {
          depth,
          bevelEnabled: false,
          curveSegments: 24,
        })
      );
      geometry.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(geometry, surface);
      mesh.position.y = y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      boat.add(mesh);
      return mesh;
    };

    extrudeHull(1.12, 0.42, bone, 0);
    extrudeHull(1, 3.05, white, 0.42);
    extrudeHull(1.018, 0.92, navy, 0.44);
    extrudeHull(1.005, 0.25, navy, 3.2);
    extrudeHull(0.955, 0.2, charcoal, 3.5);

    const railPoints = buildHullShape(0.93)
      .getPoints(72)
      .map(point => new THREE.Vector3(point.x, deckTop + 0.82, point.y));
    const railCurve = new THREE.CatmullRomCurve3(railPoints, true);
    const rail = new THREE.Mesh(
      register(new THREE.TubeGeometry(railCurve, 150, 0.04, 6, true)),
      white
    );
    boat.add(rail);
    const postGeometry = register(
      new THREE.CylinderGeometry(0.035, 0.035, 0.82, 6)
    );
    railPoints.forEach((point, index) => {
      if (index % 4 !== 0) return;
      const post = new THREE.Mesh(postGeometry, white);
      post.position.set(point.x, deckTop + 0.4, point.z);
      boat.add(post);
    });

    const addBox = (
      size: [number, number, number],
      position: [number, number, number],
      surface: THREE.Material,
      parent: THREE.Object3D = boat
    ) => {
      const mesh = new THREE.Mesh(
        register(new THREE.BoxGeometry(...size)),
        surface
      );
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    addBox([6.5, 2.3, 8.5], [-17, deckTop + 1.15, 0], white);
    addBox([6.56, 0.52, 8.56], [-17, deckTop + 1.62, 0], black);
    addBox([3, 1.48, 5.6], [-18.6, deckTop + 3.02, 0], white);
    addBox([3.05, 0.48, 5.66], [-18.6, deckTop + 3.2, 0], black);

    const funnelGeometry = register(
      new THREE.CylinderGeometry(1.1, 1.32, 5.2, 20)
    );
    const capGeometry = register(
      new THREE.CylinderGeometry(1.12, 1.12, 0.7, 20)
    );
    [-8.8, -12.3].forEach(x => {
      const funnel = new THREE.Group();
      const body = new THREE.Mesh(funnelGeometry, orange);
      body.castShadow = true;
      funnel.add(body);
      const cap = new THREE.Mesh(capGeometry, black);
      cap.position.y = 2.45;
      funnel.add(cap);
      funnel.position.set(x, deckTop + 2.62, 0);
      funnel.rotation.z = 0.08;
      boat.add(funnel);
    });

    addBox([4.5, 0.5, 7], [-4, deckTop + 0.25, 0], black);
    addBox([0.42, 3.8, 6.7], [-6.22, deckTop + 2.2, 0], black);
    addBox([0.48, 3.5, 1], [-6, deckTop + 2.08, 3.65], moss);
    addBox([0.48, 3.5, 1], [-6, deckTop + 2.08, -3.65], moss);

    const ledCanvas = document.createElement("canvas");
    ledCanvas.width = 768;
    ledCanvas.height = 384;
    const ledContext = ledCanvas.getContext("2d");
    if (ledContext) {
      const gradient = ledContext.createLinearGradient(0, 0, 768, 384);
      gradient.addColorStop(0, "#ec542b");
      gradient.addColorStop(0.52, "#ff9060");
      gradient.addColorStop(1, "#822b56");
      ledContext.fillStyle = gradient;
      ledContext.fillRect(0, 0, 768, 384);
      ledContext.fillStyle = "rgba(255,247,235,.96)";
      ledContext.textAlign = "center";
      ledContext.textBaseline = "middle";
      ledContext.font = "900 102px Arial Narrow, Arial, sans-serif";
      ledContext.fillText("SUN(SETS)", 384, 155);
      ledContext.font = "700 35px Arial, sans-serif";
      ledContext.letterSpacing = "10px";
      ledContext.fillText("MONOLITH PROJECT", 384, 255);
    }
    const ledTexture = register(new THREE.CanvasTexture(ledCanvas));
    ledTexture.colorSpace = THREE.SRGBColorSpace;
    const ledMaterial = register(
      new THREE.MeshBasicMaterial({ map: ledTexture })
    );
    const led = new THREE.Mesh(
      register(new THREE.PlaneGeometry(6.1, 3.25)),
      ledMaterial
    );
    led.rotation.y = Math.PI / 2;
    led.position.set(-5.98, deckTop + 2.22, 0);
    boat.add(led);

    addBox([1.2, 1.05, 2.8], [-2.7, deckTop + 1.02, 0], navy);
    addBox([1.42, 0.08, 3], [-2.7, deckTop + 1.58, 0], wood);
    const tentPole = new THREE.Mesh(
      register(new THREE.CylinderGeometry(0.08, 0.08, 6.2, 8)),
      white
    );
    tentPole.position.set(-4, deckTop + 3.1, 0);
    boat.add(tentPole);
    const tentMaterial = material(0xe8dfcf, {
      side: THREE.DoubleSide,
      roughness: 0.75,
    });
    const tent = new THREE.Mesh(
      register(new THREE.ConeGeometry(5.1, 2.45, 4)),
      tentMaterial
    );
    tent.rotation.y = Math.PI / 4;
    tent.position.set(-4, deckTop + 5.45, 0);
    tent.castShadow = true;
    boat.add(tent);

    addBox([2.7, 1.04, 3.4], [14.8, deckTop + 0.52, 0], navy);
    addBox([2.95, 0.08, 3.72], [14.8, deckTop + 1.08, 0], wood);
    const mast = new THREE.Mesh(
      register(new THREE.CylinderGeometry(0.065, 0.095, 5.3, 8)),
      white
    );
    mast.position.set(19, deckTop + 2.65, 0);
    boat.add(mast);

    const cabanaPostGeometry = register(
      new THREE.CylinderGeometry(0.065, 0.065, 2.2, 8)
    );
    const cabanaSlatGeometry = register(new THREE.BoxGeometry(2.7, 0.06, 0.25));
    const cushion = material(0xd9d0c1, { roughness: 0.94 });
    const addCabana = (x: number, z: number) => {
      const group = new THREE.Group();
      [
        [-1.25, -1.25],
        [1.25, -1.25],
        [-1.25, 1.25],
        [1.25, 1.25],
      ].forEach(([cx, cz]) => {
        const post = new THREE.Mesh(cabanaPostGeometry, white);
        post.position.set(cx, 1.1, cz);
        group.add(post);
      });
      for (let slatIndex = 0; slatIndex < 5; slatIndex += 1) {
        const slat = new THREE.Mesh(cabanaSlatGeometry, wood);
        slat.position.set(0, 2.24, -1.1 + slatIndex * 0.55);
        group.add(slat);
      }
      addBox([1.92, 0.4, 1.62], [0, 0.34, 0], cushion, group);
      addBox([0.27, 0.6, 1.62], [-0.82, 0.76, 0], cushion, group);
      group.position.set(x, deckTop, z);
      boat.add(group);
    };
    [3.4, 6.6, 9.8].forEach(x => {
      addCabana(x, 3.35);
      addCabana(x, -3.35);
    });

    const addLounger = (x: number, z: number, y = deckTop) => {
      const group = new THREE.Group();
      addBox([1.7, 0.34, 1.28], [0, 0.3, 0], cushion, group);
      addBox([0.24, 0.56, 1.28], [-0.72, 0.67, 0], cushion, group);
      const table = new THREE.Mesh(
        register(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 12)),
        wood
      );
      table.position.set(0.75, 0.25, 0.8);
      group.add(table);
      group.position.set(x, y, z);
      boat.add(group);
    };
    addLounger(0.75, 1.9);
    addLounger(0.75, -1.9);
    addLounger(-15.4, 2.05, deckTop + 2.3);
    addLounger(-15.4, -2.05, deckTop + 2.3);

    const bulbGeometry = register(new THREE.SphereGeometry(0.075, 6, 6));
    const bulbMaterial = register(
      new THREE.MeshBasicMaterial({ color: 0xffd3a1 })
    );
    const addLightStrand = (
      start: THREE.Vector3,
      end: THREE.Vector3,
      sag: number,
      count: number
    ) => {
      const middle = start.clone().add(end).multiplyScalar(0.5);
      middle.y -= sag;
      const curve = new THREE.QuadraticBezierCurve3(start, middle, end);
      curve.getPoints(count).forEach(point => {
        const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
        bulb.position.copy(point);
        boat.add(bulb);
      });
    };
    const tentTip = new THREE.Vector3(-4, deckTop + 6.68, 0);
    addLightStrand(tentTip, new THREE.Vector3(19, deckTop + 5.2, 0), 1.2, 20);
    addLightStrand(tentTip, new THREE.Vector3(-18.6, deckTop + 4.1, 0), 1, 14);
    addLightStrand(tentTip, new THREE.Vector3(6, deckTop + 1, 4.9), 0.8, 12);
    addLightStrand(tentTip, new THREE.Vector3(6, deckTop + 1, -4.9), 0.8, 12);

    const markerRuntimes: MarkerRuntime[] = [];
    const pickTargets: THREE.Object3D[] = [];
    map.zones.forEach(zone => {
      const status = getPackageStatus(packages, zone.packageSize);
      const baseColor = STATUS_COLORS[status].clone();
      const sphereMaterial = register(
        new THREE.MeshStandardMaterial({
          color: baseColor,
          emissive: baseColor,
          emissiveIntensity: status === "sold-out" ? 0.08 : 1.5,
          roughness: 0.28,
          metalness: 0.08,
        })
      );
      const sphere = new THREE.Mesh(
        register(new THREE.SphereGeometry(0.38, 18, 14)),
        sphereMaterial
      );
      sphere.position.set(...zone.world);
      boat.add(sphere);

      const ringMaterial = register(
        new THREE.MeshBasicMaterial({
          color: baseColor,
          transparent: true,
          opacity: status === "sold-out" ? 0.15 : 0.58,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      const ring = new THREE.Mesh(
        register(new THREE.RingGeometry(0.54, 0.72, 32)),
        ringMaterial
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(zone.world[0], zone.world[1] - 0.55, zone.world[2]);
      boat.add(ring);

      const light = new THREE.PointLight(baseColor, 5, 8, 2);
      light.position.set(...zone.world);
      boat.add(light);

      const pickMaterial = register(
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      const pickTarget = new THREE.Mesh(
        register(new THREE.SphereGeometry(0.92, 10, 8)),
        pickMaterial
      );
      pickTarget.position.set(...zone.world);
      pickTarget.userData.packageSize = zone.packageSize;
      boat.add(pickTarget);
      pickTargets.push(pickTarget);

      markerRuntimes.push({
        size: zone.packageSize,
        sphere,
        ring,
        light,
        pickTarget,
        baseColor,
        soldOut: status === "sold-out",
      });
    });

    const cameraState = {
      theta: map.cameras.overview.theta,
      phi: map.cameras.overview.phi,
      radius: 76,
      target: new THREE.Vector3(...map.cameras.overview.target),
    };
    const cameraGoal = {
      theta: map.cameras.overview.theta,
      phi: map.cameras.overview.phi,
      radius: map.cameras.overview.radius,
      target: new THREE.Vector3(...map.cameras.overview.target),
    };
    let autoRotate = !reduceMotion;
    let activeSelection: VipPackageSize | null = selectedSize;

    const setView = (nextView: VipVenueViewId) => {
      const preset = map.cameras[nextView];
      cameraGoal.theta = preset.theta;
      cameraGoal.phi = preset.phi;
      cameraGoal.radius = preset.radius;
      cameraGoal.target.set(...preset.target);
      autoRotate = false;
    };

    const setSelection = (size: VipPackageSize | null) => {
      activeSelection = size;
      markerRuntimes.forEach(marker => {
        const selected = marker.size === size && !marker.soldOut;
        const color = selected ? SELECTED_COLOR : marker.baseColor;
        marker.sphere.material.color.copy(color);
        marker.sphere.material.emissive.copy(color);
        marker.sphere.material.emissiveIntensity = marker.soldOut
          ? 0.08
          : selected
            ? 2.4
            : 1.5;
        marker.ring.material.color.copy(color);
        marker.ring.material.opacity = marker.soldOut
          ? 0.15
          : selected
            ? 0.94
            : 0.58;
        marker.light.color.copy(color);
        marker.light.intensity = marker.soldOut ? 0 : selected ? 12 : 5;
        marker.sphere.scale.setScalar(selected ? 1.28 : 1);
      });
    };

    const setLighting = (nextLighting: VipVenueLighting) => {
      if (nextLighting === "day") {
        hemi.color.set(0xbfe1ff);
        hemi.groundColor.set(0x806d54);
        hemi.intensity = 1.25;
        sun.color.set(0xfff8e8);
        sun.intensity = 2.05;
        sun.position.set(42, 62, 24);
        fill.intensity = 4;
        scene.fog?.color.set(0x9bc8dc);
        waterMaterial.color.set(0x137f9c);
        shallowMaterial.color.set(0x3aa6bc);
        bulbMaterial.color.set(0xfff1d8);
        renderer.toneMappingExposure = 1;
      } else {
        hemi.color.set(0xffa47e);
        hemi.groundColor.set(0x261b27);
        hemi.intensity = 1.18;
        sun.color.set(0xff985f);
        sun.intensity = 2.55;
        sun.position.set(-48, 34, -38);
        fill.intensity = 16;
        scene.fog?.color.set(0x5c2b32);
        waterMaterial.color.set(0x0b5165);
        shallowMaterial.color.set(0x167b91);
        bulbMaterial.color.set(0xffd3a1);
        renderer.toneMappingExposure = 1.05;
      }
    };

    runtimeRef.current = { setSelection, setView, setLighting };
    setSelection(selectedSize);
    setView(view);
    setLighting(lighting);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const activePointers = new Map<number, { x: number; y: number }>();
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let pinchDistance = 0;

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const pickMarker = (event: PointerEvent) => {
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickTargets, false)[0];
      if (!hit) return null;
      return hit.object.userData.packageSize as VipPackageSize;
    };
    const onPointerDown = (event: PointerEvent) => {
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      autoRotate = false;
      if (activePointers.size === 1) {
        dragging = true;
        moved = 0;
        lastX = event.clientX;
        lastY = event.clientY;
        canvas.setPointerCapture?.(event.pointerId);
      } else if (activePointers.size === 2) {
        const points = Array.from(activePointers.values());
        pinchDistance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (activePointers.has(event.pointerId)) {
        activePointers.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        });
      }
      if (activePointers.size === 2) {
        const points = Array.from(activePointers.values());
        const distance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
        if (pinchDistance > 0) {
          cameraGoal.radius = THREE.MathUtils.clamp(
            cameraGoal.radius * (pinchDistance / distance),
            15,
            90
          );
        }
        pinchDistance = distance;
        moved = 99;
        return;
      }
      if (dragging) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        lastX = event.clientX;
        lastY = event.clientY;
        cameraGoal.theta -= dx * 0.005;
        cameraGoal.phi = THREE.MathUtils.clamp(
          cameraGoal.phi - dy * 0.0042,
          0.3,
          1.43
        );
      } else {
        canvas.style.cursor = pickMarker(event) ? "pointer" : "grab";
      }
    };
    const onPointerEnd = (event: PointerEvent) => {
      activePointers.delete(event.pointerId);
      if (activePointers.size < 2) pinchDistance = 0;
      if (dragging && activePointers.size === 0) {
        dragging = false;
        canvas.style.cursor = "grab";
        if (moved < 7) {
          const size = pickMarker(event);
          const marker = markerRuntimes.find(item => item.size === size);
          if (size && marker && !marker.soldOut) selectRef.current(size);
        }
      }
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      autoRotate = false;
      cameraGoal.radius = THREE.MathUtils.clamp(
        cameraGoal.radius * (1 + event.deltaY * 0.001),
        15,
        90
      );
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      errorRef.current?.();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerEnd);
    canvas.addEventListener("pointercancel", onPointerEnd);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("webglcontextlost", onContextLost);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const mobile = width < 720;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.6)
      );
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    let firstFrame = true;
    let disposed = false;
    const animate = () => {
      if (disposed) return;
      frame = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (autoRotate) cameraGoal.theta += 0.00065;
      cameraState.theta += (cameraGoal.theta - cameraState.theta) * 0.07;
      cameraState.phi += (cameraGoal.phi - cameraState.phi) * 0.07;
      cameraState.radius += (cameraGoal.radius - cameraState.radius) * 0.065;
      cameraState.target.lerp(cameraGoal.target, 0.07);

      const sinPhi = Math.sin(cameraState.phi);
      camera.position.set(
        cameraState.target.x +
          cameraState.radius * sinPhi * Math.cos(cameraState.theta),
        cameraState.target.y + cameraState.radius * Math.cos(cameraState.phi),
        cameraState.target.z +
          cameraState.radius * sinPhi * Math.sin(cameraState.theta)
      );
      camera.lookAt(cameraState.target);

      if (!reduceMotion) {
        const positions = waterGeometry.attributes.position;
        for (let index = 0; index < positions.count; index += 1) {
          const offset = index * 3;
          const x = waterBase[offset];
          const y = waterBase[offset + 1];
          positions.setZ(
            index,
            Math.sin(x * 0.095 + elapsed * 1.15) * 0.2 +
              Math.cos(y * 0.14 + elapsed * 0.74) * 0.16
          );
        }
        positions.needsUpdate = true;
        foam.position.z = -23.4 + Math.sin(elapsed * 0.6) * 1.05;
        foamMaterial.opacity = 0.22 + Math.sin(elapsed * 0.6 + 1) * 0.07;

        markerRuntimes.forEach((marker, index) => {
          if (marker.soldOut) return;
          const selected = marker.size === activeSelection;
          const pulse = (Math.sin(elapsed * 2.1 + index) + 1) / 2;
          marker.ring.scale.setScalar(1 + pulse * (selected ? 0.5 : 0.28));
          marker.ring.material.opacity = selected
            ? 0.94 - pulse * 0.26
            : 0.58 - pulse * 0.26;
          marker.ring.rotation.z = selected ? elapsed * 0.45 : 0;
        });
      }

      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        readyRef.current?.();
      }
    };
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerEnd);
      canvas.removeEventListener("pointercancel", onPointerEnd);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      runtimeRef.current = null;
      scene.clear();
      resources.forEach(resource => resource.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [map, packages]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full touch-none cursor-grab"
    />
  );
}
