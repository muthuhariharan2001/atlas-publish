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
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

const UploadDataset = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [datasetFile, setDatasetFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    data_type: "",
    file_format: "",
    size_mb: "",
    keywords: "",
    license: "",
    version: "",
    access_level: "Public",
    doi: "",
    citation: "",
    contributor_name: "",
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

      const keywordsArray = formData.keywords.split(",").map((k) => k.trim());

      let thumbnailUrl = null;
      let datasetUrl = null;

      // Upload thumbnail if provided
      if (thumbnail) {
        const fileExt = thumbnail.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-dataset.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, thumbnail);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(fileName);
        
        thumbnailUrl = publicUrl;
      }

      // Upload dataset file if provided
      if (datasetFile) {
        const fileExt = datasetFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('dataset-files')
          .upload(fileName, datasetFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('dataset-files')
          .getPublicUrl(fileName);
        
        datasetUrl = publicUrl;
      }

      const { error } = await supabase.from("datasets").insert([
        {
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          data_type: formData.data_type || null,
          file_format: formData.file_format || null,
          size_mb: formData.size_mb ? parseFloat(formData.size_mb) : null,
          keywords: keywordsArray.length > 0 ? keywordsArray : null,
          license: formData.license || null,
          version: formData.version || null,
          access_level: formData.access_level || "Public",
          doi: formData.doi || null,
          citation: formData.citation || null,
          thumbnail_url: thumbnailUrl,
          dataset_url: datasetUrl,
          contributor_name: formData.contributor_name || null,
        },
      ]);

      if (error) throw error;

      toast.success("Dataset uploaded successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload dataset");
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
            <h1 className="text-4xl font-bold mb-2 text-foreground">Upload Dataset</h1>
            <p className="text-muted-foreground">Share your research data with the community</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dataset Details</CardTitle>
              <CardDescription>Provide information about your dataset</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <ImageUpload
                  label="Thumbnail Image"
                  onFileSelect={setThumbnail}
                  maxSize={2}
                />

                <div className="space-y-2">
                  <Label>Dataset File</Label>
                  <Input
                    type="file"
                    onChange={(e) => setDatasetFile(e.target.files?.[0] || null)}
                    accept=".csv,.json,.xlsx,.hdf5,.zip"
                  />
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: CSV, JSON, XLSX, HDF5, ZIP (max 100MB)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Dataset Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    placeholder="Enter dataset title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                    placeholder="Describe your dataset, methodology, and potential uses"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_type">Data Type</Label>
                  <Input
                    id="data_type"
                    value={formData.data_type}
                    onChange={(e) => handleChange("data_type", e.target.value)}
                    placeholder="e.g., Numerical, Text, Images, Time Series"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="file_format">File Format</Label>
                    <Input
                      id="file_format"
                      value={formData.file_format}
                      onChange={(e) => handleChange("file_format", e.target.value)}
                      placeholder="CSV, JSON, HDF5, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size_mb">Size (MB)</Label>
                    <Input
                      id="size_mb"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.size_mb}
                      onChange={(e) => handleChange("size_mb", e.target.value)}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => handleChange("keywords", e.target.value)}
                    placeholder="machine learning, climate, genomics"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license">License</Label>
                  <Input
                    id="license"
                    value={formData.license}
                    onChange={(e) => handleChange("license", e.target.value)}
                    placeholder="CC BY 4.0, MIT, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleChange("version", e.target.value)}
                    placeholder="1.0, 2.1, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access_level">Access Level</Label>
                  <Select value={formData.access_level} onValueChange={(value) => handleChange("access_level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Restricted">Restricted</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doi">DOI (Digital Object Identifier)</Label>
                  <Input
                    id="doi"
                    value={formData.doi}
                    onChange={(e) => handleChange("doi", e.target.value)}
                    placeholder="10.1234/example.doi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citation">Citation</Label>
                  <Textarea
                    id="citation"
                    value={formData.citation}
                    onChange={(e) => handleChange("citation", e.target.value)}
                    placeholder="Recommended citation for this dataset"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contributor_name">Contributor Name</Label>
                  <Input
                    id="contributor_name"
                    value={formData.contributor_name}
                    onChange={(e) => handleChange("contributor_name", e.target.value)}
                    placeholder="Name of the dataset contributor"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Uploading..." : "Upload Dataset"}
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

export default UploadDataset;
