This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Google Maps API Key:
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Enable "Maps JavaScript API" for your project
   - Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   - Make sure your code is committed and pushed to a GitHub repository

2. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up or log in
   - You can sign in with your GitHub account for easy integration

3. **Import your project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

4. **Configure environment variables**
   - Before deploying, add your environment variables in the Vercel dashboard:
     - Go to "Environment Variables" section
     - Add the following variables:
       ```
       NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
       NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here (if using Google Sign-In)
       ```
     - Optional (if using Stripe):
       ```
       NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
       STRIPE_SECRET_KEY=your_stripe_secret_key
       ```
   - Make sure to add them for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like `your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts to link your project
   - For production deployment, use:
   ```bash
   vercel --prod
   ```

4. **Set environment variables via CLI**
   ```bash
   vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID
   # Enter the values when prompted
   ```
   Or set them for specific environments:
   ```bash
   vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY production
   ```

### Important Notes

- **Environment Variables**: All `NEXT_PUBLIC_*` variables must be set in Vercel for your app to work correctly
- **Google Maps API**: Make sure to add your production domain to the allowed domains in Google Cloud Console
- **Google OAuth**: If using Google Sign-In, add your Vercel domain to authorized JavaScript origins in Google Cloud Console
- **Automatic Deployments**: Vercel automatically deploys when you push to your main branch
- **Preview Deployments**: Every pull request gets a preview deployment URL

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
