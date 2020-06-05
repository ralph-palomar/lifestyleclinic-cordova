export const api = {
    users_api_base_url: process.env.REACT_APP_USERS_API_BASE_URL,
    users_api_authorization: process.env.REACT_APP_USERS_API_AUTHORIZATION,
    users_api_timeout: 10000
};

export const cookieSettings = {
    path: process.env.REACT_APP_HOME_PAGE,
    secure: process.env.REACT_APP_COOKIES_SECURE,
    sameSite: process.env.REACT_APP_COOKIES_SAMESITE
}

export const defaultImg = "data:image/png;base64,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";

export const illnesses = [
    "Anxiety&/Depression",
    "Cancer",
    "Chronic Kidney Disease",
    "Diabetes Mellitus",
    "Fatty liver",
    "Gouty Arthritis",
    "Hypertension",
    "Myocardial Infarction/Heart Attack",
    "Obesity/Weight Problems",
    "PCOS",
    "Stress/Burnout",
    "Stroke"
]

export const diet_list = [
    { 
        displayText: "Whole grains", 
        id: "diet_wholegrains" 
    },
    {
        displayText: "Fruits",
        id: "diet_fruits"
    },
    {
        displayText: "Vegetables",
        id: "diet_vegetables"
    },
    {
        displayText: "Beans/legumes",
        id: "diet_beans_legumes"
    },
    {
        displayText: "Nuts",
        id: "diet_nuts"
    },
    {
        displayText: "Seeds",
        id: "diet_seeds"
    },
    {
        displayText: "Water",
        id: "diet_water",
    },
    {
        displayText: "Meat (other than fish)",
        id: "diet_meat_notfish"
    },
    {
        displayText: "Egg",
        id: "diet_egg"
    },
    {
        displayText: "Soda",
        id: "diet_soda"
    },
    {
        displayText: "Milk",
        id: "diet_milk"
    },
    {
        displayText: "Chips",
        id: "diet_chips"
    },
    {
        displayText: "Fried Food",
        id: "diet_friedfood"
    },
    {
        displayText: "Cakes/pastries/crackers",
        id: "diet_cakes_pastries_crackers"
    },
    {
        displayText: "Chocolate",
        id: "diet_choc"
    },
    {
        displayText: "Bread",
        id: "diet_bread"
    },
    {
        displayText: "Cheese",
        id: "diet_cheese"
    },
    {
        displayText: "Fast food",
        id: "diet_fastfood"
    },
    {
        displayText: "Caffeinated drink",
        id: "diet_caff_drink"
    },
    {
        displayText: "Instant noodles",
        id: "diet_inst_nood"
    },
    {
        displayText: "Canned goods",
        id: "diet_can_goods"
    },
    {
        displayText: "Dairy-based dressing",
        id: "diet_dairy_dressing"
    },
    {
        displayText: "White rice",
        id: "diet_whiterice"
    },
    {
        displayText: "Fish",
        id: "diet_fish"
    },
    {
        displayText: "Other seafoods",
        id: "diet_other_seafoods"
    }
]

export const tobacco_use_0_options = [
    "Non-smoker",
    "Current smoker",
    "Past smoker"
]

export const emotional_being_options = [ 5, 4, 3, 2, 1 ]

export const login_cookie = "webapp-lifestyleclinic-login-0";

export const emailRegExp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const defaultEmailSender = "LifestyleClinic@tes8.link";