# Asset sources and authorship

This inventory records what the repository and its owner identify about the website's content. It is not a certification of ownership or permission for every file. Items with incomplete provenance are listed explicitly below.

## Original design and website implementation

| Material | Files or location | Authorship and scope |
| --- | --- | --- |
| Visual design and creative direction | Overall layout, presentation, styling, and interaction direction | Bachtiar Aditya identifies himself as the original designer. Protection is claimed only for eligible original expression in which he holds rights, not general ideas or common patterns. |
| Website implementation | `index.html`, root CSS and JavaScript files, and `scripts/` | Developed and revised with AI coding assistance in response to Bachtiar Aditya's direction. These files are not represented as entirely human-written code. Rights in particular code portions depend on their provenance and applicable law; third-party terms remain applicable. |
| Portfolio descriptions and acknowledgements | `portfolio-content.js`, `published-projects.js`, `hall-of-fame-data.js`, `site-pages.js`, `script.js`, and `hall-of-fame.js` | Portfolio facts and contributions were supplied by Bachtiar Aditya. Wording and translations include AI assistance. Factual information and third-party names are not claimed as exclusively owned. |
| Pixel-art shapes and animation implementation | `pixel-art.js`, `pixel-background.js`, and related CSS | Implemented with AI assistance for this website under Bachtiar Aditya's creative direction. No exclusive ownership is claimed in the general concepts of pixel hearts, hammers, steps, floating icons, or particle animations. |
| Site brand illustration | `image/brand-mark.svg` | Used as this website's brand illustration. A separate creation record or rights assignment is not documented in the repository; no independent rights verification is claimed. |

## Icons

| Files | Recorded source | Terms and attribution |
| --- | --- | --- |
| `image/icons/trees.svg`, `panels-top-left.svg`, `earth.svg`, `notebook-pen.svg`, `puzzle.svg`, `code-xml.svg` | [Lucide](https://github.com/lucide-icons/lucide), as recorded in [icon sources](image/icons/SOURCES.md) | ISC, with the upstream Feather/MIT notices where applicable. The existing [Lucide license notice](image/icons/LUCIDE-LICENSE.txt) is retained. [Official license](https://lucide.dev/license). |
| `image/icons/robloxstudio.svg`, `luau.svg`, `discord.svg`, `openai.svg`, `googlegemini.svg` | [Simple Icons](https://simpleicons.org/), as recorded in [icon sources](image/icons/SOURCES.md) | The Simple Icons project uses [CC0](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md). Its [disclaimer](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md) explains that individual icons can have additional brand, trademark, copyright, or usage considerations. Project licensing does not itself establish permission from each brand owner. |

## Fonts

The website requests DM Sans and Manrope from Google Fonts in `index.html`; font binaries are not bundled in this repository.

| Font | Upstream source | License |
| --- | --- | --- |
| DM Sans | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/dmsans) | [SIL Open Font License 1.1](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt) |
| Manrope | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/manrope) | [SIL Open Font License 1.1](https://github.com/google/fonts/blob/main/ofl/manrope/OFL.txt) |

## Roblox data, avatars, and game media

| Material | Files or location | Recorded source and limits |
| --- | --- | --- |
| Account, game, and group statistics | `profile-data.js`, `published-projects.js`, `studio-data.js`, `developer-profiles.js` | Public Roblox API snapshots. Capture dates and API sources are recorded in data or synchronization scripts. These are factual snapshots, not a claim of ownership over Roblox or the accounts and games shown. |
| Developer avatars | `image/developers/` | Retrieved from Roblox's avatar thumbnail API by `scripts/sync-developers.mjs`. Underlying avatar components and platform imagery may involve third-party rights. |
| Owner's Roblox avatar and headshot | `image/roblox-avatar.png`, `image/roblox-headshot.png` | Used for the portfolio's linked Roblox profile. No separate download or permission record is included for these original files. Ownership of the account does not establish ownership of every avatar component. |
| Published-game thumbnails | `image/games/` | Presented alongside the Roblox games identified in `published-projects.js`. Original download records and separate permissions for each image are not fully documented here. Project contribution, prior ownership, or a sale status alone does not establish current rights in every image. |
| Portfolio screenshots | `image/Archives/` and any `image/Showcase/` uploads | Included as examples of portfolio work. The owner supplies the project context; individual capture authors, in-game assets, and reuse permissions are not independently verified for every image. |

## Other images and items requiring confirmation

Work-in-progress screenshots in `image/ongoing/seporsi-mie-ayam/` were supplied by the portfolio owner on 2 November 2026 for the unpublished project Seporsi Mie Ayam [Horror]. They are displayed through `ongoing-projects.js`, separately from published-game API snapshots. This records their submission, not independent verification of rights in every depicted element.

The owner also supplied an Indekos (BAND) folder on 2 November 2026. Its ten images match files already in the building, UI, and visual-journal archives, so the current-work gallery references those files without storing duplicate copies. Its owner-designated thumbnail is first. Hotel Anomaly appears as published work still under development; its current-work card references the existing published-game snapshot and credits rather than inventing unpublished statistics or replacing the original description.

| Files or location | Available provenance | Information still needed |
| --- | --- | --- |
| `image/youtuber/` | Screenshots used to acknowledge creators who played the portfolio owner's maps | Original video or post links, screenshot authorship, and any applicable permission or other basis for use. No endorsement or ownership of creators' content is claimed. |
| `image/studios/losi-studio.jpg`, `image/studios/roleplay-studio.jpg` | Public Instagram profile sources and capture information are recorded in [studio sources](image/studios/SOURCES.md) | Any permission or other applicable basis for retaining and displaying the profile images. A public profile and source link alone do not establish reuse permission. |
| `image/mascot.png` | Used as the portfolio mascot | Creator, creation method, original source file, and any relevant licenses or permissions for underlying elements. |
| `image/aihstudio.png`, `image/aihgank.png` | Used in connection with AIH Studio or its community | Creator and any rights or permission records for the artwork. Ownership of a group alone does not establish authorship of its images. |
| `image/banner.gif`, `image/profile.gif` | Present in the repository | Original source, creator, rights information, and whether each file is currently used. |

These open items are documentation gaps, not findings that a specific use is unauthorized. They should be completed from actual records rather than by assuming ownership or inventing permissions. Adding an attribution or this inventory does not itself grant a license.

See [COPYRIGHT.md](COPYRIGHT.md) for the portfolio notice. Third-party license and attribution requirements take precedence over any general restriction in that notice for the material they cover.
