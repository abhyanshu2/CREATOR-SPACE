import ListManager from '../../components/admin/ListManager'
import { BUCKETS } from '../../lib/supabaseClient'

const FIELDS = [
  { name: 'title', label: 'Project name', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'thumbnail_url', label: 'Thumbnail', type: 'image', bucket: BUCKETS.project, nullable: true },
  { name: 'github_url', label: 'GitHub URL', type: 'url', http: true, nullable: true, placeholder: 'https://github.com/you/project' },
  { name: 'demo_url', label: 'Live demo URL', type: 'url', http: true, nullable: true, placeholder: 'https://…' },
]
export default function ProjectsPage() {
  return <ListManager table="projects" title="Projects" noun="Project" subtitle="Add, edit, reorder, publish or delete projects." fields={FIELDS} enabledKey="is_published" itemTitle={(r) => r.title} itemSub={(r) => r.description || 'No description'} />
}
