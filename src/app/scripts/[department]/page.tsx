import ScriptPage from '@/components/script-page';

// This function can be removed if you are not pre-rendering these paths.
// export function generateStaticParams() {
//   return [{ department: 'etg' }, { department: 'booking' }];
// }

export default function Page({ params }: { params: { department: string } }) {
  const { department } = params;
  const departmentName = department === 'etg' ? 'ETG' : 'Booking.com';
  
  return (
    <ScriptPage department={department} departmentName={departmentName} />
  );
}
