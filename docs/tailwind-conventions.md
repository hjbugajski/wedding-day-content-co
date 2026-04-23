# Tailwind conventions

How we write Tailwind classes in this repo. Optimized for AI-agent review: grouped by semantic concern, diff-friendly. The formatter (oxfmt) does the sorting; this doc governs the structure around it.

## Stack

- Tailwind CSS v4 with CSS-first config in `src/app/(site)/globals.css` (`@theme`, `@custom-variant`, `@utility`).
- Class merging via `cn()` at `src/utils/cn.ts`, which wraps `clsx` + an `extendTailwindMerge`-configured `twMerge`.
- Variant builders via `class-variance-authority` (`cva`, `VariantProps`).
- Formatter: **oxfmt** (`.oxfmtrc.json`). Its `sortTailwindcss` sorts classes inside each string argument of `cn`, `cva`, and `class`/`className` attributes, resolving custom tokens from `globals.css`. Argument boundaries and comments between arguments are preserved across runs.

## When to use the grouped pattern

**Trust the formatter.** If the whole class expression fits on one line within oxfmt's print width, keep it as a single flat string. Only split into a multi-string array when the line would otherwise wrap.

| Site                                                                            | Format                                                                                           |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Fits on one line after format                                                   | Single flat string                                                                               |
| Doesn't fit — 6–15 classes OR mixes 2+ state types (hover + data-\* + disabled) | Grouped array — one string per semantic concern, no comments                                     |
| `cva` `base` that's long OR variant values that are themselves dense            | Grouped array for `base`; short variant values stay single strings                               |
| Conditional classes                                                             | Object syntax — `cn('base', { 'cls-a cls-b': condition })` — never `&&` or ternary into a string |

Rule of thumb: if oxfmt collapses your multi-string array back onto a single line, you should have written a single string to begin with. The array form is only useful when the lines are forced to wrap — that's when per-concern grouping pays off for review.

The array boundaries themselves are the grouping signal. Do not label categories with `// Layout`, `// Typography`, etc. — the classes in the string make the category obvious. Comments are reserved for non-obvious _why_, not for restating _what_.

### Module-level class constants

A class chain stored in a `const` should be wrapped in `cn()` (or `cva()` if it has variants), not held as a raw string. oxfmt's `sortTailwindcss` only runs inside the configured function call sites (`cn`, `cva`) and attributes (`class`, `className`); raw string literals are skipped. The Tailwind IntelliSense extension follows the same list.

```ts
// Preferred
const navButtonClasses = cn([
  'inline-flex h-7 w-7 items-center justify-center',
  'rounded-xs bg-transparent p-0',
  'hover:bg-neutral-200',
]);

// Do NOT do this — no sort, no autocomplete
const navButtonClasses =
  'inline-flex h-7 w-7 items-center justify-center rounded-xs bg-transparent p-0 hover:bg-neutral-200';
```

## Category order

Groups appear top-to-bottom in this order. Skip any group you don't need.

1. **Layout** — `absolute`, `relative`, `fixed`, `sticky`, `z-*`, `isolate`, `inset-*`, `top/right/bottom/left-*`, `overflow-*`, `flex`, `grid`, `gap-*`, `items-*`, `justify-*`, `place-*`, `grid-cols-*`, `grid-rows-*`, `col-span-*`, `row-span-*`, `order-*`, `basis-*`, `grow`, `shrink`
2. **Sizing** — `w-*`, `h-*`, `size-*`, `min-w-*`, `max-w-*`, `min-h-*`, `max-h-*`
3. **Spacing** — `p-*`, `m-*`, `space-*`
4. **Typography** — `text-*`, `font-*`, `leading-*`, `tracking-*`, `whitespace-*`, `break-*`, `line-clamp-*`, `uppercase`, `underline`, `decoration-*`, `subheading`
5. **Visual** — `bg-*`, `from-*`, `via-*`, `to-*`, `border-*`, `rounded-*`, `ring-*`, `outline-*`, `divide-*`, `shadow-*`, `opacity-*`, `backdrop-*`, `blur-*`, `translate-*`, `rotate-*`, `scale-*`, `skew-*`
6. **Motion** — `transition*`, `duration-*`, `ease-*`, `delay-*`, `animate-*`
7. **Interactive** — `cursor-*`, `pointer-events-*`, `select-*`, `touch-*`, `resize-*`, and the base state modifiers `hover:*`, `focus-visible:*`, `active:*`, `disabled:*`, `aria-invalid:*`
8. **State** — `data-[state=*]`, `data-highlighted`, `data-disabled`, `data-popup-open`, `data-starting-style:*`, `data-ending-style:*`, `data-[swipe-direction=*]`, `group-*:*`, `peer-*:*`, `aria-[...]`. When a component has multiple _concerns_ within state (enter/exit, swipe, stacking), give each concern its own string — separation in the array is the signal.
9. **Responsive** — `xs:*`, `sm:*`, `md:*`, `md-lg:*`, `lg:*`, `xl:*`, `2xl:*`. Inline next to the base class when sparse (≤2 overrides in that group). Promote to its own section when ≥3 overrides appear together.
10. **Dark** — `dark:*`. Same inline-vs-section rule as Responsive.
11. **Children selectors** — `[&_svg]:*`, `[&>div]:*`, arbitrary attribute selectors like `[[open]]:*`. Always last.

oxfmt sorts classes within each string to Tailwind's canonical order. The array entries describe the semantic buckets, not a fixed internal sequence.

## Examples

### cva base

```ts
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'w-full xs:w-fit',
    'font-semibold uppercase no-underline!',
    'rounded-sm',
    'transition',
    'cursor-pointer focus-visible:ring-2 focus-visible:ring-neutral-400/75 focus-visible:outline-hidden',
    'disabled:cursor-not-allowed disabled:border-y-2 disabled:border-t-neutral-100 disabled:border-b-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-400',
  ],
  { variants: { ... } },
);
```

### cn with dense state variants

```ts
className={cn(
  'absolute inset-x-0 top-0 z-[calc(1000-var(--toast-index))]',
  'w-full',
  'surface-card rounded-md bg-neutral-50',
  'transition-[transform,opacity] duration-300 ease-out',
  'data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0',
  'data-swiping:transition-none data-[swipe-direction=right]:translate-x-(--swipe-movement-x) data-[swipe-direction=down]:translate-y-(--swipe-movement-y)',
  'data-expanded:translate-y-(--toast-offset-y) data-behind:opacity-0 data-limited:opacity-0',
  className,
)}
```

### Conditional classes — object syntax

```ts
// Preferred
cn('base class list', {
  'font-light text-neutral-600': modifiers.outside,
  'bg-dusty-rose-100': modifiers.selected,
});

// Do NOT do this
cn('base class list', condition && 'some-class');
cn('base class list', condition ? 'a' : 'b');
```

Ternaries are acceptable only when both branches are meaningful classes and the intent is "switch between A and B", not "add A when X". When in doubt, use the object form.

## Shared utilities

Repeated class chains live in `src/app/(site)/globals.css` as `@utility` declarations, not as TS constants. Current shared utilities:

- `focus-ring-input` — focus ring used by form fields and buttons (neutral-400/75)
- `focus-ring-link` — focus ring used by links and link-like controls (black/75, dark-aware)
- `surface-card` — the shadow + ring surface treatment for cards, panels, marquee items
- `surface-overlay` — the border + shadow frame for popovers, dropdowns, and toasts
- `form-field-frame` — border + shadow + hover/focus states without shape or fill (for checkboxes, radios, select triggers that need custom shape/bg)
- `form-field-base` — composes `form-field-frame` and adds `rounded-sm bg-neutral-50` + hover bg; use on `input`, `textarea`, `select` triggers

Use these by class name. Because they're real CSS utilities, they're safe to combine with Tailwind utilities and are properly deduplicated by tailwind-merge thanks to `cn.ts`'s config.

## tailwind-merge custom classes

`cn.ts` uses `extendTailwindMerge` to teach tailwind-merge about our custom classes so conflicts dedupe correctly. Anything in these categories MUST be registered in `cn.ts`:

- Custom `@utility` redefines of Tailwind class names (our `font-thin`/`font-extralight`/`font-light`/`font-normal`/`font-medium`/`font-semibold`/`font-bold` font-variation-settings overrides)
- Custom `@utility` text-shadow utilities (`t-shadow-sm`/`t-shadow-md`/`t-shadow-lg`) — these share a conceptual group and conflict with each other
- The `subheading` utility — compounds `font-weight` + `tracking` + `text-transform`, so it must be grouped with the related Tailwind classes it can conflict with
- Custom breakpoints from `@theme`: `xxs`, `xs`, `md-lg` — must be declared as additional screens

When adding a new `@utility` that shadows or overlaps a Tailwind class group, update `cn.ts`.

## Anti-patterns

- Splitting a 3-class string into three groups. The threshold table exists for a reason.
- `// Layout`, `// Typography`, `// Misc` — any category label comment. Array separation is the grouping; restating the obvious is noise. Comments in class authoring are reserved for non-obvious _why_ (e.g. explaining why a variant exists, not what the classes do).
- Mixing concerns inside a labeled bucket (`// Layout` containing `p-4`).
- `&&` or ternary expressions that evaluate to class-name strings. Use object syntax.
- Inventing a new `@utility` for a chain used in only one or two places. Keep it inline.
- Adding `dark:*` to a component expecting global dark-mode — our dark mode is **class-scoped** (`@custom-variant dark (&:where(.dark, .dark *))` in `globals.css:3`). It only applies inside an ancestor with `class="dark"`.
- Using `cva` when no variant axis has more than one value. That's not a variant, it's a class constant — inline it or promote to an `@utility`.
