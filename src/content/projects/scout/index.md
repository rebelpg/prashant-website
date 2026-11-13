---
title: "Scout: Surveillance UGV"
order: 7
featured: false
stack: "ESP32, C++, L298N, MPU6050, HC-SR04, FlySky RC"
status: "built from scratch, without ROS · 2024–25"
thumb: ./thumb.jpg
thumbAlt: "Scout surveillance ground robot"
links:
  - { label: code, href: "https://github.com/rebelpg/Scout" }
short: "An ESP32 ground robot with web control over Wi-Fi and an RC override."
summary: >-
  A low-cost ESP32 ground robot with two control modes: a web page over Wi-Fi, and an RC transmitter that always takes over.
description: >-
  S.C.O.U.T. (Surveillance-Controlled Unmanned Tracker) is a low-cost differential-drive robot I built from scratch,
  without ROS. It started as a remote-controlled platform and is the base for a step-by-step path to autonomy:
  first reliable control and sensing, then mapping, planning and vision.
steps:
  - label: Build
    title: Hardware
    text: >-
      An <strong>ESP32</strong> is the main controller. An <strong>L298N</strong> dual H-bridge drives the geared DC
      motors for differential drive. <strong>HC-SR04</strong> ultrasonic sensors measure distance to obstacles, an
      <strong>MPU6050</strong> measures tilt and acceleration, and a <strong>FlySky FS-iA6B</strong> receiver gives
      manual control. A 12&nbsp;V Li-ion pack powers the robot. The ESP32 and motor driver sit inside the chassis
      for protection.
    images:
      - { src: ./robot.jpg, alt: "Scout robot with ESP32 electronics, ultrasonic sensor and wiring on its chassis" }
  - label: Web
    title: Web control
    text: >-
      The ESP32 hosts its own Wi-Fi network and a web server. The control page has a 3&times;3 button grid
      (forward, back, left, right, stop) and a live sensor dashboard: ultrasonic distances, X/Y acceleration from
      the MPU6050 and an estimated speed.
  - label: RC
    title: Manual override
    text: >-
      A FlySky FS-i6 transmitter drives the robot directly: channel&nbsp;1 steers, channel&nbsp;2 sets throttle and
      channel&nbsp;6 switches between RC and web control. RC control always has priority, for safety.
  - label: Safety
    title: Fail-safe and reactive control
    text: >-
      The robot stops automatically when it loses the control signal. Simple reactive control uses ultrasonic
      distance thresholds to avoid obstacles.
  - label: Next
    title: Toward autonomy
    text: >-
      Planned: a Raspberry Pi 4 as the main computer, a ToF depth camera, SLAM, A* or RRT path planning,
      wheel encoders for odometry, and PID or LQR control of wheel speed and path tracking.
---

## What I learnt

- **Embedded control:** running a web server, sensor reading and motor control on one ESP32.
- **Motor drives:** differential drive with an L298N H-bridge.
- **RC integration:** reading receiver channels and arbitrating between two control sources.
- **Safety design:** override priority and stop-on-signal-loss.
- **Sensing:** ultrasonic ranging and IMU acceleration and tilt.
