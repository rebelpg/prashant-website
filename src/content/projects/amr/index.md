---
title: "Mechabot: Autonomous Mobile Robot (AMR)"
order: 4
featured: true
stack: "ROS 2 Jazzy, Gazebo Harmonic, ros2_control, slam_toolbox, AMCL, Nav2"
org: MechaMind Labs
status: "45-day AMR Mastery Program, 26 Jan – 13 Mar 2026 (completed)"
thumb: ./thumb.jpg
thumbAlt: "Mechabot, a differential-drive mobile robot with a red top and white body"
anim: /anim/mechabot.gif
links:
  - { label: certificate, href: /data/certificates/amr-mechamind.pdf }
summary: >-
  A differential-drive robot built up in ROS 2 from a bare URDF to SLAM, AMCL localisation and Nav2.
  It solves a QR-code maze on its own in Gazebo.
description: >-
  Mechabot is a two-wheel differential-drive robot that I built in ROS 2 and Gazebo, one layer at a time:
  robot model, physics and controllers, teleoperation, sensors, an autonomous QR-code maze solver, SLAM
  mapping, AMCL localisation and Nav2 navigation. All of it runs in simulation, and one bringup launch
  file starts the full system.
steps:
  - label: Model
    title: URDF, xacro and the TF tree
    text: >-
      I started with a plain URDF of a two-wheel robot and checked it with <code>robot_state_publisher</code>
      and the joint state GUI. Then I split it into xacro files (base, sensors, Gazebo, ros2_control) and
      added the Mechabot STL meshes. A launch file converts the xacro and opens RViz. The TF tree has
      <code>base_footprint</code> at the root, then <code>base_link</code> and the two wheel links.
  - label: Physics
    title: Gazebo and ros2_control
    text: >-
      Gazebo needs <code>&lt;inertial&gt;</code> and <code>&lt;collision&gt;</code> on every link, so I added
      them with primitive shapes, not meshes. The drive wheels have high friction and the castors have low
      friction, so the castors slide. The <code>gz_ros2_control</code> plugin connects Gazebo to the
      controller manager, which runs a joint state broadcaster and a <code>diff_drive_controller</code>
      with velocity command interfaces on both wheel joints.
  - label: Teleop
    title: Joystick, keyboard and twist_mux
    text: >-
      <code>twist_mux</code> selects one velocity source by priority: joystick (99), Nav2 (90), keyboard (80).
      The joystick did not move the robot at first. <code>ros2 topic info -v</code> showed the cause: a relay
      node published <code>Twist</code>, but the controller in ROS 2 Jazzy expects <code>TwistStamped</code>.
      I removed the relay and set the whole chain to stamped messages:
      joy &rarr; joy_teleop &rarr; twist_mux &rarr; <code>/wheel_controller/cmd_vel</code>.
  - label: Sensors
    title: LiDAR, IMU and camera
    text: >-
      A 360&deg; GPU LiDAR (360 rays, 0.15&ndash;12&nbsp;m, 5&nbsp;Hz, Gaussian noise), an IMU and an RGB camera,
      bridged from Gazebo to ROS 2 with <code>ros_gz_bridge</code>. The camera has an extra optical frame,
      because ROS uses X forward and OpenCV uses Z forward. The IMU is there to correct wheel-odometry drift.
      Three small scripts read each sensor: distances in four directions, yaw and yaw rate, and a live camera view.
  - label: Maze
    title: QR-code maze world
    text: >-
      I modelled a maze in Blender and made it a Gazebo model. Three QR-code markers on the walls say
      <em>left</em>, <em>right</em> and <em>stop</em>. I placed the models by dragging them in the Gazebo GUI and
      saved the world. A detection node reads the camera image with OpenCV, decodes the QR text and draws a
      box and a label on the frame.
    images:
      - { src: ./qr-stop.jpg, alt: "Screen with Gazebo, the QR Detection window showing QR: stop, and the SLAM map in RViz", caption: "Gazebo (left), the QR detection window (centre) reading “stop”, and the live SLAM map in RViz (right)." }
  - label: Solve
    title: Autonomous maze solver
    text: >-
      The solver node uses the camera, the LiDAR and the IMU, and runs a state machine every 0.1&nbsp;s.
      In FORWARD, the robot drives until the wall in front is 0.45&nbsp;m away (the average of the 40 front
      LiDAR rays, &plusmn;20&deg;). Then it reads the QR code: <em>left</em> or <em>right</em> starts TURNING
      to the current yaw &plusmn;90&deg;, until the error is below 0.1&nbsp;rad. <em>stop</em> ends the run.
      Angle normalisation handles the wrap at &plusmn;&pi;.
    video:
      src: /video/mechabot-qr-maze.mp4
      poster: /video/mechabot-qr-maze.jpg
      caption: "Mechabot solves the QR maze on its own while slam_toolbox builds the map (68 s, no sound)."
  - label: Map
    title: SLAM with slam_toolbox
    text: >-
      Odometry alone drifts because of wheel slip and encoder noise, so the robot needs a map.
      <code>slam_toolbox</code> uses the LiDAR and odometry to build a 2D occupancy grid while the robot drives.
      Nav2's lifecycle manager starts the nodes in the correct order. I saved the map with
      <code>map_saver_cli</code> and cleaned stray pixels in GIMP.
    images:
      - { src: ./qr-maze-map.png, alt: "Occupancy grid map of the T-shaped QR maze: white free space with black walls on grey unknown space", caption: "Saved occupancy grid of the QR maze: free (white), occupied (black), unknown (grey)." }
  - label: Localise
    title: AMCL on a known map
    text: >-
      With a saved map, the robot only needs its pose. A new localisation package runs
      <code>map_server</code> and <code>nav2_amcl</code> (adaptive Monte Carlo localisation), which matches LiDAR
      scans to the map. One launch argument selects the map, for example the AWS small house world.
    images:
      - { src: ./amcl-small-house.jpg, alt: "RViz view of the small house map with red LiDAR points on the walls and a green particle cloud around the robot", caption: "AMCL in the small house map: the green particle cloud around the robot is the pose estimate; red points are LiDAR hits." }
  - label: Navigate
    title: Nav2 (in progress)
    text: >-
      A behaviour tree plans a path to the goal again at 1&nbsp;Hz and follows it. If it fails, it recovers
      up to three times: wait 3&nbsp;s, back up 0.30&nbsp;m at 0.15&nbsp;m/s, then spin. A behaviour server
      provides the spin, back-up and wait actions.
---

## What I learnt

- **Debugging ROS 2:** `ros2 topic info -v`, `ros2 control list_controllers` and `view_frames` find most problems fast. Most of my bugs were message-type mismatches.
- **Simulation details:** collision shapes, inertia, friction and sim time (`use_sim_time`) all change how the robot behaves.
- **Why each layer exists:** odometry drifts, so SLAM builds a map; with a map, AMCL only finds the pose; Nav2 plans and recovers on top of that.
- **Clean structure:** one package per job (description, controller, scripts, mapping, localisation, navigation, bringup) keeps the system easy to change.
