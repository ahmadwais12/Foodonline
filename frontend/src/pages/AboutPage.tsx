import { motion } from 'framer-motion';
import { Award, Users, Clock, MapPin, Phone, Mail, ChevronRight, Utensils, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Spotlight } from '@/components/ui/spotlight';
import { MovingBorder } from '@/components/ui/moving-border';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

export default function AboutPage() {
  const { t } = useLanguage();

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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section with Spotlight */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="orange" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
            >
              <Utensils className="w-4 h-4 mr-2" />
              <span>{t('serving_excellence') || 'Serving Excellence Since 2020'}</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
              {t('about_us_hero_title') || 'Revolutionizing How You Experience Food'}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              Foodonline was born from a simple idea: everyone deserves access to great food, 
              no matter where they are. We bridge the gap between hungry customers and the best local restaurants.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gradient-primary h-12 px-8 rounded-full shadow-lg shadow-primary/20">
                {t('our_story') || 'Our Story'}
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-primary/20 hover:bg-primary/5">
                {t('contact_us') || 'Contact Us'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Hover Effects */}
      <section className="py-24 bg-white dark:bg-gray-950 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Users, number: '50k+', label: t('active_users') || 'Active Users', color: 'bg-blue-500/10 text-blue-500' },
              { icon: Award, number: '1,200+', label: t('partner_restaurants') || 'Partner Restaurants', color: 'bg-orange-500/10 text-orange-500' },
              { icon: Zap, number: '25min', label: t('avg_delivery_time') || 'Average Delivery Time', color: 'bg-yellow-500/10 text-yellow-500' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10" />
                <Card className="p-10 text-center border-none shadow-xl shadow-gray-200/50 dark:shadow-none dark:bg-gray-900/50 rounded-3xl backdrop-blur-sm">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${stat.color} flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300`}>
                    <stat.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-4xl font-bold mb-3 tracking-tight">{stat.number}</h3>
                  <p className="text-lg text-muted-foreground font-medium">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section with 3D Image */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium mb-6">
                <ShieldCheck className="w-4 h-4 mr-2" />
                <span>{t('our_mission_tag') || 'Our Mission & Vision'}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                We're on a mission to <span className="text-primary">redefine</span> the food delivery industry
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We believe that great food should be accessible to everyone. Our mission is to 
                bridge the gap between food lovers and quality restaurants, making every meal 
                an opportunity to discover something delicious.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { title: 'Quality Assurance', desc: 'Only the best restaurants join our network' },
                  { title: 'Customer Experience', desc: 'Your satisfaction is our top priority' },
                  { title: 'Technology Driven', desc: 'Innovative solutions for faster deliveries' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative group inline-block">
                <MovingBorder duration={3500}>
                  <Button className="gradient-primary h-14 px-10 rounded-full text-lg shadow-2xl group-hover:scale-105 transition-transform">
                    {t('join_the_family') || 'Join the Family'}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </MovingBorder>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <CardContainer className="inter-var">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-2 border">
                  <CardItem
                    translateZ="50"
                    className="text-xl font-bold text-neutral-600 dark:text-white"
                  >
                    Our Flagship Restaurant
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                  >
                    Experience the finest dining atmosphere at our partnered locations.
                  </CardItem>
                  <CardItem translateZ="100" className="w-full mt-4">
                    <img
                      src="/assets/about-restaurant.jpg"
                      height="1000"
                      width="1000"
                      className="h-96 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      alt="Restaurant Interior"
                    />
                  </CardItem>
                  <div className="flex justify-between items-center mt-10">
                    <CardItem
                      translateZ={20}
                      as="button"
                      className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                    >
                      View Locations →
                    </CardItem>
                    <CardItem
                      translateZ={20}
                      as="button"
                      className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                    >
                      Book Now
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section - Clean & Modern */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">{t('get_in_touch') || 'Get in Touch'}</h2>
            <p className="text-lg text-muted-foreground">{t('contact_description') || 'Have questions? We\'d love to hear from you. Our team is here to help.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MapPin, title: 'Our Location', info: '123 Food Street, Cuisine City, NY 10001', color: 'text-primary' },
              { icon: Phone, title: 'Call Us', info: '+1 (555) 123-4567', color: 'text-orange-500' },
              { icon: Mail, title: 'Email Us', info: 'hello@foodonline.com', color: 'text-red-500' },
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 h-full flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 border-none bg-gray-50 dark:bg-gray-900 rounded-3xl">
                  <div className="w-16 h-16 mb-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                    <contact.icon className={`h-8 w-8 ${contact.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{contact.title}</h3>
                  <p className="text-muted-foreground">{contact.info}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
