import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <Container className="py-12">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Kynexs</h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl">
          Your project structure is ready. This is a clean, scalable Next.js
          foundation with TypeScript and App Router.
        </p>
        <div className="flex space-x-4">
          <Button variant="primary">Get Started</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </div>
    </Container>
  );
}
