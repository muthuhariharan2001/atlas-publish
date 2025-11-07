import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookOpen, Calendar, User, Search } from "lucide-react";
import { publishersList } from "@/data/publishersList";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string | null;
  description: string | null;
  publication_year: number | null;
  category: string | null;
  cover_image_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

const publisherMap: Record<string, string> = {
  "dhara-sci-tech": "Dhara Sci Tech Publications",
  "yar-tech": "Yar Tech Publications",
  "as-nextgen": "AS NextGen Publications",
  "dhara-publications": "Dhara Publications",
  "am-technical": "AM Technical Publications",
};

const PublisherBooks = () => {
  const { publisher } = useParams<{ publisher: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const publisherName = publisher ? publisherMap[publisher] : "";
  const publisherInfo = publishersList.find((p) => p.slug === publisher);
  const primaryColor = publisherInfo?.color || "hsl(var(--primary))";

  useEffect(() => {
    fetchBooks();
  }, [publisher]);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, categoryFilter, books]);

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
      setFilteredBooks(data || []);
    } catch (error: any) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((book) => book.category === categoryFilter);
    }

    setFilteredBooks(filtered);
  };

  const categories = Array.from(
    new Set(books.map((book) => book.category).filter(Boolean))
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section
        className="py-16 text-foreground mb-12"
        
        style={{
          background: `${primaryColor}`, // softer end
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {publisherName}
          </h1>
          <p className="text-xl opacity-90">
            Explore our collection of academic publications
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, author, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category!}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Showing {filteredBooks.length} of {books.length} books
              </p>
            </div>

            <article>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Published Books
              </h2>

              {loading ? (
                <p className="text-muted-foreground">Loading books...</p>
              ) : filteredBooks.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">
                      {books.length === 0
                        ? "No books available for this publisher yet."
                        : "No books match your search criteria."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {filteredBooks.map((book) => (
                    <Link key={book.id} to={`/book/${book.id}`}>
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full cursor-pointer">
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            {book.thumbnail_url || book.cover_image_url ? (
                              <img
                                src={
                                  book.thumbnail_url ||
                                  book.cover_image_url ||
                                  ""
                                }
                                alt={book.title}
                                className="h-24 w-16 object-cover rounded"
                              />
                            ) : (
                              <div className="h-24 w-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg mb-2 line-clamp-2">
                                {book.title}
                              </CardTitle>
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
                          {book.category && (
                            <Badge
                              style={{
                                backgroundColor: primaryColor,
                                color: "#fff",
                              }}
                              variant="secondary"
                              className="mb-2"
                            >
                              {book.category}
                            </Badge>
                          )}
                          {book.isbn && (
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>ISBN:</strong> {book.isbn}
                            </p>
                          )}
                          {book.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {book.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* About Section */}
              <section className="mb-12">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  About {publisherName}
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {publisherName} is a world-renowned academic publisher
                      committed to excellence in scholarly publishing. With a
                      rich history of publishing groundbreaking research and
                      educational materials, we continue to support the global
                      academic community in advancing knowledge and discovery.
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* FAQ Section */}
              <section>
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      How do I submit my book for publication?
                    </AccordionTrigger>
                    <AccordionContent>
                      To submit your book, you need to create an account and use
                      our upload form. Navigate to the Dashboard and select
                      "Upload Book" to get started. Make sure to provide all
                      required information including title, author details, and
                      a comprehensive description.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      What formats do you accept?
                    </AccordionTrigger>
                    <AccordionContent>
                      We accept manuscripts in various formats including PDF,
                      DOCX, and LaTeX. All submissions undergo a review process
                      to ensure they meet our quality standards.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How long does the review process take?
                    </AccordionTrigger>
                    <AccordionContent>
                      The review process typically takes 4-8 weeks depending on
                      the complexity of the work and the availability of
                      reviewers. You will receive regular updates throughout the
                      process.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      What are the publication fees?
                    </AccordionTrigger>
                    <AccordionContent>
                      Publication fees vary depending on the type and length of
                      the work. Please contact our editorial team for detailed
                      information about fees and payment options.
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
                      <a
                        href="#"
                        style={{ color: primaryColor }}
                        className="text-primary hover:underline text-sm"
                      >
                        Submission Guidelines
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{ color: primaryColor }}
                        className="text-primary hover:underline text-sm"
                      >
                        Author Resources
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{ color: primaryColor }}
                        className="text-primary hover:underline text-sm"
                      >
                        Editorial Board
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        style={{ color: primaryColor }}
                        className="text-primary hover:underline text-sm"
                      >
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
                      <p className="text-sm text-muted-foreground">
                        Total Books
                      </p>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: primaryColor }}
                      >
                        {books.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Recent Publications
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {
                          books.filter((b) => {
                            const bookDate = new Date(b.created_at);
                            const monthAgo = new Date();
                            monthAgo.setMonth(monthAgo.getMonth() - 1);
                            return bookDate > monthAgo;
                          }).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="text-primary-foreground"
                style={{ backgroundColor: primaryColor }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Submit Your Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm opacity-90 mb-4">
                    Ready to publish with {publisherName}? Start your submission
                    today.
                  </p>
                  <a
                    href="/dashboard"
                    style={{ color: primaryColor }}
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
