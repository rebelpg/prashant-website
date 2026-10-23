# Prashant Gupta: personal website

Based on Jon Barron's website template (https://github.com/jonbarron/jonbarron_website).

## Add your images
Put them in the `images/` folder with these names. Any extension works
(.jpg, .jpeg, .png, .webp, .gif), so only the part before the dot matters.

| File name   | What to put                                                |
|-------------|------------------------------------------------------------|
| `profile`   | Your photo (square-ish, face centred; shown as a circle)    |
| `coast`     | COAST paper: Gazebo screenshot of the UAV + UGV, or a figure |
| `moonlab`   | Moon Lab: a drone you work on, or you in the lab             |
| `prune_prm` | Prune-PRM: roadmap + path plot, or benchmark chart            |
| `atv_sim`   | Off-road ATV in Gazebo                                        |
| `qbot`      | IIT BHU internship: QBot hardware or a trajectory plot       |
| `pgnta`     | PGNTA humanoid robot                                         |
| `uav_ugv`   | GPS-denied UAV–UGV project: Gazebo/RViz screenshot            |
| `amr`       | Autonomous Mobile Robot (Mechamind Labs)                     |
| `scout`     | Scout surveillance UGV                                       |

Optional hover animations: add a GIF named `<name>_anim.gif`
(e.g. `pgnta_anim.gif`, `coast_anim.gif`). It plays when someone hovers over that row.

Missing images show a grey labelled placeholder, so nothing breaks.

## Add your CV
Save your resume PDF as `data/cv.pdf`.

## Preview locally
Needs Node.js (no `npm install` needed, zero dependencies). From this folder run:

    npm start        # serves at http://localhost:8000
    npm run dev      # same, and opens the browser
    PORT=3000 npm start

No Node? Use `python3 -m http.server 8000`.

## Dark mode
A toggle button sits top-right. First visit follows the system setting;
after a click, the choice is saved in the browser. Colours live as CSS
variables at the top of `stylesheet.css` (`:root` = light, `[data-theme="dark"]` = dark).

## Later: put it on GitHub
1. Create a repo named exactly `rebelpg.github.io`.
2. Upload everything in this folder (including the hidden `.nojekyll` file).
3. Settings → Pages → Deploy from branch → `main` / root.
Your site will be at https://rebelpg.github.io

## TODOs in index.html
- Paper PDF / arXiv links (search for "TODO")
- Prune-PRM code link
- Google Scholar link (search for "TODO")
