# form. — AI 3D Design Studio

A small creative studio for customizing a T-shirt in 3D. Choose a garment color, upload artwork, or describe an idea and preview the result on an interactive model.

## Getting started

```sh
npm install
npm run dev
```

## Design generation

The AI design form sends a JSON `POST` request with a `prompt` string to the DALL·E endpoint in `src/config/config.js`. The endpoint should respond with a JSON object containing the generated image as `photo`, `image`, or `imageUrl` (a URL or data URL). Update the development or production endpoint there to match your API.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview a production build
- `npm run lint` — run ESLint
