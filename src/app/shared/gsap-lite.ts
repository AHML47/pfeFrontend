type Target = HTMLElement | null;
type Vars = Record<string, number | string | (() => void) | undefined>;

const asArray = (target: Target | Target[]): HTMLElement[] =>
  (Array.isArray(target) ? target : [target]).filter(Boolean) as HTMLElement[];

const tween = (target: Target | Target[], vars: Vars): void => {
  const elements = asArray(target);
  const duration = Number(vars['duration'] ?? 0.4);
  const stagger = Number(vars['stagger'] ?? 0);
  const onComplete = vars['onComplete'] as (() => void) | undefined;

  elements.forEach((el, index) => {
    const delay = stagger * index;
    const transform = `translateY(${Number(vars['y'] ?? 0)}px) scale(${Number(vars['scale'] ?? 1)}) rotateX(${Number(vars['rotateX'] ?? 0)}deg) rotateY(${Number(vars['rotateY'] ?? 0)}deg)`;

    el.animate(
      [
        { opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform },
        { opacity: `${Number(vars['opacity'] ?? 1)}`, transform }
      ],
      { duration: duration * 1000, delay: delay * 1000, fill: 'forwards', easing: 'cubic-bezier(0.22,1,0.36,1)' }
    );

    if (index === elements.length - 1 && onComplete) {
      setTimeout(() => onComplete(), (duration + delay) * 1000);
    }
  });
};

const gsap = {
  to: tween,
  quickTo: (target: Element, property: string): ((value: number) => void) => {
    const element = target as HTMLElement;
    return (value: number) => {
      if (property === 'x' || property === 'y') {
        const x = property === 'x' ? value : Number(element.dataset['qx'] ?? 0);
        const y = property === 'y' ? value : Number(element.dataset['qy'] ?? 0);
        element.dataset['qx'] = `${x}`;
        element.dataset['qy'] = `${y}`;
        element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        return;
      }
      element.style.setProperty(property, `${value}`);
    };
  },
  fromTo: (target: Target | Target[], fromVars: Vars, toVars: Vars): void => {
    asArray(target).forEach((el) => {
      el.style.opacity = `${Number(fromVars['opacity'] ?? 1)}`;
      el.style.transform = `translateY(${Number(fromVars['y'] ?? 0)}px)`;
    });
    tween(target, toVars);
  }
};

export default gsap;
