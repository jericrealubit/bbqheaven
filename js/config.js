// Global Configuration
export const SUPABASE_URL = window.BBQ_CONFIG.SUPABASE_URL;
export const SUPABASE_KEY = window.BBQ_CONFIG.SUPABASE_KEY;

export const categoryMap = {
  starters: "starters",
  mains: "mains",
  bbq_table: "bbq_table",
  kids_corner: "kids_corner",
  white_wine: "drinks",
  red_wine: "drinks",
  sparkling_wines: "drinks",
  spirits_liquor_shots: "drinks",
  beer: "drinks",
  tap_beers: "drinks",
  soft_drinks_cans: "drinks",
  juices: "drinks",
  cocktails_and_mocktails: "drinks",
};

/**
 * We export a function or a getter to ensure 'supabase' is defined
 * when it is actually called by other modules.
 */
export const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// If the client fails to initialize here, we can export a helper to get it
export const getSupabaseClient = () => {
  if (window.supabase) {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  console.error("Supabase SDK not loaded yet.");
  return null;
};
