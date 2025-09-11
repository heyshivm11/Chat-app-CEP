import ScriptPage from '@/components/script-page';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return [{ department: 'etg' }, { department: 'booking' }];
}

export default function Page({ params }: { params: { department: string } }) {
  const { department } = params;

  if (department !== 'etg' && department !== 'booking') {
    notFound();
  }

  const departmentName = department === 'etg' ? 'ETG' : 'Booking.com';
  
  return (
    <ScriptPage department={department} departmentName={departmentName} />
  );
}
