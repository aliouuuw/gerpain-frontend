import { createFileRoute } from '@tanstack/react-router'
import { ForbiddenPage } from '../components/admin/ForbiddenPage'

export const Route = createFileRoute('/forbidden')({
  component: ForbiddenPage,
})