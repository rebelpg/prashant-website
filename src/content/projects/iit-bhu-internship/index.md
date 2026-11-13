---
title: "Controller Design for a Differential-Drive Robot"
kind: experience
order: 1
stack: "Python, NumPy, SciPy, Quanser QBot"
org: "Dept. of Electrical Engineering, IIT (BHU) Varanasi"
status: "summer research internship after my second year · 2 June – 2 July 2025 · supervisor: Dr. Shyam Kamal"
thumb: ./thumb.jpg
thumbAlt: "Quanser QBot Platform, a differential-drive ground robot"
links:
  - { label: report, href: "https://drive.google.com/file/d/1dufrGVlph_Wl4TYnVtnpZn8y88wynDSZ/view?usp=drive_link" }
summary: >-
  PID and LQR trajectory tracking on a Quanser QBot, written in Python and tested on the real robot.
description: >-
  A one-month research internship on linear control for autonomous ground robots. I modelled a
  differential-drive robot, wrote PID and LQR controllers in Python, and ran them on the Quanser QBot hardware
  to track parabolic, sinusoidal and free-form paths. At the end I formulated an MPC controller for
  constrained motion and explored first ideas in nonlinear control.
steps:
  - label: Platform
    title: Quanser QBot
    text: >-
      The QBot Platform is an open-architecture ground robot on a differential-drive base: two driven wheels,
      one on each side. My first task was to learn the hardware and to send velocity commands to it from Python.
    images:
      - { src: ./qbot.jpg, alt: "Quanser QBot Platform, a black and red hexagonal ground robot with a LiDAR on top" }
  - label: Model
    title: Differential-drive kinematics
    text: >-
      I wrote the forward and inverse kinematics. The wheel speeds give the robot's linear speed
      <em>v</em>&nbsp;=&nbsp;(<em>v</em><sub>R</sub>&nbsp;+&nbsp;<em>v</em><sub>L</sub>)/2 and turn rate
      <em>&omega;</em>&nbsp;=&nbsp;(<em>v</em><sub>R</sub>&nbsp;&minus;&nbsp;<em>v</em><sub>L</sub>)/<em>L</em>.
      Odometry integrates
      <em>&#7819;</em>&nbsp;=&nbsp;<em>v</em>&nbsp;cos&nbsp;<em>&theta;</em>,
      <em>&#7823;</em>&nbsp;=&nbsp;<em>v</em>&nbsp;sin&nbsp;<em>&theta;</em>,
      <em>&theta;&#775;</em>&nbsp;=&nbsp;<em>&omega;</em>
      at each time step. Angle normalisation keeps <em>&theta;</em> in range, so the heading does not drift.
    images:
      - { src: ./kinematics.png, alt: "Diagram of a differential-drive robot: wheels, wheel speeds, heading angle, turn radius and instantaneous centre of curvature" }
  - label: PID
    title: PID path tracking
    text: >-
      I wrote one PID controller for position and one for heading. Their outputs are velocity commands in the
      world frame. The code transforms them into the robot frame and limits them for safety. After several rounds
      of debugging the command structure and tuning the gains on the hardware, the robot tracked parabolic,
      sinusoidal and free-form paths closely.
    images:
      - { src: ./pid-results.png, alt: "Three plots of required path (red dashed) and actual path (blue): a parabola, a sine wave and a custom curve", caption: "PID tracking: required path (red, dashed) and actual path (blue) for a parabola, a sine wave and a custom path." }
  - label: LQR
    title: Optimal control with LQR
    text: >-
      I linearised the model around a nominal forward speed <em>v</em><sub>0</sub> and a small heading angle
      (cos&nbsp;<em>&theta;</em>&nbsp;&asymp;&nbsp;1, sin&nbsp;<em>&theta;</em>&nbsp;&asymp;&nbsp;<em>&theta;</em>). This gives
      <em>&#7819;</em>&nbsp;=&nbsp;<em>Ax</em>&nbsp;+&nbsp;<em>Bu</em>, with state [<em>x</em>,&nbsp;<em>y</em>,&nbsp;<em>&theta;</em>]
      and input [<em>v</em>,&nbsp;<em>&omega;</em>]. SciPy's continuous algebraic Riccati solver gives <em>P</em>,
      and the gain is <em>K</em>&nbsp;=&nbsp;<em>R</em><sup>&minus;1</sup><em>B</em><sup>T</sup><em>P</em>.
      The control law is <em>u</em>&nbsp;=&nbsp;&minus;<em>K</em>(<em>x</em>&nbsp;&minus;&nbsp;<em>x</em><sub>ref</sub>), with
      velocity saturation for the real robot. I tuned the weights <em>Q</em> (tracking error) and <em>R</em>
      (control effort). LQR did better than PID, mainly in dynamic conditions.
  - label: MPC
    title: First steps with MPC
    text: >-
      In the last part I formulated model predictive control: over a horizon of <em>N</em> steps, minimise
      the tracking error and control effort, subject to the linear model and limits on states and inputs, then
      apply only the first input (receding horizon). The plan was a quadratic-programming solver with velocity and
      acceleration limits. This part was a start for constrained motion planning, not a finished result.
---

## My part

I did all of the work on this page: the kinematic model, the PID and LQR code, the hardware tests and the tuning.

## Challenges

- **Wheel slip:** slip made the odometry wrong over time, so the estimated pose moved away from the real pose.
- **Command structure:** PID outputs are in the world frame, but the robot takes commands in its own frame. It took several iterations to get the transform and the limits right.
- **Tuning on hardware:** gains that worked in simulation needed changes on the real robot.

## What I learnt

- Differential-drive kinematics and odometry, from equations to working code.
- Controller design from start to end: model, design, implementation and tuning.
- How to linearise a nonlinear model, set up LQR and solve the Riccati equation.
- How to move a controller from theory to a real robot.

I thank Dr. Shyam Kamal for his supervision and Mrs. Priyanka for her guidance during the internship.

[Full internship report (PDF)](https://drive.google.com/file/d/1dufrGVlph_Wl4TYnVtnpZn8y88wynDSZ/view?usp=drive_link)
