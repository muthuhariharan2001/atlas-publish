import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, TrendingUp, Users, Award } from "lucide-react";
import booksIcon from "@/assets/books-icon.png";

interface PublisherStats {
  slug: string;
  name: string;
  totalBooks: number;
  recentBooks: number;
}

const publishersList = [
  { slug: "oxford-university-press", name: "Oxford University Press" },
  { slug: "cambridge-university-press", name: "Cambridge University Press" },
  { slug: "springer", name: "Springer" },
  { slug: "elsevier", name: "Elsevier" },
  { slug: "wiley", name: "Wiley" },
];

const Publishers = () => {
  const [stats, setStats] = useState<PublisherStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublisherStats();
  }, []);

  const fetchPublisherStats = async () => {
    try {
      const statsPromises = publishersList.map(async (publisher) => {
        const { data: books } = await supabase
          .from("books")
          .select("*")
          .eq("publisher", publisher.name as any);

        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const recentBooks = books?.filter((book) => {
          const bookDate = new Date(book.created_at);
          return bookDate > monthAgo;
        }).length || 0;

        return {
          slug: publisher.slug,
          name: publisher.name,
          totalBooks: books?.length || 0,
          recentBooks,
        };
      });

      const results = await Promise.all(statsPromises);
      setStats(results);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Academic Publishers
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Explore our network of world-renowned academic publishers committed to excellence in scholarly publishing
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Publishers Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Our Publishers</h2>
          
          {loading ? (
            <p className="text-muted-foreground">Loading publishers...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((publisher) => (
                <Link key={publisher.slug} to={`/books/${publisher.slug}`}>
                  <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <img src={booksIcon} alt={publisher.name} className="h-16 w-16" />
                        <div className="flex-1">
                          <CardTitle className="text-xl">{publisher.name}</CardTitle>
                          <CardDescription>Academic Publisher</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold text-primary">{publisher.totalBooks}</p>
                          <p className="text-sm text-muted-foreground">Total Books</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold text-primary">{publisher.recentBooks}</p>
                          <p className="text-sm text-muted-foreground">Recent</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Carousel Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Featured Categories</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {["Science & Technology", "Medicine & Healthcare", "Engineering", "Social Sciences", "Humanities"].map((category, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <CardHeader>
                      <Award className="h-8 w-8 text-primary mb-2" />
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        Discover groundbreaking research and publications in {category.toLowerCase()}.
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Stats Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Total Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {stats.reduce((sum, p) => sum + p.totalBooks, 0)}+
                </p>
                <p className="text-muted-foreground mt-2">Books available across all publishers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Active Publishers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">{publishersList.length}</p>
                <p className="text-muted-foreground mt-2">Leading academic publishers worldwide</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Recent Additions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">
                  {stats.reduce((sum, p) => sum + p.recentBooks, 0)}
                </p>
                <p className="text-muted-foreground mt-2">Books added in the last month</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-foreground">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I choose the right publisher?</AccordionTrigger>
              <AccordionContent>
                Each publisher specializes in different academic fields and has unique submission requirements. 
                Review their catalog and submission guidelines to find the best fit for your work. Consider factors 
                like the publisher's reputation in your field, their distribution network, and publishing timeline.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What are the benefits of publishing with established publishers?</AccordionTrigger>
              <AccordionContent>
                Established academic publishers offer rigorous peer review, global distribution networks, professional 
                editing services, and enhanced credibility in the academic community. They also provide indexing in major 
                academic databases and citation services.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I submit to multiple publishers?</AccordionTrigger>
              <AccordionContent>
                While you can upload your manuscript to our platform and select a publisher, simultaneous submissions 
                to multiple publishers are generally discouraged in academic publishing. Review each publisher's 
                specific policies regarding simultaneous submissions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What formats are accepted?</AccordionTrigger>
              <AccordionContent>
                We accept manuscripts in PDF, DOCX, and LaTeX formats. Each publisher may have specific formatting 
                requirements, so please review their guidelines before submission. Supporting materials such as figures, 
                tables, and supplementary data should be submitted in standard academic formats.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Publishers;
