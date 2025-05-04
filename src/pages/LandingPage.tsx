import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Footer } from "@/components/ui/footer-section";
import { FeatureOrbital } from "@/components/features/FeatureOrbital";

import { useEffect, useRef } from 'react';

const LandingPage = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Initial load animations for hero section
    const heroElements = document.querySelectorAll('.hero-animate');
    heroElements.forEach((el, index) => {
      el.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        el.classList.remove('opacity-0', 'translate-y-4');
        el.classList.add('animate-fade-in-up');
      }, index * 200);
    });

    // Scroll animations setup with different effects
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const animation = (target as HTMLElement).dataset.animation || 'fade-in-up';
            target.classList.add(`animate-${animation}`);
            target.classList.remove('opacity-0', 'translate-y-4', 'translate-x-4', '-translate-x-4', 'scale-95');
            observerRef.current?.unobserve(target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections with specific animations
    document.querySelectorAll('[data-animation]').forEach((el) => {
      const animation = (el as HTMLElement).dataset.animation;
      el.classList.add('opacity-0');
      if (animation === 'fade-in-up') el.classList.add('translate-y-4');
      else if (animation === 'fade-in-right') el.classList.add('-translate-x-4');
      else if (animation === 'fade-in-left') el.classList.add('translate-x-4');
      else if (animation === 'scale-in') el.classList.add('scale-95');
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Add data-animation attribute to Footer for consistent animations */}
      <div data-animation="fade-in-up">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-20 lg:py-28 xl:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/20%),transparent_25%),radial-gradient(circle_at_70%_60%,hsl(var(--secondary)/10%),transparent_25%)]"></div>
        <div className="absolute inset-y-0 right-0 -z-10 w-[40%] bg-gradient-to-l from-primary/5 to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-64 h-64 -z-10 bg-primary/10 rounded-full blur-3xl animate-float opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 -z-10 bg-brand-blue/10 rounded-full blur-3xl animate-float-delay opacity-70"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 -z-10 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container relative px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8 relative hero-animate">
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-primary/20 to-brand-blue/20 backdrop-blur-sm px-5 py-2 text-sm font-medium transform hover:scale-105 transition-all duration-300 border border-primary/10 shadow-sm">
                <span className="mr-2 text-base">✨</span>
                <span className="bg-gradient-to-r from-primary to-brand-blue bg-clip-text text-transparent font-semibold">Your Success Journey Starts Here</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                <span className="inline-block mb-2">Manage Your</span>
                <br className="hidden sm:block" />
                <span className="relative">
                  <span className="bg-gradient-to-r from-brand-cyan via-primary to-brand-blue bg-clip-text text-transparent drop-shadow-sm">
                    Freelance Business
                  </span>
                  <span className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan via-primary to-brand-blue rounded-full opacity-70 blur-sm"></span>
                </span>
                <br className="hidden sm:block" />
                <span className="inline-block mt-2">with Confidence</span>
              </h1>
              
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                The all-in-one platform for freelancers to manage clients, projects, invoicing, and more. 
                <span className="hidden md:inline"><br /></span> Stay organized, get paid faster, and grow your business.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center mt-12 hero-animate">
              <Button 
                asChild 
                size="lg" 
                className="relative overflow-hidden bg-gradient-to-r from-brand-cyan to-brand-blue shadow-xl hover:shadow-brand-blue/30 hover:scale-105 transition-all duration-300 rounded-full px-8 py-6 text-lg font-medium"
              >
                <Link to="/auth">
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-white/10 transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"></span>
                  </span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-lg font-medium border-2"
              >
                <Link to="/features" className="flex items-center">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground justify-center mt-12 hero-animate">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="h-12 w-12 rounded-full border-2 border-background bg-gradient-to-br from-muted to-muted/80 shadow-inner transform hover:scale-110 hover:z-10 transition-all duration-300 flex items-center justify-center text-xs font-semibold"
                    style={{ zIndex: 5 - i }}
                  >
                    {['JD', 'SM', 'AK', 'TR'][i-1]}
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" className="mr-1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm font-semibold">4.9/5</span>
                </div>
                <p className="text-sm font-medium">Join 10,000+ freelancers already growing their business</p>
              </div>
            </div>
            
            {/* Trusted By Logos */}
            <div className="mt-16 pt-8 border-t border-border/30">
              <p className="text-sm text-muted-foreground mb-6">TRUSTED BY FREELANCERS FROM</p>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                {['Google', 'Microsoft', 'Adobe', 'Shopify', 'Airbnb'].map((company, i) => (
                  <div key={i} className="text-muted-foreground/70 font-semibold text-lg hover:text-primary transition-colors duration-300">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </section>

      {/* Interactive Features Section with Orbital Display */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40" data-animation="fade-in-up">
        <FeatureOrbital />
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-background to-primary/5" data-animation="fade-in-right">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">By The Numbers</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Freelancers Worldwide</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                See why thousands of freelancers choose our platform to grow their business
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="text-4xl font-bold text-primary">10,000+</div>
              <p className="text-center text-muted-foreground">Active Users</p>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="text-4xl font-bold text-brand-blue">$15M+</div>
              <p className="text-center text-muted-foreground">Invoices Processed</p>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="text-4xl font-bold text-brand-magenta">25,000+</div>
              <p className="text-center text-muted-foreground">Projects Completed</p>
            </div>
            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-background p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-brand-cyan to-brand-blue bg-clip-text text-transparent">98%</div>
              <p className="text-center text-muted-foreground">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
      </div>
      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background scroll-animate">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">Testimonials</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Don't just take our word for it - hear from our satisfied customers
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {/* Testimonial Cards */}
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="absolute top-3 right-3 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" className="mr-1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/30 to-brand-blue/30 p-[2px]">
                    <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold text-primary">SJ</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Freelance Designer</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg relative">
                  <svg className="absolute -top-2 left-4 text-muted/30 rotate-180" width="16" height="8" viewBox="0 0 16 8" fill="currentColor">
                    <path d="M0 8L8 0L16 8H0Z" />
                  </svg>
                  <p className="italic text-muted-foreground">"FreelanceFlow has transformed how I manage my design business. The invoicing system is a game-changer!"</p>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>Client since 2022</span>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="absolute top-3 right-3 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1" className="mr-1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-blue/30 to-brand-cyan/30 p-[2px]">
                    <div className="h-full w-full rounded-full bg-brand-blue/10 flex items-center justify-center text-xl font-semibold text-brand-blue">MC</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">Web Developer</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg relative">
                  <svg className="absolute -top-2 left-4 text-muted/30 rotate-180" width="16" height="8" viewBox="0 0 16 8" fill="currentColor">
                    <path d="M0 8L8 0L16 8H0Z" />
                  </svg>
                  <p className="italic text-muted-foreground">"The project tracking features help me stay organized and deliver projects on time. Highly recommended!"</p>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>Client since 2021</span>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="absolute top-3 right-3 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={star <= 4 ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="1" className="mr-1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-magenta/30 to-primary/30 p-[2px]">
                    <div className="h-full w-full rounded-full bg-brand-magenta/10 flex items-center justify-center text-xl font-semibold text-brand-magenta">ED</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Emily Davis</h4>
                    <p className="text-sm text-muted-foreground">Content Writer</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg relative">
                  <svg className="absolute -top-2 left-4 text-muted/30 rotate-180" width="16" height="8" viewBox="0 0 16 8" fill="currentColor">
                    <path d="M0 8L8 0L16 8H0Z" />
                  </svg>
                  <p className="italic text-muted-foreground">"Client management has never been easier. I can focus more on writing and less on administrative tasks."</p>
                </div>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>Client since 2023</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-primary/5 hover:text-primary transition-all duration-300">
              View More Testimonials
            </Button>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background border-y border-border/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-brand-blue px-3 py-1 text-sm text-white">Integrations</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Works With Your Favorite Tools</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Seamlessly connect with the tools you already use and love
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl">
            <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
              {/* Integration Logos */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-center p-4 grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100">
                  <div className="h-12 w-24 rounded-md bg-muted/50 flex items-center justify-center">
                    <div className="text-2xl font-bold text-muted-foreground">Logo {i}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="rounded-full px-8 hover:bg-primary/5 hover:text-primary transition-all duration-300">
                View All Integrations
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40" data-animation="fade-in-up">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">Pricing</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Plan</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Simple, transparent pricing that grows with your business
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
            {/* Pricing Cards */}
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Starter</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">✓ 5 Active Projects</li>
                  <li className="flex items-center">✓ Basic Analytics</li>
                  <li className="flex items-center">✓ Client Management</li>
                </ul>
              </div>
              <Button className="w-full" variant="outline">Get Started</Button>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Professional</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">✓ Unlimited Projects</li>
                  <li className="flex items-center">✓ Advanced Analytics</li>
                  <li className="flex items-center">✓ Priority Support</li>
                </ul>
              </div>
              <Button className="w-full">Get Started</Button>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
              <div className="mb-4">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">✓ Custom Solutions</li>
                  <li className="flex items-center">✓ Dedicated Support</li>
                  <li className="flex items-center">✓ Custom Integration</li>
                </ul>
              </div>
              <Button className="w-full" variant="outline">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background scroll-animate">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white">FAQ</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
            </div>
          </div>
          <div className="mx-auto max-w-[800px] grid gap-4 pt-12">
            <div className="group rounded-lg border bg-background p-6 transition-all hover:shadow-md">
              <h3 className="font-semibold">How does the free trial work?</h3>
              <p className="mt-2 text-muted-foreground">Our 14-day free trial gives you full access to all features. No credit card required.</p>
            </div>
            <div className="group rounded-lg border bg-background p-6 transition-all hover:shadow-md">
              <h3 className="font-semibold">Can I cancel my subscription?</h3>
              <p className="mt-2 text-muted-foreground">Yes, you can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div className="group rounded-lg border bg-background p-6 transition-all hover:shadow-md">
              <h3 className="font-semibold">Do you offer custom solutions?</h3>
              <p className="mt-2 text-muted-foreground">Yes, our enterprise plan includes custom solutions tailored to your needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/90 via-primary to-brand-blue/90">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-4 max-w-[800px]">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl text-white">
                Ready to Streamline Your Freelance Business?
              </h2>
              <p className="text-lg md:text-xl text-white/90">
                Join thousands of freelancers who have transformed their workflow and boosted their income.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg shadow-xl hover:shadow-white/20 hover:scale-105 transition-all duration-300">
              <Link to="/auth">Start Your Free Trial</Link>
            </Button>
            <div className="flex items-center gap-4 text-white/80 mt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white/20 bg-white/10 shadow-inner transform hover:scale-110 hover:z-10 transition-all duration-300" />
                ))}
              </div>
              <p className="text-sm font-medium">10,000+ freelancers already growing their business</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
