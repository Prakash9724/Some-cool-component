import {
  motionValue,
  animate,
} from "framer-motion";

const DEFAULT_PAN_TRANSITON = {
  type: "spring",
  damping: 23,
  mass: 0.85,
  stiffness: 100,
  restDelta: 0.0
};

const DEFAULT_ZOOM_TRANSITON = {
  type: "spring",
  damping: 23,
  mass: 0.85,
  stiffness: 100,
  restDelta: 0.001
};

const DEFAULT_ROTATE_TRANSITON = {
  type: "spring",
  damping: 23,
  mass: 0.85,
  stiffness: 100,
  restDelta: 0.001
};

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  multiplyScalar(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  distanceTo(other) {
    return Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2);
  }

  clone() {
    return new Vector(this.x, this.y);
  }
}

const PointType = {
  Center: "center",
  TopLeft: "top-left",
  TopRight: "top-right",
  BottomLeft: "bottom-left",
  BottomRight: "bottom-right"
};

function getElementPoint(el, pointType) {
  if (!el) return new Vector(0,0); // Add a check for el
  const rect = el.getBoundingClientRect();
  switch (pointType) {
    case PointType.Center:
      return new Vector(rect.x + rect.width / 2, rect.y + rect.height / 2);
    case PointType.TopLeft:
      return new Vector(rect.x, rect.y);
    case PointType.TopRight:
      return new Vector(rect.x + rect.width, rect.y);
    case PointType.BottomLeft:
      return new Vector(rect.x, rect.y + rect.height);
    case PointType.BottomRight:
      return new Vector(rect.x + rect.width, rect.y + rect.height);
    default: // Add a default case
      return new Vector(0,0);
  }
}

export class Camera {
  constructor() {
    this.containerEl = null;
    this.contentEl = null;
    this.motionValues = {
      posX: motionValue(0),
      posY: motionValue(0),
      zoom: motionValue(1),
      rotation: motionValue(0)
    };
    this.following = null;
  }

  get position() {
    return new Vector(
      this.motionValues.posX.get(),
      this.motionValues.posY.get()
    );
  }

  get rotation() {
    return this.motionValues.rotation.get();
  }

  get zoom() {
    return this.motionValues.zoom.get();
  }

  panTo(
    position,
    transition = DEFAULT_PAN_TRANSITON
  ) {
    animate(this.motionValues.posX, position.x, transition);
    animate(this.motionValues.posY, position.y, transition);
  }

  setZoom(
    zoom,
    transition = DEFAULT_ZOOM_TRANSITON
  ) {
    animate(this.motionValues.zoom, zoom, transition);
  }

  setRotation(
    rotation,
    transition = DEFAULT_ROTATE_TRANSITON
  ) {
    animate(this.motionValues.rotation, rotation, transition);
  }

  follow(
    target,
    transition = DEFAULT_PAN_TRANSITON
  ) {
    if (this.following) {
      clearInterval(this.following.interval);
      this.following = null;
    }
    const panToTarget = () => {
      if (target && target.center) { // Add a check for target and target.center
        this.panTo(target.center, transition);
      }
    };
    panToTarget();
    this.following = {
      target,
      interval: setInterval(panToTarget, 100)
    };
  }

  unfollow(target) {
    if (this.following?.target === target) {
      clearInterval(this.following.interval);
      this.following = null;
    }
  }
}

export class CameraTarget {
  constructor(camera) {
    this.el = null;
    this.camera = camera;
  }

  getPoint(pointType) {
    const targetCenter = getElementPoint(this.el, pointType);
    const containerCenter = getElementPoint(
      this.camera.containerEl,
      PointType.Center
    );
    const targetOffset = targetCenter
      .clone()
      .sub(containerCenter)
      .multiplyScalar(1 / this.camera.zoom);
    return this.camera.position.clone().add(targetOffset);
  }

  get center() {
    return this.getPoint(PointType.Center);
  }

  get topLeft() {
    return this.getPoint(PointType.TopLeft);
  }

  get topRight() {
    return this.getPoint(PointType.TopRight);
  }

  get bottomLeft() {
    return this.getPoint(PointType.BottomLeft);
  }

  get bottomRight() {
    return this.getPoint(PointType.BottomRight);
  }
}