import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

const UploadJournal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [openAccess, setOpenAccess] = useState(false);
  const [peerReviewed, setPeerReviewed] = useState(true);
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
    keywords_list: "",
    citations_count: "",
    impact_factor: "",
    category: "",
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

      let thumbnailUrl = null;

      // Upload thumbnail if provided
      if (thumbnail) {
        const fileExt = thumbnail.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-journal.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, thumbnail);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(fileName);
        
        thumbnailUrl = publicUrl;
      }

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
          keywords_list: formData.keywords_list ? formData.keywords_list.split(",").map((k) => k.trim()) : null,
          citations_count: formData.citations_count ? parseInt(formData.citations_count) : 0,
          impact_factor: formData.impact_factor ? parseFloat(formData.impact_factor) : null,
          category: formData.category || null,
          thumbnail_url: thumbnailUrl,
          open_access: openAccess,
          peer_reviewed: peerReviewed,
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
                <ImageUpload
                  label="Thumbnail Image"
                  onFileSelect={setThumbnail}
                  maxSize={2}
                />

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
                  <Label htmlFor="keywords_list">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords_list"
                    value={formData.keywords_list}
                    onChange={(e) => handleChange("keywords_list", e.target.value)}
                    placeholder="machine learning, artificial intelligence, deep learning"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="citations_count">Citations Count</Label>
                    <Input
                      id="citations_count"
                      type="number"
                      min="0"
                      value={formData.citations_count}
                      onChange={(e) => handleChange("citations_count", e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impact_factor">Impact Factor</Label>
                    <Input
                      id="impact_factor"
                      type="number"
                      step="0.001"
                      min="0"
                      value={formData.impact_factor}
                      onChange={(e) => handleChange("impact_factor", e.target.value)}
                      placeholder="3.456"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Science & Technology">Science & Technology</SelectItem>
                      <SelectItem value="Medicine & Healthcare">Medicine & Healthcare</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                      <SelectItem value="Humanities">Humanities</SelectItem>
                      <SelectItem value="Business & Economics">Business & Economics</SelectItem>
                      <SelectItem value="Law">Law</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="open_access" 
                      checked={openAccess}
                      onCheckedChange={(checked) => setOpenAccess(checked as boolean)}
                    />
                    <Label htmlFor="open_access" className="cursor-pointer">Open Access</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="peer_reviewed" 
                      checked={peerReviewed}
                      onCheckedChange={(checked) => setPeerReviewed(checked as boolean)}
                    />
                    <Label htmlFor="peer_reviewed" className="cursor-pointer">Peer Reviewed</Label>
                  </div>
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
