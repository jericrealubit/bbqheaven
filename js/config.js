// 1. Safe Access to Environment Variables
// Provides fallbacks to prevent the app from crashing locally
const env = window.env || {
  SUPABASE_URL: "",
  SUPABASE_KEY: "",
};

export const supabaseConfig = {
  url: env.SUPABASE_URL,
  key: env.SUPABASE_KEY,
};

// 2. Category Mapping
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
 * Helper to initialize the client.
 * We use supabaseConfig.url/key to ensure variables are correctly scoped.
 */
export const getSupabaseClient = () => {
  if (window.supabase) {
    if (!supabaseConfig.url || !supabaseConfig.key) {
      console.warn(
        "Supabase Config missing. Check Netlify Environment Variables.",
      );
      return null;
    }
    return window.supabase.createClient(supabaseConfig.url, supabaseConfig.key);
  }
  console.error(
    "Supabase SDK not loaded. Ensure the script tag is in your HTML.",
  );
  return null;
};

// Export the instance immediately if possible
export const supabase = getSupabaseClient();
