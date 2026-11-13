// Reads the YAML files in src/data/. Text fields may contain HTML; components render them with set:html.
// Each file is checked against a schema, so a YAML mistake stops the build with a clear message
// (for example an unquoted "word: word" that YAML reads as a key instead of text).
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { z } from 'astro/zod';
import profileRaw from '../data/profile.yaml?raw';
import newsRaw from '../data/news.yaml?raw';
import experienceRaw from '../data/experience.yaml?raw';
import skillsRaw from '../data/skills.yaml?raw';
import leadershipRaw from '../data/leadership.yaml?raw';

const link = z.object({ label: z.string(), href: z.string() });

const profileSchema = z.object({
  name: z.string(),
  description: z.string(),
  email: z.string(),
  cv: z.string(),
  photoAlt: z.string(),
  intro: z.array(z.string()),
  links: z.array(link),
  research: z.string(),
});

const newsSchema = z.array(z.object({ date: z.coerce.string(), text: z.string() }));

const experienceSchema = z.array(
  z.object({
    date: z.coerce.string(),
    logo: z.string(),
    logoAlt: z.string(),
    title: z.string(),
    org: z.string(),
    bullets: z.array(z.string()).optional(),
    text: z.string().optional(),
    meta: z.string().optional(),
    // Slug of a kind: experience entry in src/content/projects/; links the title to /experience/<slug>/
    page: z.string().optional(),
  }),
);

const skillsSchema = z.array(z.object({ label: z.string(), tags: z.array(z.coerce.string()) }));

const leadershipSchema = z.array(
  z.object({
    heading: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        detail: z.string().optional(),
        meta: z.string().optional(),
        date: z.coerce.string(),
        // Shown after the meta line, e.g. a certificate PDF in public/data/certificates/
        links: z.array(link).default([]),
        // Photo file name in src/assets/leadership/
        photo: z.object({ file: z.string(), alt: z.string(), caption: z.string().optional() }).optional(),
        // MP4 in public/video/; poster = image file name in src/assets/leadership/ (it also sets the size).
        // The video loads only when the visitor presses play.
        video: z.object({ src: z.string(), poster: z.string(), caption: z.string().optional() }).optional(),
      }),
    ),
  }),
);

function load<T extends z.ZodType>(file: string, raw: string, schema: T): z.infer<T> {
  const result = schema.safeParse(parse(raw));
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`src/data/${file} is invalid:\n${issues}\nTip: put quotes around text that contains ": ".`);
  }
  return result.data;
}

const rawProfile = load('profile.yaml', profileRaw, profileSchema);
// The CV links show only when the CV file exists in public/, so the site never links to a missing file
export const hasCv = existsSync(join(process.cwd(), 'public', rawProfile.cv));
export const profile = {
  ...rawProfile,
  links: rawProfile.links.filter((l) => hasCv || l.href !== rawProfile.cv),
};
export const news = load('news.yaml', newsRaw, newsSchema);
export const experience = load('experience.yaml', experienceRaw, experienceSchema);
export const skills = load('skills.yaml', skillsRaw, skillsSchema);
export const leadership = load('leadership.yaml', leadershipRaw, leadershipSchema);

export type ExperienceItem = z.infer<typeof experienceSchema>[number];
export type SkillGroup = z.infer<typeof skillsSchema>[number];
export type LeadershipGroup = z.infer<typeof leadershipSchema>[number];
