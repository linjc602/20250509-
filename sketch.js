// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // Circle position
const circleSize = 100; // Circle size
let isDragging = false; // Track if the circle is being dragged
let trail = []; // Store the trail of the circle

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);

  // Initialize circle position at the center of the canvas
  circleX = width / 2;
  circleY = height / 2;
}

function draw() {
  image(video, 0, 0);

  // Draw the trail
  noFill();
  strokeWeight(10);
  for (let t of trail) {
    stroke(t.color);
    line(t.x1, t.y1, t.x2, t.y2);
  }

  // Draw the circle
  fill(0, 0, 255, 150); // Semi-transparent blue
  noStroke();
  ellipse(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Draw keypoints and lines
        drawKeypointsAndLines(hand);

        // Check if the index finger (keypoint 8) touches the circle
        let indexFinger = hand.keypoints[8];
        let d = dist(indexFinger.x, indexFinger.y, circleX, circleY);

        if (d < circleSize / 2) {
          // Move the circle to the index finger's position
          let prevX = circleX;
          let prevY = circleY;
          circleX = indexFinger.x;
          circleY = indexFinger.y;

          // Add the red trail
          trail.push({ x1: prevX, y1: prevY, x2: circleX, y2: circleY, color: color(255, 0, 0) });
        }
      }
    }
  }
}

function drawKeypointsAndLines(hand) {
  // Draw circles for keypoints
  for (let i = 0; i < hand.keypoints.length; i++) {
    let keypoint = hand.keypoints[i];

    // Color-code based on left or right hand
    if (hand.handedness == "Left") {
      fill(255, 0, 255);
    } else {
      fill(255, 255, 0);
    }

    noStroke();
    circle(keypoint.x, keypoint.y, 16);
  }

  // Draw lines connecting keypoints
  stroke(0, 255, 0); // Set line color
  strokeWeight(2);

  // Connect keypoints 0 to 4
  for (let i = 0; i < 4; i++) {
    line(
      hand.keypoints[i].x, hand.keypoints[i].y,
      hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
    );
  }

  // Connect keypoints 5 to 8
  for (let i = 5; i < 8; i++) {
    line(
      hand.keypoints[i].x, hand.keypoints[i].y,
      hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
    );
  }

  // Connect keypoints 9 to 12
  for (let i = 9; i < 12; i++) {
    line(
      hand.keypoints[i].x, hand.keypoints[i].y,
      hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
    );
  }

  // Connect keypoints 13 to 16
  for (let i = 13; i < 16; i++) {
    line(
      hand.keypoints[i].x, hand.keypoints[i].y,
      hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
    );
  }

  // Connect keypoints 17 to 20
  for (let i = 17; i < 20; i++) {
    line(
      hand.keypoints[i].x, hand.keypoints[i].y,
      hand.keypoints[i + 1].x, hand.keypoints[i + 1].y
    );
  }
}
