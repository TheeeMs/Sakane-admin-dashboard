import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "@/features/auth";

const App = () => {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <div>
      <AppRouter />
    </div>
  );
};

export default App;
