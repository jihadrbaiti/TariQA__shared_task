# TariqQA — Moroccan Traffic Law QA Shared Task (website)

Static website for **TariqQA**, the shared task on multiple-choice question answering over the
Moroccan Highway Code (Law 52-05) in Modern Standard Arabic, Moroccan Darija and English,
proposed for the AbjadNLP 2027 Workshop. Inspired in structure by the AbjadGenEval task page.

Plain HTML, CSS and JavaScript. No build step, no dependencies. Ready for GitHub Pages.

## Pages

| File | Content |
|------|---------|
| `index.html` | Main page: overview, motivation, data (stats, examples, sample quiz), task and evaluation, timeline, organizers, participation, logistics |
| `guidelines.html` | Participation guidelines, phases, submission format, FAQ |
| `paper.html` | System description paper guidelines |
| `data/sample_train.csv` | 20 questions showing the data format (`id,question,A,B,C,answer`) |
| `data/sample_submission.csv` | Prediction file format (`id,answer`) |
| `assets/js/config.js` | **All external links and the contact e-mail live here** |
| `assets/organizers.csv` | Organizer cards: name, role, affiliation, profile links, photo |

## Before going live

1. `assets/js/config.js`: registration form, GitHub, Codabench, Slack, mailing list and
   OpenReview URLs, plus the contact e-mail. Empty values show a small "soon" badge instead
   of a broken link.
2. `index.html`, section 05: timeline dates. All of them are tentative placeholders.
3. `assets/organizers.csv`: one row per organizer, with the columns
   `first_name,last_name,affiliation,role,orcid,linkedin,google_scholar,research_gate,email,profile_picture_path`.
   Every row needs all 10 fields; leave unused ones empty, e.g. `...,research_gate_url,,assets/img/name.jpg`.
   ORCID takes the bare iD (`0000-0002-...`), the e-mail a plain address, the photo a path such as
   `assets/img/name.jpg` (it is clipped to a horseshoe arch). Profile icons appear only for filled
   columns; web profiles open in a new tab.
4. Split sizes, licence, baseline scores and the footer maintainer name are marked with
   `class="tba"`. Search the HTML files for `TBA`.
5. The task name `TariqQA` can be changed with a find-and-replace across the three HTML files
   and `config.js`.

## Preview locally

```
python -m http.server 8000
```

then open http://localhost:8000. Opening `index.html` directly from the file system works too,
except the organizer list: browsers block reading the CSV from `file://`, so the page shows a note instead.

## Deploy on GitHub Pages

Push the repository to GitHub, then *Settings → Pages → Build and deployment → Source:
Deploy from a branch → `main` / `/ (root)`*. The `.nojekyll` file tells GitHub Pages to
serve the files as they are.

## Design notes

Traditional Moroccan motifs (zellige eight-pointed stars, horseshoe arches, saffron, cobalt,
terracotta and emerald) combined with Moroccan road signs (STOP / قف, give way, speed bump, no overtaking,
speed limits, roundabout, no entry...), an animated traffic light and asphalt road dividers.
All graphics are inline SVG; the fonts (Marcellus, Source Sans 3, Amiri) are loaded from Google
Fonts. The site supports dark mode (toggle in the navigation, remembered per browser) and
reduced-motion preferences.

## Dataset figures shown on the page

Computed from `combined_dataset.csv` (5,147 rows): three options per question; gold answers
A 33.9%, B 34.3%, C 31.8%; about 8% of questions in English, about 18% with Moroccan Darija
markers, about 21% citing an article of Law 52-05. Update the page if the released splits differ.
