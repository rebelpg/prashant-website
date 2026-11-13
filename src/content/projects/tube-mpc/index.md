---
title: "Event-Triggered Tube MPC for a Crazyflie Quadrotor"
order: 3
featured: true
stack: "ROS 2, Gazebo, CrazySim SITL, CVXPY + OSQP, Docker"
status: "Linear Control Systems course project (team), 2026 · my part: the simulation stack and the Docker image"
thumb: ./thumb.jpg
thumbAlt: "RViz view of the Crazyflie flight path with the blue mRPI tube around the nominal pose"
links:
  - { label: code, href: "https://github.com/MUlti-agent-SImulation-and-Control-Lab/LCS-334-434-684/tree/main/Project/Shlok_23309%2C%20Divyam_23112%2C%20Prashant_23237/02_Trajectory_Engineering" }
  - { label: Docker image, href: "https://hub.docker.com/r/rebelpg/crazysim_et_mpc/tags" }
summary: >-
  Robust MPC that re-solves its QP only when the drone is about to leave a safety tube: 84&ndash;93% fewer
  solves with zero constraint violations, flown on a Crazyflie in software-in-the-loop.
description: >-
  Tube MPC keeps a drone safe under bounded disturbances: a nominal MPC plans a disturbance-free path, and an
  LQR feedback law holds the real drone inside a robust tube around it. Standard tube MPC solves a QP at every
  step, which is expensive for a nano-quadrotor. Our event-triggered version re-solves only when the tracking
  error is about to leave the tube. We tested it offline under four disturbance scenarios and then flew it on a
  Bitcraze Crazyflie 2.1 in CrazySim software-in-the-loop (SITL).
steps:
  - label: Tube
    title: The mRPI safety tube
    text: >-
      The drone is modelled as a 3D double integrator. The LQR gain <em>K</em> makes the error dynamics
      <em>A</em><sub>K</sub>&nbsp;=&nbsp;<em>A</em>&nbsp;&minus;&nbsp;<em>BK</em> stable, so the error stays in a
      minimal robust positively invariant (mRPI) set &Omega; for any bounded disturbance. &Omega; is a 72-facet
      polytope with a radius of 0.408&nbsp;m. The MPC plans with constraints tightened by &Omega;, so the real drone
      stays inside the true limits.
  - label: Trigger
    title: Solve only when needed
    text: >-
      The controller re-solves the nominal QP (CVXPY + OSQP, horizon 20, 20&nbsp;Hz) only when the tracking error
      stays near the tube boundary for 3 steps in a row, or when the stored plan runs out. Between solves, the LQR
      law tracks the stored plan.
    images:
      - { src: ./triggers.png, alt: "Event trigger timelines for four scenarios: 15, 32, 18 and 16 solves out of 200", caption: "QP solves over 10 s in each scenario: 15, 32, 18 and 16 out of 200 steps." }
  - label: Stress test
    title: Four disturbance scenarios
    text: >-
      Offline, against standard MPC and full tube MPC (both re-solve at every step): persistent crosswind,
      100% payload drop, high-speed catch with a gust, and a UWB sensor glitch. The event-triggered controller
      solved the QP 15&ndash;32 times instead of 200 (84&ndash;93% fewer) with zero constraint violations in every
      scenario. The cost is a higher tracking error (RMSE 0.64&ndash;0.84&nbsp;m against 0.55&ndash;0.79&nbsp;m for
      standard MPC).
    images:
      - { src: ./stress-summary.png, alt: "Bar charts of tracking RMSE, constraint violations (none) and QP solve count for standard, full tube and event-triggered tube MPC", caption: "Tracking RMSE, constraint violations (none for any controller) and QP solves, for each scenario." }
  - label: SITL
    title: Flying the Crazyflie in simulation
    text: >-
      I integrated CrazySim, the Crazyflie firmware in SITL and our MPC ROS 2 package into one Gazebo + ROS 2 +
      RViz pipeline. The drone flew M- and S-shaped waypoint paths end to end, with no bound violations. RViz
      shows the tube live around the nominal pose, and a red marker at each trigger.
    images:
      - { src: ./m-trajectory.jpg, alt: "Gazebo with the Crazyflie on the left and RViz on the right showing the M-shaped flight path and the blue tube", caption: "M path: Gazebo (left) and RViz (right) with the flight trail and the mRPI tube (blue cylinder)." }
      - { src: ./s-trajectory.jpg, alt: "Gazebo and RViz during the S-shaped flight path", caption: "S path, same drone and arena." }
  - label: Debug
    title: Making SITL fly
    text: >-
      The first stack did not fly. The SITL firmware ignored commands sent through Crazyswarm2, so I wrote a direct
      CFLib bridge that keeps one connection open for the whole run. Predicting the setpoint forward from odometry
      caused a runaway climb to 8.65&nbsp;m; sending the MPC's own nominal position and velocity fixed it. The
      first arena limits excluded some waypoints, so the QP became infeasible near the boundary; wider limits and
      a regenerated tube fixed that.
  - label: Docker
    title: One-command demo
    text: >-
      I packaged the full stack (Gazebo, ROS 2, Crazyflie SITL, CFLib and the MPC) into one Docker image of about
      2.6&nbsp;GB, with X11 display and software-rendering fallback. On any Ubuntu machine,
      <code>phase2 M</code> or <code>phase2 S</code> starts the full demo.
---

## My part

The team designed the controller together. My part was the simulation stack (CrazySim, firmware SITL, the CFLib
bridge, the tube visualisation and the launch flow), the debugging needed to make the drone fly, and the Docker
image.

## What I learnt

- **Robust MPC:** mRPI sets, constraint tightening, and why the tube gives guarantees that plain MPC does not.
- **Compute against accuracy:** event triggering saves most of the solver work, and costs some tracking error.
- **SITL integration:** firmware, simulator and ROS 2 each have their own timing and connection rules.
- **Reproducibility:** a pinned Docker image lets anyone run the demo without the setup work.
