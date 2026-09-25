import { Shell } from "@/components/layout/Shell";
import { NavProvider, useNav } from "@/lib/nav";
import { HistoryPage } from "@/pages/History";
import { LearnPage } from "@/pages/Learn";
import { SimulatePage } from "@/pages/Simulate";
import { StudyPage } from "@/pages/Study";

function Screen() {
  const { path } = useNav();
  if (path === "/history") return <HistoryPage />;
  if (path === "/learn") return <LearnPage />;
  if (path === "/study") return <StudyPage />;
  return <SimulatePage />;
}

export default function App() {
  return (
    <NavProvider>
      <Shell>
        <Screen />
      </Shell>
    </NavProvider>
  );
}
