
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingLayout from "@/layouts/LandingLayout";
import { TestimonialsSection } from "@/components/blocks/testimonials-with-marquee";
import { CTASection } from "@/components/blocks/cta-with-glow";

const testimonials = [
  {
    author: {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "FreelanceFlow has transformed how I manage my design business. The invoicing system is a game-changer for getting paid faster!",
  },
  {
    author: {
      name: "Michael Chen",
      role: "Web Developer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The project tracking features help me stay organized and deliver projects on time. Highly recommended for any freelancer!",
  },
  {
    author: {
      name: "Emily Davis",
      role: "Content Writer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Client management has never been easier. I can focus more on writing and less on administrative tasks thanks to this platform."
  },
  {
    author: {
      name: "James Wilson",
      role: "Marketing Consultant",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "The AI assistant helped me create professional proposals in minutes instead of hours. This tool pays for itself!"
  },
  {
    author: {
      name: "Alex Rivera",
      role: "Photographer",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face"
    },
    text: "The expense tracking feature has made tax season so much less stressful. I can categorize everything and generate reports instantly."
  }
];

const Index = () => {
  return (
    // <LandingLayout>
      <div className="min-h-screen">
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
            </div>
          </div>
        </section>

        {/* Main content sections */}
        <TestimonialsSection
          title="Loved by Freelancers Worldwide"
          description="Hear what our users have to say about how FreelanceFlow has transformed their businesses and workflows"
          testimonials={testimonials}
        />
        
        {/* Call to Action */}
        <CTASection 
          title="Ready to Streamline Your Freelance Business?"
          description="Join thousands of freelancers who have transformed their workflow and boosted their income."
          action={{
            text: "Start Your Free Trial",
            href: "/auth",
            variant: "secondary"
          }}
          secondaryAction={{
            text: "Learn More",
            href: "/features"
          }}
          className="w-full py-16 md:py-24 bg-gradient-to-br from-primary/90 via-primary to-brand-blue/90"
        />
      </div>
    // </LandingLayout>
  );
};

export default Index;
