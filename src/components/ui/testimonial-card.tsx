
import { User } from "lucide-react";

export interface TestimonialAuthor {
  name: string;
  handle?: string;
  avatar?: string;
  role?: string;
}

export interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
}

export function TestimonialCard({ author, text, href }: TestimonialCardProps) {
  return (
    <div className="group flex w-80 flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <div className="flex gap-2 text-lg opacity-50">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="h-5 w-5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      
      <p className="min-h-[80px] font-medium text-card-foreground">"{text}"</p>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
            {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10">
                <User size={16} className="text-primary" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-semibold">{author.name}</span>
            <span className="text-sm text-muted-foreground">{author.role || author.handle}</span>
          </div>
        </div>
        
        {href && (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="rounded-md bg-primary/10 p-2 text-primary hover:bg-primary/20"
            aria-label={`Visit ${author.name}'s profile`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M7 17L17 7" />
              <path d="M7 7H17V17" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
