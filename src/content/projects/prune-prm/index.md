---
title: "Prune-PRM: Faster Roadmap Planning by Batch Collision Pruning"
order: 1
featured: true
stack: "Python, OMPL, NumPy"
org: Moon Lab
status: "2026 · built as a real OMPL planner"
thumb: ./thumb.png
thumbAlt: "Prune-PRM roadmap and planned path"
anim: /anim/prune-prm.gif
links:
  - { label: code, href: "https://github.com/rebelpg/prune-prm" }
summary: >-
  A roadmap planner that builds its graph blind, then removes collisions in one batch: 3&ndash;5&times; fewer
  collision tests than naive pruning, for the identical roadmap.
description: >-
  A PRM variant written as a real <a href="https://ompl.kavrakilab.org/" target="_blank" rel="noopener">OMPL</a>
  planner in Python. Classic PRM checks for collisions while it wires the graph. Prune-PRM builds the roadmap
  without any collision checks, then removes colliding nodes and edges in one batch using the exact obstacle
  geometry. A locality bound, R<sub>eff</sub>, proves that most edges cannot collide, so they are kept without
  any test.
steps:
  - label: Problem
    title: The test world
    text: >-
      A point robot in a 60&times;60 box must go from (10,&nbsp;10) to (50,&nbsp;50) around four circular obstacles.
      The same world is shared by the demo, the benchmark and the plots, so every result lines up.
    images:
      - { src: ./prune_prm_path.png, alt: "Prune-PRM path from start to goal around four grey circular obstacles", caption: "A Prune-PRM solution: 23 waypoints from start to goal." }
  - label: Idea
    title: Build blind, prune once
    text: >-
      Four batch steps: <strong>sample</strong> random points anywhere, even inside obstacles;
      build a <strong>skeleton</strong> by joining each point to its k nearest neighbours, ignoring obstacles;
      <strong>prune</strong> points inside a circle and edges that cross one; then <strong>search</strong> the
      result with Dijkstra for the shortest path.
    gif: { src: /anim/prune-prm.gif, alt: "Animation of Dijkstra searching the pruned roadmap from start to goal" }
  - label: R_eff
    title: The locality bound
    text: >-
      R<sub>eff</sub>&nbsp;=&nbsp;r&nbsp;+&nbsp;inflation&nbsp;+&nbsp;max edge length. Any edge that hits a circle must
      have an endpoint inside that circle&rsquo;s R<sub>eff</sub> ring: its closest point to the centre is within
      r&nbsp;+&nbsp;inflation, and each endpoint is at most one edge length from that point. So an edge with both
      ends outside every ring is provably safe and is kept with zero tests. Tested on the same skeleton, the
      localised prune does about <strong>3&ndash;5&times; fewer edge-vs-circle tests</strong> than the naive one,
      and an assertion checks that both give the identical roadmap.
    images:
      - { src: ./reff_ablation.png, alt: "Three charts: prune time of naive vs R_eff pruning over neighbours per node, max edge length and number of samples", caption: "Naive (orange) vs R_eff pruning (blue). The gain is steady with more neighbours or samples, and shrinks as edges get longer." }
  - label: OMPL
    title: A real OMPL planner
    text: >-
      Prune-PRM subclasses <code>ob.Planner</code> and overrides <code>solve()</code>. A nanobind trampoline lets
      OMPL&rsquo;s C++ core call the Python method, so it plugs into <code>SimpleSetup</code> and
      <code>ompl.tools.Benchmark</code> exactly like PRM or RRT. It uses OMPL for the state space, the sampler,
      start and goal, and the output path. It bypasses OMPL&rsquo;s yes/no validity checker, because R<sub>eff</sub>
      needs the real obstacle shapes.
  - label: Benchmark
    title: Against PRM, PRM* and FMT*
    text: >-
      10 runs, 1&nbsp;s budget. All planners solve the world. Prune-PRM takes about 14&nbsp;ms (prune + search,
      with the roadmap assumed built), PRM about 25&nbsp;ms, FMT* about 12&nbsp;ms, and PRM* uses its full budget for
      the shortest path. The time column is not like-for-like (Python with analytic circles vs C++ with a
      collision callback); path length is a fair comparison.
    images:
      - { src: ./planner_comparison.png, alt: "Bar charts of planning time (log scale) and path length for PrunePRM, PRM, PRM* and FMT*" }
---

## What I learnt

- **OMPL architecture:** state spaces, validity checkers, samplers, problem definitions and the planner lifecycle.
- **Custom planners:** subclassing `ob.Planner` from Python, and how the nanobind trampoline connects it to the C++ core.
- **Proof-driven speed-ups:** turning a geometric bound into skipped work, and checking with an assertion that the result does not change.
- **Fair benchmarking:** ablations on the same input, and saying clearly which numbers are and are not like-for-like.
- **Debugging:** a ROS `libompl` shadowing the pip install through `LD_LIBRARY_PATH`, and a double-free crash from freeing OMPL states by hand.

## Try it

- [Tutorial notebook in Colab](https://colab.research.google.com/github/rebelpg/prune-prm/blob/main/prune_prm_tutorial_colab.ipynb): runs in the browser, installs OMPL by itself.
- [Talk slides: Prune-PRM &amp; OMPL](https://docs.google.com/presentation/d/1UGcFLT_iZov0bXkL46YI9xsq1knPZbO86lB9je8PfAs/edit?usp=sharing)
- [Full write-up (PDF)](https://github.com/rebelpg/prune-prm/blob/main/docs/prune_prm_ompl_guide.pdf): method, R<sub>eff</sub> proof, OMPL integration and benchmark method.
