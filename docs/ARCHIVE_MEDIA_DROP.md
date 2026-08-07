# Adding photos + videos to an archive gallery

Each closed event has a collection in `client/src/data/galleryData.ts`
(`archiveCollectionsBySlug`) and a drop folder under
`client/public/images/archive/<event-slug>/`.

Current drop folders:

- `client/public/images/archive/ape-drums-july31/` — Ape Drums · July 31, 2026
- `client/public/images/archive/sunsets-i-july4/` — SUN(SETS) I · July 4, 2026

## The flow

1. **Drop the media** into the event's folder. Photos as `.jpg`/`.webp`;
   videos as `.mp4` (plus a `.jpg` poster frame per video).
2. **Generate responsive variants** so the site ships sized images:
   ```sh
   node scripts/generate_responsive_images.mjs
   ```
   The script walks `client/public/images/` recursively and emits 480/1024
   variants into `client/public/images/generated/`.
3. **Register each item** in the collection's `media` array in
   `client/src/data/galleryData.ts` using the `image({...})` / `video({...})`
   helpers already in that file. Width/height come from the source file
   (`sips -g pixelWidth -g pixelHeight <file>` on macOS). Give every item a
   stable `id`, an honest `alt`, and a short `caption`.
4. **Publish** by removing `comingSoon: true` from the collection. While
   `comingSoon` stays set, the gallery page keeps the community-upload panel
   below the gallery; removing it marks the record final.
5. **Verify** before pushing:
   ```sh
   npx vitest run
   npm run build
   ```

Videos go in `client/public/videos/` if they are large; reference them from
the `media` array with the `video({...})` helper (poster frame required).
