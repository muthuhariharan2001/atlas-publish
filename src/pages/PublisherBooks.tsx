import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookOpen, Calendar, User } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string | null;
  description: string | null;
  publication_year: number | null;
  created_at: string;
}

const publisherMap: Record<string, string> = {
  "oxford-university-press": "Oxford University Press",
  "cambridge-university-press": "Cambridge University Press",
  "springer": "Springer",
  "elsevier": "Elsevier",
  "wiley": "Wiley",
};

const PublisherBooks = () => {
  const { publisher } = useParams<{ publisher: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const publisherName = publisher ? publisherMap[publisher] : "";

  useEffect(() => {
    fetchBooks();
  }, [publisher]);

  const fetchBooks = async () => {
    try {
      if (!publisherName) return;

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("publisher", publisherName as any)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBooks(data || []);
    } catch (error: any) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{publisherName}</h1>
          <p className="text-xl opacity-90">Explore our collection of academic publications</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <main className="lg:col-span-3">
            <article>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Published Books</h2>

              {loading ? (
                <p className="text-muted-foreground">Loading books...</p>
              ) : books.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">No books available for this publisher yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {books.map((book) => (
                    <Card key={book.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{book.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4" />
                              {book.author}
                            </CardDescription>
                            {book.publication_year && (
                              <CardDescription className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {book.publication_year}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {book.isbn && (
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>ISBN:</strong> {book.isbn}
                          </p>
                        )}
                        {book.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* About Section */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-foreground">About {publisherName}</h3>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {publisherName} is a world-renowned academic publisher committed to excellence in scholarly publishing. 
                      With a rich history of publishing groundbreaking research and educational materials, we continue to 
                      support the global academic community in advancing knowledge and discovery.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* FAQ Section */}
              <section>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I submit my book for publication?</AccordionTrigger>
                    <AccordionContent>
                      To submit your book, you need to create an account and use our upload form. Navigate to the Dashboard
                      and select "Upload Book" to get started. Make sure to provide all required information including title,
                      author details, and a comprehensive description.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What formats do you accept?</AccordionTrigger>
                    <AccordionContent>
                      We accept manuscripts in various formats including PDF, DOCX, and LaTeX. All submissions undergo
                      a review process to ensure they meet our quality standards.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How long does the review process take?</AccordionTrigger>
                    <AccordionContent>
                      The review process typically takes 4-8 weeks depending on the complexity of the work and the
                      availability of reviewers. You will receive regular updates throughout the process.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>What are the publication fees?</AccordionTrigger>
                    <AccordionContent>
                      Publication fees vary depending on the type and length of the work. Please contact our editorial
                      team for detailed information about fees and payment options.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>
            </article>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-primary hover:underline text-sm">
                        Submission Guidelines
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline text-sm">
                        Author Resources
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline text-sm">
                        Editorial Board
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline text-sm">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Books</p>
                      <p className="text-2xl font-bold text-primary">{books.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recent Publications</p>
                      <p className="text-2xl font-bold text-primary">
                        {books.filter((b) => {
                          const bookDate = new Date(b.created_at);
                          const monthAgo = new Date();
                          monthAgo.setMonth(monthAgo.getMonth() - 1);
                          return bookDate > monthAgo;
                        }).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-lg">Submit Your Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm opacity-90 mb-4">
                    Ready to publish with {publisherName}? Start your submission today.
                  </p>
                  <a
                    href="/dashboard"
                    className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity text-sm"
                  >
                    Go to Dashboard
                  </a>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublisherBooks;
