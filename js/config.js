// Global Configuration
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_KEY = process.env.SUPABASE_KEY;

export const categoryMap = {
  starters: "starters",
  salad: "starters",
  sides: "starters",
  mains: "mains",
  poultry: "mains",
  fishermans_catch: "mains",
  bbq_table: "mains",
  kids_corner: "mains",
  burgers_and_sandwiches: "burgers_and_sandwiches",
  heaven_boards_family_to_share: "heaven_boards_family_to_share",
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
