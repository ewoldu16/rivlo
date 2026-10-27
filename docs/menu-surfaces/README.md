# Rivlo shared gradient surfaces

The approved Scores card treatment now applies across Favourites, Tracker, Feed, More/settings, search, NBA Explorer, onboarding, game panels, comparison dialogs and player/play detail overlays.

Team-related surfaces use existing team colours. Matchups blend both sides and fade downward. Single-team cards use that team's colour on both sides. Surfaces with no verified team colour use slate. The approved 28.9% / 25.5% colour mixes remain unchanged, retaining the previous 15% reduction. No gradient animation was added.

Surface tokens and the surface selector list are centralised in `src/design/scores-tokens.json`. `src/design/menu-surfaces.css` defines shared painting only. The existing generator includes both homepage and menu styles in `src/app/sports-home.css`. `teamSurfaceStyle` binds existing colour data without requesting anything.

Layouts, dimensions, spacing, typography, navigation, accents, polling, data handling and storage remain owned by their existing components. The Scores homepage treatment is unchanged.

## Screenshots

390px and 1440px captures are available below. NBA context screenshots use existing ESPN response fixtures; unavailable fields remain unavailable. Screenshots do not establish current live NBA results.

| Screen | Mobile | Desktop |
| --- | --- | --- |
| Favourites | [390px](after-favourites-390.png) | [1440px](after-favourites-1440.png) |
| My Tracker | [390px](after-tracker-populated-390.png) | [1440px](after-tracker-populated-1440.png) |
| Feed | [390px](after-feed-390.png) | [1440px](after-feed-1440.png) |
| More | [390px](after-more-390.png) | [1440px](after-more-1440.png) |
| NBA teams | [390px](after-directory-390.png) | [1440px](after-directory-1440.png) |
| Team overview | [390px](after-team-390.png) | [1440px](after-team-1440.png) |
| Standings | [390px](after-standings-390.png) | [1440px](after-standings-1440.png) |
| Player profile | [390px](after-player-390.png) | [1440px](after-player-1440.png) |
| Game page | [390px](after-game-390.png) | [1440px](after-game-1440.png) |
| Player pop-up | [390px](after-player-popup-390.png) | [1440px](after-player-popup-1440.png) |
| Play pop-up | [390px](after-play-popup-390.png) | [1440px](after-play-popup-1440.png) |

Before captures for the main menus are saved as `before-{screen}-{width}.png`. The before/after metrics match exactly for measured card/menu bounds at 390px and 1440px, with no page overflow. Additional Android Chromium, iOS WebKit and desktop WebKit menu checks found no page errors or horizontal overflow.

## Validation

- 63 unit tests passed.
- Full 86-test browser suite passed, including accessibility, responsive layouts, polling/corrections, pop-up focus and shared Tracker storage.
- 23 targeted browser tests passed again after adding the final comparison panel surfaces.
- ESLint, TypeScript and production build passed.

Preview: http://127.0.0.1:3001/
