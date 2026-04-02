import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
    toast({
      title: t('message_sent') || 'Message Sent',
      description: t('message_sent_desc') || 'We\'ll get back to you soon!',
    });
  };

  const fadeInUp = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {t('contact_us') || 'Contact Us'}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('contact_hero_desc') || 'Have a question, feedback, or just want to say hello? We\'d love to hear from you!'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto -mt-32 relative z-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {[
              { icon: MapPin, title: t('address') || 'Address', info: '123 Food Street, Cuisine City, CC 12345' },
              { icon: Phone, title: t('phone') || 'Phone', info: '+1 (555) 123-4567' },
              { icon: Mail, title: t('email') || 'Email', info: 'hello@foodonline.com' },
              { icon: Clock, title: t('hours') || 'Hours', info: 'Mon-Sun: 8AM - 10PM' },
            ].map((contact, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center">
                    <contact.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{contact.title}</h3>
                  <p className="text-muted-foreground text-sm">{contact.info}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-8">
                  {submitted ? (
                    <motion.div
                      className="text-center py-12"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{t('thank_you') || 'Thank You!'}</h3>
                      <p className="text-muted-foreground">
                        {t('message_received') || 'Your message has been received. We\'ll get back to you soon.'}
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mb-6">{t('send_message') || 'Send us a Message'}</h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <Label htmlFor="name">{t('your_name') || 'Your Name'}</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={t('name_placeholder') || 'John Doe'}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">{t('your_email') || 'Your Email'}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={t('email_placeholder') || 'john@example.com'}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject">{t('subject') || 'Subject'}</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder={t('subject_placeholder') || 'How can we help?'}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">{t('message') || 'Message'}</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder={t('message_placeholder') || 'Tell us more about your inquiry...'}
                            className="mt-1 min-h-[120px]"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full py-6 h-12 gradient-primary rounded-xl text-base font-medium shadow-lg hover:shadow-xl transition-all"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              {t('sending') || 'Sending...'}
                            </div>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              {t('send_message') || 'Send Message'}
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </Card>
              </motion.div>

              {/* FAQ or Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center"
              >
                <h2 className="text-2xl font-bold mb-6">{t('faqs') || 'Frequently Asked Questions'}</h2>
                <div className="space-y-4">
                  {[
                    { q: t('faq_delivery_q') || 'How long does delivery take?', a: t('faq_delivery_a') || 'Most orders are delivered within 30-45 minutes depending on your location and restaurant preparation time.' },
                    { q: t('faq_payment_q') || 'What payment methods do you accept?', a: t('faq_payment_a') || 'We accept credit/debit cards, digital wallets, and cash on delivery in select areas.' },
                    { q: t('faq_cancel_q') || 'Can I cancel my order?', a: t('faq_cancel_a') || 'Orders can be cancelled within 5 minutes of placing them or before the restaurant starts preparing your food.' },
                    { q: t('faq_track_q') || 'How can I track my order?', a: t('faq_track_a') || 'You can track your order in real-time through our app or website once it\'s been picked up by a delivery partner.' },
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                      whileHover={{ x: 5 }}
                    >
                      <h4 className="font-semibold mb-2 text-primary">{faq.q}</h4>
                      <p className="text-muted-foreground text-sm">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
