import SingletonForm from '../../components/admin/SingletonForm'
import { BUCKETS } from '../../lib/supabaseClient'

const FIELDS = [
  { name: 'logo_text', label: 'Logo text', required: true },
  { name: 'logo_url', label: 'Website logo (image)', type: 'image', bucket: BUCKETS.assets, nullable: true },
  { name: 'primary_color', label: 'Primary (pink) colour', type: 'color' },
  { name: 'secondary_color', label: 'Secondary colour', type: 'color' },
  { name: 'background_theme', label: 'Default theme', type: 'select', options: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }] },
  { name: 'animations_enabled', label: 'Decorative animations (floating hearts)', type: 'toggle' },
  { name: 'footer_text', label: 'Footer text' },
]
export default function AppearancePage() {
  return <SingletonForm table="site_settings" title="Appearance" subtitle="Colours, logo, theme and footer." fields={FIELDS} />
}
