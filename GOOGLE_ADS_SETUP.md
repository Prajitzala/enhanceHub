# Google Ads Setup Guide for AI Photo Restoration

## 🎯 Overview
This guide will help you set up Google Ads for your AI Photo Restoration website to drive traffic and conversions.

## 📋 Prerequisites
- Google Ads account
- Google Analytics 4 (GA4) account
- Website domain ownership

## 🔧 Step-by-Step Setup

### 1. Google Ads Account Setup

#### Create Google Ads Account
1. Go to [ads.google.com](https://ads.google.com)
2. Click "Start now" and follow the setup process
3. Choose "Website traffic" as your goal
4. Set your daily budget (recommended: $20-50 to start)

#### Campaign Structure
```
📁 AI Photo Restoration
├── 🎯 Search Campaign (Photo Restoration)
├── 🎯 Display Campaign (Remarketing)
└── 🎯 Video Campaign (YouTube)
```

### 2. Update Tracking Code

#### Replace Placeholder IDs
In `src/app/layout.tsx`, replace:
- `AW-CONVERSION_ID` with your actual Google Ads conversion ID
- `CONVERSION_LABEL` with your conversion action labels

In `src/lib/google-ads.ts`, update:
```typescript
export const GOOGLE_ADS_CONVERSION_ID = 'AW-123456789'; // Your actual ID

export const GOOGLE_ADS_CONVERSION_LABELS = {
  PHOTO_RESTORATION: 'ABC123', // Your conversion label
  DOWNLOAD: 'DEF456',
  SIGNUP: 'GHI789',
};
```

### 3. Conversion Actions Setup

#### Create Conversion Actions in Google Ads
1. Go to Tools & Settings > Conversions
2. Click the "+" button to create new conversion action
3. Choose "Website" as the source
4. Set up these conversion actions:

| Conversion Action | Category | Value |
|------------------|----------|-------|
| Photo Restoration Started | Custom | $1.00 |
| Photo Restoration Completed | Custom | $5.00 |
| Photo Downloaded | Custom | $2.00 |
| CTA Button Click | Custom | $0.50 |

### 4. Keyword Research & Campaign Setup

#### Primary Keywords (Search Campaign)
```
photo restoration
restore old photos
fix damaged photos
remove scratches from photos
photo repair
old photo restoration
damaged photo repair
photo colorization
black and white photo colorization
vintage photo restoration
```

#### Negative Keywords
```
free
online editor
photoshop
lightroom
app
mobile app
software
download
tutorial
how to
```

#### Ad Copy Examples

**Headline 1:** AI Photo Restoration
**Headline 2:** Restore Old Photos
**Headline 3:** Remove Scratches & Damage

**Description 1:** Upload old, damaged photos. AI removes scratches, fixes tears & brings color back to life.
**Description 2:** Professional photo restoration in minutes. No registration required. Download restored photos instantly.

### 5. Display Campaign (Remarketing)

#### Audience Lists
1. **All Visitors** (1 day)
2. **Photo Uploaders** (7 days)
3. **Restoration Started** (14 days)
4. **Restoration Completed** (30 days)

#### Display Ad Placements
- Photography websites
- Genealogy sites
- Family history blogs
- Photo editing forums
- Social media platforms

### 6. Enhanced Conversions

#### Setup Enhanced Conversions
1. In Google Ads, go to Conversions > Settings
2. Enable "Enhanced conversions"
3. Choose "Website" as the source
4. Select "Tag-based" implementation

#### User Data Collection
The website already tracks:
- ✅ File uploads
- ✅ Restoration starts
- ✅ Restoration completions
- ✅ Downloads
- ✅ CTA clicks
- ✅ Error events

### 7. Budget & Bidding Strategy

#### Recommended Budget Allocation
- **Search Campaign:** 60% of total budget
- **Display Campaign:** 30% of total budget
- **Video Campaign:** 10% of total budget

#### Bidding Strategies
- **Search:** Target CPA ($2-5 per conversion)
- **Display:** Target ROAS (300-500%)
- **Video:** Target CPM ($5-10)

### 8. Landing Page Optimization

#### Current Landing Page Strengths
- ✅ Clear value proposition
- ✅ Simple upload process
- ✅ Before/after comparison
- ✅ Trust indicators
- ✅ Mobile responsive

#### Recommended Improvements
- Add customer testimonials
- Include pricing information
- Add FAQ section
- Show more before/after examples
- Add social proof (user count, success rate)

### 9. Performance Tracking

#### Key Metrics to Monitor
- **Conversion Rate:** Target 2-5%
- **Cost per Conversion:** Target $2-5
- **Click-through Rate:** Target 2-4%
- **Quality Score:** Target 7-10
- **Return on Ad Spend:** Target 300-500%

#### Automated Rules
Set up these automated rules in Google Ads:
1. Pause keywords with QS < 5
2. Increase budget for campaigns with ROAS > 400%
3. Pause ads with CTR < 1%
4. Increase bids for keywords with conversion rate > 3%

### 10. A/B Testing

#### Test Variables
- **Ad Copy:** Different value propositions
- **Landing Page:** Headlines, CTAs, images
- **Bidding Strategies:** Manual vs Automated
- **Ad Extensions:** Sitelinks, callouts, structured snippets

#### Testing Schedule
- Run tests for minimum 2 weeks
- Use statistical significance calculator
- Test one variable at a time

## 🚀 Launch Checklist

### Before Launch
- [ ] Google Ads account created
- [ ] Conversion tracking implemented
- [ ] Keywords researched and added
- [ ] Ad copy written and approved
- [ ] Landing page optimized
- [ ] Budget set and approved
- [ ] Negative keywords added
- [ ] Remarketing audiences created

### After Launch (First Week)
- [ ] Monitor conversion tracking
- [ ] Check for technical issues
- [ ] Review keyword performance
- [ ] Adjust bids based on performance
- [ ] Add new negative keywords
- [ ] Optimize ad copy based on CTR

### Ongoing Optimization
- [ ] Weekly performance review
- [ ] Monthly keyword expansion
- [ ] Quarterly landing page updates
- [ ] Continuous A/B testing
- [ ] Regular budget adjustments

## 📊 Expected Results

### First Month Targets
- **Impressions:** 50,000-100,000
- **Clicks:** 1,000-2,000
- **Conversions:** 20-50
- **Cost per Conversion:** $3-5
- **ROAS:** 200-300%

### Optimization Goals
- **Month 2-3:** Improve ROAS to 400-500%
- **Month 4-6:** Scale successful campaigns
- **Month 6+:** Expand to new markets/keywords

## 🆘 Troubleshooting

### Common Issues
1. **No conversions tracking:** Check conversion code implementation
2. **Low Quality Score:** Improve landing page relevance
3. **High cost per click:** Add more negative keywords
4. **Low click-through rate:** Test new ad copy
5. **Poor conversion rate:** Optimize landing page

### Support Resources
- [Google Ads Help Center](https://support.google.com/google-ads)
- [Google Ads Community](https://support.google.com/google-ads/community)
- [Google Ads Academy](https://skillshop.exceedlms.com/student/catalog/list?category_ids=1-google-ads)

## 📞 Next Steps

1. **Set up your Google Ads account**
2. **Update the tracking codes with your actual IDs**
3. **Create your first campaign using the keywords provided**
4. **Monitor performance and optimize based on data**
5. **Scale successful campaigns**

For technical support with the tracking implementation, refer to the code comments in the source files.
