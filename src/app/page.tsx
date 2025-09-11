import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, BookText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-8 gradient-background">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground flex items-center justify-center gap-4">
          <BookText className="w-12 h-12 md:w-16 md:h-16" />
          Scriptify AI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Your smart library for customer service chat scripts. Instantly find, copy, and refine scripts with the power of AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <DepartmentCard
          href="/scripts/etg"
          title="ETG Scripts"
          description="Access all scripts related to the ETG department."
          icon={<Building className="w-8 h-8 text-primary" />}
        />
        <DepartmentCard
          href="/scripts/booking"
          title="Booking.com Scripts"
          description="Access all scripts related to Booking.com partnership."
          icon={<Building className="w-8 h-8 text-primary" />}
        />
      </div>
       <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        Built for professionals.
      </footer>
    </main>
  );
}

interface DepartmentCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function DepartmentCard({ href, title, description, icon }: DepartmentCardProps) {
  return (
    <Link href={href} passHref>
      <Card className="glass-card rounded-2xl h-full transition-all duration-300 hover:border-primary/60 hover:shadow-2xl hover:-translate-y-2 group">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          {icon}
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{description}</p>
          <Button variant="ghost" className="group-hover:text-primary transition-colors">
            Go to scripts <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
