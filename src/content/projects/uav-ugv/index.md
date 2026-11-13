---
title: "GPS-Denied Autonomous Navigation (UAV–UGV)"
order: 5
featured: false
stack: "ROS 2 Jazzy, Gazebo Harmonic, LiDAR, OpenCV"
status: "team project with Anmol Agarwal and Nikhil Kumar · my part: the simulations and ground-robot control"
thumb: ./thumb.jpg
thumbAlt: "Planned (blue) and actual (green) ground-robot paths between fire targets in Gazebo"
short: "A drone finds fire targets and guides a ground robot to each one, with no GPS (course project, team)."
summary: >-
  A drone finds fire targets with its camera and guides a ground robot to each one, with no GPS.
description: >-
  A fire-rescue mission in simulation, with no GPS. A drone (UAV) hovers above the area, finds fires with its
  downward camera and computes their world positions. It plans a route and sends it to a ground robot (UGV),
  which drives to each fire, avoids obstacles with LiDAR and &ldquo;extinguishes&rdquo; it: the block turns from
  red to green. Odometry, SLAM, the camera and LiDAR replace GPS.
steps:
  - label: Mission
    title: The simulated world
    text: >-
      A Gazebo world with walls and red blocks as fires. The goal: find every fire and turn it green.
      There is no GPS, so both robots must know where they are from their own sensors.
    images:
      - { src: ./world.jpg, alt: "Gazebo world with a wall, red fire blocks, the ground robot and the drone above" }
  - label: Detect
    title: Fire detection from the drone
    text: >-
      The drone camera image is converted from RGB to HSV, red pixels are thresholded and contours are found
      around them. A red-pixel ratio above 1% means &ldquo;fire detected&rdquo;. Each pixel is then projected to
      the ground with a pinhole camera model:
      ground scale = 2&nbsp;&times;&nbsp;height&nbsp;&times;&nbsp;tan(FOV/2)&nbsp;/&nbsp;image width,
      then rotated by the drone&rsquo;s yaw into world coordinates.
    images:
      - { src: ./drone-camera.jpg, alt: "Gazebo view with the drone above the fires and its downward camera image in a side panel" }
  - label: Plan
    title: Altitude and route
    text: >-
      The drone climbs when fires are near the image edge (to see more) and descends when they are centred
      (for better accuracy), between 3 and 20&nbsp;m. A greedy nearest-neighbour route orders the fires from the
      ground robot&rsquo;s position, O(N&sup2;), and is published as a list of waypoints.
    images:
      - { src: ./path.jpg, alt: "Planned route in blue and the ground robot's actual path in green between fire blocks", caption: "Planned route (blue) and the path the ground robot drove (green)." }
  - label: Drive
    title: State machine and PD control
    text: >-
      The ground robot runs a state machine: IDLE &rarr; ROTATING &rarr; MOVING &rarr; WAITING &rarr; next target
      &rarr; FINISHED. A PD controller (K<sub>p</sub>&nbsp;=&nbsp;1.5, K<sub>d</sub>&nbsp;=&nbsp;0.3) turns it to face the
      target until the heading error is below 0.1&nbsp;rad, and keeps it on heading while driving. Forward speed is
      proportional to the distance, clamped to 0.3&ndash;1.0&nbsp;m/s.
    images:
      - { src: ./pd-control.png, alt: "Chart of heading error over time converging toward zero under PD control" }
  - label: Avoid
    title: LiDAR safety layer
    text: >-
      A 360&deg; LiDAR scan is checked in a 30&deg; cone in front of the robot. The robot stops when the target
      block is directly ahead, waits 2&nbsp;s to &ldquo;extinguish&rdquo; it, publishes the event, and moves on.
    images:
      - { src: ./lidar.jpg, alt: "Ground robot next to fire blocks with LiDAR rays drawn in blue" }
  - label: Map
    title: Sensor fusion
    text: >-
      Two maps are merged: the SLAM occupancy map from LiDAR (unknown, free, wall) and a heat map from the camera
      (no fire, extinguished, active fire). Active fires have the highest priority, then extinguished fires, then
      walls. The result shows obstacles and fires on one map.
    images:
      - { src: ./map-fusion.png, alt: "Diagram: SLAM map and camera heat map combined into one costmap" }
  - label: Result
    title: Performance
    text: >-
      Fire detection at 30&nbsp;FPS with more than 95% accuracy. We designed for a waypoint error of at most
      &plusmn;5&nbsp;cm, and the measured error was lower. About 60&nbsp;s to clear 3 fires, with less than 30% CPU load.
    images:
      - { src: ./result.jpg, alt: "Simulation run showing planned and actual paths through five fire targets" }
---

## My part

I built the simulations (the Gazebo world, the robots and the mission runs) and the ground-robot control:
the state machine, the PD heading controller, the speed law and the LiDAR stop.

## What I learnt

- **ROS 2 and Gazebo:** nodes, topics and launch files for a two-robot system in one simulated world.
- **Computer vision:** HSV colour segmentation and contour detection with OpenCV.
- **Geometry:** the pinhole camera model, camera-to-world frame transforms, and quaternion-to-Euler conversion for yaw.
- **Control:** PD heading control, a proportional speed law, and gain tuning (too much K<sub>p</sub> overshoots; too much K<sub>d</sub> is sluggish).
- **Robot behaviour:** state machines with clear transitions.
- **Planning:** greedy nearest-neighbour routing as a fast TSP approximation.
- **Sensor fusion:** combining camera, LiDAR, odometry and SLAM when there is no GPS.

[Full project report (PDF)](https://drive.google.com/file/d/1C6FJxsMp0nhTv8jq8TF3dz5Blbg62f0S/view?usp=sharing)
