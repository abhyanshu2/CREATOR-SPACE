import ListManager from '../../components/admin/ListManager'
import { iconMap } from '../../lib/icons'

const ICONS = Object.keys(iconMap).map((k) => ({ value: k, label: k[0].toUpperCase() + k.slice(1) }))
const TYPES = ['github', 'portfolio', 'resume', 'blog', 'other'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }))
const FIELDS = [
  { name: 'label', label: 'Label', required: true, placeholder: 'Resume' },
  { name: 'url', label: 'Link (URL)', type: 'url', required: true },
  { name: 'type', label: 'Type', type: 'select', options: TYPES, default: 'other' },
  { name: 'icon', label: 'Icon', type: 'select', options: ICONS },
]
export default function WorkLinksPage() {
  return <ListManager table="work_links" title="Work Links" noun="Link" subtitle="GitHub, portfolio, resume, blog and other links (shown in the Projects section)." fields={FIELDS} enabledKey="is_enabled" itemTitle={(r) => r.label} itemSub={(r) => r.url} />
}
