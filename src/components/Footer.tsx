import { BookOpen, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">AcademicPress</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Leading platform for academic publishing, research dissemination, and scholarly communication.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Publishers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/books/oxford-university-press" className="text-muted-foreground hover:text-primary transition-colors">
                  Oxford University Press
                </Link>
              </li>
              <li>
                <Link to="/books/cambridge-university-press" className="text-muted-foreground hover:text-primary transition-colors">
                  Cambridge University Press
                </Link>
              </li>
              <li>
                <Link to="/books/springer" className="text-muted-foreground hover:text-primary transition-colors">
                  Springer
                </Link>
              </li>
              <li>
                <Link to="/books/elsevier" className="text-muted-foreground hover:text-primary transition-colors">
                  Elsevier
                </Link>
              </li>
              <li>
                <Link to="/books/wiley" className="text-muted-foreground hover:text-primary transition-colors">
                  Wiley
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Book Publishing</li>
              <li>Journal Publishing</li>
              <li>Dataset Publishing</li>
              <li>Research Support</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contact@academicpress.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                London, United Kingdom
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 AcademicPress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
