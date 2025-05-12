
import { supabase } from "@/integrations/supabase/client";
import { PortfolioService } from "@/types/portfolio";

export const getPortfolioServices = async (portfolioId: string): Promise<PortfolioService[]> => {
  try {
    const { data, error } = await supabase
      .from("portfolio_services")
      .select("*")
      .eq("portfolio_id", portfolioId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching portfolio services:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching portfolio services:", error);
    return [];
  }
};

export const createPortfolioService = async (service: Omit<PortfolioService, "id">): Promise<PortfolioService | null> => {
  try {
    const { data, error } = await supabase
      .from("portfolio_services")
      .insert(service)
      .select()
      .single();

    if (error) {
      console.error("Error creating portfolio service:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error creating portfolio service:", error);
    return null;
  }
};

export const updatePortfolioService = async (service: PortfolioService): Promise<PortfolioService | null> => {
  try {
    const { data, error } = await supabase
      .from("portfolio_services")
      .update(service)
      .eq("id", service.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating portfolio service:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error updating portfolio service:", error);
    return null;
  }
};

export const deletePortfolioService = async (serviceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("portfolio_services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      console.error("Error deleting portfolio service:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting portfolio service:", error);
    return false;
  }
};
