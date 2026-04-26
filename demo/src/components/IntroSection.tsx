import { Cpu, Palette, ChevronRight } from 'lucide-solid';
import { Badge } from '../../../lib/ui/Badge';
import { Button } from '../../../lib/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../lib/ui/Card';

interface IntroSectionProps {
  onGetStarted: () => void;
}

export const IntroSection = (props: IntroSectionProps) => {
  return (
    <section class="space-y-6">
      <Badge variant="outline" class="text-primary border-primary/20 bg-primary/5">
        Documentation
      </Badge>
      <h1 class="text-5xl font-extrabold tracking-tight leading-[1.1]">
        Precision components for <span class="gradient-text">technical teams</span>.
      </h1>
      <p class="text-xl text-muted leading-relaxed max-w-2xl">
        Starling UI is a meticulously crafted component library for SolidJS, optimized for
        data-heavy interfaces. It emphasizes precision, accessibility, and professional
        aesthetics.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <Card class="bg-panel/30 border-dashed">
          <CardHeader>
            <Cpu size={24} class="text-primary mb-2" />
            <CardTitle>Performance First</CardTitle>
            <CardDescription>
              Zero-cost abstractions and built-in tree shaking ensure minimal bundle sizes.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card class="bg-panel/30 border-dashed">
          <CardHeader>
            <Palette size={24} class="text-primary mb-2" />
            <CardTitle>Multiple Presets</CardTitle>
            <CardDescription>
              Switch between several theme presets with zero configuration, optimized for
              all technical scenarios.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div class="pt-10 flex gap-4">
        <Button onClick={props.onGetStarted}>
          Get Started <ChevronRight size={16} class="ml-2" />
        </Button>
        <Button
          variant="secondary"
          as="a"
          href="https://github.com/StarlingCityDevelopment/starling-components"
        >
          GitHub Repository
        </Button>
      </div>
    </section>
  );
};
