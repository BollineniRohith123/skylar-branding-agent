

# Skylar Brand Vision Generator

An AI-powered application that transforms your logo into stunning brand visualizations across multiple advertising surfaces. Upload your logo and watch as our Gemini AI model generates professional brand mockups for various products and marketing materials.

## ✨ Features

- **Multi-Surface Brand Visualization**: See your logo applied across different advertising surfaces (billboards, packaging, digital ads, etc.)
- **AI-Powered Generation**: Uses Google's Gemini AI to create high-quality, contextually appropriate brand visualizations
- **Multiple API Key Support**: Automatic rotation through multiple API keys to maximize quota and handle rate limits gracefully
- **User-Friendly Error Handling**: Intelligent retry mechanism with user-friendly error messages
- **Generation History**: Save and revisit your previous brand visualization sessions
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Quick Start

**Prerequisites:** Node.js

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   API_KEYS=your_gemini_api_key_1,your_gemini_api_key_2,your_gemini_api_key_3
   ```

   **Note:** Add multiple comma-separated Gemini API keys for automatic rotation and increased quota limits.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to see your app in action!

## 🔧 Recent Updates

### Enhanced Error Handling
- **User-friendly error messages**: Replaced technical API error messages with clear, actionable feedback
- **One-click retry**: Failed generations now show a "Retry" button for easy regeneration
- **Intelligent rate limit handling**: Automatic retry mechanism with smart delays when API limits are reached

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done!)
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository: `https://github.com/BollineniRohith123/skylar-branding-agent.git`
3. **Add Environment Variables:**
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add `API_KEYS` with your Gemini API keys
4. **Deploy!** Your app will be live instantly

### Manual Deployment

For other platforms, ensure you:
- Set the `API_KEYS` environment variable with your Gemini API keys
- Build the project: `npm run build`
- Serve the `dist` folder

## 🔑 API Key Management

This application supports multiple Gemini API keys for:
- **Automatic rotation**: When one key hits rate limits, the next key is used automatically
- **Increased quota**: Combine quotas from multiple keys for higher usage limits
- **Graceful degradation**: If all keys are exhausted, users see a friendly retry option

Add as many keys as needed in your `.env` file, separated by commas.

## 📝 Usage

1. **Upload your logo** (PNG, JPEG, or WebP format)
2. **Wait for generation** - Our AI creates brand visualizations across multiple surfaces
3. **View results** - See your logo in various advertising contexts
4. **Download favorites** - Save high-quality images for your projects
5. **Retry if needed** - Use the retry button if generation fails due to API limits

## 🛠️ Development

- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API
- **State Management**: React hooks
- **Build Tool**: Vite

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**View your deployed app**: [Live Demo](https://your-app-url.vercel.app) (replace with your actual deployed URL)
