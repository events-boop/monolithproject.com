# Monolith VIP Venue Map Playbook

This is the operating system for every interactive VIP venue experience. The
goal is to make each event feel custom without rebuilding the booking flow or
mixing visual geometry with live inventory.

## The golden rule

Geometry answers **where**. Event inventory answers **what is available**.
Never hardcode availability, pricing, or reservation state inside a 3D scene.

```text
Event selected
  → event-specific venueMap.id
  → versioned scene + zones + camera views
  → live event.vipPackages availability
  → package + zone selected
  → request carries event, venue, map, zone, group, and contact details
```

## Source of truth

| Concern                                   | Owner               | File                                                |
| ----------------------------------------- | ------------------- | --------------------------------------------------- |
| Event date, venue, map ID                 | Event catalog       | `server/data/public-site-data.ts`                   |
| Package size, minimum, availability       | Event catalog       | `server/data/public-site-data.ts`                   |
| Scene, zones, marker coordinates, cameras | Map registry        | `client/src/data/vipVenueMaps.ts`                   |
| Selection and sold-out rules              | Shared client logic | `client/src/lib/vipExperience.ts`                   |
| Model controls and fallback               | Venue experience    | `client/src/components/VipVenueModel.tsx`           |
| Three.js scene geometry                   | Scene module        | `client/src/components/vip/CastawaysVenueScene.tsx` |
| Submitted request context                 | VIP page            | `client/src/pages/VIP.tsx`                          |

## Add a new event map

1. Create the event in the event catalog. Keep its public status truthful.
2. Give it a unique `venueMap.id`, even if the venue appeared before.
3. Add a registry entry with the same ID in `vipVenueMaps.ts`.
4. Reuse a `sceneId` when the physical venue is unchanged; customize its
   zones and cameras when the production layout changes.
5. Define one zone for each offered package. Zone IDs must be stable,
   descriptive slugs such as `captains-cabana`, never visual coordinates.
6. Configure package availability only on `event.vipPackages`.
7. Keep `illustrative: true` until the venue approves an exact plan.
8. Verify the generated request contains the correct event ID, venue ID, map
   ID, zone ID, package, guest range, and minimum.

## Inventory changes

Change only the relevant package in the event catalog:

```ts
vipPackages: buildVenueVipPackages({
  small: "available",
  medium: "limited",
  large: "sold-out",
});
```

The cards, model markers, plan markers, selection rules, and request button all
derive from that state. Do not edit the Three.js scene for an inventory update.

## Geometry delivery levels

### Level 1 — Illustrative launch

- Venue silhouette is recognizable.
- Stage, arrival, service core, water/street orientation, and premium zones are
  directionally correct.
- The interface says “Illustrative · final placement by host.”

### Level 2 — Venue-reviewed

- Venue confirms zone names, relative placement, capacity, and guest flow.
- Update zone coordinates and camera presets; increment the map version.
- Keep `illustrative: true` unless dimensions are confirmed.

### Level 3 — Venue-approved

- Build from an official floor plan or dimensioned model.
- Validate accessibility paths and operational clearances with the venue.
- Set `illustrative: false` only after written approval.

## Required QA before release

- [ ] Event status and public copy are approved.
- [ ] No unannounced artist, price, or inventory appears in the scene.
- [ ] Every package has exactly one valid map zone.
- [ ] Sold-out packages cannot be selected from cards, model, or plan.
- [ ] Map and package selection stay synchronized.
- [ ] The inquiry includes event, venue, map, zone, package, and guest count.
- [ ] Desktop orbit, zoom, presets, lighting, and marker selection work.
- [ ] Mobile drag and pinch work without horizontal overflow.
- [ ] Keyboard and screen-reader users can complete the entire flow without
      the canvas.
- [ ] Reduced-motion preference disables automatic rotation and pulsing motion.
- [ ] WebGL failure automatically exposes the usable plan view.
- [ ] The 3D module remains lazy-loaded and is absent from initial page code.
- [ ] Focused tests, TypeScript, production build, and route smoke checks pass.

## Performance guardrails

- Keep Three.js in the lazy scene chunk and request it only when the model
  approaches the viewport.
- Cap device pixel ratio; never render uncapped retina resolution.
- Disable expensive shadows on narrow/mobile screens.
- Dispose geometries, materials, textures, animation frames, listeners, and the
  WebGL context when the scene unmounts.
- Prefer procedural primitives for first release. Add compressed GLB assets
  only when they materially improve recognition.
- Keep the plan view fully functional as the accessibility and low-power path.

## Request contract

Every VIP host request must preserve these fields, even if the delivery
provider later changes:

```text
eventId
event date / episode
venueId
venueMapId
zoneId
package size / guest range
minimum or “Host quote”
customer name, phone, email, guest count
```

The current booking endpoint receives these values in a human-readable message
so they reach the existing database, webhook, and email fallback without a
breaking migration. A future structured VIP endpoint can lift the same fields
into dedicated columns without changing the front-end selection model.
