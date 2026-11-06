The assistant avatar lives here as:

  mint-melody-avatar.glb

Source: "Mint_ Melody_Character" by oktria.taranasta — CC BY — via Sketchfab
( https://sketchfab.com/3d-models/mint--melody-character-fe6a839b40de440382c142ada06f3146 )

It is tinted green at runtime and given a walking bounce + sway by
src/components/site/avatar-3d.tsx (no edit to the file needed). Drop a
replacement .glb here under the same name to swap the avatar.

Note: the downloaded Sketchfab GLB has no embedded skeleton/animations, so the
"walk" is a procedural bounce+lean+sway (plus a ground shadow). For a true
skeletal walk, rig the model on Mixamo and re-export a GLB with a walk clip —
avatar-3d.tsx will auto-play it.
