import { ThemeProvider } from "../ThemeProvider";
import { ThemeToggle as ThemeToggleComponent } from "../ThemeToggle";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <ThemeToggleComponent />
      </div>
    </ThemeProvider>
  );
}
