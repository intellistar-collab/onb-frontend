"use client";

import { useState } from "react";

export default function AccountSupport() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "",
    priority: "medium",
    description: ""
  });

  const [supportData] = useState({
    tickets: [
      {
        id: "T-2024-001",
        subject: "Issue with mystery box opening",
        category: "Technical",
        status: "open",
        priority: "high",
        created: "2024-01-15",
        lastUpdate: "2024-01-16",
        messages: 3
      },
      {
        id: "T-2024-002",
        subject: "Refund request for duplicate item",
        category: "Billing",
        status: "in_progress",
        priority: "medium",
        created: "2024-01-12",
        lastUpdate: "2024-01-14",
        messages: 5
      },
      {
        id: "T-2024-003",
        subject: "Account verification help",
        category: "Account",
        status: "resolved",
        priority: "low",
        created: "2024-01-08",
        lastUpdate: "2024-01-10",
        messages: 2
      }
    ],
    faq: [
      {
        id: 1,
        question: "How do I open a mystery box?",
        answer: "To open a mystery box, go to your inventory, select the box you want to open, and click the 'Open' button. The reveal animation will show your prize!",
        category: "Gameplay",
        helpful: 45
      },
      {
        id: 2,
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and various cryptocurrencies.",
        category: "Billing",
        helpful: 38
      },
      {
        id: 3,
        question: "How long does shipping take?",
        answer: "Physical items typically ship within 7-14 business days. Digital items and experiences are delivered instantly to your account.",
        category: "Shipping",
        helpful: 52
      },
      {
        id: 4,
        question: "Can I return or exchange items?",
        answer: "Due to the nature of mystery boxes, all sales are final. However, if you receive a damaged item, please contact support within 7 days.",
        category: "Returns",
        helpful: 23
      },
      {
        id: 5,
        question: "How does the referral program work?",
        answer: "Share your unique referral code with friends. When they sign up and make their first purchase, you'll earn commission based on your tier level.",
        category: "Referrals",
        helpful: 67
      }
    ],
    quickActions: [
      {
        title: "Report a Bug",
        description: "Found a technical issue? Let us know!",
        icon: "🐛",
        action: "bug_report"
      },
      {
        title: "Account Issues",
        description: "Problems with login or account access",
        icon: "👤",
        action: "account_help"
      },
      {
        title: "Billing Questions",
        description: "Payment, refund, or subscription issues",
        icon: "💳",
        action: "billing_help"
      },
      {
        title: "Item Claims",
        description: "Issues with claiming or receiving items",
        icon: "📦",
        action: "item_help"
      }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "text-red-500 bg-red-500/10";
      case "in_progress": return "text-yellow-500 bg-yellow-500/10";
      case "resolved": return "text-green-500 bg-green-500/10";
      case "closed": return "text-gray-500 bg-gray-500/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle ticket submission
    console.log("Submitting ticket:", newTicket);
    // Reset form
    setNewTicket({
      subject: "",
      category: "",
      priority: "medium",
      description: ""
    });
  };

  const tabs = [
    { id: "tickets", label: "Support Tickets", icon: "🎫" },
    { id: "faq", label: "FAQ", icon: "❓" },
    { id: "contact", label: "Contact Us", icon: "📧" }
  ];

  return (
    <div className="space-y-6">
      {/* Support Header */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-2">🛟 Support Center</h3>
        <p className="text-muted-foreground mb-4">
          Get help with your account, report issues, or find answers to common questions.
        </p>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {supportData.quickActions.map((action, index) => (
            <button
              key={index}
              className="bg-background border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors text-left"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="font-medium text-foreground text-sm">{action.title}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card rounded-lg border border-border shadow-lg">
        <div className="border-b border-border">
          <nav className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "tickets" && (
            <div className="space-y-6">
              {/* Create New Ticket */}
              <div className="bg-background rounded-lg border border-border p-4">
                <h4 className="font-semibold text-foreground mb-4">Create New Ticket</h4>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                      <input
                        type="text"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="technical">Technical</option>
                        <option value="billing">Billing</option>
                        <option value="account">Account</option>
                        <option value="shipping">Shipping</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Please provide detailed information about your issue..."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>

              {/* Existing Tickets */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Your Tickets</h4>
                <div className="space-y-3">
                  {supportData.tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-background rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-foreground">{ticket.subject}</h5>
                          <p className="text-sm text-muted-foreground">Ticket ID: {ticket.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Created: {ticket.created}</span>
                        <span>{ticket.messages} messages</span>
                      </div>
                      
                      <div className="mt-3">
                        <button className="text-primary hover:text-primary/80 transition-colors text-sm">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground mb-4">Frequently Asked Questions</h4>
              
              <div className="space-y-4">
                {supportData.faq.map((item) => (
                  <div key={item.id} className="bg-background rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-foreground">{item.question}</h5>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {item.category}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{item.answer}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        👍 {item.helpful} found this helpful
                      </span>
                      <div className="flex gap-2">
                        <button className="text-xs text-green-500 hover:text-green-600">
                          👍 Helpful
                        </button>
                        <button className="text-xs text-red-500 hover:text-red-600">
                          👎 Not helpful
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground mb-4">Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-background rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📧</span>
                      <div>
                        <h5 className="font-medium text-foreground">Email Support</h5>
                        <p className="text-sm text-muted-foreground">Get help via email</p>
                      </div>
                    </div>
                    <p className="text-primary">support@onenightbox.com</p>
                    <p className="text-xs text-muted-foreground mt-1">Response time: 24-48 hours</p>
                  </div>
                  
                  <div className="bg-background rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💬</span>
                      <div>
                        <h5 className="font-medium text-foreground">Live Chat</h5>
                        <p className="text-sm text-muted-foreground">Chat with our team</p>
                      </div>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm">
                      Start Chat
                    </button>
                    <p className="text-xs text-muted-foreground mt-1">Available 9 AM - 6 PM EST</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-background rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📱</span>
                      <div>
                        <h5 className="font-medium text-foreground">Social Media</h5>
                        <p className="text-sm text-muted-foreground">Follow us for updates</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Twitter</button>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Facebook</button>
                      <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm">Discord</button>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📚</span>
                      <div>
                        <h5 className="font-medium text-foreground">Help Center</h5>
                        <p className="text-sm text-muted-foreground">Browse our knowledge base</p>
                      </div>
                    </div>
                    <button className="text-primary hover:text-primary/80 transition-colors text-sm">
                      Visit Help Center →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
