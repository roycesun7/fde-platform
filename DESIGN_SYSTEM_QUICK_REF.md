# 🎨 Design System Quick Reference

## Utility Classes Cheat Sheet

### **Animations**
```css
.animate-fade-in        /* Fade in from bottom (0.5s) */
.animate-slide-in       /* Slide in from left (0.5s) */
.animate-scale-in       /* Scale in from 95% (0.3s) */
.animate-float          /* Gentle floating (3s loop) */

/* Stagger delays for sequential animations */
.stagger-1              /* 0.1s delay */
.stagger-2              /* 0.2s delay */
.stagger-3              /* 0.3s delay */
.stagger-4              /* 0.4s delay */
.stagger-5              /* 0.5s delay */
.stagger-6              /* 0.6s delay */
```

### **Visual Effects**
```css
.gradient-mesh          /* Multi-color gradient background */
.glass                  /* Glass morphism with blur */
.hover-lift             /* Lift on hover with shadow */
.shadow-glow            /* Purple glow */
.shadow-glow-green      /* Green glow */
.shadow-glow-red        /* Red glow */
.shadow-glow-yellow     /* Yellow glow */
.text-gradient          /* Purple-to-pink gradient text */
```

### **Layout**
```css
.grid-background        /* Subtle grid pattern */
.section-spacing        /* py-16 md:py-24 lg:py-32 */
.container-ramp         /* Max-width container with padding */
.separator-line         /* Clean horizontal divider */
```

---

## Common Patterns

### **Hero Section**
```jsx
<div className="relative -mx-6 px-6 py-8 gradient-mesh animate-fade-in">
  <h1 className="text-5xl font-bold tracking-tight">Title</h1>
  <p className="text-muted-foreground text-lg">Description</p>
</div>
```

### **Card with Hover Effect**
```jsx
<Card className="hover-lift hover:shadow-xl transition-all duration-300">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### **Staggered Grid**
```jsx
<div className="grid grid-cols-4 gap-6">
  {items.map((item, i) => (
    <div 
      key={item.id}
      className={`animate-fade-in stagger-${Math.min(i + 1, 6)}`}
      style={{ opacity: 0 }}
    >
      <Card>...</Card>
    </div>
  ))}
</div>
```

### **Icon Container**
```jsx
<div className="p-2 bg-primary/10 rounded-lg">
  <Icon className="h-5 w-5 text-primary" />
</div>
```

### **Gradient Button**
```jsx
<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
  Action
</Button>
```

### **Live Indicator**
```jsx
<div className="flex items-center gap-2">
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
  </span>
  <span className="text-sm text-muted-foreground">Live</span>
</div>
```

### **Loading State**
```jsx
<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse">
  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
</div>
```

### **Color-Coded Badge**
```jsx
<Badge className="bg-red-500/10 text-red-700 border-red-200">
  High Priority
</Badge>
```

---

## Color Palette

### **Semantic Colors**
```css
/* Success */
.text-green-600
.bg-green-500/10
.border-green-200

/* Error */
.text-red-700
.bg-red-500/10
.border-red-200

/* Warning */
.text-yellow-700
.bg-yellow-500/10
.border-yellow-200

/* Info */
.text-blue-700
.bg-blue-500/10
.border-blue-200

/* AI/Premium */
.text-purple-600
.bg-purple-500/10
.border-purple-200
```

---

## Typography Scale

```css
text-xs      /* 12px - labels, captions */
text-sm      /* 14px - body text, descriptions */
text-base    /* 16px - default body */
text-lg      /* 18px - large body, subtitles */
text-xl      /* 20px - section headings */
text-2xl     /* 24px - card headings */
text-3xl     /* 30px - page subtitles */
text-4xl     /* 36px - page titles */
text-5xl     /* 48px - hero titles */
```

---

## Spacing Scale

```css
gap-1.5      /* 6px - tight inline spacing */
gap-2        /* 8px - badges, tags */
gap-3        /* 12px - buttons, form elements */
gap-4        /* 16px - card content */
gap-6        /* 24px - card grid */
gap-8        /* 32px - section spacing */
gap-12       /* 48px - major sections */
```

---

## Shadow Scale

```css
shadow-sm    /* Subtle - inputs, badges */
shadow-md    /* Standard - cards */
shadow-lg    /* Elevated - hover states */
shadow-xl    /* Prominent - modals */
```

---

## Border Radius

```css
rounded      /* 4px - sharp, modern */
rounded-md   /* 6px - slightly softer */
rounded-lg   /* 8px - cards, containers */
rounded-full /* Pills, circles */
```

---

## Quick Component Recipes

### **Metric Card**
```jsx
<Card className="relative overflow-hidden hover-lift">
  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16"></div>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-4xl font-bold tracking-tight">123</p>
    <p className="text-sm text-muted-foreground mt-1">subtitle</p>
  </CardContent>
</Card>
```

### **Search Input**
```jsx
<div className="relative flex-1">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
  <Input
    placeholder="Search..."
    className="pl-12 h-12 text-base bg-background shadow-sm"
  />
</div>
```

### **Empty State**
```jsx
<div className="text-center py-16 space-y-4">
  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
    <Icon className="h-8 w-8 text-muted-foreground" />
  </div>
  <div>
    <p className="text-lg font-medium">No items found</p>
    <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
  </div>
</div>
```

---

## Best Practices

### **DO ✅**
- Use `hover-lift` on interactive cards
- Add `transition-all duration-300` for smooth effects
- Use semantic colors (green/red/yellow)
- Include loading states with spinners
- Add empty states with helpful messages
- Use staggered animations for lists
- Apply gradient mesh to hero sections
- Use icon containers with colored backgrounds

### **DON'T ❌**
- Don't use animations longer than 500ms
- Don't stack too many effects
- Don't use pure black (#000) - use foreground color
- Don't forget hover states on interactive elements
- Don't use rounded-full on cards (use rounded-lg)
- Don't skip loading states
- Don't use small touch targets on mobile

---

## Responsive Breakpoints

```css
/* Mobile First */
sm:   /* 640px  - small tablets */
md:   /* 768px  - tablets */
lg:   /* 1024px - laptops */
xl:   /* 1280px - desktops */
2xl:  /* 1536px - large desktops */
```

### **Common Responsive Patterns**
```jsx
/* Grid */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"

/* Text Size */
className="text-4xl lg:text-5xl"

/* Padding */
className="p-6 md:p-8 lg:p-10"

/* Hide/Show */
className="hidden lg:flex"
```

---

## Accessibility

### **Focus States**
All interactive elements have visible focus rings:
```css
focus-visible:outline-ring
focus-visible:ring-2
```

### **Color Contrast**
- Text: Minimum 4.5:1 contrast ratio
- Interactive elements: Minimum 3:1 contrast ratio

### **Motion**
Respects `prefers-reduced-motion` for accessibility

---

## Performance Tips

1. **Use transform & opacity** for animations (GPU accelerated)
2. **Avoid animating** width, height, top, left
3. **Use will-change** sparingly
4. **Debounce** search inputs
5. **Lazy load** images and heavy components
6. **Memoize** expensive calculations

---

*Keep this handy for quick reference when building new features!* 🚀

