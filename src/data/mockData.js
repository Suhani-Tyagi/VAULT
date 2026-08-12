export const MOCK_USER = {
  name: "Rohan Sharma",
  email: "rohan.sharma@gmail.com",
  city: "Bengaluru, KA",
  accountNo: "•••• 8492",
  fullAccountNo: "4829 1048 8492",
  ifscCode: "VAUL0001042",
  upiId: "rohan.sharma@vault",
  availableBalance: 48520.50,
  monthlyIncome: 85000.00,
  safeToSpend: 34120.50, // Available minus allocated goals
  profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
  biometricsEnabled: false, // Can be toggled in Settings
  requirePinOverThreshold: true,
  pinThreshold: 5000,
  pushNotifications: true,
  emailAlerts: true,
  smsAlerts: true,
  linkedCard: {
    bank: "HDFC Bank (Salary)",
    cardNo: "•••• 4109",
    fullCardNo: "4532 •••• •••• 4109",
    type: "Debit Mastercard",
    expiry: "08/28"
  },
  activeSession: {
    device: "iPhone 15 Pro",
    location: "Bengaluru, KA",
    time: "Just now (Active)"
  }
};

export const MOCK_CONTACTS = [
  {
    id: "c1",
    name: "Aditi Nair",
    upiId: "aditi.nair@okhdfcbank",
    phone: "+91 98765 43210",
    avatarBg: "#B5563C",
    initials: "AN",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "c2",
    name: "Rahul Verma",
    upiId: "rahulv@icici",
    phone: "+91 98123 76543",
    avatarBg: "#6B8272",
    initials: "RV",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "c3",
    name: "Priya Patel",
    upiId: "priyapatel@axisbank",
    phone: "+91 97654 12389",
    avatarBg: "#C68A2E",
    initials: "PP",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: "c4",
    name: "Siddharth Rao",
    upiId: "siddharth.r@paytm",
    phone: "+91 99012 34567",
    avatarBg: "#5C6B73",
    initials: "SR",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
  }
];

export const MOCK_GOALS = [
  {
    id: "g1",
    title: "Trip to Goa with Friends",
    targetAmount: 35000,
    currentAmount: 28500,
    category: "Travel",
    iconName: "Plane",
    color: "#B5563C",
    targetDate: "Oct 2026",
    notes: "Flights & Airbnb booking for South Goa weekend"
  },
  {
    id: "g2",
    title: "New M3 MacBook Pro",
    targetAmount: 140000,
    currentAmount: 22000,
    category: "Tech",
    iconName: "Laptop",
    color: "#6B8272",
    targetDate: "Dec 2026",
    notes: "Upgrading workstation for side projects"
  }
];

export const MOCK_TRANSACTIONS = [
  {
    id: "tx-101",
    merchant: "Swiggy Gourmet",
    category: "Food & Dining",
    amount: 684.00,
    type: "debit",
    date: "Today, 1:15 PM",
    timestamp: "2026-08-12T13:15:00",
    runningBalance: 48520.50,
    method: "UPI (Vault Pay)",
    upiRef: "422910849201",
    icon: "Utensils",
    note: "Lunch order with team"
  },
  {
    id: "tx-102",
    merchant: "Blinkit Instant",
    category: "Groceries",
    amount: 347.50,
    type: "debit",
    date: "Today, 9:30 AM",
    timestamp: "2026-08-12T09:30:00",
    runningBalance: 49204.50,
    method: "UPI AutoPay",
    upiRef: "422909301284",
    icon: "ShoppingBag",
    note: "Milk, sourdough bread & coffee beans"
  },
  {
    id: "tx-103",
    merchant: "Swiggy Refund (Cancelled Item)",
    category: "Refund",
    amount: 340.00,
    type: "refund",
    date: "Yesterday, 8:40 PM",
    timestamp: "2026-08-11T20:40:00",
    runningBalance: 49552.00,
    method: "Refund to Vault",
    upiRef: "REF-883920194",
    icon: "RotateCcw",
    note: "Out of stock item refund credited automatically"
  },
  {
    id: "tx-104",
    merchant: "Uber India",
    category: "Transport",
    amount: 245.00,
    type: "debit",
    date: "Yesterday, 6:15 PM",
    timestamp: "2026-08-11T18:15:00",
    runningBalance: 49212.00,
    method: "UPI (Vault Pay)",
    upiRef: "422818159920",
    icon: "Car",
    note: "Cab home from Indiranagar office"
  },
  {
    id: "tx-105",
    merchant: "Amazon India",
    category: "Shopping",
    amount: 1849.00,
    type: "debit",
    date: "Aug 10, 2026",
    timestamp: "2026-08-10T14:22:00",
    runningBalance: 49457.00,
    method: "Debit Card (•••• 8492)",
    upiRef: "AMZ-993021940",
    icon: "Package",
    note: "Ergonomic wrist rest & Type-C cable"
  },
  {
    id: "tx-106",
    merchant: "Sri Manjunatha Kirana",
    category: "Groceries",
    amount: 89.00,
    type: "debit",
    date: "Aug 10, 2026",
    timestamp: "2026-08-10T11:05:00",
    runningBalance: 51306.00,
    method: "UPI QR Code",
    upiRef: "422711058392",
    icon: "Store",
    note: "Bottled water & coconut water"
  },
  {
    id: "tx-107",
    merchant: "Third Wave Coffee",
    category: "Food & Dining",
    amount: 320.00,
    type: "debit",
    date: "Aug 09, 2026",
    timestamp: "2026-08-09T16:45:00",
    runningBalance: 51395.00,
    method: "UPI (Vault Pay)",
    upiRef: "422616450192",
    icon: "Coffee",
    note: "Iced Latte while working"
  },
  {
    id: "tx-108",
    merchant: "Aditi Nair (Split: Dinner at Toit)",
    category: "Transfers",
    amount: 1240.00,
    type: "credit",
    date: "Aug 08, 2026",
    timestamp: "2026-08-08T21:10:00",
    runningBalance: 51715.00,
    method: "UPI Transfer",
    upiRef: "422521109943",
    icon: "ArrowDownLeft",
    note: "Received for brewery bill split"
  },
  {
    id: "tx-109",
    merchant: "BESCOM Electricity Bill",
    category: "Utilities",
    amount: 1435.00,
    type: "debit",
    date: "Aug 05, 2026",
    timestamp: "2026-08-05T10:00:00",
    runningBalance: 50475.00,
    method: "AutoPay Vault",
    upiRef: "BES-2026-08-492",
    icon: "Zap",
    note: "Monthly electricity bill — Koramangala apt"
  },
  {
    id: "tx-110",
    merchant: "Netflix India Premium",
    category: "Subscriptions",
    amount: 649.00,
    type: "debit",
    date: "Aug 04, 2026",
    timestamp: "2026-08-04T02:15:00",
    runningBalance: 51910.00,
    method: "Recurring Subscription",
    upiRef: "NFLX-99301284",
    icon: "Tv",
    note: "Monthly Ultra HD plan"
  },
  {
    id: "tx-111",
    merchant: "Apartment Rent — August",
    category: "Rent",
    amount: 22000.00,
    type: "debit",
    date: "Aug 01, 2026",
    timestamp: "2026-08-01T09:00:00",
    runningBalance: 52559.00,
    method: "Bank Transfer (NEFT)",
    upiRef: "NEFT202608019940",
    icon: "Home",
    note: "Monthly rent to Landlord Ramesh"
  },
  {
    id: "tx-112",
    merchant: "TechCorp Pvt Ltd Salary",
    category: "Income",
    amount: 85000.00,
    type: "credit",
    date: "Jul 31, 2026",
    timestamp: "2026-07-31T06:00:00",
    runningBalance: 74559.00,
    method: "Direct Deposit (ACH)",
    upiRef: "SAL-JUL-2026-8819",
    icon: "Wallet",
    note: "July salary payout"
  }
];

export const MOCK_INSIGHTS = {
  currentMonthTotal: 30378.00,
  lastMonthTotal: 34500.00,
  comparisonSentence: "You spent 12% less on food & dining out this month compared to July — keeping you ₹3,400 ahead of your plan.",
  categoryBreakdown: [
    { category: "Rent & Housing", amount: 22000, percent: 72, color: "#6B8272" },
    { category: "Food & Dining", amount: 3456, percent: 11, color: "#B5563C" },
    { category: "Shopping & Tech", amount: 1849, percent: 6, color: "#C68A2E" },
    { category: "Utilities & Bills", amount: 1435, percent: 5, color: "#8E7268" },
    { category: "Subscriptions", amount: 898, percent: 3, color: "#A87C6F" },
    { category: "Transport", amount: 740, percent: 3, color: "#5C6B73" }
  ]
};
