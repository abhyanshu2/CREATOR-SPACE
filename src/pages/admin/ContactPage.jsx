import SingletonForm from '../../components/admin/SingletonForm'

const FIELDS = [
  { name: 'email', label: 'Email address' },
  { name: 'whatsapp', label: 'WhatsApp number', hint: 'With country code, e.g. +919876543210' },
  { name: 'message', label: 'Contact message', type: 'textarea' },
  { name: 'button_label', label: 'Button text', required: true },
  { name: 'button_url', label: 'Button link', type: 'url', hint: 'e.g. mailto:you@example.com or https://…' },
]
export default function ContactPage() {
  return <SingletonForm table="contact_settings" title="Contact" subtitle="What visitors see in the contact section." fields={FIELDS} />
}
