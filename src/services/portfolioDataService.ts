import { supabase } from "@/integrations/supabase/client";
import { ExtendedPortfolioData } from "@/types/portfolio";
import { toast } from "sonner";
import { savePortfolioData as savePortfolioToDatabase, exportPortfolioToPDF, sharePortfolio } from "@/services/portfolioService";

// Temp storage for local development
let localStorageKey = "portfolio_data";

// Save portfolio data (uses Supabase database or local storage as fallback)
export const savePortfolioData = async (portfolio: ExtendedPortfolioData): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user) {
      // Save to Supabase
      return await savePortfolioToDatabase(portfolio);
    } else {
      // Fallback to local storage
      localStorage.setItem(localStorageKey, JSON.stringify(portfolio));
      return "local";
    }
  } catch (error) {
    console.error("Error saving portfolio data:", error);
    // Fallback to local storage
    localStorage.setItem(localStorageKey, JSON.stringify(portfolio));
    return "local";
  }
};

// Get portfolio data (tries Supabase first, then local storage)
export const getPortfolioData = (): ExtendedPortfolioData | null => {
  try {
    const localData = localStorage.getItem(localStorageKey);
    if (localData) {
      return JSON.parse(localData);
    }
    return null;
  } catch (error) {
    console.error("Error getting portfolio data:", error);
    return null;
  }
};

// Export functions (re-exporting from portfolioService.ts)
export { exportPortfolioToPDF, sharePortfolio };