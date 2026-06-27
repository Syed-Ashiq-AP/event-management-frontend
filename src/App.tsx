import { Route, BrowserRouter, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login";
import { SignUpPage } from "./pages/signup";
import { HomePage } from "./pages/homePage";
import { Header } from "@/components/header";
import { UserProvider } from "@/hooks/use-user";
import { EventsPage } from "./pages/eventsPage";
import { OrganizePage } from "./pages/organizePage";
import { CertificatesPage } from "./pages/certificatesPage";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/organize" element={<OrganizePage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
