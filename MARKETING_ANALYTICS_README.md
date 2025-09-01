# Shikshanam Marketing Analytics System

A comprehensive marketing analytics and retargeting system built for Shikshanam's educational platform. This system provides advanced UTM tracking, A/B testing, cross-device tracking, and real-time analytics dashboard.

## 🚀 Features Implemented

### 1. UTM-Based Retargeting Logic
- **Enhanced UTM Tracking**: Advanced UTM parameter tracking with support for all major platforms
- **UTM-Based Retargeting**: Intelligent retargeting based on UTM source, medium, campaign, and click IDs
- **Attribution Modeling**: Multi-touch attribution with 30-day attribution window
- **Traffic Source Classification**: Automatic classification of traffic sources (organic, paid, social, email, referral, direct)

### 2. A/B Testing Infrastructure
- **Statistical Significance Testing**: Chi-square tests with p-value calculations
- **Multi-Variant Testing**: Support for multiple variants with traffic splitting
- **Goal Tracking**: Conversion, engagement, revenue, and custom goal tracking
- **Real-time Results**: Live performance monitoring with confidence intervals
- **Targeting Rules**: Segment-based, UTM-based, and device-based targeting

### 3. Cross-Device Tracking
- **Device Fingerprinting**: Advanced fingerprinting using canvas, WebGL, audio, fonts, and hardware
- **User Identification**: Cross-device user identification with similarity matching
- **Session Mapping**: Unified session tracking across devices
- **Behavioral Analysis**: Cross-device behavior patterns and preferences

### 4. Real-Time Analytics Dashboard
- **Admin Authentication**: Secure admin access (admin/adminadmin)
- **Live Data Updates**: Real-time analytics with 30-second refresh intervals
- **Comprehensive Metrics**: UTM performance, A/B test results, retargeting insights
- **Export Capabilities**: Data export in JSON/CSV formats
- **Responsive Design**: Mobile-friendly dashboard interface

## 📊 Dashboard Access

### URL: `/analytics-dashboard`
- **Username**: `admin`
- **Password**: `adminadmin`

### Dashboard Features:
- **Overview**: Key metrics and performance indicators
- **UTM Analytics**: Traffic source performance and attribution
- **A/B Testing**: Test results and statistical significance
- **Retargeting**: Campaign performance and conversion rates
- **Cross-Device**: User behavior across devices
- **Conversions**: Revenue and conversion tracking
- **Users**: User segmentation and behavior analysis

## 🔧 Technical Implementation

### Core Libraries

#### 1. UTM Tracking (`lib/utmTracking.ts`)
```typescript
// Advanced UTM parameter tracking
const utmTracker = new UTMTracker()
const currentUTM = utmTracker.getCurrentUTM()
const trafficSource = utmTracker.getTrafficSource()
```

#### 2. A/B Testing (`lib/abTesting.ts`)
```typescript
// A/B test management
const abTestingEngine = new ABTestingEngine()
const variant = abTestingEngine.getVariant('test_id')
const results = abTestingEngine.getTestResults('test_id')
```

#### 3. Cross-Device Tracking (`lib/crossDeviceTracking.ts`)
```typescript
// Cross-device user tracking
const crossDeviceTracker = new CrossDeviceTracker()
const user = crossDeviceTracker.getCurrentUser()
const insights = crossDeviceTracker.getCrossDeviceInsights()
```

#### 4. Enhanced Retargeting (`lib/enhancedRetargeting.ts`)
```typescript
// UTM-based retargeting
const retargetingEngine = new EnhancedRetargetingEngine()
const rules = retargetingEngine.getRules()
const insights = retargetingEngine.getRetargetingInsights()
```

#### 5. Analytics Orchestrator (`lib/analyticsOrchestrator.ts`)
```typescript
// Central analytics management
const analyticsOrchestrator = AnalyticsOrchestrator.getInstance()
await analyticsOrchestrator.initialize(userId)
const insights = analyticsOrchestrator.getAnalyticsInsights()
```

### API Endpoints

#### Analytics Dashboard API (`/api/analytics/dashboard`)
```typescript
// GET - Fetch dashboard data
GET /api/analytics/dashboard
Authorization: Bearer admin-token

// POST - Export data
POST /api/analytics/dashboard
{
  "action": "export"
}
```

## 🎯 Marketing Use Cases

### 1. UTM Campaign Optimization
- Track performance of different UTM campaigns
- Identify high-performing traffic sources
- Optimize ad spend based on conversion data
- Retarget users from specific campaigns

### 2. A/B Testing for Conversion Optimization
- Test different CTA buttons and colors
- Optimize pricing display formats
- Test hero section variations
- Improve checkout flow conversion rates

### 3. Cross-Device User Experience
- Understand user behavior across devices
- Optimize content for different device types
- Track user journey across platforms
- Improve mobile conversion rates

### 4. Retargeting Campaigns
- Exit-intent offers for high-value visitors
- UTM-based personalized messaging
- Time-based urgency campaigns
- Abandoned cart recovery

## 📈 Key Metrics Tracked

### UTM Analytics
- Traffic source performance
- Campaign conversion rates
- Attribution path analysis
- Click ID tracking (Google, Facebook, Microsoft, TikTok, LinkedIn)

### A/B Testing
- Statistical significance
- Conversion rate improvements
- Confidence intervals
- Winner determination

### Cross-Device
- User identification accuracy
- Device preferences
- Browser and OS distribution
- Multi-device user behavior

### Retargeting
- Campaign impressions and clicks
- Click-through rates (CTR)
- Conversion rates
- Revenue attribution

## 🔒 Security & Privacy

### Data Protection
- GDPR-compliant data collection
- User consent management
- Data retention policies
- Secure admin authentication

### Privacy Features
- Anonymous user tracking
- Opt-out mechanisms
- Data encryption
- Secure API endpoints

## 🚀 Getting Started

### 1. Access the Dashboard
Navigate to `/analytics-dashboard` and login with:
- Username: `admin`
- Password: `adminadmin`

### 2. View Analytics Data
The dashboard provides real-time insights into:
- UTM campaign performance
- A/B test results
- Retargeting campaign metrics
- Cross-device user behavior

### 3. Export Data
Use the API endpoint to export analytics data:
```bash
curl -X POST /api/analytics/dashboard \
  -H "Authorization: Bearer admin-token" \
  -H "Content-Type: application/json" \
  -d '{"action": "export"}'
```

## 📋 Default Test Data

The system comes with pre-configured test data:

### A/B Tests
1. **CTA Button Test**: Testing different button colors and text
2. **Pricing Display Test**: Testing pricing format variations

### Retargeting Rules
1. **High-Value UTM Retargeting**: Premium offers for high-value campaigns
2. **Exit Intent Offer**: Special offers when users try to leave

### Sample Metrics
- Total Sessions: 12.5K
- Conversion Rate: 3.2%
- Total Revenue: $45.2K
- Active A/B Tests: 8

## 🔧 Customization

### Adding New A/B Tests
```typescript
const newTest: ABTest = {
  id: 'custom_test',
  name: 'Custom Test',
  type: 'content',
  variants: [...],
  goals: [...],
  targeting: {...}
}
abTestingEngine.addTest(newTest)
```

### Creating Retargeting Rules
```typescript
const newRule: RetargetingRule = {
  id: 'custom_rule',
  name: 'Custom Rule',
  type: 'utm_based',
  utmConditions: {...},
  actions: {...}
}
retargetingEngine.addRule(newRule)
```

## 📞 Support

For technical support or feature requests, please refer to the main project documentation or contact the development team.

---

**Note**: This marketing analytics system is designed for educational purposes and should be customized for production use with proper security measures and data privacy compliance.
