import emailjs from '@emailjs/browser';

// EmailJS configuration
// These should be set in your .env file
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID_SUPPORT = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_SUPPORT || '';
const TEMPLATE_ID_CONTACT = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT || '';
const TEMPLATE_ID_QUOTE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_QUOTE || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Initialize EmailJS
if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

export interface SupportRequestData {
  name: string;
  email: string;
  website?: string;
  issueType: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

export interface QuoteRequestData {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  pages: number;
  features: string[];
  urgency: string;
  estimatedRange: string;
  additionalNotes?: string;
}

/**
 * Send support request email to admin
 */
export const sendSupportRequest = async (data: SupportRequestData): Promise<boolean> => {
  if (!SERVICE_ID || !TEMPLATE_ID_SUPPORT || !PUBLIC_KEY) {
    console.error('EmailJS configuration is missing. Please check your .env file.');
    return false;
  }

  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      website: data.website || 'Not provided',
      issue_type: data.issueType,
      message: data.description,
      to_email: 'thefreelancer2076@gmail.com', // Admin email
      subject: `Support Request: ${data.issueType} - ${data.name}`,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID_SUPPORT, templateParams);
    return true;
  } catch (error) {
    console.error('Failed to send support request:', error);
    return false;
  }
};

/**
 * Send contact form email to admin
 */
export const sendContactForm = async (data: ContactFormData): Promise<boolean> => {
  if (!SERVICE_ID || !TEMPLATE_ID_CONTACT || !PUBLIC_KEY) {
    console.error('EmailJS configuration is missing. Please check your .env file.');
    return false;
  }

  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone || 'Not provided',
      project_type: data.projectType,
      budget: data.budget || 'Not specified',
      timeline: data.timeline || 'Not specified',
      message: data.message,
      to_email: 'thefreelancer2076@gmail.com', // Admin email
      subject: `New Contact Form Submission: ${data.projectType} - ${data.name}`,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID_CONTACT, templateParams);
    return true;
  } catch (error) {
    console.error('Failed to send contact form:', error);
    return false;
  }
};

/**
 * Send quote request email to admin
 */
export const sendQuoteRequest = async (data: QuoteRequestData): Promise<boolean> => {
  if (!SERVICE_ID || !TEMPLATE_ID_QUOTE || !PUBLIC_KEY) {
    console.error('EmailJS configuration is missing. Please check your .env file.');
    return false;
  }

  try {
    const templateParams = {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone || 'Not provided',
      project_type: data.projectType,
      pages: data.pages.toString(),
      features: data.features.join(', '),
      urgency: data.urgency,
      estimated_range: data.estimatedRange,
      additional_notes: data.additionalNotes || 'None',
      to_email: 'thefreelancer2076@gmail.com', // Admin email
      subject: `Quote Request: ${data.projectType} - ${data.name}`,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID_QUOTE, templateParams);
    return true;
  } catch (error) {
    console.error('Failed to send quote request:', error);
    return false;
  }
};

