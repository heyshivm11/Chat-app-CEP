
"use client";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Home,
  LogOut,
  Palette,
  Plane,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "./providers/theme-provider";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { cycleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) {
    return <main className="flex-grow">{children}</main>
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Plane className="h-8 w-8 text-primary animate-fly" />
            <span className="font-semibold text-lg">CEP Scripts</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/scripts" passHref>
                <SidebarMenuButton tooltip="Dashboard" isActive={pathname.startsWith('/scripts')}>
                  <Home />
                  <span>Scripts</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/fun" passHref>
                <SidebarMenuButton tooltip="Fun Zone" isActive={pathname.startsWith('/fun')}>
                  <Gamepad2 />
                  <span>Fun Zone</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <Button variant="ghost" onClick={cycleTheme} className="justify-start gap-2 p-2 h-auto">
            <Palette />
            <span className="group-data-[collapsible=icon]:hidden">
              Change Theme
            </span>
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="justify-start gap-2 p-2 h-auto text-red-500 hover:text-red-400 hover:bg-red-500/10">
            <LogOut />
            <span className="group-data-[collapsible=icon]:hidden">
              Logout
            </span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
