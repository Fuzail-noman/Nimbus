// Marketing copy for the pricing section. The Billing page loads the live plans from the API.
export const MARKETING_PLANS = [
  {
    id: 'free',
    name: 'Starter',
    tagline: 'For individuals trying things out',
    price: { monthly: 0, yearly: 0 },
    features: ['Up to 3 projects', '3 members per project', 'Kanban boards', 'Basic analytics'],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For growing teams that ship fast',
    price: { monthly: 12, yearly: 10 },
    popular: true,
    features: ['Up to 25 projects', '15 members per project', 'Advanced analytics', 'Activity timeline', 'Priority support'],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For organisations that need scale',
    price: { monthly: 29, yearly: 24 },
    features: ['Unlimited projects', '200 members per project', 'Everything in Pro', 'Audit-friendly activity log', 'Dedicated success manager'],
  },
];
