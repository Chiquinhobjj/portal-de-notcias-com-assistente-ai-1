"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Cloud,
  Droplets,
  Wind,
  DollarSign,
  Bitcoin,
  Zap,
  Activity,
  Globe,
  Calendar,
  Bot,
  User,
  LogOut,
  Settings,
  MessageSquare,
  Tv,
} from "lucide-react";
import { useTheme } from "next-themes";
import SidebarAssistant from "./SidebarAssistant";
import { UserPreferences } from "./UserPreferences";
import Image from "next/image";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const rotatingData = [
  {
    icon: <Cloud className="h-4 w-4 text-orange-500" />,
    label: "Cuiabá",
    value: "32°C",
    sublabel: "Céu limpo",
    type: "weather",
  },
  {
    icon: <TrendingDown className="h-4 w-4 text-red-500" />,
    label: "S&P 500",
    value: "5.847,21",
    change: "-0.97%",
    changeColor: "text-red-500",
    type: "market",
  },
  {
    icon: <TrendingDown className="h-4 w-4 text-red-500" />,
    label: "NASDAQ",
    value: "18.972,42",
    change: "-1.28%",
    changeColor: "text-red-500",
    type: "market",
  },
  {
    icon: <Bitcoin className="h-4 w-4 text-orange-500" />,
    label: "Bitcoin",
    value: "$67.234",
    change: "-0.11%",
    changeColor: "text-red-500",
    type: "crypto",
  },
  {
    icon: <DollarSign className="h-4 w-4 text-green-500" />,
    label: "Dólar/Real",
    value: "R$ 5,32",
    change: "+0.45%",
    changeColor: "text-green-500",
    type: "currency",
  },
  {
    icon: <DollarSign className="h-4 w-4 text-green-500" />,
    label: "Euro/Real",
    value: "R$ 5,87",
    change: "+0.32%",
    changeColor: "text-green-500",
    type: "currency",
  },
  {
    icon: <TrendingUp className="h-4 w-4 text-green-500" />,
    label: "IBOVESPA",
    value: "134.521,32",
    change: "+1.45%",
    changeColor: "text-green-500",
    type: "market",
  },
  {
    icon: <Activity className="h-4 w-4 text-red-500" />,
    label: "Petróleo Brent",
    value: "$85,42/barril",
    change: "-2.34%",
    changeColor: "text-red-500",
    type: "commodity",
  },
  {
    icon: <Activity className="h-4 w-4 text-red-500" />,
    label: "Ouro",
    value: "$2.387/oz",
    change: "-0.87%",
    changeColor: "text-red-500",
    type: "commodity",
  },
  {
    icon: <Droplets className="h-4 w-4 text-blue-500" />,
    label: "Várzea Grande",
    value: "31°C",
    sublabel: "Umidade 45%",
    type: "weather",
  },
  {
    icon: <Wind className="h-4 w-4 text-blue-400" />,
    label: "Rondonópolis",
    value: "28°C",
    sublabel: "Vento 12km/h",
    type: "weather",
  },
  {
    icon: <Bitcoin className="h-4 w-4 text-purple-500" />,
    label: "Ethereum",
    value: "$3.645",
    change: "+2.15%",
    changeColor: "text-green-500",
    type: "crypto",
  },
  {
    icon: <Zap className="h-4 w-4 text-yellow-500" />,
    label: "Energia MT",
    value: "R$ 0,87/kWh",
    sublabel: "Tarifa média",
    type: "utility",
  },
  {
    icon: <Globe className="h-4 w-4 text-blue-500" />,
    label: "Taxa Selic",
    value: "11,25%",
    sublabel: "Banco Central",
    type: "finance",
  },
  {
    icon: <Calendar className="h-4 w-4 text-purple-500" />,
    label: "Inflação (IPCA)",
    value: "4,42%",
    sublabel: "Últimos 12 meses",
    type: "finance",
  },
];

interface NewsHeaderProps {
  articles?: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    source: string;
    timestamp: string;
    sources: number;
  }>;
}

export default function NewsHeader({ articles = [] }: NewsHeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-rotate data with smooth animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentDataIndex((prev) => (prev + 1) % rotatingData.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error?.code) {
        toast.error("Erro ao sair. Tente novamente.");
      } else {
        localStorage.removeItem("bearer_token");
        refetch();
        toast.success("Você saiu da sua conta.");
        router.push("/");
      }
    } catch (error) {
      toast.error("Erro ao sair. Tente novamente.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const currentData = rotatingData[currentDataIndex];

  return (
    <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            {mounted && (
              <div className="relative h-10 w-auto">
                <Image
                  src={
                    theme === "dark"
                      ? "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ISPIAI_branco-4x-1761167472564.png"
                      : "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ISPIAI_padrao-4x-1761167472574.png"
                  }
                  alt="IspiAI Logo"
                  width={180}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
            )}
            {!mounted && (
              <div className="h-10 w-[180px] bg-muted animate-pulse rounded" />
            )}
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* IspiAI Shorts button */}
            <Link href="/shorts">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">IspiAI shorts</span>
              </Button>
            </Link>

            {/* IspiAI TV button */}
            <Link href="/tv">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Tv className="h-4 w-4" />
                <span className="hidden sm:inline">IspiAI TV</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssistantOpen(true)}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">XomanoAI</span>
            </Button>

            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="gap-2"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {theme === "dark" ? "Light" : "Dark"}
                </span>
              </Button>
            )}

            {session?.user ? (
              <>
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] flex items-center justify-center text-white text-xs font-medium">
                        {session.user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="hidden md:inline">{session.user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} disabled={isLoggingOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E]">
                    Criar Conta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Assistant Sidebar */}
      <SidebarAssistant 
        open={assistantOpen} 
        onOpenChange={setAssistantOpen}
        onFastNewsOpen={() => router.push("/shorts")}
      />
    </header>
  );
}