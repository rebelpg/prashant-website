import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per project: src/content/projects/<slug>/index.md (+ its images).
// The folder name is the URL: /projects/<slug>/
const projects = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // 'paper' shows under Research, 'project' under Projects.
      // 'experience' is not listed on the home page: it is the long page at /experience/<slug>/,
      // linked from an item in src/data/experience.yaml (field: page).
      kind: z.enum(['paper', 'project', 'experience']).default('project'),
      // Lower number = higher on the page
      order: z.number(),
      // true = full row with thumbnail under Projects; false = one line under Other projects
      featured: z.boolean().default(false),
      // One-line text for the Other projects list; the summary is used when this is missing
      short: z.string().optional(),
      // Short text for the home page (keep it to one or two sentences)
      summary: z.string(),
      // Longer text at the top of the project page; the summary is used when this is missing
      description: z.string().optional(),
      thumb: image(),
      thumbAlt: z.string(),
      // Keep the thumbnail's own shape (for wide figures) instead of a square
      wideThumb: z.boolean().default(false),
      // Optional GIF in public/ that plays on hover, e.g. /anim/nidar.gif
      anim: z.string().optional(),
      stack: z.string().optional(),
      org: z.string().optional(),
      status: z.string().optional(),
      authors: z.string().optional(),
      venue: z.string().optional(),
      highlight: z.boolean().default(false),
      links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
      // Project page: build steps shown as a timeline (label on the left, text and images on the right)
      steps: z
        .array(
          z.object({
            label: z.string(),
            title: z.string(),
            text: z.string(),
            images: z
              .array(z.object({ src: image(), alt: z.string(), caption: z.string().optional() }))
              .default([]),
            // Optional animated GIF in public/ (GIFs skip image processing so they keep moving)
            gif: z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() }).optional(),
            // Optional MP4 in public/video/ with a poster image; loads only when the visitor presses play
            video: z.object({ src: z.string(), poster: z.string(), caption: z.string().optional() }).optional(),
          }),
        )
        .default([]),
      // Project page: video at the bottom. A YouTube URL (watch, youtu.be or shorts) is embedded.
      video: z.object({ label: z.string(), href: z.string() }).optional(),
    }),
});

export const collections = { projects };
