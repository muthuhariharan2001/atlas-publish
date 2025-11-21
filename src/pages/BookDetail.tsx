import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Calendar, Globe, User } from "lucide-react";
import { log } from "console";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  isbn?: string;
  description?: string;
  publication_year?: number;
  edition?: string;
  language?: string;
  page_count?: number;
  category?: string;
  cover_image_url?: string;
  thumbnail_url?: string;
  price?: number;
  availability_status?: string;
  subject_area?: string;
}

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setBook(data);
      console.log("Book ID from params:", data.cover_image_url);
    } catch (error: any) {
      toast.error("Failed to load book details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <p className="text-muted-foreground">Book not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                {book.cover_image_url ? (
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="w-full rounded-lg shadow-lg mb-4"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-muted rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}
                {book.price && (
                  <div className="text-center mb-4">
                    <p className="text-3xl font-bold text-primary">
                      ${book.price}
                    </p>
                    <Badge
                      variant={
                        book.availability_status === "Available"
                          ? "default"
                          : "secondary"
                      }
                      className="mt-2"
                    >
                      {book.availability_status || "Available"}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      <User className="inline h-4 w-4 mr-1" />
                      by {book.author}
                    </CardDescription>
                  </div>
                  {book.category && (
                    <Badge variant="outline">{book.category}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {book.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{book.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Publisher
                    </h4>
                    <p>{book.publisher}</p>
                  </div>
                  {book.isbn && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        ISBN
                      </h4>
                      <p className="font-mono text-sm">{book.isbn}</p>
                    </div>
                  )}
                  {book.publication_year && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        Publication Year
                      </h4>
                      <p>{book.publication_year}</p>
                    </div>
                  )}
                  {book.edition && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        Edition
                      </h4>
                      <p>{book.edition}</p>
                    </div>
                  )}
                  {book.language && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        <Globe className="inline h-4 w-4 mr-1" />
                        Language
                      </h4>
                      <p>{book.language}</p>
                    </div>
                  )}
                  {book.page_count && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        Pages
                      </h4>
                      <p>{book.page_count}</p>
                    </div>
                  )}
                  {book.subject_area && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        Subject Area
                      </h4>
                      <p>{book.subject_area}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetail;
