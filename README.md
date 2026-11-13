# Prashant Gupta: personal website

Built with [Astro](https://astro.build). Design based on Jon Barron's template
(https://github.com/jonbarron/jonbarron_website). The output is plain static HTML.

## Run locally
Needs Node.js 22.12 or newer.

    npm install      # first time only
    npm run dev      # http://localhost:4321, reloads when you save
    npm start        # same, and opens the browser
    npm run build    # makes the final site in dist/
    npm run preview  # serves dist/ to check the final site

## Where things are

| What you want to change         | File                                   |
|---------------------------------|----------------------------------------|
| Intro text, links, research line | `src/data/profile.yaml`               |
| News                            | `src/data/news.yaml`                   |
| Experience timeline             | `src/data/experience.yaml`             |
| Skills                          | `src/data/skills.yaml`                 |
| Leadership & Community          | `src/data/leadership.yaml`             |
| Photos in Leadership & Community | `src/assets/leadership/` (shown on `/community/`; the home section title links to it) |
| Certificates (PDF)              | `public/data/certificates/`            |
| A project or paper              | `src/content/projects/<name>/index.md` |
| Logos (timeline)                | `src/assets/logos/`                    |
| Profile photo                   | `public/profile.jpg`                   |
| CV                              | `public/data/cv.pdf`                   |
| Colours, fonts, layout          | `src/styles/global.css`                |

Text in the YAML files may contain HTML (`<a>`, `<strong>`, `<em>`).
Put quotes around any text that contains `: ` (a colon and a space).
If a YAML file has a mistake, `npm run dev` and `npm run build` show which file and which line.

## Add a project
1. Make a folder: `src/content/projects/<name>/`. The folder name becomes the URL `/projects/<name>/`.
2. Put a square thumbnail in it, for example `thumb.jpg` (400×400 px is enough).
3. Make `index.md` in it. Copy the top part from another project and change it:

       ---
       title: "My Project"
       order: 3            # lower number = higher on the page
       stack: "ROS 2, Gazebo"
       org: Moon Lab       # optional
       status: ongoing     # optional, grey text
       thumb: ./thumb.jpg
       thumbAlt: "What the thumbnail shows"
       links:
         - { label: code, href: "https://github.com/..." }
       summary: >-
         Two or three sentences for the home page.
       ---

4. Optional: write more below the `---` line, with photos:

       ![What the photo shows](./photo1.jpg)

   When there is text below the `---` line, the home page links the title to the project page.
   Keep each photo below about 1600 px wide.

Long page for an Experience item: make a project folder with `kind: experience`. It is not listed on the
home page; it is served at `/experience/<name>/`. Then add `page: <name>` to that item in `src/data/experience.yaml`
(example: `src/content/projects/iit-bhu-internship/`).

Other fields: `kind: paper` (shows under Research), `authors`, `venue`, `highlight: true` (yellow row),
`wideThumb: true` (keep a wide figure's shape), `anim: /anim/<name>.gif` (a GIF in `public/anim/` that plays on hover).

## Publish on GitHub Pages
1. Create a repo named exactly `rebelpg.github.io` and push this folder to its `main` branch.
2. On GitHub: Settings → Pages → Source: **GitHub Actions**.
3. Every push to `main` now builds and publishes the site to https://rebelpg.github.io
   (see `.github/workflows/deploy.yml`).

## Other folders
- `originals/`: full-size source images used to make the thumbnails. They are not published.
- `dist/`: build output. Do not edit; it is made again by every build.

## TODOs
- Add `public/data/cv.pdf`.
- COAST paper PDF / arXiv links: `src/content/projects/coast/index.md`.
- Google Scholar link: `src/data/profile.yaml`.
- Job line in the intro: `src/data/profile.yaml`.
