

import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import CookieConsent from "./components/CookieConsent";
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
       <CookieConsent />
    </AuthProvider>
  );
}

export default App;