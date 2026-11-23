import SingletonForm from '../../components/admin/SingletonForm'
import { BUCKETS } from '../../lib/supabaseClient'

const FIELDS = [
  { name: 'name', label: 'Creator name', required: true },
  { name: 'title', label: 'Professional title' },
  { name: 'intro', label: 'Introduction (big headline on the home page)', type: 'textarea' },
  { name: 'bio', label: 'Biography', type: 'textarea' },
  { name: 'avatar_url', label: 'Profile picture', type: 'image', bucket: BUCKETS.profile, nullable: true },
  { name: 'banner_url', label: 'Profile banner', type: 'image', bucket: BUCKETS.profile, nullable: true },
  { name: 'stats', label: 'Profile statistics', type: 'stats' },
]
export default function ProfilePage() {
  return <SingletonForm table="profiles" title="Profile" subtitle="Your name, picture, bio and statistics." fields={FIELDS} />
}
