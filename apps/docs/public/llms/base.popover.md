# Base Popover

Accessible via: `/base/popover`

> TODO: Add description.

# Popover

<Showcase name="hero" />

## Animations

### Entry and exit animations

<Showcase name="transition" />

## Value based state

<Showcase name="value" />

## Signal based state

<Showcase name="signal" />

Relevant CSS:

```css
.popover-transition {
  opacity: 0;
  transition: opacity 0.3s, overlay 0.3s, display 0.3s;
  transition-behavior: allow-discrete;
}

.popover-transition:popover-open {
  opacity: 1;
}

/* @starting-style needs to be after the previous [popover]:popover-open rule
to take effect, as the specificity is the same */

@starting-style {
  .popover-transition:popover-open {
    opacity: 0;
  }
}

```

### Why no keyframe examples?

Transitions can be interrupted mid-animation. When users interact quickly (opening then immediately closing a popover), transitions smoothly reverse while keyframes must complete their full animation cycle.

