# 🚀 Production Deployment Guide - Shikshanam SSO

This guide will help you deploy the Shikshanam platform with SSO authentication to production.

## 📋 Prerequisites

1. **Domain Name**: A registered domain for your application
2. **Hosting Platform**: Vercel, Netlify, or similar hosting service
3. **Google Cloud Console**: For Google OAuth setup
4. **Environment Variables**: All required secrets and API keys

## 🔧 Step 1: Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-generated-secret-key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Graphy API Configuration
GRAPHY_MERCHANT_ID=hyperquest
GRAPHY_API_TOKEN=80c83322-69d7-429c-99f7-e5170767d818
GRAPHY_BASE_URL=https://api.graphy.com

# Environment
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET

```bash
# Generate a secure secret key
openssl rand -base64 32
```

## 🔐 Step 2: Google OAuth Setup

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### 2.2 Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required information:
   - App name: "Shikshanam"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (for development)

### 2.3 Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)
5. Copy the Client ID and Client Secret

## 🌐 Step 3: Domain Configuration

### 3.1 DNS Setup

Configure your domain's DNS records:

```
A     @      your-server-ip
CNAME www    your-domain.com
```

### 3.2 SSL Certificate

Ensure your hosting platform provides SSL certificates (automatic with Vercel/Netlify).

## 🚀 Step 4: Deployment

### Option A: Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add all environment variables from Step 1

3. **Custom Domain**
   - Go to Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option B: Netlify Deployment

1. **Connect Repository**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`

2. **Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all environment variables

### Option C: Manual Server Deployment

1. **Build the Application**
   ```bash
   npm run build
   npm start
   ```

2. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "shikshanam" -- start
   pm2 save
   pm2 startup
   ```

## 🔍 Step 5: Testing

### 5.1 Test Authentication Flow

1. **Google OAuth**
   - Visit your production site
   - Click "Login" > "Continue with Google"
   - Complete OAuth flow
   - Verify user data appears in navigation

2. **Email Authentication**
   - Test email/password login
   - Verify Graphy integration works

3. **Session Management**
   - Test logout functionality
   - Verify session persistence
   - Test protected routes

### 5.2 Security Testing

1. **HTTPS Enforcement**
   - Verify all requests use HTTPS
   - Check security headers

2. **Cookie Security**
   - Verify HttpOnly cookies
   - Check SameSite attributes
   - Confirm secure flag in production

3. **CORS Configuration**
   - Test cross-origin requests
   - Verify proper CORS headers

## 🛡️ Step 6: Security Hardening

### 6.1 Security Headers

The application includes security headers in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ];
}
```

### 6.2 Rate Limiting

Consider implementing rate limiting for authentication endpoints:

```javascript
// Example with express-rate-limit
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts'
});
```

### 6.3 Environment Variable Security

- Never commit `.env.local` to version control
- Use different secrets for development and production
- Rotate secrets regularly
- Use secret management services in production

## 📊 Step 7: Monitoring & Analytics

### 7.1 Error Monitoring

Set up error monitoring with services like:
- Sentry
- LogRocket
- Bugsnag

### 7.2 Performance Monitoring

- Vercel Analytics
- Google Analytics
- Web Vitals monitoring

### 7.3 Logging

Implement structured logging:

```javascript
// Example logging configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔄 Step 8: Maintenance

### 8.1 Regular Updates

- Keep dependencies updated
- Monitor security advisories
- Update NextAuth.js and other packages

### 8.2 Backup Strategy

- Database backups (if applicable)
- Environment variable backups
- Code repository backups

### 8.3 Health Checks

Implement health check endpoints:

```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

## 🚨 Troubleshooting

### Common Issues

1. **OAuth Redirect URI Mismatch**
   - Ensure redirect URIs match exactly
   - Check for trailing slashes
   - Verify HTTPS vs HTTP

2. **Environment Variables Not Loading**
   - Restart deployment after adding variables
   - Check variable names for typos
   - Verify deployment platform supports the variables

3. **CORS Errors**
   - Check allowed origins in Google OAuth
   - Verify domain configuration
   - Check NextAuth.js configuration

4. **Session Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check cookie settings
   - Test in incognito mode

### Debug Mode

Enable debug mode for troubleshooting:

```env
NEXTAUTH_DEBUG=true
```

## 📞 Support

For issues with:
- **NextAuth.js**: [GitHub Issues](https://github.com/nextauthjs/next-auth/issues)
- **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/)
- **Graphy API**: Contact Graphy support
- **Deployment**: Check your hosting platform's documentation

## ✅ Checklist

- [ ] Environment variables configured
- [ ] Google OAuth setup complete
- [ ] Domain configured with SSL
- [ ] Application deployed
- [ ] Authentication flow tested
- [ ] Security headers verified
- [ ] Error monitoring configured
- [ ] Backup strategy implemented
- [ ] Documentation updated

---

**Note**: This guide assumes you're using the standard Next.js deployment process. Adjust steps based on your specific hosting platform and requirements.
