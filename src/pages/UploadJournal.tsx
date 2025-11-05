import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

const UploadJournal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    journal_name: "",
    volume: "",
    issue: "",
    pages: "",
    doi: "",
    abstract: "",
    publication_date: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) throw new Error("Not authenticated");

      const authorsArray = formData.authors.split(",").map((a) => a.trim());

      const { error } = await supabase.from("journals").insert([
        {
          user_id: user.id,
          title: formData.title,
          authors: authorsArray,
          journal_name: formData.journal_name,
          volume: formData.volume || null,
          issue: formData.issue || null,
          pages: formData.pages || null,
          doi: formData.doi || null,
          abstract: formData.abstract || null,
          publication_date: formData.publication_date || null,
        },
      ]);

      if (error) throw error;

      toast.success("Journal uploaded successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload journal");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Upload Journal Article</h1>
            <p className="text-muted-foreground">Submit your research paper for publication</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Journal Details</CardTitle>
              <CardDescription>Provide information about your journal article</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    placeholder="Enter article title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authors">Authors * (comma-separated)</Label>
                  <Input
                    id="authors"
                    value={formData.authors}
                    onChange={(e) => handleChange("authors", e.target.value)}
                    required
                    placeholder="John Doe, Jane Smith, Robert Johnson"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journal_name">Journal Name *</Label>
                  <Input
                    id="journal_name"
                    value={formData.journal_name}
                    onChange={(e) => handleChange("journal_name", e.target.value)}
                    required
                    placeholder="Nature, Science, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume</Label>
                    <Input
                      id="volume"
                      value={formData.volume}
                      onChange={(e) => handleChange("volume", e.target.value)}
                      placeholder="42"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue">Issue</Label>
                    <Input
                      id="issue"
                      value={formData.issue}
                      onChange={(e) => handleChange("issue", e.target.value)}
                      placeholder="3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    value={formData.pages}
                    onChange={(e) => handleChange("pages", e.target.value)}
                    placeholder="123-145"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doi">DOI</Label>
                  <Input
                    id="doi"
                    value={formData.doi}
                    onChange={(e) => handleChange("doi", e.target.value)}
                    placeholder="10.1000/xyz123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publication_date">Publication Date</Label>
                  <Input
                    id="publication_date"
                    type="date"
                    value={formData.publication_date}
                    onChange={(e) => handleChange("publication_date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea
                    id="abstract"
                    value={formData.abstract}
                    onChange={(e) => handleChange("abstract", e.target.value)}
                    placeholder="Provide the abstract of your article"
                    rows={6}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Uploading..." : "Upload Journal"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
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

export default UploadJournal;
