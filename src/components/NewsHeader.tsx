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
} from "lucide-react";
import { useTheme } from "next-themes";
import SidebarAssistant from "./SidebarAssistant";
import { UserPreferences } from "./UserPreferences";
import { FastNews } from "./FastNews";
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
  const [fastNewsOpen, setFastNewsOpen] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <div className="relative w-24 md:w-32 h-8 md:h-10">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Ativo-6-4x-1761161927495.png"
                  alt="IspiAI"
                  fill
                  className="object-contain object-left dark:hidden"
                  priority
                />
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ISPIAI_branco-4x-1761161927239.png"
                  alt="IspiAI"
                  fill
                  className="object-contain object-left hidden dark:block"
                  priority
                />
              </div>
            </Link>

            {/* CTA Buttons - XomanoAI e IspiAI em 30s */}
            <div className="flex-1 flex items-center justify-center gap-2 md:gap-3">
              <Button
                size="sm"
                className="shadow-md hover:shadow-lg transition-all gap-1 md:gap-2 bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] hover:from-[#0C4A6E] hover:to-[#0EA5E9] text-xs md:text-sm px-2 md:px-4"
                onClick={() => setAssistantOpen(true)}
              >
                <Bot className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">XomanoAI</span>
              </Button>
              
              <Button
                size="sm"
                className="shadow-md hover:shadow-lg transition-all gap-1 md:gap-2 bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] hover:from-[#0C4A6E] hover:to-[#0EA5E9] text-xs md:text-sm px-2 md:px-4"
                onClick={() => setFastNewsOpen(true)}
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                <span className="hidden sm:inline">IspiAI em 30s</span>
              </Button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-8 w-8 md:h-10 md:w-10"
              >
                <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <UserPreferences />

              {/* Auth UI */}
              {isPending ? (
                <div className="h-8 w-8 md:h-10 md:w-10 flex items-center justify-center">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full p-0"
                    >
                      <Avatar className="h-8 w-8 md:h-10 md:w-10">
                        <AvatarFallback className="bg-gradient-to-br from-[#0EA5E9] to-[#0C4A6E] text-white font-semibold text-xs md:text-sm">
                          {getUserInitials(session.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/login")}
                    className="h-8 md:h-10 text-xs md:text-sm"
                  >
                    Entrar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => router.push("/register")}
                    className="h-8 md:h-10 bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] hover:from-[#0C4A6E] hover:to-[#0EA5E9] text-xs md:text-sm"
                  >
                    Criar Conta
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rotating Data Ticker */}
        <div className="border-t bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30">
          <div className="container mx-auto px-4 py-2.5 overflow-hidden">
            <div className="flex items-center justify-center gap-4">
              <div
                className={`flex items-center gap-2.5 transition-all duration-300 ${
                  isAnimating
                    ? "opacity-0 scale-95 translate-y-2"
                    : "opacity-100 scale-100 translate-y-0"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {currentData.icon}
                  <span className="font-semibold text-sm">{currentData.label}</span>
                </div>
                
                <div className="h-4 w-px bg-border" />
                
                <span className="font-bold text-sm">{currentData.value}</span>
                
                {currentData.change && (
                  <>
                    <span className={`font-semibold text-sm ${currentData.changeColor}`}>
                      {currentData.change}
                    </span>
                  </>
                )}
                
                {currentData.sublabel && (
                  <>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {currentData.sublabel}
                    </span>
                  </>
                )}
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-1 ml-3">
                {rotatingData.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentDataIndex
                        ? "bg-gradient-to-r from-[#0EA5E9] to-[#0C4A6E] w-8"
                        : "bg-muted-foreground/20 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <SidebarAssistant 
        open={assistantOpen} 
        onOpenChange={setAssistantOpen}
        onFastNewsOpen={() => setFastNewsOpen(true)}
      />
      
      <FastNews
        articles={articles}
        isOpen={fastNewsOpen}
        onClose={() => setFastNewsOpen(false)}
      />
    </>
  );
}