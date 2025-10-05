# YouTube Channel Analyzer - Design Guidelines

## Design Approach: Modern Analytics Dashboard

**Selected Approach:** Hybrid system inspired by Linear's clean aesthetics + Vercel's dashboard patterns for data-heavy analytics

**Key Design Principles:**
- Data clarity above all - metrics should be instantly scannable
- Progressive disclosure - guide users from simple input to complex insights
- Trust through professionalism - clean, credible presentation of AI insights
- Subtle depth - use shadows and borders to create hierarchy without distraction

---

## Core Design Elements

### A. Color Palette

**Dark Mode Primary (Default):**
- Background: 222 47% 11% (deep charcoal)
- Surface: 222 47% 14% (elevated cards)
- Surface Elevated: 222 47% 18% (hover states, nested cards)
- Border: 222 20% 25% (subtle divisions)

**Light Mode:**
- Background: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white cards)
- Surface Elevated: 0 0% 96% (subtle elevation)
- Border: 220 13% 91% (gentle divisions)

**Accent Colors:**
- Primary: 217 91% 60% (professional blue - buttons, links, charts)
- Success: 142 71% 45% (positive metrics, growth indicators)
- Warning: 38 92% 50% (medium risk, caution states)
- Danger: 0 84% 60% (high risk, negative trends)
- Chart Colors: Use a 5-color palette - 217 91% 60%, 142 71% 45%, 271 91% 65%, 38 92% 50%, 338 78% 56%

**Typography Colors:**
- Primary Text: 222 47% 95% (dark mode) / 222 47% 11% (light mode)
- Secondary Text: 222 20% 70% (dark mode) / 222 20% 45% (light mode)
- Muted Text: 222 15% 50% (dark mode) / 222 15% 60% (light mode)

### B. Typography

**Font Families:**
- Primary: 'Inter' (via Google Fonts) - all UI text, metrics, labels
- Monospace: 'JetBrains Mono' (via Google Fonts) - channel IDs, technical data

**Type Scale:**
- Hero Headline: text-4xl md:text-5xl font-bold (input page title)
- Section Title: text-2xl font-semibold (dashboard sections)
- Card Title: text-lg font-semibold (metric cards)
- Metric Value: text-3xl md:text-4xl font-bold (revenue, engagement numbers)
- Body: text-base (default paragraph, AI insights)
- Label: text-sm font-medium (form labels, chart axes)
- Caption: text-xs (timestamps, footnotes)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 3, 4, 6, 8, 12, 16
- Consistent padding: p-6 for cards, p-8 for page containers
- Grid gaps: gap-4 for tight grids, gap-6 for card layouts
- Vertical rhythm: space-y-6 for stacked sections

**Responsive Grid:**
- Mobile: Single column, full width cards
- Tablet (md:): 2-column grid for metrics
- Desktop (lg:): 3-column for metric cards, 2-column for main content/sidebar

**Container Structure:**
- Max width: max-w-7xl mx-auto
- Page padding: px-4 md:px-8
- Card padding: p-6 md:p-8

### D. Component Library

**Input Page Components:**
- Centered Card (max-w-2xl): White/elevated surface with shadow-xl, rounded-2xl, contains form
- Input Field: Full-width with rounded-lg border, focus ring in primary color, px-4 py-3
- Submit Button: Primary blue, full-width on mobile, w-auto px-8 on desktop, rounded-lg, font-semibold
- Loading State: Centered spinner with animated pulse effect, text-primary color

**Dashboard Components:**

*Metric Cards:*
- Background: Surface color with border
- Border radius: rounded-xl
- Padding: p-6
- Layout: Stacked with icon/label at top, large metric value, subtitle/change indicator
- Hover: Subtle lift with shadow-lg transition

*Revenue Summary Card:*
- Large currency display (text-4xl font-bold)
- Breakdown grid (2-column on desktop): Monthly revenue, margin %, MCN share
- Color coding: Green for positive margins, amber for moderate, red for low

*Engagement Metrics:*
- Horizontal stats row on desktop, stacked on mobile
- Icon + label + value pattern
- Use muted icons from Heroicons (ChartBarIcon, HeartIcon, ChatBubbleIcon)

*Risk Level Indicator:*
- Badge component with dynamic color: Success (Low), Warning (Medium), Danger (High)
- Rounded-full px-4 py-2, font-semibold text-sm
- Placed prominently in header area of dashboard

*Chart Container:*
- Full-width card with p-6
- Chart.js canvas with responsive aspect ratio
- Legend positioned top-right
- Grid lines in muted border color
- Tooltips with surface background and shadow

*AI Insights Block:*
- Larger card (col-span-2 on 2-column grid)
- Formatted prose with max-w-none
- Headings in text-lg font-semibold
- Paragraphs with space-y-4
- Bullet points with custom marker color (primary blue)

**Navigation:**
- Minimal header: Logo/title left, optional settings icon right
- Sticky positioning (sticky top-0) with backdrop-blur
- Border-bottom for separation

### E. Visual Enhancements

**Shadows:**
- Cards: shadow-lg for default, shadow-xl for hover
- Input focus: Custom ring-2 ring-primary ring-offset-2
- Elevated surfaces: shadow-2xl for modals/overlays

**Transitions:**
- All interactions: transition-all duration-200 ease-in-out
- Card hover: transform hover:scale-[1.02]
- Button press: active:scale-95
- Loading states: animate-pulse or animate-spin

**Chart Styling:**
- Line charts: Smooth curves with gradient fills (opacity 20%)
- Bar charts: Rounded corners (borderRadius: 8)
- Grid: Subtle dotted lines in border color
- Axes: Labels in muted text color, font-size 12px

**Status Badges:**
- Pill shape (rounded-full)
- Subtle backgrounds: bg-success/10, bg-warning/10, bg-danger/10
- Bold text in matching colors
- 2px left border in badge color for emphasis

---

## Page-Specific Layouts

### Input Page (Landing State):
- Centered layout with max-w-2xl
- Generous vertical spacing (py-16 md:py-24)
- Hero text above form card explaining the tool
- Form card with elevated surface, large input, prominent CTA button
- Subtle background pattern or gradient (linear from background to surface color)

### Dashboard (Results State):
- Header bar with channel name, avatar (if available), analyze new button
- 3-column metric grid (revenue, engagement, risk) - collapses to 1 column mobile
- Full-width subscriber growth chart below metrics
- 2-column layout: Left = additional metrics, Right = AI insights (larger)
- Footer with timestamp and data freshness indicator

---

## Data Visualization

**Number Formatting:**
- Currency: $1,665/mo (compact notation for large numbers: $1.2M)
- Percentages: 42.5% (one decimal for precision)
- Large numbers: 1.2M, 842K (abbreviated with K/M/B)
- Growth indicators: +15.3% with color coding and arrow icons

**Chart Configuration (Chart.js):**
- Font family: 'Inter'
- Colors from accent palette defined above
- Responsive: maintainAspectRatio: true
- Animation: Smooth entrance with 800ms duration
- Legend: Position top, align end, font-size 14px
- Grid lines: Dotted, color matching border color at 40% opacity

---

## Interaction Patterns

**Form Submission Flow:**
1. User enters URL → input border highlights on focus
2. Click Analyze → button shows loading spinner, disabled state
3. Success → Smooth transition to dashboard (fade-in with stagger effect on cards)
4. Error → Red border on input, error message below in danger color

**Dashboard Interactions:**
- Hover cards → Subtle lift and shadow increase
- Click metric cards → Optional drill-down (future enhancement, show as cursor-pointer)
- Charts → Interactive tooltips on hover showing exact values
- AI insights → Collapsible sections if content is lengthy (chevron icon indicators)

---

## Accessibility & Responsiveness

**Mobile Optimizations:**
- Single column layout for all cards
- Larger touch targets (min 44px height for buttons)
- Horizontal scroll for wide charts with scroll indicator
- Stacked metrics with clear visual separation

**Dark Mode Consistency:**
- All surfaces use defined dark mode palette
- Input fields: bg-surface with elevated focus state
- Charts: Dark background with lighter lines and text
- Ensure 4.5:1 contrast ratio for all text on backgrounds

**Loading States:**
- Skeleton screens matching final card dimensions
- Pulsing animation for placeholder content
- Loading spinner centered with descriptive text ("Analyzing channel...")

---

## Images

No hero image required - this is a utility-focused analytics dashboard. Visual interest comes from:
- Data visualization (charts and graphs)
- Metric cards with iconography
- Clean typography and spacing
- Color-coded status indicators

Optional: Small YouTube channel avatar/thumbnail displayed in dashboard header if available from API response.