# Google Tag Manager Setup Guide for Ollvy

This guide explains how to set up Google Tag Manager (GTM) and Google Ads conversion tracking for the Ollvy customer portal.

## Step 1: Create a GTM Container

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click "Create Account"
3. Enter:
   - Account Name: `Ollvy`
   - Country: `India`
4. Create a Container:
   - Container name: `ollvy.com`
   - Target platform: `Web`
5. Accept the Terms of Service
6. Copy your **Container ID** (looks like `GTM-XXXXXXX`)

## Step 2: Add GTM ID to Environment

Add your GTM Container ID to your environment file:

```bash
# In apps/customer/.env.local (or .env.production for production)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Step 3: Configure Tags in GTM

### 3.1 Google Ads Conversion Tag (Purchase)

This tracks successful orders as conversions in Google Ads.

1. In GTM, go to **Tags** > **New**
2. Tag Configuration:
   - Tag Type: `Google Ads Conversion Tracking`
   - Conversion ID: `AW-XXXXXXXXXX` (from your Google Ads account)
   - Conversion Label: `XXXXXXXXXXXXXXXXXXX` (from Google Ads)
   - Conversion Value: `{{Ecommerce Value}}`
   - Currency Code: `INR`
   - Transaction ID: `{{Ecommerce Transaction ID}}`
3. Triggering:
   - Create a new trigger
   - Trigger Type: `Custom Event`
   - Event name: `purchase`
4. Save the tag

### 3.2 Google Analytics 4 (GA4) Configuration Tag

1. In GTM, go to **Tags** > **New**
2. Tag Configuration:
   - Tag Type: `Google Analytics: GA4 Configuration`
   - Measurement ID: `G-XXXXXXXXXX` (from your GA4 property)
3. Triggering: `All Pages`
4. Save the tag

### 3.3 GA4 E-commerce Events

Create tags for each e-commerce event:

#### view_item (Service Page View)
1. Tag Type: `Google Analytics: GA4 Event`
2. Configuration Tag: Select your GA4 Configuration tag
3. Event Name: `view_item`
4. Event Parameters:
   - `currency`: `{{Ecommerce Currency}}`
   - `value`: `{{Ecommerce Value}}`
   - `items`: `{{Ecommerce Items}}`
5. Trigger: Custom Event - `view_item`

#### begin_checkout
1. Tag Type: `Google Analytics: GA4 Event`
2. Event Name: `begin_checkout`
3. Same parameters as above
4. Trigger: Custom Event - `begin_checkout`

#### add_payment_info
1. Tag Type: `Google Analytics: GA4 Event`
2. Event Name: `add_payment_info`
3. Same parameters as above
4. Trigger: Custom Event - `add_payment_info`

#### purchase
1. Tag Type: `Google Analytics: GA4 Event`
2. Event Name: `purchase`
3. Event Parameters:
   - `transaction_id`: `{{Ecommerce Transaction ID}}`
   - `currency`: `{{Ecommerce Currency}}`
   - `value`: `{{Ecommerce Value}}`
   - `items`: `{{Ecommerce Items}}`
4. Trigger: Custom Event - `purchase`

## Step 4: Create Data Layer Variables

In GTM, go to **Variables** > **User-Defined Variables** > **New**:

### Ecommerce Value
- Variable Type: `Data Layer Variable`
- Data Layer Variable Name: `ecommerce.value`

### Ecommerce Currency
- Variable Type: `Data Layer Variable`
- Data Layer Variable Name: `ecommerce.currency`

### Ecommerce Transaction ID
- Variable Type: `Data Layer Variable`
- Data Layer Variable Name: `ecommerce.transaction_id`

### Ecommerce Items
- Variable Type: `Data Layer Variable`
- Data Layer Variable Name: `ecommerce.items`

## Step 5: Get Google Ads Conversion Details

1. Go to [Google Ads](https://ads.google.com/)
2. Navigate to **Tools & Settings** > **Conversions**
3. Click **+ New conversion action**
4. Select **Website**
5. Enter your website URL
6. Choose **Purchase** as the goal
7. Configure:
   - Conversion name: `Ollvy Order`
   - Value: Use different values for each conversion
   - Count: Every conversion
8. Select **Use Google Tag Manager**
9. Copy the **Conversion ID** and **Conversion Label**

## Step 6: Test Your Setup

### Preview Mode

1. In GTM, click **Preview** (top right)
2. Enter your website URL
3. Navigate through the site:
   - Visit a service page - check for `view_item` event
   - Go to checkout - check for `begin_checkout` event
   - Initiate payment - check for `add_payment_info` event
   - Complete a test order - check for `purchase` event

### Debug in Browser

Open browser DevTools and run:
```javascript
// Check dataLayer contents
console.log(window.dataLayer)

// Watch for new events
window.dataLayer.push = function(obj) {
  console.log('GTM Event:', obj)
  Array.prototype.push.call(this, obj)
}
```

## Step 7: Publish

Once everything is tested:

1. In GTM, click **Submit** (top right)
2. Add a version name (e.g., "Initial e-commerce tracking")
3. Click **Publish**

## Events Tracked by Ollvy

| Event | Page | Description |
|-------|------|-------------|
| `view_item` | Service detail page | User views a service |
| `begin_checkout` | Checkout page | User starts checkout |
| `add_payment_info` | Checkout page | User initiates payment |
| `purchase` | Success page | Order completed successfully |

## Data Sent with Each Event

```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'OLV-240331-1234',  // Order number
    value: 14999,                        // Total in INR (rupees)
    currency: 'INR',
    items: [{
      item_id: 'uuid-of-service',
      item_name: 'GST Registration',
      item_category: 'Services',
      price: 14999,
      quantity: 1
    }]
  }
}
```

## Troubleshooting

### Events not firing
- Check browser console for errors
- Verify `NEXT_PUBLIC_GTM_ID` is set correctly
- Ensure GTM container is published

### Conversion value showing 0
- Verify Data Layer variables are configured correctly
- Check that `ecommerce.value` is being read

### Duplicate conversions
- The code includes `hasTrackedPurchase` state to prevent duplicates
- Check your trigger conditions in GTM

## Files Modified

- `apps/customer/app/layout.tsx` - GTM provider added
- `apps/customer/components/analytics/GTMProvider.tsx` - GTM script component
- `apps/customer/lib/hooks/useGTM.ts` - GTM hook for pushing events
- `apps/customer/app/(main)/orders/[id]/success/page.tsx` - purchase tracking
- `apps/customer/app/(main)/checkout/[serviceId]/page.tsx` - checkout tracking
- `apps/customer/components/service/UnifiedServicePage.tsx` - view_item tracking
