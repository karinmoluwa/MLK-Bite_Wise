/*
 * Bite Wise additional food catalogue
 *
 * IMPORTANT:
 * - Calories and macronutrients in this file are estimates.
 * - Macronutrients are estimated from calorie distribution by food category.
 * - These records are marked estimated: true so they are not presented
 *   as exact laboratory/USDA values.
 */

type MacroCategory =
  | "Protein"
  | "Carbohydrates"
  | "Fat"
  | "Mixed";

type EstimatedMacros = {
  protein: number;
  carbohydrates: number;
  fat: number;
  fibre: number;
};

function estimateMacros(
  name: string,
  calories: number
): EstimatedMacros {
  const food = name.toLowerCase();

  let proteinPercent = 0.15;
  let carbPercent = 0.50;
  let fatPercent = 0.35;
  let fibre = 4;

  /* PURE / MOSTLY CARBOHYDRATE FOODS */
  if (
    food.includes("eba") ||
    food.includes("fufu") ||
    food.includes("poundo") ||
    food.includes("semovita") ||
    food.includes("semolina") ||
    food.includes("tuwo") ||
    food.includes("swallow") ||
    food.includes("starch") ||
    food.includes("amala") ||
    food.includes("custard") ||
    food.includes("basmati") ||
    food.includes("cornflakes") ||
    food.includes("couscous")
  ) {
    proteinPercent = 0.07;
    carbPercent = 0.84;
    fatPercent = 0.09;
    fibre = food.includes("amala") || food.includes("oat")
      ? 6
      : 3;
  }

  /* RICE / PASTA / NOODLE MEALS */
  if (
    food.includes("rice") ||
    food.includes("spaghetti") ||
    food.includes("pasta") ||
    food.includes("noodle") ||
    food.includes("macaroni")
  ) {
    proteinPercent = 0.14;
    carbPercent = 0.62;
    fatPercent = 0.24;
    fibre = 4;
  }

  /* BEAN-BASED FOODS */
  if (
    food.includes("bean") ||
    food.includes("akara") ||
    food.includes("moin moin") ||
    food.includes("moi moi") ||
    food.includes("gbegiri") ||
    food.includes("hummus") ||
    food.includes("adalu") ||
    food.includes("ewa")
  ) {
    proteinPercent = 0.22;
    carbPercent = 0.48;
    fatPercent = 0.30;
    fibre = 8;
  }

  /* MEAT / FISH / HIGH-PROTEIN FOODS */
  if (
    food.includes("suya") ||
    food.includes("steak") ||
    food.includes("chicken") ||
    food.includes("beef") ||
    food.includes("goat") ||
    food.includes("catfish") ||
    food.includes("fish") ||
    food.includes("kilishi") ||
    food.includes("pepper soup") ||
    food.includes("asun")
  ) {
    proteinPercent = 0.48;
    carbPercent = 0.10;
    fatPercent = 0.42;
    fibre = 1;
  }

  /* OILY MEAT DISHES */
  if (
    food.includes("nkwobi") ||
    food.includes("isiewu")
  ) {
    proteinPercent = 0.30;
    carbPercent = 0.08;
    fatPercent = 0.62;
    fibre = 1;
  }

  /* VEGETABLE / LEAFY SOUPS */
  if (
    food.includes("edikang") ||
    food.includes("afang") ||
    food.includes("oha") ||
    food.includes("bitterleaf") ||
    food.includes("okra") ||
    food.includes("ewedu")
  ) {
    proteinPercent = 0.28;
    carbPercent = 0.18;
    fatPercent = 0.54;
    fibre = 7;
  }

  /* HEAVY NIGERIAN SOUPS */
  if (
    food.includes("egusi") ||
    food.includes("ogbono") ||
    food.includes("banga")
  ) {
    proteinPercent = 0.22;
    carbPercent = 0.16;
    fatPercent = 0.62;
    fibre = 6;
  }

  /* PLANTAIN / YAM */
  if (
    food.includes("plantain") ||
    food.includes("dodo") ||
    food.includes("yam") ||
    food.includes("asaro") ||
    food.includes("bole") ||
    food.includes("boli")
  ) {
    proteinPercent = 0.08;
    carbPercent = 0.65;
    fatPercent = 0.27;
    fibre = 5;
  }

  /* BAKED / FRIED SNACKS */
  if (
    food.includes("pie") ||
    food.includes("puff") ||
    food.includes("chin chin") ||
    food.includes("croissant") ||
    food.includes("danish") ||
    food.includes("samosa") ||
    food.includes("spring roll") ||
    food.includes("sausage roll") ||
    food.includes("gala")
  ) {
    proteinPercent = 0.11;
    carbPercent = 0.53;
    fatPercent = 0.36;
    fibre = 2;
  }

  /* BURGER / SHAWARMA / SANDWICH / PIZZA */
  if (
    food.includes("burger") ||
    food.includes("shawarma") ||
    food.includes("sandwich") ||
    food.includes("pizza") ||
    food.includes("hot dog")
  ) {
    proteinPercent = 0.22;
    carbPercent = 0.40;
    fatPercent = 0.38;
    fibre = 3;
  }

  /* SALADS */
  if (
    food.includes("salad") ||
    food.includes("coleslaw")
  ) {
    proteinPercent = 0.10;
    carbPercent = 0.30;
    fatPercent = 0.60;
    fibre = 5;
  }

  /* OATS */
  if (food.includes("oat")) {
    proteinPercent = 0.16;
    carbPercent = 0.67;
    fatPercent = 0.17;
    fibre = 5;
  }

  /* GUACAMOLE / AVOCADO */
  if (
    food.includes("guacamole") ||
    food.includes("avocado")
  ) {
    proteinPercent = 0.07;
    carbPercent = 0.18;
    fatPercent = 0.75;
    fibre = 4;
  }

  const protein = Math.round(
    (calories * proteinPercent) / 4
  );

  const carbohydrates = Math.round(
    (calories * carbPercent) / 4
  );

  const fat = Math.round(
    (calories * fatPercent) / 9
  );

  return {
    protein,
    carbohydrates,
    fat,
    fibre,
  };
}

const estimatedMeal = (
  id: string,
  name: string,
  calories: number,
  serving: string,
  cuisine:
    | "Nigerian Cuisine"
    | "International Cuisine",
  aliases: string[] = [],
  macroCategory: MacroCategory = "Mixed"
) => {
  const macros = estimateMacros(
    name,
    calories
  );

  return {
    id,
    name,
    cuisine,
    serving,
    aliases,
    macroCategory,
    estimated: true,
    confidence: 90,

    nutrients: {
      calories,
      protein: macros.protein,
      carbohydrates:
        macros.carbohydrates,
      fat: macros.fat,
      fibre: macros.fibre,
    },

    allergens: [] as string[],
    intolerances: [] as string[],
  };
};

/* =========================================================
   50 NIGERIAN FOODS
   ========================================================= */

export const nigerianFoods = [
  estimatedMeal(
    "ng-pounded-yam-nsala",
    "Pounded Yam & Nsala Soup",
    650,
    "1 medium lump of yam + 1 bowl of soup with 2 pieces of meat",
    "Nigerian Cuisine",
    ["pounded yam", "nsala", "white soup"]
  ),

  estimatedMeal(
    "ng-amala-abula",
    "Amala & Abula (Ewedu + Gbegiri + Stew)",
    550,
    "1 medium lump of amala + mixed soups and assorted meat",
    "Nigerian Cuisine",
    ["amala", "abula", "ewedu", "gbegiri"]
  ),

  estimatedMeal(
    "ng-banga-starch",
    "Banga Soup with Starch",
    720,
    "1 bowl of banga soup + 1 medium lump of cassava starch",
    "Nigerian Cuisine",
    ["banga", "starch", "palm fruit soup"]
  ),

  estimatedMeal(
    "ng-ogbono-fufu",
    "Ogbono Soup with Fufu",
    680,
    "1 bowl of ogbono soup + 1 medium lump of fufu",
    "Nigerian Cuisine",
    ["ogbono", "fufu", "draw soup"]
  ),

  estimatedMeal(
    "ng-tuwo-miyan-kuka",
    "Tuwo Shinkafa & Miyan Kuka",
    500,
    "1 medium lump of tuwo + 1 bowl of miyan kuka",
    "Nigerian Cuisine",
    ["tuwo", "tuwo shinkafa", "miyan kuka"]
  ),

  estimatedMeal(
    "ng-edikang-ikong",
    "Edikang Ikong Soup",
    420,
    "1 bowl with assorted meat, excluding swallow",
    "Nigerian Cuisine",
    ["edikang ikong", "vegetable soup"]
  ),

  estimatedMeal(
    "ng-afang",
    "Afang Soup",
    450,
    "1 bowl with seafood/meat, excluding swallow",
    "Nigerian Cuisine",
    ["afang", "afang soup"]
  ),

  estimatedMeal(
    "ng-oha",
    "Oha Soup",
    380,
    "1 bowl, excluding swallow",
    "Nigerian Cuisine",
    ["oha", "ora", "oha soup", "ora soup"]
  ),

  estimatedMeal(
    "ng-bitterleaf",
    "Bitterleaf Soup (Ofe Onugbu)",
    390,
    "1 bowl, excluding swallow",
    "Nigerian Cuisine",
    ["bitterleaf", "ofe onugbu", "onugbu"]
  ),

  estimatedMeal(
    "ng-okra",
    "Okra Soup (Ila Alasepo)",
    220,
    "1 bowl of low-oil okra soup with seafood/meat",
    "Nigerian Cuisine",
    ["okra", "ila alasepo", "okro"]
  ),

  estimatedMeal(
    "ng-ewedu",
    "Ewedu Soup (Plain)",
    70,
    "1 standard bowl without stew or meat",
    "Nigerian Cuisine",
    ["ewedu", "jute leaves"]
  ),

  estimatedMeal(
    "ng-gbegiri",
    "Gbegiri Soup (Plain)",
    150,
    "1 standard bowl",
    "Nigerian Cuisine",
    ["gbegiri", "bean soup"]
  ),

  estimatedMeal(
    "ng-eba-standard",
    "Eba (Yellow/White Cassava)",
    320,
    "1 medium-sized ball",
    "Nigerian Cuisine",
    ["eba", "garri", "gari"]
  ),

  estimatedMeal(
    "ng-wheat-swallow",
    "Wheat Swallow",
    280,
    "1 medium-sized ball",
    "Nigerian Cuisine",
    ["wheat", "wheat swallow"]
  ),

  estimatedMeal(
    "ng-semovita",
    "Semovita / Semolina",
    340,
    "1 medium-sized ball",
    "Nigerian Cuisine",
    ["semo", "semolina", "semovita"]
  ),

  estimatedMeal(
    "ng-oatmeal-swallow",
    "Oatmeal Swallow",
    290,
    "1 medium-sized ball",
    "Nigerian Cuisine",
    ["oat swallow", "oats swallow", "oatmeal"]
  ),

  estimatedMeal(
    "ng-plantain-fufu",
    "Plantain Fufu",
    260,
    "1 medium-sized ball",
    "Nigerian Cuisine",
    ["plantain fufu", "plantain swallow"]
  ),

  estimatedMeal(
    "ng-ofada-ayamase",
    "Ofada Rice with Ayamase Stew",
    620,
    "1 standard plate + 2 scoops of stew with assorted meat",
    "Nigerian Cuisine",
    ["ofada", "ayamase", "designer stew"]
  ),

  estimatedMeal(
    "ng-coconut-rice",
    "Coconut Rice",
    510,
    "1 standard plate",
    "Nigerian Cuisine",
    ["coconut rice"]
  ),

  estimatedMeal(
    "ng-fried-rice",
    "Fried Rice (Nigerian Style)",
    480,
    "1 standard plate",
    "Nigerian Cuisine",
    ["fried rice", "nigerian fried rice", "party fried rice"]
  ),

  estimatedMeal(
    "ng-white-rice-stew",
    "White Rice & Tomato Stew",
    550,
    "1 standard plate + 2 ladles of stew with beef",
    "Nigerian Cuisine",
    ["white rice", "rice and stew", "tomato stew"]
  ),

  estimatedMeal(
    "ng-ewa-aganyin",
    "Ewa Aganyin",
    420,
    "1 standard plate",
    "Nigerian Cuisine",
    ["ewa aganyin", "ewa agoyin", "beans"]
  ),

  estimatedMeal(
    "ng-adalu",
    "Beans & Corn (Adalu)",
    380,
    "1 standard plate",
    "Nigerian Cuisine",
    ["adalu", "beans and corn", "beans and maize"]
  ),

  estimatedMeal(
    "ng-beans-plantain",
    "White Beans & Plantain Porridge",
    440,
    "1 standard plate",
    "Nigerian Cuisine",
    ["beans and plantain", "bean porridge"]
  ),

  estimatedMeal(
    "ng-masa",
    "Masa (Hausa Rice Cakes)",
    290,
    "3 pieces",
    "Nigerian Cuisine",
    ["masa", "rice cakes", "hausa masa"]
  ),

  estimatedMeal(
    "ng-tuwo-masara",
    "Tuwo Masara",
    360,
    "1 medium lump",
    "Nigerian Cuisine",
    ["tuwo masara", "corn swallow"]
  ),

  estimatedMeal(
    "ng-asaro",
    "Yam Porridge (Asaro)",
    450,
    "1 deep plate",
    "Nigerian Cuisine",
    ["asaro", "yam porridge", "yam pottage"]
  ),

  estimatedMeal(
    "ng-boli-fish",
    "Boli (Roasted Plantain) with Grilled Fish",
    480,
    "1 medium roasted plantain + 1 medium piece of grilled fish",
    "Nigerian Cuisine",
    ["boli", "bole", "roasted plantain", "plantain and fish"]
  ),

  estimatedMeal(
    "ng-dodo",
    "Fried Plantain (Dodo)",
    300,
    "1 medium plantain, about 8–10 slices",
    "Nigerian Cuisine",
    ["dodo", "fried plantain"]
  ),

  estimatedMeal(
    "ng-yam-egg",
    "Boiled Yam with Egg Sauce",
    520,
    "2 medium yam slices + 2-egg sauce",
    "Nigerian Cuisine",
    ["yam and egg", "boiled yam", "egg sauce"]
  ),

  estimatedMeal(
    "ng-ji-abani",
    "Ji Abani (Roasted Yam with Palm Oil Sauce)",
    410,
    "3 slices roasted yam + small palm-oil dip",
    "Nigerian Cuisine",
    ["ji abani", "roasted yam", "yam and palm oil"]
  ),

  estimatedMeal(
    "ng-ukwa",
    "Ukwa (African Breadfruit Porridge)",
    460,
    "1 medium bowl",
    "Nigerian Cuisine",
    ["ukwa", "breadfruit", "african breadfruit"]
  ),

  estimatedMeal(
    "ng-beef-suya",
    "Beef Suya",
    320,
    "4–5 strips / about 150 g",
    "Nigerian Cuisine",
    ["suya", "beef suya"]
  ),

  estimatedMeal(
    "ng-asun",
    "Asun (Spicy Roasted Goat Meat)",
    380,
    "1 small plate / about 150 g",
    "Nigerian Cuisine",
    ["asun", "goat meat", "spicy goat"]
  ),

  estimatedMeal(
    "ng-nkwobi",
    "Nkwobi",
    450,
    "1 traditional bowl",
    "Nigerian Cuisine",
    ["nkwobi", "cow foot"]
  ),

  estimatedMeal(
    "ng-isiewu",
    "Isiewu (Spicy Goat Head)",
    480,
    "1 small plate",
    "Nigerian Cuisine",
    ["isiewu", "isi ewu", "goat head"]
  ),

  estimatedMeal(
    "ng-catfish-pepper-soup",
    "Catfish Pepper Soup",
    250,
    "1 large bowl with 1–2 catfish chunks",
    "Nigerian Cuisine",
    ["catfish", "pepper soup", "fish pepper soup"]
  ),

  estimatedMeal(
    "ng-assorted-pepper-soup",
    "Assorted Meat Pepper Soup",
    210,
    "1 large bowl",
    "Nigerian Cuisine",
    ["assorted pepper soup", "meat pepper soup", "offal"]
  ),

  estimatedMeal(
    "ng-chicken-suya",
    "Chicken Suya",
    260,
    "4–5 skewers",
    "Nigerian Cuisine",
    ["chicken suya", "suya chicken"]
  ),

  estimatedMeal(
    "ng-kilishi",
    "Kilishi (Nigerian Beef Jerky)",
    350,
    "1 large sheet / about 100 g",
    "Nigerian Cuisine",
    ["kilishi", "beef jerky"]
  ),

  estimatedMeal(
    "ng-akara",
    "Akara (Bean Cakes)",
    280,
    "4 medium balls",
    "Nigerian Cuisine",
    ["akara", "bean cake", "bean cakes"]
  ),

  estimatedMeal(
    "ng-moi-moi",
    "Moin Moin",
    210,
    "1 medium leaf wrap or ramekin",
    "Nigerian Cuisine",
    ["moi moi", "moin moin", "bean pudding"]
  ),

  estimatedMeal(
    "ng-puff-puff",
    "Puff Puff",
    270,
    "3 medium balls",
    "Nigerian Cuisine",
    ["puff puff", "puffpuff"]
  ),

  estimatedMeal(
    "ng-chin-chin",
    "Chin Chin",
    440,
    "1 small cup / about 100 g",
    "Nigerian Cuisine",
    ["chin chin", "chinchin"]
  ),

  estimatedMeal(
    "ng-bole-groundnuts",
    "Bole (Roasted Plantain) with Groundnuts",
    410,
    "1 small roasted plantain + 1 handful groundnuts",
    "Nigerian Cuisine",
    ["bole", "boli", "roasted plantain and groundnut"]
  ),

  estimatedMeal(
    "ng-corn-ube",
    "Roasted Corn & Native Pear (Ube)",
    310,
    "1 medium corn cob + 3 medium ube",
    "Nigerian Cuisine",
    ["roasted corn", "ube", "native pear", "corn and pear"]
  ),

  estimatedMeal(
    "ng-abacha",
    "Abacha (African Salad)",
    390,
    "1 medium plate",
    "Nigerian Cuisine",
    ["abacha", "african salad"]
  ),

  estimatedMeal(
    "ng-meat-pie",
    "Meat Pie (Nigerian Style)",
    380,
    "1 medium pie",
    "Nigerian Cuisine",
    ["meat pie", "nigerian meat pie"]
  ),

  estimatedMeal(
    "ng-fura-nono",
    "Fura da Nono",
    340,
    "1 medium bowl",
    "Nigerian Cuisine",
    ["fura", "nono", "fura da nono"]
  ),

  estimatedMeal(
    "ng-gala",
    "Gala / Sausage Roll",
    290,
    "1 standard packaged sausage roll",
    "Nigerian Cuisine",
    ["gala", "sausage roll"]
  ),
];

/* =========================================================
   EXTRA SWALLOW REFERENCE
   1 PORTION = 1 STANDARD WRAP
   ========================================================= */

export const swallowFoods = [
  estimatedMeal(
    "swallow-starch",
    "Starch (Cassava Starch with Palm Oil)",
    420,
    "1 standard wrap",
    "Nigerian Cuisine",
    ["starch", "cassava starch"]
  ),

  estimatedMeal(
    "swallow-semo",
    "Semovita / Semolina - Standard Wrap",
    360,
    "1 standard wrap",
    "Nigerian Cuisine",
    ["semo", "semovita", "semolina"]
  ),

  estimatedMeal(
    "swallow-poundo",
    "Poundo Yam (Flour Blend)",
    340,
    "1 standard wrap",
    "Nigerian Cuisine",
    ["poundo", "poundo yam"]
  ),

  estimatedMeal(
    "swallow-fufu",
    "Fufu (Akpu / Santana)",
    330,
    "1 standard wrap",
    "Nigerian Cuisine",
    ["fufu", "akpu", "santana"]
  ),

  estimatedMeal(
    "swallow-yellow-eba",
    "Eba - Yellow Garri",
    320,
    "1 standard wrap",
    "Nigerian Cuisine",
    ["yellow eba", "yellow garri", "yellow gari"]
  ),

  estimatedMeal(
    "swallow-white-eba",
    "Eba - White Garri",
    300,
    "1 standard wrap",
    "Nigerian Cuisine",
    ["white eba", "white garri", "white gari"]
  ),

  estimatedMeal(
    "swallow-amala",
    "Amala (Dudu / Yam Flour)",
    270,
    "1 standard wrap",
    "Nigerian Cuisine",
    ["amala", "amala dudu", "yam flour"]
  ),
];

/* =========================================================
   30 INTERNATIONAL / IMPORTED FOODS
   ========================================================= */

export const internationalFoods = [
  estimatedMeal(
    "intl-noodles",
    "Instant Noodles (e.g. Indomie)",
    380,
    "1 standard cooked 70–80 g pack, plain",
    "International Cuisine",
    ["indomie", "instant noodles", "noodles"]
  ),

  estimatedMeal(
    "intl-spaghetti",
    "Spaghetti Bolognese / Pasta Stir-fry",
    520,
    "1 standard deep plate",
    "International Cuisine",
    ["spaghetti", "bolognese", "pasta", "stir fry pasta"]
  ),

  estimatedMeal(
    "intl-mac-cheese",
    "Macaroni and Cheese",
    490,
    "1 medium scoop",
    "International Cuisine",
    ["mac and cheese", "macaroni", "macaroni cheese"]
  ),

  estimatedMeal(
    "intl-lasagna",
    "Lasagna",
    610,
    "1 standard rectangular slice",
    "International Cuisine",
    ["lasagna", "lasagne"]
  ),

  estimatedMeal(
    "intl-shawarma",
    "Shawarma (Nigerian Style)",
    650,
    "1 standard wrapped roll",
    "International Cuisine",
    ["shawarma", "chicken shawarma", "beef shawarma"]
  ),

  estimatedMeal(
    "intl-hummus",
    "Hummus",
    160,
    "3 tablespoons / about 50 g",
    "International Cuisine",
    ["hummus", "chickpea dip"]
  ),

  estimatedMeal(
    "intl-greek-salad",
    "Greek Salad",
    240,
    "1 medium bowl",
    "International Cuisine",
    ["greek salad", "feta salad"]
  ),

  estimatedMeal(
    "intl-burger",
    "Burger (Beef / Chicken)",
    540,
    "1 standard single-patty burger, without fries",
    "International Cuisine",
    ["burger", "beef burger", "chicken burger", "hamburger"]
  ),

  estimatedMeal(
    "intl-pizza",
    "Pizza",
    280,
    "1 medium slice",
    "International Cuisine",
    ["pizza", "pizza slice"]
  ),

  estimatedMeal(
    "intl-fries",
    "French Fries / Irish Chips",
    365,
    "1 medium portion / about 100 g",
    "International Cuisine",
    ["fries", "french fries", "chips", "irish chips"]
  ),

  estimatedMeal(
    "intl-hot-dog",
    "Hot Dog",
    290,
    "1 standard sausage in a bun, plain",
    "International Cuisine",
    ["hot dog", "hotdog"]
  ),

  estimatedMeal(
    "intl-pancakes",
    "Waffles & Pancakes",
    310,
    "2 standard pancakes or 1 waffle, before syrup",
    "International Cuisine",
    ["waffle", "waffles", "pancake", "pancakes"]
  ),

  estimatedMeal(
    "intl-croissant",
    "Croissant / Danish Pastry",
    340,
    "1 medium pastry",
    "International Cuisine",
    ["croissant", "danish", "pastry"]
  ),

  estimatedMeal(
    "intl-chinese-fried-rice",
    "Fried Rice (Chinese Style)",
    410,
    "1 standard plate",
    "International Cuisine",
    ["chinese fried rice", "fried rice"]
  ),

  estimatedMeal(
    "intl-spring-samosa",
    "Spring Roll & Samosa",
    210,
    "1 spring roll + 1 samosa",
    "International Cuisine",
    ["spring roll", "samosa", "small chops"]
  ),

  estimatedMeal(
    "intl-stir-fry",
    "Stir-fry Chicken / Beef",
    320,
    "1 medium bowl",
    "International Cuisine",
    ["stir fry", "chicken stir fry", "beef stir fry"]
  ),

  estimatedMeal(
    "intl-gyoza",
    "Fried Dumplings / Gyoza",
    260,
    "4 pieces",
    "International Cuisine",
    ["dumplings", "gyoza", "fried dumplings"]
  ),

  estimatedMeal(
    "intl-steak",
    "Steak (Ribeye / T-Bone)",
    450,
    "1 cooked cut / about 200 g",
    "International Cuisine",
    ["steak", "ribeye", "t bone", "t-bone"]
  ),

  estimatedMeal(
    "intl-mashed-potatoes",
    "Mashed Potatoes",
    240,
    "1 standard scoop / cup",
    "International Cuisine",
    ["mashed potato", "mashed potatoes"]
  ),

  estimatedMeal(
    "intl-coleslaw",
    "Coleslaw",
    210,
    "1 small side bowl",
    "International Cuisine",
    ["coleslaw", "slaw"]
  ),

  estimatedMeal(
    "intl-potato-salad",
    "Potato Salad",
    320,
    "1 small side bowl",
    "International Cuisine",
    ["potato salad"]
  ),

  estimatedMeal(
    "intl-wings",
    "Barbecue Chicken Wings",
    380,
    "4 medium wings",
    "International Cuisine",
    ["chicken wings", "bbq wings", "barbecue wings"]
  ),

  estimatedMeal(
    "intl-club-sandwich",
    "Club Sandwich",
    510,
    "1 full sandwich",
    "International Cuisine",
    ["club sandwich", "sandwich"]
  ),

  estimatedMeal(
    "intl-oatmeal",
    "Oatmeal / Rolled Oats",
    150,
    "1 cooked bowl from about 40 g dry oats, before milk/sugar",
    "International Cuisine",
    ["oatmeal", "oats", "rolled oats"]
  ),

  estimatedMeal(
    "intl-cornflakes",
    "Cornflakes / Processed Cereal",
    140,
    "1 bowl / about 35 g dry, before milk",
    "International Cuisine",
    ["cornflakes", "corn flakes", "cereal"]
  ),

  estimatedMeal(
    "intl-custard",
    "Custard (Powdered)",
    120,
    "1 standard cooked bowl, before milk/sugar",
    "International Cuisine",
    ["custard", "powdered custard"]
  ),

  estimatedMeal(
    "intl-couscous",
    "Couscous",
    200,
    "1 standard cooked side cup",
    "International Cuisine",
    ["couscous"]
  ),

  estimatedMeal(
    "intl-basmati",
    "Basmati Rice",
    205,
    "1 standard cooked cup, plain",
    "International Cuisine",
    ["basmati", "basmati rice"]
  ),

  estimatedMeal(
    "intl-guacamole",
    "Guacamole",
    90,
    "2 tablespoons",
    "International Cuisine",
    ["guacamole", "avocado dip"]
  ),

  estimatedMeal(
    "intl-chili",
    "Chili con Carne / Chili Beans",
    340,
    "1 medium bowl",
    "International Cuisine",
    ["chili", "chilli con carne", "chili beans"]
  ),
];

/* =========================================================
   OILS — PER TABLESPOON
   These are reference ingredients rather than full meals.
   ========================================================= */

export type OilReference = {
  id: string;
  name: string;
  serving: string;
  calories: number;
  primaryFatType: string;
  smokePoint: string;
  bestUse: string;
};

export const oilReferences: OilReference[] = [
  {
    id: "oil-vegetable",
    name: "Vegetable Oil (Palm Olein / Groundnut)",
    serving: "1 tablespoon",
    calories: 120,
    primaryFatType: "Balanced saturated / monounsaturated fats",
    smokePoint: "230°C / 446°F",
    bestUse:
      "Deep frying foods such as dodo or akara and high-heat Nigerian cooking.",
  },
  {
    id: "oil-sunflower",
    name: "Sunflower Oil",
    serving: "1 tablespoon",
    calories: 120,
    primaryFatType: "Polyunsaturated fat (Omega-6)",
    smokePoint: "232°C / 450°F",
    bestUse:
      "Baking, light stir-fries and pastry preparation.",
  },
  {
    id: "oil-olive",
    name: "Olive Oil (Extra Virgin)",
    serving: "1 tablespoon",
    calories: 119,
    primaryFatType: "Monounsaturated fat (oleic acid)",
    smokePoint: "190°C / 374°F",
    bestUse:
      "Drizzling, salads and lower-heat sautéing.",
  },
];

/* =========================================================
   SPICES / SEASONINGS
   Values below use the spoon weights and calorie estimates
   supplied for the Bite Wise reference catalogue.
   ========================================================= */

export type SpiceReference = {
  id: string;
  tier: 1 | 2 | 3 | 4;
  tierName: string;
  name: string;
  approximateWeightGrams: number;
  calories: number;
};

export const spiceReferences: SpiceReference[] = [
  {
    id: "spice-ogiri",
    tier: 1,
    tierName: "Heavy Pastes & Condiments",
    name: "Ogiri (Fermented Paste)",
    approximateWeightGrams: 14,
    calories: 42,
  },
  {
    id: "spice-seasoning-cube",
    tier: 1,
    tierName: "Heavy Pastes & Condiments",
    name: "Seasoning Cube (Crushed)",
    approximateWeightGrams: 12,
    calories: 35,
  },

  {
    id: "spice-garlic-powder",
    tier: 2,
    tierName: "Aromatic Roots & Moist Seeds",
    name: "Garlic Powder",
    approximateWeightGrams: 9,
    calories: 29,
  },
  {
    id: "spice-ehuru",
    tier: 2,
    tierName: "Aromatic Roots & Moist Seeds",
    name: "Ehuru (African Nutmeg)",
    approximateWeightGrams: 5.5,
    calories: 28,
  },
  {
    id: "spice-iru",
    tier: 2,
    tierName: "Aromatic Roots & Moist Seeds",
    name: "Iru (Locust Beans - Moist)",
    approximateWeightGrams: 10.5,
    calories: 26,
  },

  {
    id: "spice-cumin",
    tier: 3,
    tierName: "Standard Ground Powders & Seafood",
    name: "Cumin (Ground)",
    approximateWeightGrams: 6,
    calories: 22,
  },
  {
    id: "spice-crayfish",
    tier: 3,
    tierName: "Standard Ground Powders & Seafood",
    name: "Ground Crayfish",
    approximateWeightGrams: 6,
    calories: 21,
  },
  {
    id: "spice-curry-powder",
    tier: 3,
    tierName: "Standard Ground Powders & Seafood",
    name: "Curry Powder",
    approximateWeightGrams: 6.3,
    calories: 20,
  },
  {
    id: "spice-curry-masala",
    tier: 3,
    tierName: "Standard Ground Powders & Seafood",
    name: "Curry Masala",
    approximateWeightGrams: 6,
    calories: 19,
  },
  {
    id: "spice-ginger",
    tier: 3,
    tierName: "Standard Ground Powders & Seafood",
    name: "Ginger Powder",
    approximateWeightGrams: 5.4,
    calories: 18,
  },
  {
    id: "spice-atare",
    tier: 3,
    tierName: "Standard Ground Powders & Seafood",
    name: "Atare (Alligator Pepper)",
    approximateWeightGrams: 5.5,
    calories: 18,
  },
  {
    id: "spice-cayenne",
    tier: 3,
    tierName: "Standard Ground Powders & Seafood",
    name: "Cayenne (Ata Gunrun)",
    approximateWeightGrams: 5.3,
    calories: 17,
  },
  {
    id: "spice-cameroon-pepper",
    tier: 3,
    tierName: "Standard Ground Powders & Seafood",
    name: "Cameroon Pepper",
    approximateWeightGrams: 5,
    calories: 16,
  },
  {
    id: "spice-coriander",
    tier: 3,
    tierName: "Standard Ground Powders & Seafood",
    name: "Coriander (Ground)",
    approximateWeightGrams: 5,
    calories: 15,
  },

  {
    id: "spice-thyme",
    tier: 4,
    tierName: "Light Fluffy Herbs",
    name: "Thyme (Dried Leaves)",
    approximateWeightGrams: 4,
    calories: 11,
  },
];

/* =========================================================
   COMPLETE ADDITIONAL SEARCHABLE MEAL CATALOGUE
   ========================================================= */

export const additionalMeals = [
  ...nigerianFoods,
  ...swallowFoods,
  ...internationalFoods,
];

/*
 * Oil and spice reference search helpers.
 * These can later be displayed in an Ingredient Reference card.
 */

export const ingredientReferences = {
  oils: oilReferences,
  spices: spiceReferences,
};