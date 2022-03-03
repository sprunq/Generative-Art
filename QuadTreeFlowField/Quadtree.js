class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h
    );
  }

  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary;
    this.capacity = n;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;
    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southeast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    this.southwest = new QuadTree(sw, this.capacity);
    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      if (this.northeast.insert(point)) {
        return true;
      } else if (this.northwest.insert(point)) {
        return true;
      } else if (this.southeast.insert(point)) {
        return true;
      } else if (this.southwest.insert(point)) {
        return true;
      }
    }
  }

  show(showPoints) {
    stroke(255);
    noFill();
    strokeWeight(1);
    rectMode(CENTER);
    rect(
      this.boundary.x,
      this.boundary.y,
      this.boundary.w * 2,
      this.boundary.h * 2
    );
    if (showPoints) {
      for (let p of this.points) {
        strokeWeight(2);
        point(p.x, p.y);
      }
    }

    if (this.divided) {
      this.northeast.show(showPoints);
      this.northwest.show(showPoints);
      this.southeast.show(showPoints);
      this.southwest.show(showPoints);
    }
  }

  getAllBoundingBoxesRandom(depth = 0) {
    let rects = [];
    let rand = random() * depth;
    if (rand < 0.3 && rand > 0) {
      rects = [];
    } else {
      if (this.divided) {
        rects.push(...this.northeast.getAllBoundingBoxes(depth++));
        rects.push(...this.northwest.getAllBoundingBoxes(depth++));
        rects.push(...this.southeast.getAllBoundingBoxes(depth++));
        rects.push(...this.southwest.getAllBoundingBoxes(depth++));
      } else {
        rects = [this.boundary];
      }
    }
    return rects;
  }

  getAllBoundingBoxes(depth = 0) {
    let rects = [];
    if (this.divided) {
      rects.push(...this.northeast.getAllBoundingBoxes(depth++));
      rects.push(...this.northwest.getAllBoundingBoxes(depth++));
      rects.push(...this.southeast.getAllBoundingBoxes(depth++));
      rects.push(...this.southwest.getAllBoundingBoxes(depth++));
    } else {
      rects = [this.boundary];
    }
    return rects;
  }
}
