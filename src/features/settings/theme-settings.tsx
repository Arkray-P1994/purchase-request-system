import { useTheme } from "@/components/theme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/main";
import { ModeToggle } from "@/components/toggle";
import { ConfigDrawer } from "@/components/layout/config-drawer";

const ACCENT_THEMES = [
  { id: "theme1", name: "Default", color: "#6366f1", bg: "#f1f5f9" },
  { id: "theme2", name: "Tangerine", color: "#f97316", bg: "#f1f5f9" },
  { id: "theme3", name: "Claude", color: "#f59e0b", bg: "#fffbeb" },
  { id: "theme4", name: "Amber Minimal", color: "#f59e0b", bg: "#ffffff" },
  { id: "theme5", name: "Graphite", color: "#606060", bg: "#f0f0f0" },
  { id: "theme6", name: "Mono", color: "#737373", bg: "#ffffff" },
  { id: "theme7", name: "Neo Brutalism", color: "#ff3333", bg: "#ffff00" },
  { id: "theme8", name: "Pastel Dreams", color: "#c084fc", bg: "#f3e8ff" },
  { id: "theme9", name: "Sunset Horizon", color: "#ff4d4d", bg: "#fff7ed" },
  { id: "theme10", name: "Vercel", color: "#000000", bg: "#fafafa" },
];

export function ThemeSettings() {
  const { theme, setTheme, accentTheme, setAccentTheme } = useTheme();

  return (
    <>
      <Header fixed>
        <div className="ms-auto flex items-center space-x-4">
          <ModeToggle />
          <ConfigDrawer />
        </div>
      </Header>
      <Main>
        <div className="mb-6 max-w-5xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Theme Settings</h2>
          <p className="text-muted-foreground text-sm">
            Customize the appearance and accent colors of your application.
          </p>
        </div>

        <div className="grid gap-6 max-w-5xl mx-auto">
          <Card className="shadow-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription className="text-xs">
                Switch between light and dark modes.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <RadioGroup
                defaultValue={theme}
                onValueChange={(value) => setTheme(value as any)}
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
              >
                {[
                  { id: "light", name: "Light", bg: "#ecedef" },
                  { id: "dark", name: "Dark", bg: "#09090b" },
                  { id: "system", name: "System", bg: "linear-gradient(to right, #ecedef, #09090b)" },
                ].map((item) => (
                  <div key={item.id}>
                    <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" />
                    <Label
                      htmlFor={item.id}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <div 
                        className="mb-2 h-7 w-full rounded-sm" 
                        style={{ background: item.bg }} 
                      />
                      <span className="text-xs font-medium">{item.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-lg">Accent Theme</CardTitle>
              <CardDescription className="text-xs">
                Choose a color palette for the interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <RadioGroup
                defaultValue={accentTheme}
                onValueChange={(value) => setAccentTheme(value as any)}
                className="grid grid-cols-2 md:grid-cols-5 gap-3"
              >
                {ACCENT_THEMES.map((theme) => (
                  <div key={theme.id}>
                    <RadioGroupItem value={theme.id} id={theme.id} className="peer sr-only" />
                    <Label
                      htmlFor={theme.id}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <div 
                        className="mb-2 flex h-7 w-full gap-1 rounded-sm p-1"
                        style={{ backgroundColor: `${theme.color}20` }}
                      >
                         <div className="h-full w-full rounded-[2px]" style={{ backgroundColor: theme.color }} />
                         <div className="h-full w-full rounded-[2px]" style={{ backgroundColor: theme.bg }} />
                      </div>
                      <span className="text-[10px] font-medium truncate w-full text-center">
                        {theme.name}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
