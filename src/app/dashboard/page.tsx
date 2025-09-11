
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { BarChart2, ClipboardCheck, Lightbulb, UserCheck } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';

const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Believe you can and you're halfway there.",
    "The future belongs to those who believe in the beauty of their dreams."
];

function StatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
    return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [quote, setQuote] = useState('');
    
    // In a real app, this data would come from a database or analytics service.
    const stats = {
        scriptsCopied: 42,
        mostUsedScript: "Request Stated & Verified",
        teamContribution: "78%"
    };

    useEffect(() => {
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, []);

    return (
        <div className="min-h-screen w-full gradient-background flex flex-col p-4 md:p-8">
            <header className="mb-8">
                 <h1 className="text-3xl font-bold tracking-tight text-primary">Agent Dashboard</h1>
                 <p className="text-muted-foreground">Welcome back, {user?.displayName}! Here's your performance snapshot.</p>
            </header>
            <main className="flex-grow">
                <div className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <StatCard title="Scripts Copied Today" value={stats.scriptsCopied} icon={ClipboardCheck} />
                        <StatCard title="Most Used Script" value={stats.mostUsedScript} icon={BarChart2} />
                        <StatCard title="Your Contribution" value={stats.teamContribution} icon={UserCheck} />
                    </div>

                    <Card className="glass-card">
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                            <Lightbulb className="h-6 w-6 text-primary" />
                            <CardTitle>Quote of the Day</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <blockquote className="border-l-2 pl-6 italic text-lg">
                                {quote}
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
