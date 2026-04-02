import { Link, useNavigate } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Star,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.jpg';

export default function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  
  // Feedback form state
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  });

  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmittingContact(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      type: 'general'
    });
    alert('Thank you for your message! We will get back to you soon.');
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmittingFeedback(false);
    setFeedbackData({
      name: '',
      email: '',
      message: '',
      rating: 0
    });
    alert('Thank you for your feedback! It helps us improve our service.');
  };

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time through the Orders page or mobile app.'
    },
    {
      question: 'What are the delivery charges?',
      answer: 'Delivery fees vary by restaurant and distance. You can see the exact fee before checkout.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel within 5 minutes of placing your order if the restaurant hasn\'t started preparing it.'
    }
  ];

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerSections = [
    {
      title: t("quick_links"),
      links: [
        { name: t("restaurants"), onClick: () => scrollToSection('restaurants-section') },
        { name: t("track_order"), path: "/user/orders" },
        { name: t("favorites"), path: "/user/favorites" },
        { name: t("special_offers"), path: "/category/special-offers" },
        { name: t("services"), onClick: () => scrollToSection('services-section') },
        { name: t("about_us"), onClick: () => scrollToSection('about-section') },
      ]
    },
    {
      title: t("customer_service"),
      links: [
        { name: t("help_center"), path: "/help" },
        { name: t("contact_us"), onClick: () => scrollToSection('contact-section') },
        { name: t("terms_of_service"), path: "/terms" },
        { name: t("privacy_policy"), path: "/privacy" },
        { name: t("refund_policy"), path: "/refund" },
      ]
    },
    {
      title: t("for_restaurants"),
      links: [
        { name: t("partner_with_us"), path: "/partner" },
        { name: t("add_your_restaurant"), path: "/add-restaurant" },
        { name: t("business_blog"), path: "/business-blog" },
        { name: t("restaurant_apps"), path: "/restaurant-apps" },
      ]
    }
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <motion.img 
                src={logo} 
                alt="FoodDash Logo" 
                className="w-14 h-14 rounded-2xl object-cover shadow-xl"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <div>
                <span className="font-bold text-3xl bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent block">
                  FoodDash
                </span>
                <p className="text-xs text-muted-foreground -mt-1">Delicious food delivered fast</p>
              </div>
            </motion.div>
            <motion.p 
              className="text-sm text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {t("footer_description")}
            </motion.p>
            
            {/* Social Media */}
            <motion.div 
              className="flex gap-4 pt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {[
                { Icon: Facebook, href: "https://facebook.com/fooddash", color: "hover:bg-blue-600" },
                { Icon: Twitter, href: "https://twitter.com/fooddash", color: "hover:bg-sky-500" },
                { Icon: Instagram, href: "https://instagram.com/fooddash", color: "hover:bg-pink-600" },
                { Icon: Youtube, href: "https://youtube.com/fooddash", color: "hover:bg-red-600" },
                { Icon: Linkedin, href: "https://linkedin.com/company/fooddash", color: "hover:bg-blue-700" }
              ].map(({ Icon, href, color }, idx) => (
                <motion.a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`h-11 w-11 rounded-full bg-white/10 dark:bg-gray-800 flex items-center justify-center border border-white/20 dark:border-gray-700 shadow-lg transition-all duration-300 ${color}`}
                  whileHover={{ scale: 1.2, rotate: 10, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <motion.div 
              key={index}
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <h3 className="font-semibold mb-6 text-lg relative">
                {section.title}
                <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-primary rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.onClick ? (
                      <button 
                        onClick={link.onClick} 
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center group text-left w-full"
                      >
                        <span className="group-hover:ml-1 transition-all duration-200">{link.name}</span>
                      </button>
                    ) : (
                      <Link 
                        to={link.path || '#'} 
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center group"
                      >
                        <span className="group-hover:ml-1 transition-all duration-200">{link.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact & Feedback Row */}
        <div id="contact-section" className="mt-20 pt-16 border-t border-primary/10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-xl p-8 md:p-10 border border-border h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{t('contact')}</h2>
                    <p className="text-muted-foreground">General support & business inquiries</p>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                        className="rounded-xl bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                        className="rounded-xl bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+93 70 123 4567"
                        className="rounded-xl bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Inquiry Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none h-10"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="business">Business Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-input focus:border-primary focus:outline-none transition-colors bg-background/50 resize-none"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmittingContact}
                    className="w-full py-6 h-12 btn-grad text-lg rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmittingContact ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Feedback & Rating Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-xl p-8 md:p-10 border border-border h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-orange-500 rounded-2xl shadow-lg">
                    <Star className="h-8 w-8 text-white fill-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Feedback</h2>
                    <p className="text-muted-foreground">Share your experience with us</p>
                  </div>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <Input
                        type="text"
                        value={feedbackData.name}
                        onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                        placeholder="Your Name"
                        required
                        className="rounded-xl bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={feedbackData.email}
                        onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="rounded-xl bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-2">Rating *</label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                          className="transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star 
                            className={`h-10 w-10 ${
                              feedbackData.rating >= star 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Feedback *
                    </label>
                    <textarea
                      value={feedbackData.message}
                      onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-input focus:border-primary focus:outline-none transition-colors bg-background/50 resize-none"
                      placeholder="What did you like or dislike?"
                      required
                    ></textarea>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmittingFeedback}
                    className="w-full py-6 h-12 btn-grad text-lg rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section Row */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm shadow-lg p-8 md:p-10 border border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-md">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
                      <HelpCircle className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">Common Questions</h2>
                  </div>
                  <p className="text-muted-foreground mb-6">Quick answers to frequently asked questions about our service.</p>
                  
                  {/* Footer Contact Icons */}
                  <div className="space-y-4 pt-4 border-t border-primary/10">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <span className="font-medium">+93 70 123 4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <span className="font-medium">support@fooddash.af</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">Kabul, Afghanistan</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 grid md:grid-cols-1 gap-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-6 rounded-2xl bg-background/40 hover:bg-background/60 transition-colors border border-border/50 shadow-sm">
                      <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="mt-16 pt-8 border-t text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} FoodDash. {t("all_rights_reserved")}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span>{t("designed_with_love")}</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}