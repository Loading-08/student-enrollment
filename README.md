# Student Enrollment Analysis

A mini project that manages and analyzes students enrolled in Mathematics, Science, and Computer Science using **set operations** — union, intersection, and difference.

🔗 **Live demo:** https://loading-08.github.io/student-enrollment/

## What it does

- Add or remove students and tick the courses each one is enrolled in.
- Pick any two courses and instantly see:
  - **Union** — students in either course
  - **Intersection** — students in both courses
  - **Difference (A − B)** and **(B − A)** — students unique to one course
- Across all courses, view:
  - Students enrolled in at least one course (union of all)
  - Students not enrolled anywhere (difference from the full student set)
  - Students enrolled in more than one course
  - Students enrolled in exactly one course
  - Students enrolled in every course (intersection of all)
  - Headcount per course, for academic planning and resource allocation

## Tech stack

- HTML, CSS, and vanilla JavaScript (`Set` objects power the union/intersection/difference logic)
- No frameworks, no build step — just static files
- Data is saved in the browser's `localStorage`, so it persists across refreshes

## Project structure

```
student-enrollment/
├── index.html      # page structure
├── css/
│   └── style.css   # styling
├── js/
│   └── script.js   # set operations and app logic
└── README.md
```

## Run locally

```bash
python -m http.server 8000
```
Then open http://localhost:8000

## Deploy

Hosted for free on **GitHub Pages** (Settings → Pages → Branch: `main`, folder: `/root`).
