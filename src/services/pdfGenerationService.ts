import html2pdf from 'html2pdf.js';
import { ExtendedPortfolioData } from '@/types/portfolio';

export interface PDFGenerationOptions {
  filename?: string;
  margin?: number;
  pageSize?: string;
  orientation?: 'portrait' | 'landscape';
  enableHeaders?: boolean;
  enableFooters?: boolean;
  customCSS?: string;
}

export class PDFGenerationService {
  private static defaultOptions: PDFGenerationOptions = {
    margin: 10,
    pageSize: 'a4',
    orientation: 'portrait',
    enableHeaders: true,
    enableFooters: true
  };

  static async generatePortfolioPDF(
    portfolioData: ExtendedPortfolioData,
    options: PDFGenerationOptions = {}
  ): Promise<void> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    const element = document.createElement('div');
    element.innerHTML = this.generatePortfolioHTML(portfolioData, mergedOptions);

    const pdfOptions = {
      margin: mergedOptions.margin,
      filename: mergedOptions.filename || `${portfolioData.name.replace(/\s+/g, '_')}_Portfolio.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: mergedOptions.pageSize, 
        orientation: mergedOptions.orientation
      }
    };

    return html2pdf()
      .from(element)
      .set(pdfOptions)
      .save();
  }

  private static generatePortfolioHTML(
    data: ExtendedPortfolioData,
    options: PDFGenerationOptions
  ): string {
    const css = `
      * { box-sizing: border-box; }
      body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 210mm; margin: 0 auto; padding: 20px; }
      .header { text-align: center; margin-bottom: 40px; }
      .section { margin-bottom: 30px; }
      .section-title { color: #2952CC; border-bottom: 2px solid #2952CC; padding-bottom: 5px; margin-bottom: 20px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
      .card { background: #f8f9fa; border-radius: 8px; padding: 15px; }
      .skill-bar { background: #eee; height: 10px; border-radius: 5px; margin-top: 5px; }
      .skill-progress { background: #2952CC; height: 100%; border-radius: 5px; }
      .contact-info { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
      ${options.customCSS || ''}
    `;

    return `
      <style>${css}</style>
      <div class="container">
        ${options.enableHeaders ? this.generateHeader(data) : ''}
        
        <div class="section">
          <h2 class="section-title">About Me</h2>
          <p>${data.bio || ''}</p>
        </div>

        ${this.generateContactSection(data)}
        ${this.generateSkillsSection(data)}
        ${this.generateProjectsSection(data)}
        ${this.generateExperienceSection(data)}
        ${this.generateServicesSection(data)}
        ${this.generateTestimonialsSection(data)}
        
        ${options.enableFooters ? this.generateFooter(data) : ''}
      </div>
    `;
  }

  private static generateHeader(data: ExtendedPortfolioData): string {
    return `
      <div class="header">
        ${data.logoImage ? `<img src="${data.logoImage}" alt="Logo" style="max-height: 60px; margin-bottom: 20px;">` : ''}
        <h1 style="font-size: 28px; margin: 0;">${data.name}</h1>
        <h2 style="font-size: 20px; color: #666; margin: 10px 0;">${data.title || ''}</h2>
        ${data.subtitle ? `<p style="color: #888;">${data.subtitle}</p>` : ''}
      </div>
    `;
  }

  private static generateContactSection(data: ExtendedPortfolioData): string {
    if (!data.contact) return '';
    
    return `
      <div class="section">
        <h2 class="section-title">Contact Information</h2>
        <div class="contact-info">
          ${data.contact.email ? `<p>Email: ${data.contact.email}</p>` : ''}
          ${data.contact.phone ? `<p>Phone: ${data.contact.phone}</p>` : ''}
          ${data.contact.location ? `<p>Location: ${data.contact.location}</p>` : ''}
          ${data.contact.website ? `<p>Website: ${data.contact.website}</p>` : ''}
        </div>
      </div>
    `;
  }

  private static generateSkillsSection(data: ExtendedPortfolioData): string {
    if (!data.skills?.length) return '';

    const skillsHTML = data.skills.map(skill => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <strong>${skill.name}</strong>
          <span>${skill.level}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress" style="width: ${skill.level}%"></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="section">
        <h2 class="section-title">Skills & Expertise</h2>
        <div class="grid">${skillsHTML}</div>
      </div>
    `;
  }

  private static generateProjectsSection(data: ExtendedPortfolioData): string {
    if (!data.projects?.length) return '';

    const projectsHTML = data.projects.map(project => `
      <div class="card">
        ${project.image ? `<img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: 4px; margin-bottom: 10px;">` : ''}
        <h3 style="margin: 0 0 10px 0;">${project.title}</h3>
        <p>${project.description || ''}</p>
        ${project.technologies ? `
          <p style="margin-top: 10px; font-style: italic; color: #666;">
            Technologies: ${project.technologies.join(', ')}
          </p>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="section">
        <h2 class="section-title">Projects</h2>
        <div class="grid">${projectsHTML}</div>
      </div>
    `;
  }

  private static generateExperienceSection(data: ExtendedPortfolioData): string {
    if (!data.experiences?.length) return '';

    const experiencesHTML = data.experiences.map(exp => `
      <div class="card">
        <h3 style="margin: 0;">${exp.company}</h3>
        <p style="color: #666; margin: 5px 0;">${exp.role} | ${exp.duration}</p>
        <p>${exp.description}</p>
        ${exp.achievements ? `
          <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="section">
        <h2 class="section-title">Professional Experience</h2>
        <div class="grid">${experiencesHTML}</div>
      </div>
    `;
  }

  private static generateServicesSection(data: ExtendedPortfolioData): string {
    if (!data.services?.length) return '';

    const servicesHTML = data.services.map(service => `
      <div class="card">
        ${service.icon ? `<div style="font-size: 24px; margin-bottom: 10px;">${service.icon}</div>` : ''}
        <h3 style="margin: 0 0 10px 0;">${service.title}</h3>
        <p>${service.description}</p>
        ${service.price ? `<p style="font-weight: bold; margin-top: 10px;">Starting at: ${service.price}</p>` : ''}
      </div>
    `).join('');

    return `
      <div class="section">
        <h2 class="section-title">Services</h2>
        <div class="grid">${servicesHTML}</div>
      </div>
    `;
  }

  private static generateTestimonialsSection(data: ExtendedPortfolioData): string {
    if (!data.testimonials?.length) return '';

    const testimonialsHTML = data.testimonials.map(testimonial => `
      <div class="card" style="font-style: italic;">
        <p>"${testimonial.content}"</p>
        <p style="text-align: right; margin-top: 10px;">
          <strong>${testimonial.author}</strong>
          ${testimonial.role ? `<br><span style="color: #666;">${testimonial.role}</span>` : ''}
        </p>
      </div>
    `).join('');

    return `
      <div class="section">
        <h2 class="section-title">Testimonials</h2>
        <div class="grid">${testimonialsHTML}</div>
      </div>
    `;
  }

  private static generateFooter(data: ExtendedPortfolioData): string {
    return `
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
        <p>Portfolio generated on ${new Date().toLocaleDateString()}</p>
      </div>
    `;
  }
}