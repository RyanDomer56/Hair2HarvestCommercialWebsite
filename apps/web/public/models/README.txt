Assistant avatar files (rendered by src/components/site/avatar-3d.tsx):

  marshmallow-avatar.glb   <- PRIMARY. Drop the "Marshmallow Avatar (Roblox UGC)"
                              by SouthWake_ (CC BY, via Sketchfab) here to use it.
  mint-melody-avatar.glb   <- FALLBACK. "Mint_ Melody_Character" by oktria.taranasta
                              (CC BY, via Sketchfab). Shown until the marshmallow
                              file is added.

Behavior (see avatar-3d.tsx):
  - The assistant uses faceMode: the camera zooms onto the head so the FACE is
    clearly visible (not just the body), and the face does a talking head-nod +
    pulse while the assistant speaks.
  - Models are tinted green at runtime (no file edit needed).
  - If marshmallow-avatar.glb is missing, it falls back to mint-melody-avatar.glb,
    then to the built-in SVG avatar.

Sketchfab's download API needs a login, so the GLB must be downloaded in your
browser (open the model page -> Download -> GLB) and placed here manually.

Note: these free Sketchfab GLBs ship with no skeleton/animations, so "walk"/"talk"
are procedural. Rig on Mixamo for a true skeletal clip — avatar-3d.tsx auto-plays it.
