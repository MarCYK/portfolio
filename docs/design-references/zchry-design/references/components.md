# zchry-design — Components

## 1. Buttons

| Variant | Background | Text | Border | Radius | Height |
|------|------|------|------|------|------|
| Primary | var(--accent) | #FFFFFF | none | 8px | 40px |
| Secondary | transparent | var(--text1) | 1px solid var(--border-visible) | 8px | 40px |
| Ghost | transparent | var(--text2) | none | 8px | 36px |
| Destructive | #EF4444 | #FFFFFF | none | 8px | 40px |

States:
- Hover: background shifts to surface3 for non-primary, brand darkens for primary.
- Active: 0.98 visual compression via darker tone.
- Focus: 2px outline on accent.
- Disabled: opacity 0.4.

## 2. Cards / Surfaces

Standard card:
- Background var(--surface1)
- Border 1px solid var(--border)
- Radius 12px
- Padding 40px desktop, 24px mobile

Featured card:
- Same base, optional accent border-top 1px.

Compact card:
- 12px radius, 16px padding.

## 3. Inputs

Text input:

| Property | Value |
|------|------|
| Height | 40px |
| Background | var(--surface1) |
| Border default | 1px solid var(--border) |
| Border focus | 1px solid var(--border-visible) |
| Border error | 1px solid var(--error) |
| Radius | 8px |
| Padding | 10px 12px |

Textarea:
- Same style, min-height 120px.

Select:
- Input shell + right caret icon.

## 4. Lists / Rows

Standard row:
- Min-height 56px
- Padding 20px 0
- Divider 1px solid var(--border)
- Label text2, value text1

Selected row:
- background var(--surface2)

## 5. Navigation

Top nav link:
- Idle color rgba white 0.5 in dark mode
- Active/hover text1
- No underline

Mobile nav:
- 24px semibold links
- 1px separators
- Fullscreen panel over background

Tab bar:
- Height 44px + safe area
- Active text1
- Inactive text3

## 6. Tags / Chips

| Property | Value |
|------|------|
| Height | 24px |
| Padding | 4px 10px |
| Radius | 999px |
| Border | 1px solid var(--border) |
| Font | 12px/1 Soehne 600 |

Status variants:
- Success: success over success-bg tint
- Warning: warning over warning-bg tint
- Error: error over error-bg tint

## 7. Overlays

Modal:
- Surface1 background
- 12px radius
- Border 1px solid var(--border)
- Backdrop rgba(0,0,0,0.45)

Bottom sheet:
- Surface1
- Top radius 12px
- Handle 36x4, border-visible tone

Dropdown/popover:
- Surface1, 12px radius, border 1px var(--border)
- Item height 36px

## 8. State patterns

Empty state:
- Icon/line motif + concise heading + one primary action.

Loading:
- Skeleton bars on surface2, no shimmer by default.

Error:
- Inline caption in error color.
- Block-level alert with subtle error tint.

Disabled:
- Opacity 0.4.
- No hover state.

## 9. Toggle / Switch (derived)

| Property | Value |
|------|------|
| Track | 36x20 |
| Track radius | 999px |
| Thumb | 14x14 |
| Thumb offset | 3px |
| Off bg | var(--surface3) |
| On bg | var(--accent) |

## 10. Checkbox (derived)

| Property | Value |
|------|------|
| Size | 16px |
| Radius | 4px |
| Border | 1px solid var(--border-visible) |
| Checked bg | var(--accent) |
| Checkmark | 2px white stroke |

## 11. Radio (derived)

| Property | Value |
|------|------|
| Size | 16px |
| Border | 1px solid var(--border-visible) |
| Dot | 8px var(--accent) |

## 12. Slider (derived)

| Property | Value |
|------|------|
| Track height | 4px |
| Track bg | var(--surface3) |
| Filled bg | var(--accent) |
| Thumb | 16px circle, text1 |
