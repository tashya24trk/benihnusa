---
name: BenihNusa Track
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#3e4a3e'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#6e7a6e'
  outline-variant: '#bdcabb'
  surface-tint: '#006d31'
  primary: '#00682f'
  on-primary: '#ffffff'
  primary-container: '#00843d'
  on-primary-container: '#e7ffe6'
  inverse-primary: '#71dc8a'
  secondary: '#056d34'
  on-secondary: '#ffffff'
  secondary-container: '#99f4ab'
  on-secondary-container: '#0f7238'
  tertiary: '#00682b'
  on-tertiary: '#ffffff'
  tertiary-container: '#008438'
  on-tertiary-container: '#e7ffe4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#8ef9a4'
  primary-fixed-dim: '#71dc8a'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#005324'
  secondary-fixed: '#9cf6ae'
  secondary-fixed-dim: '#81da94'
  on-secondary-fixed: '#00210b'
  on-secondary-fixed-variant: '#005225'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  tabular-num:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-desktop: 1.5rem
  margin: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes a high-precision, enterprise-grade traceability environment tailored for Indonesian agricultural supply chains, seed certifiers, and field logistics operators. 

### Brand Personality & Core Atmosphere
- **Institutional Reliability & Integrity:** The interface communicates official authority, biological traceability rigor, and data authenticity without feeling bureaucratic or opaque.
- **Operational Clarity:** Built for desktop-heavy work environments—warehouses, laboratories, agronomy hubs, and regional government inspection desks—where dense batch tracking, status monitoring, and certification workflows occur continuously.
- **Modern Agronomic Precision:** Combines clean, light-mode minimalist ergonomics (Next.js/Tailwind aesthetic) with crisp botanical accents. It eschews generic dashboard clutter in favor of clean margins, structural Lucide iconography, and decisive typography.

### Design Movement: Modern Corporate Minimalism
The visual execution fuses clean modern enterprise utility with subtle tactical contrast:
- Pristine structural containers (`#FFFFFF`) grounded over a calm, daylight canvas (`#F7F9F8`).
- Razor-thin divider borders (`#E2E8F0`) providing strict boundary governance without heaviness.
- High typographic readability via geometric sans-serif styling to accelerate complex Indonesian administrative scanning (e.g., *Nomor Induk Benih*, *Sertifikasi Varietas*, *Batch Lot Distribusi*).

## Colors

The palette balances government-grade compliance with vibrant agricultural vitality. Color is applied purposefully as functional state indicators, navigation markers, and verification stamps rather than decorative fills.

### Palette Architecture
- **Primary Brand Green (`#00843D`):** Primary interactions, active table tabs, dominant CTAs, and certified status highlights.
- **Dark Green Accent (`#006B32`):** Hover states, top-tier summary indicators, and high-emphasis focal items.
- **Subtle Surface Greens (`#F0FAF3`):** Active navigation rows, contextual alerts, badge backgrounds, and primary hover fills.
- **Canvas Neutral (`#F7F9F8`):** Off-white base page background preventing monitor glare across prolonged administrative shifts.
- **Container White (`#FFFFFF`):** High-density workspace cards, data tables, modal dialogs, and flyout sheets.
- **Borders & Dividers (`#E2E8F0`):** Precise 1px boundaries separating data points, table heads, and toolbars.
- **Typography Charcoal (`#111827`):** Primary headers, numerical metrics, and main table records.
- **Slate Secondary (`#64748B`):** Metadata, breadcrumbs, column headers, helper labels, and disabled states.

### Semantic & Verification Tokens
- **Success (`#16A34A` / Light Fill `#DCFCE7`):** *Lolos Uji Mutu*, *Sertifikat Terbit*, *Distribusi Selesai*.
- **Warning (`#F59E0B` / Light Fill `#FEF3C7`):** *Masa Karantina*, *Menunggu Verifikasi*, *Inspeksi Lapangan*.
- **Danger (`#EF4444` / Light Fill `#FEE2E2`):** *Afkir*, *Kadaluarsa*, *Ditolak BPSB*, *Batch Rusak*.
- **Info (`#2563EB` / Light Fill `#EFF6FF`):** *Dalam Pengiriman*, *Sinkronisasi Data*.

## Typography

The design system exclusively utilizes **Plus Jakarta Sans**, chosen for its crisp geometric construction, high x-height, and open counters. This ensures effortless scanning across long data tables containing Indonesian administrative terminology and technical lot numbers.

### Typographic Rules
- **Numerical Regularity:** Use CSS `font-variant-numeric: tabular-nums` for all metrics, lot codes, tonnages, seed quantities, and certification dates to preserve column alignments.
- **Hierarchy Balance:** Column headers in data tables use `label-sm` in all-caps or title case with muted text (`#64748B`) to create an immediate visual boundary between table structure and table records.
- **Localization Adaptation:** Indonesian sentence structures tend to be 10–20% longer than English (e.g., "Menunggu Persetujuan Inspektur"). Component sizing and typography scales account for wrapping risks through generous horizontal spacing and tight vertical line-heights.

## Layout & Spacing

The layout is optimized for high-resolution desktop terminals (1280px to 1920px+ viewport widths), structured via a fixed vertical sidebar (260px wide) combined with a fluid data canvas.

### Layout Mechanics
- **Grid Architecture:** 12-column responsive desktop layout configured with `1.5rem` (24px) gutters and `2rem` (32px) outer canvas margins.
- **Vertical Rhythm:** 4px base modular unit. Input controls, table rows, and status badges consistently adopt 32px, 36px, 40px, or 48px component bounding heights.
- **Information Density:** Enterprise-grade compact spacing ensures that a full inspection batch (batch number, variety, germination rate, moisture percentage, producer, certification date, status, actions) is fully visible without horizontal table scrolling on standard 1080p monitors.

## Elevation & Depth

Visual hierarchy relies on structural borders combined with soft ambient light dissipation. Heavy drop shadows are strictly prohibited to retain the clean, modern dashboard aesthetic.

### Depth Hierarchy
- **Level 0 (Canvas):** `#F7F9F8` background tone, totally flat.
- **Level 1 (Workspace Cards & Tables):** `#FFFFFF` surfaces bounded by a crisp `1px solid #E2E8F0` border and reinforced by a subtle atmospheric shadow: `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)`.
- **Level 2 (Interactive Dropdowns & Toolbars):** Filter drawers, date pickers, and popovers: `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`, bounded by `#E2E8F0`.
- **Level 3 (Modal Dialogs & Confirmation Overlays):** Modal sheets (e.g., *Formulir Terbit Sertifikasi*): `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)` over a `rgba(15, 23, 42, 0.4)` backdrop blur.

## Shapes

The design system standardizes on gentle, contemporary curves (8px to 12px) to convey approachable efficiency without childish softness.

### Shape Assignment
- **Default Elements (0.5rem / 8px):** Search inputs, button controls, select dropdowns, table pagination steppers, and inline alerts.
- **Cards & Data Grids (0.75rem / 12px):** KPI metric cards, analytical charts, data tables, and batch details wrappers.
- **Pills / Full Radius (`9999px`):** Status badges (*Status Sertifikasi*), category tags, avatar status rings, and step indicators.

## Components

### Data Tables
- **Header:** Sticky top header with `#F8FAFC` background, `border-b border-[#E2E8F0]`, and `11px` bold uppercase slate text (`#64748B`).
- **Rows:** Zebra-free pure white surfaces with `1px border-b border-[#F1F5F9]`. Hover effect uses a gentle transition to `#F0FAF3` (light green tint). Row height is standardized at 52px.
- **Selection:** Checkboxes aligned vertically in the first column (`w-12`), using `#00843D` checked fill with a crisp white tick mark.
- **Pagination Footer:** Displays item count (e.g., *"Menampilkan 1-10 dari 2.450 data benih"*), page jumping dropdown, and bounded arrow buttons with disabled styling at extremities.

### Status Badges (Pills)
Constructed as `px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border`:
- **Disetujui / Lolos Uji:** Background `#DCFCE7`, text `#15803D`, border `#BBF7D0`, leading 6px solid dot indicator.
- **Menunggu Verifikasi:** Background `#FEF3C7`, text `#B45309`, border `#FDE68A`, leading 6px solid dot indicator.
- **Ditolak / Afkir:** Background `#FEE2E2`, text `#B91C1C`, border `#FECACA`, leading 6px solid dot indicator.
- **Dalam Proses:** Background `#EFF6FF`, text `#1D4ED8`, border `#BFDBFE`, leading 6px solid dot indicator.

### Statistic Metric Cards
- White container (`#FFFFFF`), `rounded-xl`, `border border-[#E2E8F0]`, `p-5`.
- **Top Row:** Metric title in `13px font-medium text-[#64748B]` paired with a top-right 40x40px icon box (`rounded-lg bg-[#F0FAF3] text-[#00843D] p-2.5`). Icons are clean 20px Lucide outlines (e.g., `Sprout`, `QrCode`, `ShieldCheck`, `Truck`).
- **Center:** Metric value rendered in `28px font-bold text-[#111827] tabular-nums`.
- **Bottom:** Comparative badge showing trend percentage and contextual label (e.g., *"+12.5% dari bulan lalu"*).

### Search & Filter Toolbars
- Unified container situated directly above data tables.
- **Search Input:** Left-aligned 360px text box with a leading Lucide `Search` icon (`#94A3B8`), placeholder text: *"Cari no. batch, varietas, atau produsen..."*. Focus ring: `2px solid #00843D` with zero shadow offset.
- **Filters:** Grouped secondary button dropdowns (`border border-[#E2E8F0] text-[#111827]`) featuring Lucide `Filter` and `ChevronDown`. Active filters show a numeric counter badge in `#00843D`.
- **Secondary Actions:** Trailing right-aligned `Export Excel/PDF` outline button and primary `+ Tambah Batch Benih` action button.

### Action Buttons
- **Primary Action (Approve / Setujui):** Solid `#00843D` background, white text, hover `#006B32`, Lucide `Check` icon prefix. Active state scale `0.98`.
- **Destructive Action (Reject / Tolak):** Ghost or outline button with `#EF4444` text and border, hover fill `#FEE2E2`, Lucide `X` icon prefix.
- **Secondary / Standard:** White background, `#E2E8F0` border, text `#334155`, hover background `#F8FAFC`.

### Breadcrumb Navigation
- Top navigation bar component positioned above page titles.
- Clean text trail (`13px text-[#64748B]`) separated by Lucide `ChevronRight` (14px, `#94A3B8`).
- Final breadcrumb item highlights the current active node in `font-medium text-[#111827]`.

### Form Inputs & Checkboxes
- **Inputs:** Height 40px, `rounded-lg`, border `1px solid #E2E8F0`, interior padding `0.75rem`, text `14px text-[#111827]`. Active state utilizes green highlight ring: `border-[#00843D] ring-2 ring-[#00843D]/20`.
- **Checkboxes:** Standard 18x18px, `rounded-[4px]`, border `1.5px solid #CBD5E1`. Checked state transitions seamlessly to `#00843D` background with white check mark.