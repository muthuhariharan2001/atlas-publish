import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

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

const publishers = [
  "Dhara Sci Tech Publications",
  "Yar Tech Publications",
  "AM Technical Publications",
  "Dhara Publications",
  "AS NextGen Publishing Home",
];

type UploadLocationState = {
  mode?: "edit";
  book?: Book;
  slug?: string; // from PublisherBooks
} | null;

const UploadBook = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as UploadLocationState;
  const isEdit = state?.mode === "edit";

  console.log("UploadBook location.state:", state);

  useEffect(() => {
    if (isEdit && !state?.book) {
      toast.error("No book data for editing");
      navigate("/dashboard");
    }
  }, [isEdit, state, navigate]);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: state?.book?.title ?? "",
    author: state?.book?.author ?? "",
    publisher: state?.book?.publisher ?? "",
    isbn: state?.book?.isbn ?? "",
    description: state?.book?.description ?? "",
    publication_year: state?.book?.publication_year
      ? String(state.book.publication_year)
      : "",
    edition: "",
    language: "English",
    page_count: "",
    category: state?.book?.category ?? "",
    price: "",
    subject_area: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) throw new Error("Not authenticated");

      let coverImageUrl = state?.book?.cover_image_url ?? null;
      let thumbnailUrl = state?.book?.thumbnail_url ?? null;

      if (coverImage) {
        const fileExt = coverImage.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}-cover.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("book-covers")
          .upload(fileName, coverImage);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("book-covers").getPublicUrl(fileName);

        coverImageUrl = publicUrl;
      }

      if (thumbnail) {
        const fileExt = thumbnail.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}-thumb.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("thumbnails")
          .upload(fileName, thumbnail);
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("thumbnails").getPublicUrl(fileName);

        thumbnailUrl = publicUrl;
      }

      const payload = {
        user_id: user.id,
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher as any,
        isbn: formData.isbn || null,
        description: formData.description || null,
        publication_year: formData.publication_year
          ? parseInt(formData.publication_year)
          : null,
        category: formData.category || null,
        cover_image_url: coverImageUrl,
        thumbnail_url: thumbnailUrl,
        edition: formData.edition || null,
        page_count: formData.page_count ? parseInt(formData.page_count) : null,
        subject_area: formData.subject_area || null,
      };

      if (isEdit && state?.book?.id) {
        const { data, error } = await supabase
          .from("books")
          .update(payload)
          .eq("id", state.book.id)
          .select("*");
        console.log("UPDATE result:", {
          data,
          error,
          id: state.book.id,
          payload,
        });

        if (error) throw error;

        if (!data || data.length === 0) {
          toast.error("No rows were updated. Check RLS and id.");
          setLoading(false);
          return;
        }

        toast.success("Book updated successfully!");
      } else {
        const { data, error } = await supabase
          .from("books")
          .insert([payload])
          .select("*");

        console.log("Insert result:", { data, error });

        if (error) throw error;

        toast.success("Book uploaded successfully!");
      }

      // after edit, go back to publisher page so list refetches
      if (state?.slug) {
        navigate(`/books/${state.slug}`);
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save book");
    } finally {
      setLoading(false);
    }

    console.log("UploadBook state:", state);
    console.log("UploadBook formData:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              {isEdit ? "Edit Book" : "Upload Book"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit
                ? "Update the details of your book"
                : "Submit your book for publication"}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Book Details</CardTitle>
              <CardDescription>
                {isEdit
                  ? "Modify the information about your book"
                  : "Provide information about your book"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <ImageUpload
                  label="Cover Image"
                  onFileSelect={setCoverImage}
                  maxSize={5}
                />

                <ImageUpload
                  label="Thumbnail"
                  onFileSelect={setThumbnail}
                  maxSize={2}
                />

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    placeholder="Enter book title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleChange("author", e.target.value)}
                    required
                    placeholder="Enter author name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher *</Label>
                  <Select
                    value={formData.publisher}
                    onValueChange={(value) => handleChange("publisher", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a publisher" />
                    </SelectTrigger>
                    <SelectContent>
                      {publishers.map((pub) => (
                        <SelectItem key={pub} value={pub}>
                          {pub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleChange("isbn", e.target.value)}
                    placeholder="978-3-16-148410-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publication_year">Publication Year</Label>
                  <Input
                    id="publication_year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={formData.publication_year}
                    onChange={(e) =>
                      handleChange("publication_year", e.target.value)
                    }
                    placeholder="2025"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edition">Edition</Label>
                  <Input
                    id="edition"
                    value={formData.edition}
                    onChange={(e) => handleChange("edition", e.target.value)}
                    placeholder="1st Edition, 2nd Edition, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    placeholder="English"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page_count">Page Count</Label>
                  <Input
                    id="page_count"
                    type="number"
                    min="1"
                    value={formData.page_count}
                    onChange={(e) => handleChange("page_count", e.target.value)}
                    placeholder="350"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science & Technology">
                        Science & Technology
                      </SelectItem>
                      <SelectItem value="Medicine & Healthcare">
                        Medicine & Healthcare
                      </SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Social Sciences">
                        Social Sciences
                      </SelectItem>
                      <SelectItem value="Humanities">Humanities</SelectItem>
                      <SelectItem value="Business & Economics">
                        Business & Economics
                      </SelectItem>
                      <SelectItem value="Law">Law</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (INR)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="1"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      placeholder="499.99"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject_area">Subject Area</Label>
                    <Input
                      id="subject_area"
                      value={formData.subject_area}
                      onChange={(e) =>
                        handleChange("subject_area", e.target.value)
                      }
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Provide a brief description of your book"
                    rows={5}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading
                      ? isEdit
                        ? "Saving..."
                        : "Uploading..."
                      : isEdit
                      ? "Save Changes"
                      : "Upload Book"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadBook;
