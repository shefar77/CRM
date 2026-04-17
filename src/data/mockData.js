export const kpis = [
  { label: 'Total Leads',     value: '1,284', delta: '▲ 12% vs last month',  trend: 'up',      filter: 'total'  },
  { label: 'Active Leads',    value: '387',   delta: '▲ 8% vs last month',   trend: 'up',      filter: 'active' },
  { label: 'Deals Closed',    value: '64',    delta: '▼ 3% vs last month',   trend: 'down',    filter: 'closed' },
  { label: 'Conversion Rate', value: '4.98%', delta: '— same as last month', trend: 'neutral', filter: null     },
];

export const pipeline = [
  { stage: 'New Lead',    count: 412, value: '₹82Cr',   pct: 100, color: 'var(--primary)' },
  { stage: 'Contacted',   count: 218, value: '₹43Cr',   pct: 53,  color: 'var(--primary)' },
  { stage: 'Viewing',     count: 94,  value: '₹19Cr',   pct: 23,  color: 'var(--primary)' },
  { stage: 'Negotiation', count: 47,  value: '₹9.4Cr',  pct: 11,  color: 'var(--primary)' },
  { stage: 'Closed',      count: 64,  value: '₹12.8Cr', pct: 16,  color: 'var(--green)'   },
];

export const agents = [
  { id: 1, name: 'Priya Sharma',  initials: 'PS', color: 'blue',   meetings: 34, deals: 18, responseRate: 94, performance: 90 },
  { id: 2, name: 'Rahul Verma',   initials: 'RV', color: 'purple', meetings: 28, deals: 14, responseRate: 87, performance: 74 },
  { id: 3, name: 'Meena Khanna',  initials: 'MK', color: 'orange', meetings: 21, deals: 9,  responseRate: 79, performance: 55 },
  { id: 4, name: 'Amit Rao',      initials: 'AR', color: 'blue',   meetings: 19, deals: 7,  responseRate: 68, performance: 42 },
  { id: 5, name: 'Sunita Das',    initials: 'SD', color: 'blue',   meetings: 12, deals: 3,  responseRate: 52, performance: 22 },
];

export const funnel = [
  { label: 'Lead',    count: 1284, pct: 100, color: 'var(--primary)' },
  { label: 'Viewing', count: 94,   pct: 73,  color: 'var(--primary)' },
  { label: 'Offer',   count: 47,   pct: 37,  color: 'var(--primary)' },
  { label: 'Closed',  count: 64,   pct: 18,  color: 'var(--green)'   },
];

export const leads = [
  {
    id: 1, name: 'Rohit Gupta', budget: '₹85L', source: 'Meta Ads', status: 'Contacted',
    agent: 'Priya Sharma', agentInitials: 'PS', agentColor: 'blue', lastActivity: '2h ago',
    phone: '+91 98201 11234', email: 'rohit.gupta@email.com',
    propertyName: 'Baner Heights', areaName: 'Baner, Pune',
    dealProgress: 'Site visit done', paymentStatus: 'Token pending',
    notes: 'Interested in 3BHK. Budget flexible up to ₹90L.',
    comments: [{ author: 'Priya Sharma', time: 'Today 10:00 AM', text: 'Follow up scheduled for tomorrow 11 AM.' }],
  },
  {
    id: 2, name: 'Nisha Patel', budget: '₹1.2Cr', source: 'Website', status: 'Viewing',
    agent: 'Rahul Verma', agentInitials: 'RV', agentColor: 'purple', lastActivity: '5h ago',
    phone: '+91 99302 22345', email: 'nisha.patel@email.com',
    propertyName: 'Hinjewadi Residency', areaName: 'Hinjewadi, Pune',
    dealProgress: 'Second visit scheduled', paymentStatus: 'Not started',
    notes: 'Wants ground floor unit. Needs parking for 2 cars.',
    comments: [{ author: 'Rahul Verma', time: 'Today 11:15 AM', text: 'Showed 2 units. Prefers Unit 104.' }],
  },
  {
    id: 3, name: 'Karan Mehta', budget: '₹65L', source: 'Manual', status: 'New',
    agent: 'Meena Khanna', agentInitials: 'MK', agentColor: 'orange', lastActivity: '1d ago',
    phone: '+91 97403 33456', email: 'karan.mehta@email.com',
    propertyName: 'Wakad Square', areaName: 'Wakad, Pune',
    dealProgress: 'Initial inquiry', paymentStatus: 'Not started',
    notes: 'First-time buyer. Needs home loan assistance.',
    comments: [],
  },
  {
    id: 4, name: 'Sunita Joshi', budget: '₹2.1Cr', source: 'Meta Ads', status: 'Negotiation',
    agent: 'Priya Sharma', agentInitials: 'PS', agentColor: 'blue', lastActivity: '3h ago',
    phone: '+91 96504 44567', email: 'sunita.joshi@email.com',
    propertyName: 'Kharadi Towers', areaName: 'Kharadi, Pune',
    dealProgress: 'Offer letter sent', paymentStatus: 'Discount requested',
    notes: 'Asking for 5% discount. Decision expected by April 20.',
    comments: [
      { author: 'Priya Sharma', time: 'Today 10:42 AM', text: 'Client wants 5% off. Needs manager approval.' },
      { author: 'Aarav Kapoor', time: 'Today 11:15 AM', text: 'Can approve up to 3%. Confirm sign-off date first.' },
    ],
  },
  {
    id: 5, name: 'Deepak Nair', budget: '₹45L', source: 'Website', status: 'Stale',
    agent: 'Amit Rao', agentInitials: 'AR', agentColor: 'blue', lastActivity: '12d ago',
    phone: '+91 95605 55678', email: 'deepak.nair@email.com',
    propertyName: 'Pimple Saudagar Homes', areaName: 'Pimple Saudagar, Pune',
    dealProgress: 'No response', paymentStatus: 'Not started',
    notes: 'No response for 12 days. Consider reassignment.',
    comments: [],
  },
  {
    id: 6, name: 'Pooja Iyer', budget: '₹90L', source: 'Referral', status: 'Closed',
    agent: 'Rahul Verma', agentInitials: 'RV', agentColor: 'purple', lastActivity: 'Yesterday',
    phone: '+91 94706 66789', email: 'pooja.iyer@email.com',
    propertyName: 'Viman Nagar Vista', areaName: 'Viman Nagar, Pune',
    dealProgress: 'Deal closed', paymentStatus: 'Token received',
    notes: 'Deal closed at ₹88L. Registry pending.',
    comments: [{ author: 'Rahul Verma', time: 'Yesterday 3 PM', text: 'Token received. Registry on April 25.' }],
  },
  {
    id: 7, name: 'Arun Bhatia', budget: '₹55L', source: 'Meta Ads', status: 'New',
    agent: 'Sunita Das', agentInitials: 'SD', agentColor: 'blue', lastActivity: '6h ago',
    phone: '+91 93807 77890', email: 'arun.bhatia@email.com',
    propertyName: 'Undri Meadows', areaName: 'Undri, Pune',
    dealProgress: 'Initial call done', paymentStatus: 'Not started',
    notes: 'Looking for possession within 6 months.',
    comments: [],
  },
  {
    id: 8, name: 'Geeta Pillai', budget: '₹1.8Cr', source: 'Referral', status: 'Viewing',
    agent: 'Priya Sharma', agentInitials: 'PS', agentColor: 'blue', lastActivity: '1h ago',
    phone: '+91 92908 88901', email: 'geeta.pillai@email.com',
    propertyName: 'Koregaon Park Suites', areaName: 'Koregaon Park, Pune',
    dealProgress: 'Site visit scheduled', paymentStatus: 'Not started',
    notes: 'NRI client. Prefers fully furnished unit.',
    comments: [{ author: 'Priya Sharma', time: '1h ago', text: 'Visit confirmed for April 18, 11 AM.' }],
  },
  {
    id: 9, name: 'Vikram Singh', budget: '₹75L', source: 'Website', status: 'Contacted',
    agent: 'Amit Rao', agentInitials: 'AR', agentColor: 'blue', lastActivity: '2d ago',
    phone: '+91 91009 99012', email: 'vikram.singh@email.com',
    propertyName: 'Ravet Green Park', areaName: 'Ravet, Pune',
    dealProgress: 'Brochure sent', paymentStatus: 'Not started',
    notes: 'Comparing 3 properties. Decision in 2 weeks.',
    comments: [],
  },
  {
    id: 10, name: 'Lalita Menon', budget: '₹3Cr', source: 'Manual', status: 'Negotiation',
    agent: 'Rahul Verma', agentInitials: 'RV', agentColor: 'purple', lastActivity: '4h ago',
    phone: '+91 90110 10123', email: 'lalita.menon@email.com',
    propertyName: 'Boat Club Road Residences', areaName: 'Boat Club Road, Pune',
    dealProgress: 'Final negotiation', paymentStatus: 'Loan approved',
    notes: 'High value client. Ready to sign within this week.',
    comments: [{ author: 'Rahul Verma', time: '4h ago', text: 'Client agreed to ₹2.95Cr. Docs being prepared.' }],
  },
];

export const automationRules = {
  drip: [
    { id: 1, title: 'Day 1: WhatsApp intro',    desc: 'Sent when lead is created from Meta Ads', enabled: true  },
    { id: 2, title: 'Day 3: Property brochure', desc: 'Follows up with shortlisted properties',  enabled: true  },
  ],
  stale: [
    { id: 4, title: 'No activity for 7 days',   desc: 'Flags lead as stale, notifies agent',     enabled: true  },
    { id: 5, title: 'Auto-reassign at 14 days', desc: 'Moves to shared pool for reassignment',   enabled: true  },
  ],
  alerts: [
    { id: 6, title: 'Birthday wishes (WhatsApp)', desc: 'Sent at 9 AM on birthday',              enabled: true  },
    { id: 7, title: 'Festival greetings',          desc: 'Diwali, Holi, Eid — personalised',     enabled: true  },
  ],
  followup: [
    { id: 8, title: 'Post-site-visit follow-up',  desc: 'Task created 2h after viewing is logged', enabled: true },
    { id: 9, title: 'Negotiation check-in',        desc: 'Daily task when lead is in Negotiation',  enabled: true },
  ],
};

export const sharedPool = [
  { id: 1, name: 'Rohit Gupta',  initials: 'RG', color: 'blue',   detail: '₹85L, 3BHK',   source: 'Meta Ads', staleDays: '5 days' },
  { id: 2, name: 'Sonia Kapoor', initials: 'SK', color: 'orange', detail: '₹1.5Cr, Villa', source: 'Website',  staleDays: '3 days' },
  { id: 3, name: 'Arun Jha',     initials: 'AJ', color: 'green',  detail: '₹60L, 2BHK',   source: 'Referral', staleDays: null     },
];

export const approvals = [
  { id: 1, title: 'Discount: ₹3L off — Nisha Patel',   requestedBy: 'Rahul Verma',  time: '1h ago'    },
  { id: 2, title: 'Handoff: Sunita Joshi → Priya',     requestedBy: 'Amit Rao',     time: '3h ago'    },
  { id: 3, title: 'Extended timeline: Karan Mehta',    requestedBy: 'Meena Khanna', time: 'Yesterday' },
];

export const comments = [
  { id: 1, author: 'Priya Sharma',           initials: 'PS', color: 'blue',   time: 'Today 10:42 AM', text: 'Client is interested in the Baner project. Has seen 2 units. Wants 5% discount to finalize. Needs manager approval.' },
  { id: 2, author: 'Aarav Kapoor (Manager)', initials: 'AK', color: 'indigo', time: 'Today 11:15 AM', text: "Will approve up to 3%. Beyond that needs MD sign-off. Please confirm client's timeline — are they ready to sign this month?" },
  { id: 3, author: 'Priya Sharma',           initials: 'PS', color: 'blue',   time: 'Today 11:38 AM', text: 'Client confirmed ready by April 20. Targeting token this weekend. Will update after call at 3 PM today.' },
];

export const reportKpis = [
  { label: 'Avg. Time to Close', value: '23d',     delta: '▲ 2d faster',    trend: 'up'      },
  { label: 'Drop-off Rate',      value: '68%',     delta: '▼ worsened 4%',  trend: 'down'    },
  { label: 'Inventory Turnover', value: '12.4%',   delta: '▲ 1.2%',         trend: 'up'      },
  { label: 'Revenue (MTD)',      value: '₹12.8Cr', delta: '— On track',     trend: 'neutral' },
];

export const agentConversion = [
  { name: 'Priya Sharma', pct: 88, color: 'var(--green)'   },
  { name: 'Rahul Verma',  pct: 72, color: 'var(--primary)' },
  { name: 'Meena Khanna', pct: 54, color: 'var(--primary)' },
  { name: 'Amit Rao',     pct: 41, color: 'var(--amber)'   },
  { name: 'Sunita Das',   pct: 28, color: 'var(--red)'     },
];

export const dropoffPoints = [
  { label: 'Lead → Contacted',    pct: 47, color: 'var(--amber)'   },
  { label: 'Contacted → Viewing', pct: 43, color: 'var(--amber)'   },
  { label: 'Viewing → Offer',     pct: 50, color: 'var(--primary)' },
  { label: 'Offer → Closed',      pct: 68, color: 'var(--green)'   },
];