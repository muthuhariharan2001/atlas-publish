import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { BookOpen, FileText, Database, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Welcome Back!</h1>
          <p className="text-muted-foreground">Manage your publications from your dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BookOpen className="h-8 w-8 text-primary" />
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle>Book Publishing</CardTitle>
              <CardDescription>Upload and manage your books</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/upload/book">
                <Button className="w-full">Upload Book</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <FileText className="h-8 w-8 text-primary" />
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle>Journal Publishing</CardTitle>
              <CardDescription>Submit your research papers</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/upload/journal">
                <Button className="w-full">Upload Journal</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Database className="h-8 w-8 text-primary" />
                <Plus className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle>Dataset Publishing</CardTitle>
              <CardDescription>Share your research data</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/upload/dataset">
                <Button className="w-full">Upload Dataset</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/books/oxford-university-press">
              <Card className="hover:bg-accent cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground">Browse Publishers</h3>
                  <p className="text-sm text-muted-foreground">Explore books by publisher</p>
                </CardContent>
              </Card>
            </Link>
            <Card className="hover:bg-accent cursor-pointer transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground">My Publications</h3>
                <p className="text-sm text-muted-foreground">View your submitted work</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
