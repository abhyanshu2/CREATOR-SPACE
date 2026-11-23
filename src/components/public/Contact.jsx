import { Mail, MessageCircle } from 'lucide-react'
import { CatFace } from './Decor'

export default function Contact({ section, contact }) {
  const wa = contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` : null
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
      <div className="glow-card relative overflow-hidden p-8 text-center sm:p-12">
        <CatFace className="mx-auto h-20 w-20 animate-floaty" />
        {section.heading && <h2 className="section-title mt-4">{section.heading}</h2>}
        {(contact.message || section.description) && <p className="mx-auto mt-2 max-w-lg whitespace-pre-line text-muted">{contact.message || section.description}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-semibold">
          {contact.email && <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-4 py-2 hover:bg-primary/15"><Mail className="h-4 w-4 text-primary" />{contact.email}</a>}
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-4 py-2 hover:bg-primary/15"><MessageCircle className="h-4 w-4 text-primary" />WhatsApp</a>}
        </div>
        {contact.button_url && <a href={contact.button_url} className="btn-pink mt-8">{contact.button_label}</a>}
      </div>
    </section>
  )
}
