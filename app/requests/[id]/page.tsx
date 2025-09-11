import { RequestDetails } from './request-details';

// Generate static params for static export
export async function generateStaticParams() {
  // In a real app, this would fetch from your API
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function RequestDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <RequestDetails requestId={params.id} />;
}
