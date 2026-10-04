import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Divider from "@/components/ui/Divider";
import BackgroundGlow from "@/components/background/BackgroundGlow";
import GridBackground from "@/components/background/GridBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen pt-[80px]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundGlow position="top-right" color="lime" intensity="medium" />
        <BackgroundGlow position="bottom-left" color="purple" intensity="medium" />
        <GridBackground opacity={0.02} />
      </div>

      <Container className="py-20 relative z-10">
        <div className="space-y-20">
          {/* Hero Section */}
          <section className="text-center space-y-8">
            <h1 className="text-display font-heading font-bold text-text-primary">
              KYNEKS <span className="text-lime">PHASE 1</span>
            </h1>
            <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
              Design System & Global Layout Foundation
            </p>
          </section>

          {/* Buttons Section */}
          <section className="space-y-6">
            <h2 className="text-h2 font-heading font-semibold text-text-primary">Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Primary Small</Button>
              <Button variant="primary" size="md">Primary Medium</Button>
              <Button variant="primary" size="lg">Primary Large</Button>
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="ghost" size="md">Ghost</Button>
              <Button variant="outline" size="md">Outline</Button>
              <Button variant="danger" size="md">Danger</Button>
              <Button variant="primary" size="md" isLoading>Loading</Button>
              <Button variant="primary" size="md" disabled>Disabled</Button>
            </div>
          </section>

          <Divider variant="solid" />

          {/* Inputs Section */}
          <section className="space-y-6">
            <h2 className="text-h2 font-heading font-semibold text-text-primary">Inputs</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
              <Input label="Default Input" placeholder="Enter text..." />
              <Input label="With Error" error="This field is required" placeholder="Enter text..." />
              <Input label="With Success" success="Available" placeholder="Enter text..." />
              <Input label="Disabled" disabled placeholder="Cannot edit" />
            </div>
          </section>

          <Divider variant="gradient" />

          {/* Cards Section */}
          <section className="space-y-6">
            <h2 className="text-h2 font-heading font-semibold text-text-primary">Cards</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <div className="p-6 space-y-4">
                  <h3 className="text-h3 font-heading font-semibold text-text-primary">Default Card</h3>
                  <p className="text-body text-text-muted">Hover to see the effect</p>
                  <Button variant="primary" size="sm">Action</Button>
                </div>
              </Card>
              <Card variant="elevated">
                <div className="p-6 space-y-4">
                  <h3 className="text-h3 font-heading font-semibold text-text-primary">Elevated Card</h3>
                  <p className="text-body text-text-muted">Slightly darker surface</p>
                  <Button variant="secondary" size="sm">Action</Button>
                </div>
              </Card>
              <Card variant="bordered">
                <div className="p-6 space-y-4">
                  <h3 className="text-h3 font-heading font-semibold text-text-primary">Bordered Card</h3>
                  <p className="text-body text-text-muted">Thicker border</p>
                  <Button variant="outline" size="sm">Action</Button>
                </div>
              </Card>
            </div>
          </section>

          {/* Badges Section */}
          <section className="space-y-6">
            <h2 className="text-h2 font-heading font-semibold text-text-primary">Badges</h2>
            <div className="flex flex-wrap gap-4">
              <Badge variant="live">LIVE</Badge>
              <Badge variant="open">OPEN</Badge>
              <Badge variant="upcoming">UPCOMING</Badge>
              <Badge variant="full">FULL</Badge>
              <Badge variant="completed">COMPLETED</Badge>
              <Badge variant="default">DEFAULT</Badge>
            </div>
          </section>

          {/* Typography Section */}
          <section className="space-y-6">
            <h2 className="text-h2 font-heading font-semibold text-text-primary">Typography</h2>
            <div className="space-y-4">
              <p className="text-display font-heading font-bold">Display Text</p>
              <p className="text-h1 font-heading font-bold">Heading 1</p>
              <p className="text-h2 font-heading font-semibold">Heading 2</p>
              <p className="text-h3 font-heading font-semibold">Heading 3</p>
              <p className="text-h4 font-heading font-semibold">Heading 4</p>
              <p className="text-body-lg">Body Large - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-body">Body - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-body-sm">Body Small - Lorem ipsum dolor sit amet.</p>
              <p className="text-caption">Caption text</p>
              <p className="text-label">Label text</p>
            </div>
          </section>

          {/* Gradient Text */}
          <section className="space-y-6">
            <h2 className="text-h2 font-heading font-semibold text-text-primary">Gradient Text</h2>
            <p className="text-display font-heading font-bold text-gradient">
              GRADIENT TEXT EFFECT
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
