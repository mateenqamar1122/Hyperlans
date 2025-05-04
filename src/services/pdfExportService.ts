import html2pdf from 'html2pdf.js';
import { ExtendedPortfolioData } from '@/types/portfolio';
import { toast } from 'sonner';

// PDF export options
export interface PDFExportOptions {
  filename?: string;
  pageSize?: string; // A4, Letter, etc.
  margin?: number | [number, number, number, number]; // [top, right, bottom, left] in mm
  includeProjects?: boolean;
  includeExperiences?: boolean;
  includeSkills?: boolean;
  includeContact?: boolean;
  watermark?: string;
}

// Default PDF export options
const defaultPDFOptions: PDFExportOptions = {
  filename: 'portfolio.pdf',
  pageSize: 'A4',
  margin: 10,
  includeProjects: true,
  includeExperiences: true,
  includeSkills: true,
  includeContact: true,
};

/**
 * Generate HTML content for the portfolio PDF
 * @param portfolio The portfolio data to convert to PDF
 * @param options PDF export options
 * @returns HTML string for the PDF
 */
const generatePortfolioHTML = (portfolio: ExtendedPortfolioData, options: PDFExportOptions): string => {
  const {
    includeProjects = true,
    includeExperiences = true,
    includeSkills = true,
    includeContact = true,
  } = options;

  // Generate the HTML content for the PDF
  let html = `
    <div class="portfolio-pdf">
      <style>
        .portfolio-pdf {
          font-family: 'Helvetica', 'Arial', sans-serif;
          color: #333;
          line-height: 1.5;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          color: #2563eb;
        }
        .header h2 {
          margin: 5px 0;
          font-size: 20px;
          font-weight: normal;
          color: #666;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 20px;
          margin-bottom: 15px;
          color: #2563eb;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .bio {
          margin-bottom: 25px;
          line-height: 1.6;
        }
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .contact-item {
          padding: 5px 10px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 14px;
        }
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        .skill-category {
          margin-bottom: 15px;
          width: 100%;
        }
        .skill-category-title {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 16px;
        }
        .skill-item {
          padding: 5px 10px;
          background: #f0f7ff;
          border-radius: 4px;
          font-size: 14px;
          display: inline-block;
          margin-right: 8px;
          margin-bottom: 8px;
        }
        .project {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .project-title {
          font-size: 18px;
          margin-bottom: 5px;
          color: #1e40af;
        }
        .project-description {
          margin-bottom: 10px;
        }
        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        .tech-tag {
          padding: 3px 8px;
          background: #e0e7ff;
          border-radius: 4px;
          font-size: 12px;
        }
        .experience {
          margin-bottom: 20px;
        }
        .experience-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .experience-title {
          font-size: 18px;
          font-weight: bold;
          color: #1e40af;
        }
        .experience-company {
          font-size: 16px;
        }
        .experience-duration {
          font-size: 14px;
          color: #666;
        }
        .watermark {
          position: fixed;
          bottom: 20px;
          right: 20px;
          opacity: 0.15;
          font-size: 16px;
          color: #333;
          transform: rotate(-45deg);
        }
        @media print {
          .portfolio-pdf {
            padding: 20px;
          }
        }
      </style>
      
      <div class="header">
        <h1>${portfolio.name}</h1>
        <h2>${portfolio.title}</h2>
        ${portfolio.subtitle ? `<h3>${portfolio.subtitle}</h3>` : ''}
      </div>
      
      <div class="bio">
        ${portfolio.bio}
      </div>
  `;

  // Add contact information
  if (includeContact && portfolio.contact) {
    html += `
      <div class="section">
        <div class="section-title">Contact Information</div>
        <div class="contact-info">
          ${portfolio.contact.email ? `<div class="contact-item">Email: ${portfolio.contact.email}</div>` : ''}
          ${portfolio.contact.phone ? `<div class="contact-item">Phone: ${portfolio.contact.phone}</div>` : ''}
          ${portfolio.contact.location ? `<div class="contact-item">Location: ${portfolio.contact.location}</div>` : ''}
          ${portfolio.contact.website ? `<div class="contact-item">Website: ${portfolio.contact.website}</div>` : ''}
          ${portfolio.contact.linkedin ? `<div class="contact-item">LinkedIn: ${portfolio.contact.linkedin}</div>` : ''}
          ${portfolio.contact.github ? `<div class="contact-item">GitHub: ${portfolio.contact.github}</div>` : ''}
        </div>
      </div>
    `;
  }

  // Add skills
  if (includeSkills && portfolio.skills && portfolio.skills.length > 0) {
    // Group skills by category
    const skillsByCategory: Record<string, typeof portfolio.skills> = {};
    
    portfolio.skills.forEach(skill => {
      const category = skill.category || 'Other';
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });

    html += `
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-container">
    `;

    // Add each skill category
    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      html += `
        <div class="skill-category">
          <div class="skill-category-title">${category}</div>
          <div class="skill-list">
      `;

      // Add each skill in this category
      skills.forEach(skill => {
        html += `<div class="skill-item">${skill.name}</div>`;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  }

  // Add experiences
  if (includeExperiences && portfolio.experiences && portfolio.experiences.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">Experience</div>
    `;

    portfolio.experiences.forEach(exp => {
      const current = exp.isCurrent ? 'Present' : exp.endDate;
      html += `
        <div class="experience">
          <div class="experience-header">
            <div>
              <div class="experience-title">${exp.role}</div>
              <div class="experience-company">${exp.company}</div>
            </div>
            <div class="experience-duration">${exp.startDate} - ${current}</div>
          </div>
          ${exp.location ? `<div class="experience-location">${exp.location}</div>` : ''}
          <div class="experience-description">${exp.description}</div>
        </div>
      `;
    });

    html += `
      </div>
    `;
  }

  // Add projects
  if (includeProjects && portfolio.projects && portfolio.projects.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">Projects</div>
    `;

    portfolio.projects.forEach(project => {
      html += `
        <div class="project">
          <div class="project-title">${project.title}</div>
          <div class="project-description">${project.description}</div>
      `;

      if (project.technologies && project.technologies.length > 0) {
        html += `
          <div class="project-tech">
        `;

        project.technologies.forEach(tech => {
          html += `<div class="tech-tag">${tech}</div>`;
        });

        html += `
          </div>
        `;
      }

      html += `
        </div>
      `;
    });

    html += `
      </div>
    `;
  }

  // Add watermark if specified
  if (options.watermark) {
    html += `
      <div class="watermark">${options.watermark}</div>
    `;
  }

  html += `
    </div>
  `;

  return html;
};

/**
 * Export a portfolio to PDF
 * @param portfolio The portfolio data to export
 * @param options PDF export options
 * @returns Promise that resolves when the PDF is generated
 */
export const exportPortfolio = async (
  portfolio: ExtendedPortfolioData,
  options: Partial<PDFExportOptions> = {}
): Promise<void> => {
  try {
    // Merge default options with provided options
    const mergedOptions = { ...defaultPDFOptions, ...options };
    
    // Set filename if not provided
    if (!mergedOptions.filename) {
      mergedOptions.filename = `${portfolio.name.replace(/\s+/g, '_')}_portfolio.pdf`;
    }

    // Generate HTML content
    const html = generatePortfolioHTML(portfolio, mergedOptions);

    // Create a temporary div to render the HTML
    const element = document.createElement('div');
    element.innerHTML = html;
    element.style.visibility = 'hidden';
    document.body.appendChild(element);

    // Configure html2pdf options
    const pdfOptions = {
      margin: mergedOptions.margin,
      filename: mergedOptions.filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: mergedOptions.pageSize, orientation: 'portrait' }
    };

    // Generate and download the PDF
    await html2pdf().from(element).set(pdfOptions).save();

    // Clean up the temporary element
    document.body.removeChild(element);

    toast.success('Portfolio exported successfully');
  } catch (error) {
    console.error('Error exporting portfolio to PDF:', error);
    toast.error('Failed to export portfolio');
  }
};