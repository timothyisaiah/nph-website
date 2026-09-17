# Image sources

This directory contains preserved inputs for the deterministic image pipeline. The files under `../generated` are build outputs and must not be edited by hand.

The local NPH photographs and charts were copied here without overwriting their previous files. The five previously remote photographs were acquired from these existing Unsplash image URLs on 17 September 2026, using `auto=format&fit=max&w=2000&q=90`:

- `hero.jpg`: `photo-1584982751601-97dcc096659c`
- `medical-data.jpg`: `photo-1576091160550-2173dba999ef`
- `healthcare-team.jpg`: `photo-1579684385127-1ef15d508118`
- `community-workers.jpg`: `photo-1571844307880-751c6d86f3f3`
- `laboratory.jpg`: `photo-1576091160399-112ba8d25d1d`

The attribution text retained by the application is recorded in `scripts/generate-images.js`. Before adding a new image, preserve its source here, record its attribution, add an explicit role and size policy to the generator, run `npm run images:generate`, visually inspect the generated candidates, and run `npm run images:verify`.
