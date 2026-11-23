import { Github, Instagram, Youtube, Linkedin, Facebook, Ghost, Twitter, Link2, FileText, Globe } from 'lucide-react'

// Key stored in the database -> lucide icon. Admin picks from these keys.
export const iconMap = {
  github: Github, instagram: Instagram, youtube: Youtube, linkedin: Linkedin,
  facebook: Facebook, snapchat: Ghost, x: Twitter, link: Link2, file: FileText, globe: Globe,
}
export const getIcon = (key) => iconMap[key] || Link2
