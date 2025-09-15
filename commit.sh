#!/bin/bash
git add .
git commit -m "feat(ui): implement diagonal central cells with vertex colors and pure CSS

- Replace generic central-cell pattern with specific c3/c4/d3/d4 classes
- Implement diagonal gradients: half vertex color, half black
- c3: Blue (a1) to Black diagonal division
- c4: Red (a6) to Black diagonal division
- d3: Green (f1) to Black diagonal division
- d4: Yellow (f6) to Black diagonal division
- Remove all Tailwind CSS dependencies from BoardSquare component
- Add pure CSS highlight classes to replace Tailwind utilities
- Enhance gaming UX with improved hover effects
- Maintain 60fps performance with hardware acceleration"