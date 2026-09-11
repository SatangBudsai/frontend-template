---
name: frontend-design
description: Design, build, review, or refine distinctive production frontend experiences with strong UX, visual hierarchy, responsive behavior, accessibility, truthful data visualization, motion, and implementation quality. Use for websites, landing pages, dashboards, portals, React components, HTML/CSS layouts, design-system work, visual audits, UX/UI reviews, or requests to modernize and beautify an existing interface.
---

# Frontend Design

Create interfaces that feel intentionally designed for their users, content, brand, and technical environment. Distinctiveness must come from a coherent idea and excellent execution—not novelty layered over weak usability.

## Working Method

### 1. Ground the work in reality

Before proposing or writing UI:

- Identify the primary users, their top task, and the action the page must make easiest.
- Inspect the existing interface, code, design tokens, components, assets, fonts, content, and real data.
- Reuse established brand and interaction patterns unless the task explicitly calls for a new system.
- Separate facts from decisions. Look up facts in the code; ask only about decisions that materially change the result.
- Name technical constraints: framework, server/client boundaries, performance budget, browser support, localization, and accessibility target.

For an existing product, preserve what already works. Redesign the weak relationships rather than restyling every surface.

### 2. Define one clear direction

State the direction in one sentence covering:

- **Purpose** — what the interface helps people accomplish.
- **Tone** — the emotional character appropriate to the domain.
- **Signature** — the one composition, interaction, or data story users should remember.
- **Restraint** — what the design deliberately avoids.

Choose a direction from the product context, not from a random aesthetic label. A university research portal, a music tool, and a finance console should not share the same visual grammar.

### 3. Design the journey before the components

Map the page as a sequence of user questions and answers. Every section must have a distinct job and lead naturally to the next action.

Check:

- Entry point, primary action, supporting actions, and exit.
- Information hierarchy and progressive disclosure.
- Loading, empty, error, success, disabled, and partial-data states.
- First-time and returning-user needs.
- Keyboard, touch, zoom, reduced-motion, and localization behavior.

Do not let a component inventory become the information architecture. Repeated card grids are not a journey.

## Visual Craft

### Composition and rhythm

- Establish a deliberate page rhythm using scale, density, negative space, and contrasting section structures.
- Use asymmetry, overlap, or grid-breaking moments only when they strengthen hierarchy or narrative.
- Give each major section a different visual role while keeping shared tokens and alignment lines.
- Keep line lengths readable and align related content consistently.
- Avoid long pages made from identical “heading + cards + button” blocks.

### Typography

- Respect the existing type system unless a font change has a clear brand and performance benefit.
- Create hierarchy with scale, weight, line height, width, and spacing—not weight alone.
- Keep body and metadata readable at real device sizes; do not use tiny uppercase text as decoration.
- Test long names, localization, numbers, and wrapping. Never tune a layout only for ideal English copy.

### Color and surfaces

- Start from brand colors and content needs. Brand purple, gradients, or glass effects are valid when used intentionally.
- Use color to communicate hierarchy and state; never rely on color alone.
- Maintain WCAG AA contrast for text and controls.
- Prefer a small number of meaningful surfaces over many nested rounded cards.
- Use glow, blur, grain, gradients, and texture as atmosphere, not as a substitute for composition.

### Components and interaction

- Prefer native semantic elements and clear interaction states.
- Make hover, focus, active, selected, loading, and disabled states visually related.
- Keep touch targets at least 44×44px where practical and never below WCAG 2.2 minimums.
- Use direct, descriptive action labels. Avoid generic “Learn more” when the destination can be named.
- Preserve focus visibility and logical keyboard order.

## Data Visualization

Design the question before choosing the chart.

- Use only real metrics supported by the data contract.
- Distinguish snapshots, distributions, rankings, relationships, and time series. Never imply growth when only a snapshot exists.
- Choose the smallest visual form that makes the relationship clearer than prose or a short table.
- Public-facing data should usually read as an editorial story: one conclusion, a few proof values, and a clear path into the underlying content.
- Dashboards may use dense comparison and controls only when monitoring or analysis is the user's actual job.
- Keep exact values available in text. Provide keyboard and touch interaction, programmatic names, and a non-visual equivalent for complex charts.
- Do not import a chart library when semantic HTML or a small SVG layer is sufficient.

Avoid decorative charts, fabricated trends, gauge collections, and KPI-card grids that do not help a user decide or act.

## Motion

Use motion to explain hierarchy, continuity, selection, or cause and effect.

- Prioritize one orchestrated high-impact moment over animation on every component.
- Animate compositor-friendly properties such as transform and opacity.
- Keep interaction feedback short and predictable.
- Stop or pause auto-advancing content on interaction.
- Respect `prefers-reduced-motion`; the final state must remain complete and understandable without animation.
- Avoid scroll-jacking, constant parallax, looping particles, and movement that competes with reading.

## Responsive Design

Design mobile as its own composition, not a scaled-down desktop.

- Decide what remains primary, what reflows, what simplifies, and what becomes progressively disclosed.
- Test narrow phones, standard mobile, tablet, laptop, and wide desktop.
- Prevent horizontal overflow and content hidden beneath sticky UI.
- Verify long text, large numbers, virtual keyboards, safe areas, and 200% zoom.
- Use responsive images and explicit dimensions to prevent layout shift.

## Implementation Discipline

- Follow the repo's component, styling, data, and routing conventions.
- Reuse tokens, components, and utilities before adding new abstractions.
- Keep server-rendered content on the server and push client boundaries to the smallest interactive island.
- Avoid unnecessary dependencies, client fetching, hydration work, and animation bundles.
- Use real content and data shapes. Include honest empty and failure states.
- Match implementation complexity to the value of the design idea.

## Quality Gate

Before declaring the work complete:

1. Inspect the real page in a browser at desktop and mobile sizes.
2. Walk the primary task from entry to successful exit.
3. Test keyboard navigation, visible focus, reduced motion, and touch-sized controls.
4. Check hierarchy, contrast, wrapping, overflow, loading, empty, and error states.
5. Review console output and network/image behavior where relevant.
6. Run the repository's formatter, typecheck, lint, tests, and production build as applicable.
7. Compare the result against the stated direction and signature. Remove effects or components that do not support them.

## Anti-patterns

Do not:

- Produce a generic SaaS layout regardless of domain.
- Default every section to centered copy, three cards, and a gradient CTA.
- Replace a coherent brand merely to appear fashionable.
- Use excessive rounded containers, glass panels, glow, or purple gradients without purpose.
- Make all cards animate upward on scroll.
- Hide important information behind hover.
- Trade readability, accessibility, or performance for visual novelty.
- Claim completion from source inspection alone when the interface can be viewed and tested.

The result should be memorable because the product's purpose is expressed clearly—not because the interface contains the most effects.
