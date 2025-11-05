import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Database, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";
import booksIcon from "@/assets/books-icon.png";
import journalsIcon from "@/assets/journals-icon.png";
import datasetsIcon from "@/assets/datasets-icon.png";

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
            <Link to="/books/oxford-university-press">
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
                  <li>• Oxford University Press</li>
                  <li>• Cambridge University Press</li>
                  <li>• Springer, Elsevier, Wiley</li>
                  <li>• Professional editorial support</li>
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

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
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
