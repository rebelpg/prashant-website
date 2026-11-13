---
title: "COAST: Altitude as a Coupled Perception Variable in Shared-Camera Aerial-Ground Tracking"
kind: paper
order: 1
highlight: true
authors: "Shlok Mehndiratta<sup>&dagger;</sup>, Divyam Sood<sup>&dagger;</sup>, <strong>Prashant Gupta</strong><sup>&dagger;</sup>, Agniva Banerjee, Arijit Sen"
venue: "IFAC Advances in Control and Optimization of Dynamical Systems (ACODS), 2026"
status: "accepted · † equal contribution · paper PDF after the camera-ready version"
thumb: ./thumb.png
thumbAlt: "UAV and UGV in the COAST Gazebo simulation"
wideThumb: true
links:
  - { label: code, href: "https://github.com/soododivyam/COAST-code" }
summary: >-
  A UAV's downward camera is the only sensor guiding a ground robot. Flying higher sees more of the path but
  localises more coarsely, so we derive in closed form the lowest altitude that keeps the path in view, which rises
  with path curvature when the lane search region grows in turns, and validate it in ROS 2/Gazebo. Event triggering needs 24.9&times; fewer planner solves.
description: >-
  One downward camera on a drone (UAV) is the only sensor of a ground robot (UGV). Each image gives both the
  lane waypoint for navigation and the marker pose for localisation, so one variable, the UAV altitude, sets
  both. Flying higher widens the view, but the localisation noise grows as <em>R</em>&nbsp;&prop;&nbsp;<em>z</em><sup>2</sup>.
  COAST treats altitude as a perception variable: we find the best altitude in closed form, state exactly when
  changing it along the path helps, and cut planner computation with event triggering.
steps:
  - label: Problem
    title: One camera, two jobs
    text: >-
      The same frame gives the navigation waypoint (from the segmented lane) and the EKF pose measurement (from
      the ArUco marker on the UGV). Low altitude gives better localisation; high altitude keeps more of the lane
      in view.
    images:
      - { src: ./dual-role.png, alt: "Downward camera view of the UGV with an ArUco marker on a curved lane, and the same frame with the marker pose and lane waypoint marked", caption: "(a) The UAV's downward view. (b) The same frame gives the marker pose and the lane waypoint." }
  - label: Result
    title: The best altitude, in closed form
    text: >-
      The estimation-optimal altitude is the lowest one that keeps the searched lane region inside the camera
      footprint (the <em>coverage floor</em>), and it rises with path curvature when the search region grows in
      turns. A changing altitude beats every fixed altitude <strong>only</strong> when this floor is active and
      changes along the path; otherwise one fixed altitude is already optimal.
  - label: System
    title: Estimator and controllers
    text: >-
      An EKF fuses the marker pose with wheel odometry. A belief-space MPC drives the UGV and penalises its own
      predicted uncertainty. The UAV's aerial planner sets position and altitude, and an ancillary feedback law
      tracks the plan between re-plans. The planner re-solves only on events (tube exit, uncertainty spike,
      a turn ahead, drift, or an expiring plan), with a bounded tracking error between events.
    images:
      - { src: ./system-overview.png, alt: "Block diagram: UAV camera feeds ArUco and lane detection; state EKF, belief-space UGV MPC, aerial planner with altitude policy, and ancillary law with event trigger", caption: "System overview. The EKF belief drives the UGV MPC; its endpoint drives the aerial planner; uncertainty and curvature drive the trigger." }
  - label: Tests
    title: What the simulations show
    text: >-
      In ROS&nbsp;2/Gazebo, the marker position error follows the predicted <em>z</em><sup>2</sup> law
      (R<sup>2</sup>&nbsp;=&nbsp;0.983 over 2&ndash;7&nbsp;m). On our tracks the coverage floor stays constant, and as the
      theory predicts, the adaptive policy ties with the best fixed altitude (within 2.8%). Event triggering needs
      <strong>24.9&times; fewer planner solves</strong> and <strong>12.3&times; less planner CPU time</strong> than
      re-solving at 20&nbsp;Hz, at the same estimation quality.
    images:
      - { src: ./z2-scaling.png, alt: "Plot of ArUco mean squared position error against altitude from 2 to 7 m with a quadratic fit, R squared 0.983", caption: "Marker position error grows with the square of altitude, as the model predicts." }
      - { src: ./adaptive-altitude.png, alt: "Left: altitude over time, adaptive policy climbing in turns versus fixed 2.5 m. Right: mean estimation cost for adaptive and fixed 2.5, 4 and 7 m", caption: "(a) The adaptive policy climbs in turns. (b) Its estimation cost ties with the best fixed altitude, as predicted when the floor does not vary." }
---

## My part

I built and ran the ROS&nbsp;2/Gazebo testbed and the experiments, and worked on the result analysis and the
paper text. The first three authors contributed equally.

## Scope

All results are from software-in-the-loop simulation: the UAV is a velocity-controlled point mass with a nadir
camera, with no rotor or attitude dynamics, wind, camera tilt or realistic image noise, and the UAV pose is
ground truth. Next steps are tracks where the coverage floor changes along the
path, and hardware tests with a full multicopter model.

*This project was funded by ANRF (Project No. ANRF/ARG/2025/007351/ENS).*
