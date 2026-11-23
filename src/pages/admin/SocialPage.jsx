import ListManager from '../../components/admin/ListManager'
import { iconMap } from '../../lib/icons'

const ICONS = Object.keys(iconMap).map((k) => ({ value: k, label: k[0].toUpperCase() + k.slice(1) }))
const FIELDS = [
  { name: 'platform', label: 'Platform name', required: true, placeholder: 'Instagram' },
  { name: 'username', label: 'Username', placeholder: '@yourname' },
  { name: 'url', label: 'Link (URL)', type: 'url', required: true, placeholder: 'https://instagram.com/yourname' },
  { name: 'icon', label: 'Icon', type: 'select', options: ICONS },
]
export default function SocialPage() {
  return <ListManager table="social_links" title="Social Links" noun="Link" subtitle="Add, edit, hide, reorder or delete social platforms." fields={FIELDS} enabledKey="is_enabled" itemTitle={(r) => r.platform} itemSub={(r) => `${r.username || ''} ${r.url}`.trim()} />
}
