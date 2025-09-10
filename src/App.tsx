import Reports from "./pages/Reports";
import Databases from "./pages/Databases"; // Add the Databases import
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip"; // Adjust the path as needed
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"; // Adjust the path as needed
import { Toaster as Sonner } from "@/components/ui/sonner";  // Add this import, adjust the path as needed
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DataIngestion from "./pages/DataIngestion";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/data-ingestion" element={<DataIngestion />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/databases" element={<Databases />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;