# Dubiqo Digital Solutions - Company Website

A full-featured, enterprise-grade company website for Dubiqo Digital Solutions - a modern digital solutions agency that designs, develops, and maintains websites, portfolios, dashboards, billing systems, and provides technical troubleshooting and support.

## 🚀 Features

- **Multi-page Website**: Complete company ecosystem with 30+ pages
- **Service Pages**: Detailed pages for each service offering
- **Portfolio & Case Studies**: Showcase of projects and detailed case studies
- **Interactive Forms**: Support requests, contact forms, and quote calculator
- **Client Portal**: UI for client project management
- **Blog**: Content management system for articles
- **Careers Portal**: Job listings and application system
- **Analytics & Payment Demos**: Showcase dashboard and billing UI capabilities
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Modern UI/UX**: Glassmorphism design with smooth animations

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Email Service**: EmailJS (for form submissions)
- **State Management**: React Hooks
- **Charts**: Recharts (for analytics demos)

## 📦 Installation

1. **Clone the repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd dubiqo
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # EmailJS Configuration
   # Get these values from https://www.emailjs.com/
   
   VITE_EMAILJS_SERVICE_ID=your_service_id_here
   VITE_EMAILJS_TEMPLATE_ID_SUPPORT=your_support_template_id
   VITE_EMAILJS_TEMPLATE_ID_CONTACT=your_contact_template_id
   VITE_EMAILJS_TEMPLATE_ID_QUOTE=your_quote_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```

4. **Start the development server**
   ```sh
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 📧 EmailJS Setup (Required for Form Submissions)

To enable support requests, contact forms, and quote requests to be sent to admin email:

1. **Sign up for EmailJS**
   - Visit [https://www.emailjs.com/](https://www.emailjs.com/)
   - Create a free account (200 emails/month free tier)

2. **Create an Email Service**
   - Go to Email Services > Add New Service
   - Connect your email (Gmail, Outlook, etc.)
   - Note your Service ID

3. **Create Email Templates**
   
   Create three templates in EmailJS:
   
   **Support Request Template:**
   - Template Name: Support Request
   - Subject: `Support Request: {{issue_type}} - {{from_name}}`
   - Content:
     ```
     New Support Request Received
     
     Name: {{from_name}}
     Email: {{from_email}}
     Website: {{website}}
     Issue Type: {{issue_type}}
     
     Description:
     {{message}}
     ```
   
   **Contact Form Template:**
   - Template Name: Contact Form
   - Subject: `New Contact Form Submission: {{project_type}} - {{from_name}}`
   - Content:
     ```
     New Contact Form Submission
     
     Name: {{from_name}}
     Email: {{from_email}}
     Phone: {{phone}}
     Project Type: {{project_type}}
     Budget: {{budget}}
     Timeline: {{timeline}}
     
     Message:
     {{message}}
     ```
   
   **Quote Request Template:**
   - Template Name: Quote Request
   - Subject: `Quote Request: {{project_type}} - {{from_name}}`
   - Content:
     ```
     New Quote Request
     
     Name: {{from_name}}
     Email: {{from_email}}
     Phone: {{phone}}
     Project Type: {{project_type}}
     Pages: {{pages}}
     Features: {{features}}
     Urgency: {{urgency}}
     Estimated Range: {{estimated_range}}
     
     Additional Notes:
     {{additional_notes}}
     ```

4. **Get Your Public Key**
   - Go to Account > API Keys
   - Copy your Public Key

5. **Update .env file**
   - Add all the IDs and keys to your `.env` file
   - Make sure to set the recipient email in your EmailJS service settings to your admin email

## 📁 Project Structure

```
dubiqo/
├── public/              # Static assets
├── src/
│   ├── components/     # Reusable components
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ChatWidget.tsx
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   ├── Services/
│   │   ├── legal/
│   │   └── ...
│   ├── utils/          # Utility functions
│   │   └── emailService.ts
│   ├── hooks/          # Custom hooks
│   ├── components/ui/  # shadcn/ui components
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── .env                # Environment variables (create this)
├── package.json
└── README.md
```

## 🎨 Design System

- **Primary Colors**:
  - Purple: `#6C4CF0`
  - Neon Blue: `#2DBAFF`
  - Deep Navy: `#0A0A1F`
  - Soft Gray: `#F5F5FB`

- **Design Style**:
  - Glassmorphism cards
  - Rounded corners (xl/2xl)
  - Smooth scroll animations
  - Gradient backgrounds
  - Modern SaaS/agency aesthetic

## 🚢 Deployment

### Build for Production
```sh
npm run build
```

The build output will be in the `dist/` directory.

### Deploy Options

1. **Vercel** (Recommended)
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

2. **Netlify**
   - Connect your repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables

3. **Other Platforms**
   - Any static hosting service (GitHub Pages, Cloudflare Pages, etc.)
   - Make sure to set environment variables in your hosting platform

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### EmailJS Configuration

All form submissions (Support, Contact, Quote) are sent to admin email via EmailJS. Make sure to:

1. Set up EmailJS account and service
2. Create email templates as described above
3. Add environment variables to `.env` file
4. Configure recipient email in EmailJS service settings

### Customization

- **Brand Colors**: Update colors in `tailwind.config.js` or `src/index.css`
- **Content**: Edit page components in `src/pages/`
- **Navigation**: Update routes in `src/App.tsx` and menu items in `src/components/Navbar.tsx`

## 📄 License

© 2025 Dubiqo Digital Solutions. All rights reserved.

## 🤝 Support

For support, email support@dubiqo.com or visit the [Support Center](/support).

---

**Built with ❤️ by Dubiqo Digital Solutions**
