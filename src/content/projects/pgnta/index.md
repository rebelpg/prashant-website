---
title: "PGNTA: 17-DOF Humanoid Robot"
order: 6
featured: false
stack: "ESP32, PCA9685, MPU6050, HC-SR04, servos"
status: "first-year summer project, 2024"
thumb: ./thumb.jpg
thumbAlt: "PGNTA 17-DOF humanoid robot"
links:
  - { label: code, href: "https://github.com/rebelpg/project" }
short: "A 17-servo humanoid that I designed and built from scratch on an ESP32."
summary: >-
  A 53&nbsp;cm, 17-servo humanoid I designed and built from scratch: ESP32 and PCA9685 on a plywood frame,
  with IMU and ultrasonic sensing.
description: >-
  A 53&nbsp;cm bipedal humanoid I designed and built from scratch. An ESP32 drives 17 servos (14 MG995, 3 SG90)
  through a PCA9685 on a 3&nbsp;mm plywood frame, with an MPU6050 IMU and an HC-SR04 ultrasonic sensor, a
  six-cell 18650 pack and live data on Arduino Cloud. It waves, dances and turns its head toward objects.
steps:
  - label: Parts
    title: Choosing the components
    text: >-
      Balanced torque, cost and availability: 14 high-torque <strong>MG995</strong> servos for the major joints,
      3 <strong>SG90</strong> servos for light joints, an <strong>ESP32</strong> as the main controller,
      a <strong>PCA9685</strong> 16-channel servo driver, an <strong>MPU6050</strong> for acceleration and
      gyro data, and an <strong>HC-SR04</strong> for object detection.
    images:
      - { src: ./parts.jpg, alt: "Components laid out on a whiteboard: ESP32, Nano, sensors, servo, buck converter, batteries" }
  - label: Frame
    title: Plywood structure
    text: >-
      The frame is 3&nbsp;mm plywood: a 14&times;11&nbsp;cm body, box-shaped limbs, C-shaped hinge joints and a
      6&times;3&times;5&nbsp;cm head for the sensors. Each servo is held by four 2&nbsp;mm screws, with 7&nbsp;mm
      holes for the servo horns and nails as support on the opposite side.
      Final size: 53&nbsp;cm tall, 25&nbsp;cm long, 8&nbsp;cm wide.
    images:
      - { src: ./frame.jpg, alt: "PGNTA frame during assembly in the workshop, surrounded by tools" }
  - label: Joints
    title: 17 degrees of freedom
    text: >-
      The servos copy human joints: 10 in the legs (LL1&ndash;LL5, RL1&ndash;RL5), 6 in the arms
      (LH1&ndash;LH3, RH1&ndash;RH3) and 1 to turn the head.
    images:
      - { src: ./electronics.jpg, alt: "Annotated photo of PGNTA showing the ESP32, HC-SR04, MPU6050, LED, PCA9685 and Nano positions" }
  - label: Power
    title: Battery pack
    text: >-
      9&nbsp;V batteries could not supply the current for 17 servos. The final pack uses six 18650 cells
      (3.7&nbsp;V, 2000&nbsp;mAh): two parallel strings of three cells in series, about 11.5&nbsp;V. A DC-DC buck
      converter steps it down to 5&nbsp;V for the servos and electronics.
    images:
      - { src: ./power.jpg, alt: "Six 18650 cells in two holders with a switch and a buck converter module" }
  - label: Wiring
    title: Circuit
    text: >-
      The ESP32 sends PWM commands to the PCA9685 over I2C. A 25&nbsp;V 100&nbsp;&micro;F capacitor smooths the
      servo supply. The HC-SR04, MPU6050 and a circular LED connect to the ESP32. An Arduino Nano version of the
      circuit is used to interface with servo control software.
    images:
      - { src: ./circuit-esp32.jpg, alt: "Circuit diagram: ESP32, PCA9685, 18650 batteries, HC-SR04, MPU6050, LED ring and 16 servos", caption: "ESP32 version of the circuit." }
  - label: Control
    title: Programming and cloud
    text: >-
      Programmed in the Arduino IDE with PWM servo control. I tuned each servo position with
      <a href="https://tims-pc-applications.blogspot.com/2020/05/tim-servo-x16-controller.html" target="_blank" rel="noopener">Tim's Servo x16 Controller</a>
      and saved preset poses and movement scripts. Arduino Cloud shows live data: head angle, distance and acceleration.
    images:
      - { src: ./cloud.png, alt: "Arduino Cloud dashboard with gauges for head rotation, distance and acceleration" }
  - label: Result
    title: What it can do
    text: >-
      Arm movements (up, down, front), simple dance routines, waving &ldquo;hi&rdquo;, and turning the head
      toward detected objects, with live data on Arduino Cloud.
    images:
      - { src: ./finished.jpg, alt: "Finished PGNTA upper body with the ultrasonic sensor head and glowing LED ring" }
video: { label: "Watch PGNTA on YouTube", href: "https://youtube.com/shorts/zHsEO_fMCd4" }
---

## Challenges and fixes

- **Servo range:** the MG995 servos are limited to 0&ndash;180&deg;. I fine-tuned positions in Tim's Servo x16 Controller and made preset poses.
- **Power:** 9&nbsp;V batteries could not give enough current. I moved to the 18650 pack.
- **Weight:** 3&nbsp;mm plywood made the robot heavy. A next version needs a lighter material.
- **Assembly:** I mounted some servos before testing them, which limited some motions. Now I test every part before final assembly.
- **Soldering:** bad joints on the PCA9685 pins caused connection faults. I re-soldered them with a 30&nbsp;W iron.

## Next versions

1. **V2:** web-based control interface; smoother and wider movements.
2. **V3:** ESP32-CAM for image detection; copy human movements in real time.
3. **V4:** voice control and natural-language interaction through an AI API.
