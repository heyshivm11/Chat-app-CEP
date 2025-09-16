
import type { Script } from './types';

export const scripts: Script[] = [
  // ETG Scripts
  {
    id: 'etg-1',
    department: 'etg',
    category: 'Request Not Stated & Non-Verified',
    title: 'Request Not Stated & Non-Verified',
    content: [
        {
          title: 'Greeting',
          content: 'Welcome to Customer Care [Customer First Name], you’re speaking with [Agent Name]!',
        },
        {
          title: 'Verification Request',
          content: 'Before we get started, could you please provide me with your order number so I can confirm your details in our system?',
        },
        {
          title: 'Confirmation and query',
          content: 'Great! Thank you for sharing your information. How may I assist you today?',
        },
    ]
  },
  {
    id: 'etg-2',
    department: 'etg',
    category: 'Request Not Stated & Verified',
    title: 'Request Not Stated & Verified',
    content: "Welcome to Customer Care [Customer First Name], you’re speaking with [Agent Name]! How may I assist you today?",
  },
  {
    id: 'etg-3',
    department: 'etg',
    category: 'Request Stated & Non-Verified',
    title: 'Request Stated & Non-Verified',
    content: [
      {
        title: 'Greeting',
        content: 'Welcome to Customer Care [Customer First Name], you’re speaking with [Agent Name]!',
      },
      {
        title: 'Verification Request',
        content: 'Before we get started, could you please provide me with your order number so I can confirm your details in our system?',
      },
      {
        title: 'Acknowledge Request',
        content: 'I see that you have shared your request, please give me a moment to review it.',
      },
    ]
  },
  {
    id: 'etg-4',
    department: 'etg',
    category: 'Request Stated & Verified',
    title: 'Request Stated & Verified',
    content: [
        {
          title: 'Greeting',
          content: 'Welcome to Customer Care [Customer First Name], you’re speaking with [Agent Name]!',
        },
        {
          title: 'Acknowledge Request',
          content: 'I see that you have shared your request, please give me a moment to review it.',
        }
    ]
  },
  {
    id: 'etg-5',
    department: 'etg',
    category: 'Verified – Request Stated (Transferred Chat)',
    title: 'Verified – Request Stated (Transferred Chat)',
    content: [
        {
            title: 'Greeting',
            content: 'Welcome to Customer Care [Customer First Name], you’re speaking with [Agent Name]!',
        },
        {
            title: 'Acknowledge Transfer',
            content: 'I see that my colleague has transferred your chat to my team for support.',
        }
    ]
  },

  // Booking.com Scripts
  {
    id: 'bookingcom-1',
    department: 'bookingcom',
    category: 'Request Not Stated & Non-Verified',
    title: 'Request Not Stated & Non-Verified',
    content: [
        {
          title: 'Greeting',
          content: 'Welcome to Gotogate Customer Care in partnership with Booking.com [Customer First Name]! My name is [Agent Name]!',
        },
        {
          title: 'Verification Request',
          content: 'Before we get started, could you please provide me with your order number so I can confirm your details in our system?',
        },
        {
          title: 'Confirmation and Query',
          content: 'Great! Thank you for sharing your information. How may I assist you today?',
        },
    ]
  },
  {
    id: 'bookingcom-2',
    department: 'bookingcom',
    category: 'Request Not Stated & Verified',
    title: 'Request Not Stated & Verified',
    content: 'Welcome to Gotogate Customer Care in partnership with Booking.com [Customer First Name]! My name is [Agent Name]!How may I assist you today?',
  },
  {
    id: 'bookingcom-3',
    department: 'bookingcom',
    category: 'Request Stated & Non-Verified',
    title: 'Request Stated & Non-Verified',
    content: [
        {
          title: 'Greeting',
          content: 'Welcome to Gotogate Customer Care in partnership with Booking.com [Customer First Name]! My name is [Agent Name]!',
        },
        {
          title: 'Verification Request',
          content: 'Before we get started, could you please provide me with your order number so I can confirm your details in our system?',
        },
        {
          title: 'Acknowledge Request',
          content: 'I see that you have shared your request, please give me a moment to review it.',
        }
    ]
  },
  {
    id: 'bookingcom-4',
    department: 'bookingcom',
    category: 'Request Stated & Verified',
    title: 'Request Stated & Verified',
    content: [
        {
          title: 'Greeting',
          content: 'Welcome to Gotogate Customer Care in partnership with Booking.com [Customer First Name]! My name is [Agent Name]!',
        },
        {
          title: 'Acknowledge Request',
          content: 'I see that you have shared your request, please give me a moment to review it.',
        }
    ]
  },
  {
    id: 'bookingcom-5',
    department: 'bookingcom',
    category: 'Verified – Request Stated (Transferred Chat)',
    title: 'Verified – Request Stated (Transferred Chat)',
    content: [
        {
          title: 'Greeting',
          content: 'Welcome to Gotogate Customer Care in partnership with Booking.com [Customer First Name]! My name is [Agent Name]!',
        },
        {
          title: 'Acknowledge Transfer and Review',
          content: 'Before we get started, I see that my colleague has transferred your chat to my team for support. I would need some time to review your request to assist you better. Is that ok?',
        }
    ]
  },

  // Common Scripts
  {
    id: 'common-2',
    department: 'common',
    category: 'Conversation Flow',
    title: 'Conversation Flow',
    content: [
      {
        title: 'Acknowledge initial query',
        content: 'I understand that you need help with……..is that correct',
      },
      {
        title: 'Commitment to assist',
        content: 'You’ve come to the right place! I’ll do my best to find the most suitable solution for you!',
      },
      {
        title: 'Probing',
        content: 'Can I ask you a few questions to better understand the situation? / To better assist you / to better understand the situation, I’ll need to ask a few questions. Is that ok?',
      },
      {
        title: 'Discuss Solution & Gain Agreement',
        content: 'So, the available options are… / So, as you have mentioned, the ideal choice for you is…Is this solution clear? Do you have any questions? I just want to make sure that everything is clear before we proceed',
      },
      {
        title: 'Summarize & Resolve',
        content: 'So [Customer First Name], to summarize we discussed that....',
      },
      {
        title: 'Further assistance',
        content: 'I hope everything is clear. Do you have any further questions?',
      },
      {
        title: 'Closing',
        content: 'Thank you for using our service. Should you require any further assistance, please don’t hesitate to get in touch.',
      },
       {
        title: 'Wish',
        content: 'Wishing you a wonderful day ahead!',
      },
    ],
  },
  {
    id: 'common-3',
    department: 'common',
    category: 'Workflow',
    title: "Customer doesn't respond 1st Warning",
    content: "Hi, I wanted to check in to see if you're still with us. Please reply so I can continue assisting you. If I don't hear from you in the next 3 minutes, the chat will close due to inactivity. \n\nDon't worry - you can always reach out again whenever you’re ready. We’re here to help!",
  },
  {
    id: 'common-4',
    department: 'common',
    category: 'Workflow',
    title: 'Close chat after no response for 5 min',
    content: "I still haven't received a response, and it seems that you are no longer connected. This chat will now be closed. \nIf you need further assistance, please start a new chat.\nThank you.",
  },
  {
    id: 'common-5',
    department: 'common',
    category: 'Workflow',
    title: 'Hold',
    content: 'Please give me a moment to review your information. I will be back shortly.',
  },
  {
    id: 'common-6',
    department: 'common',
    category: 'Workflow',
    title: 'Refresh Hold',
    content: 'Thank you for waiting. But I will need a few more minutes to work on your request.',
  },
  {
    id: 'common-7',
    department: 'common',
    category: 'Workflow',
    title: 'Consequent refresh hold',
    content: 'I am still working on your request and am almost there. I just need a few more minutes to wrap this up. I appreciate your patience while I make sure everything is handled properly.',
  },
  {
    id: 'common-1',
    department: 'common',
    category: 'Chat Closing',
    title: 'Chat Closing',
    content: [
        {
            title: 'Closing',
            content: 'Thank you for contacting us. Should you require any further assistance, please don’t hesitate to get in touch.'
        },
        {
            title: 'Wish',
            content: 'Wishing you a wonderful day ahead!',
        }
    ]
  },
];

export const scriptCategories = [...new Set(scripts.map(s => s.category))];
