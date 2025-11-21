import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Database, ArrowRight, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";
import booksIcon from "@/assets/books-icon.png";
import journalsIcon from "@/assets/journals-icon.png";
import datasetsIcon from "@/assets/datasets-icon.png";
// import { supabase } from "@/lib/supabaseClient";
import React from "react";
import {supabase } from "@/integrations/supabase/client";


const Index = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Advancing Knowledge Through
            <span className="block text-primary mt-2">Academic Publishing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive platform for publishing books, journals, and datasets. Join the global community of researchers and scholars.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/auth">
              <Button variant="hero" size="lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/publishers">
              <Button variant="outline" size="lg">
                Browse Publishers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Publishing Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive solutions for all your academic publishing needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4">
                  <img src={booksIcon} alt="Books" className="w-full h-full object-contain" />
                </div>
                <CardTitle className="text-center text-2xl">Book Publishing</CardTitle>
                <CardDescription className="text-center">
                  Publish with prestigious academic publishers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Dhara Publications</li>
                  <li>• Yar Tech Publications</li>
                  <li>• AM Technical Publications</li>
                  <li>• AS NextGen Publishing Home</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4">
                  <img src={journalsIcon} alt="Journals" className="w-full h-full object-contain" />
                </div>
                <CardTitle className="text-center text-2xl">Journal Publishing</CardTitle>
                <CardDescription className="text-center">
                  Share your research with the world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Peer-reviewed publications</li>
                  <li>• DOI assignment</li>
                  <li>• Global indexing</li>
                  <li>• Open access options</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4">
                  <img src={datasetsIcon} alt="Datasets" className="w-full h-full object-contain" />
                </div>
                <CardTitle className="text-center text-2xl">Dataset Publishing</CardTitle>
                <CardDescription className="text-center">
                  Make your data accessible and citable
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Secure storage & versioning</li>
                  <li>• Metadata standards</li>
                  <li>• License management</li>
                  <li>• Citation tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Publishers Carousel */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Featured Publishers</h2>
            <p className="text-muted-foreground text-lg">
              Partner with world-leading academic publishers
            </p>
          </div>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {[
                { name: "Dhara Sci Tech Publications", focus: "Science & Technology" },
                { name: "Yar Tech Publications", focus: "Research & Education" },
                { name: "AS NextGen Publishing Home", focus: " Sciences" },
                { name: "Dhara Publications", focus: "Scientific" },
                { name: "AM Technical Publications", focus: "Academic" },
              ].map((publisher, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <CardHeader>
                      <img src={booksIcon} alt={publisher.name} className="h-16 w-16 mx-auto mb-3 rounded-[8px]" />
                      <CardTitle className="text-lg text-center">{publisher.name}</CardTitle>
                      <CardDescription className="text-center">
                        <Badge variant="secondary">{publisher.focus}</Badge>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-10 w-10 mx-auto text-primary mb-2" />
                <CardTitle className="text-3xl">10,000+</CardTitle>
                <CardDescription>Published Books</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <FileText className="h-10 w-10 mx-auto text-primary mb-2" />
                <CardTitle className="text-3xl">5,000+</CardTitle>
                <CardDescription>Journal Articles</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Database className="h-10 w-10 mx-auto text-primary mb-2" />
                <CardTitle className="text-3xl">2,500+</CardTitle>
                <CardDescription>Open Datasets</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="h-10 w-10 mx-auto text-primary mb-2" />
                <CardTitle className="text-3xl">50,000+</CardTitle>
                <CardDescription>Active Researchers</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I get started with publishing?</AccordionTrigger>
              <AccordionContent>
                Simply create an account, navigate to your dashboard, and select the type of content you want to publish
                (book, journal article, or dataset). Fill out the required information and submit your work for review.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What publishers can I work with?</AccordionTrigger>
              <AccordionContent>
                We partner with five major academic publishers: Oxford University Press, Cambridge University Press,
                Springer, Elsevier, and Wiley. Each publisher has specific focus areas and submission requirements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is there a fee for publishing?</AccordionTrigger>
              <AccordionContent>
                Publication fees vary by publisher and type of content. Some publishers offer open access options with
                associated fees, while others use traditional publishing models. Contact the specific publisher for
                detailed pricing information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How long does the review process take?</AccordionTrigger>
              <AccordionContent>
                Review times vary depending on the publisher and type of submission. Typically, book manuscripts take
                8-12 weeks, journal articles 4-8 weeks, and datasets 2-4 weeks. You'll receive updates throughout the
                process.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Publish Your Work?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of researchers and scholars sharing their work on AcademicPress
          </p>
          <Link to="/auth">
            <Button variant="secondary" size="lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
