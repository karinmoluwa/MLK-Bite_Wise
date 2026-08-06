# Bite Wise — Part 1A Onboarding Foundation

A responsive Next.js implementation of the Bite Wise product foundation and two-step onboarding flow.

## Included

- Calm, modern green-and-white design system
- Responsive desktop, tablet, and mobile layouts
- Two-step onboarding with preserved form state
- Required field validation and supportive inline messages
- Soft confirmation for unusual height and weight values
- Browser-language detection with manual override
- Rotating health tips and progress indicators
- Activity level, goal, dietary preference, intolerance, and allergy severity inputs
- Clearly differentiated allergy and intolerance panels
- Skip-for-now flow with a persistent dashboard-style reminder stored in local storage
- Graceful browser capability notice without blocking core onboarding
- Firebase, Firestore, FCM, USDA, LibreTranslate, and health-platform service boundaries from the previous increment

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm run build
```

The current onboarding interaction is client-side. Firebase account creation and Firestore persistence will be connected when the relevant authentication and data workflow specifications are supplied.

## Dashboard and meal logging module

The cumulative repository now includes:

- Responsive nutrition dashboard with calorie gauge, interactive macronutrient chart, BMI summary and quick statistics
- Positive nutrition insights, culturally relevant meal recommendations, dismissible reminders and unread notifications
- Persistent Nigerian/International cuisine selection
- Image, text and voice meal-logging experiences with graceful browser fallbacks
- AI-candidate review screens with confidence values and estimated-nutrition disclosure
- Explicit meal confirmation before saving
- Favourites, recent meals, pinned meals and instant global search
- Typed meal/nutrition domain models and a replaceable analysis adapter ready for a server-side AI service

The current meal analyzer uses deterministic demonstration data so the workflow can be tested without a paid AI service. USDA, Firebase and LibreTranslate adapters remain separated under `src/services` for environment-based integration.

## Part 2 modules

This cumulative build now includes:

- Firebase Cloud Messaging category preferences
- Explicit user-nutritionist linking by invitation code, email invitation, or secure link
- User and nutritionist role views
- Nutritionist client dashboard with sorting and filtering
- Client profile sections filtered by sharing permissions
- Meal-specific and general guidance interfaces
- Immediate privacy controls with confirmation
- Dietary requirements and allergy/intolerance management
- Severe-allergy acknowledgement storage workflow
- Weekly/monthly nutrition insight views
- Responsible Simplified View
- Confirm-before-save settings workflows

The UI uses local state for demonstration. The typed models and service boundaries are ready to be connected to Firestore and Firebase custom claims.


## Reusable component library and design system

The cumulative application includes a responsive design-system workspace with reusable buttons, inputs, multi-select controls, cards, charts, feedback banners, badges, chips, progress patterns, accessibility guidance, and performance implementation notes. The palette remains predominantly green and white, with restrained blue, amber, and red semantic colours paired with text and icons so status is never communicated by colour alone.


## Final design-system increment

- 4/8px-based spacing scale with responsive margins and 12/8/4-column grids
- Radius and elevation guidance for flat, raised, and modal surfaces
- Outlined and filled icon usage rules with a rounded 2px stroke standard
- Culturally inclusive illustration guidance for onboarding, empty, success, and educational states
- Motion timings under 300ms with reduced-motion support
- A professional Product Design Document is supplied alongside the repository for design, engineering, QA, and product handoff

## Added production layers

This cumulative build now includes:

- Installable Progressive Web App support (`manifest.webmanifest`, service worker, application icons)
- Responsive desktop/tablet/mobile-browser experience
- Routed login, signup, password reset, dashboard, meal logging, settings, and nutritionist pages
- Firebase Authentication provider and protected-page guard
- Server-side USDA FoodData Central proxy endpoint
- Server-side LibreTranslate proxy endpoint
- Netlify configuration pinned to Node.js 22

### Important platform distinction

The application is an installable **PWA**: it runs in desktop and mobile browsers and can be installed on supported devices. It is not a native App Store/Play Store binary. Native distribution would require a later Capacitor, React Native, or Flutter packaging stage.

### Netlify environment variables

Add the Firebase variables from `.env.example`, plus:

```text
USDA_API_KEY=your_key
LIBRETRANSLATE_URL=https://your-libretranslate-instance.example
LIBRETRANSLATE_API_KEY=
NEXT_PUBLIC_DEMO_MODE=false
```

Never commit `.env.local`.
