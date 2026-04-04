# ICU.TERMINAL - Interactive Terminal Portfolio

## Concept
Retro terminal portfolio. Visitors type commands to navigate projects. CRT aesthetic with scanlines, glow, typing animations.

## Tech Stack
- Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- Fonts: JetBrains Mono, VT323
- Static deploy (Vercel/Netlify)

## Phases

### Phase 1: Terminal Shell [DONE]
- [x] Project setup (Next.js + TS + Tailwind)
- [x] Terminal component with input/output
- [x] Command parser (lib/commands.ts)
- [x] `help` command + all basic commands stubbed
- [x] Basic styling (dark bg, green text, JetBrains Mono)
- [x] Auto-scroll, command history (up/down arrows)
- [x] ASCII art welcome banner
- [x] Ctrl+L to clear
- [x] Build verified clean

### Phase 2: Boot Sequence + CRT Effects [DONE]
- [x] Boot sequence animation on load (char-by-char typing)
- [x] CRT scanlines overlay
- [x] Text glow effect (green phosphor shadow)
- [x] Screen flicker animation
- [x] Typing animation (char by char output)
- [x] Vignette / edge darkening
- [x] Blinking block cursor
- [x] Skip boot with any keypress
- [x] Build verified clean

### Phase 3: Core Commands [DONE]
- [x] `about` -- bio/intro with box art
- [x] `projects` -- list projects with status tags [LIVE]/[DEV]
- [x] `open <project>` -- project detail view with description, stack, status, links
- [x] `skills` -- categorized tech stack display
- [x] `contact` -- contact info with box art
- [x] `banner` -- re-show welcome ASCII art
- [x] `whoami` -- returns "visitor"
- [x] `date` -- current date/time
- [x] `echo <text>` -- print text
- [x] Project data structure (lib/projects.ts) -- easy to add new projects
- [x] Fuzzy project name matching (open blacksite / open blacksite-07 both work)
- [x] Build verified clean

### Phase 4: Project Details + Media
- [ ] Project data structure
- [ ] Screenshots/images in terminal
- [ ] Links (clickable in output)
- [ ] ASCII art headers

### Phase 5: Polish
- [ ] `theme green|amber|white` command
- [ ] Mobile responsive
- [ ] SEO meta tags
- [ ] Deploy config
