import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CreditCard,
  Bike,
  Shield,
  Gift
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t("quick_links"),
      links: [
        { name: t("restaurants"), path: "/restaurants" },
        { name: t("track_order"), path: "/orders" },
        { name: t("favorites"), path: "/favorites" },
        { name: t("special_offers"), path: "/offers" },
        { name: t("new_arrivals"), path: "/new" },
      ]
    },
    {
      title: t("customer_service"),
      links: [
        { name: t("help_center"), path: "/help" },
        { name: t("contact_us"), path: "/contact" },
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

  const features = [
    { icon: Bike, title: t("fast_delivery"), desc: t("delivery_guarantee") },
    { icon: Shield, title: t("secure_payments"), desc: t("pci_compliant") },
    { icon: Gift, title: t("daily_offers"), desc: t("exclusive_discounts") },
    { icon: CreditCard, title: t("multiple_payment"), desc: t("all_major_cards") },
  ];

  return (
    <footer className="bg-gradient-to-br from-muted/50 to-background border-t mt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary-700 bg-clip-text text-transparent">
                FoodDash
              </span>
            </motion.div>
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {t("footer_description")}
            </motion.p>
            
            {/* Contact Info */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+93 70 123 4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@fooddash.af</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t("address_kabul")}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{t("operating_hours")}</span>
              </div>
            </motion.div>
            
            {/* Social Media */}
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
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
                    <Link 
                      to={link.path} 
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center group"
                    >
                      <span className="group-hover:ml-1 transition-all duration-200">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Feedback Form */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <h3 className="font-semibold text-xl">FoodDash</h3>
            </div>
            <h3 className="font-semibold mb-6 text-lg relative">
              {t("send_feedback")}
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("feedback_description")}
            </p>
            <form className="space-y-3">
              <input
                type="text"
                placeholder={t("your_name")}
                className="w-full px-4 py-3 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <input
                type="email"
                placeholder={t("your_email")}
                className="w-full px-4 py-3 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <textarea
                placeholder={t("your_message")}
                rows={4}
                className="w-full px-4 py-3 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              ></textarea>
              <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                {t("send_feedback")}
              </button>
            </form>
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