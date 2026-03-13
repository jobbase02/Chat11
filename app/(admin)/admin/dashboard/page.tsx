import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DBClient';

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get('admin_session')?.value;
  
  if (!sessionValue) {
    redirect('/admin/auth');
  }

  let role = 'manager';
  let name = 'Admin';

  try {
    // Safely parse the base64 cookie
    const decodedStr = Buffer.from(sessionValue, 'base64').toString('utf8');
    const decoded = JSON.parse(decodedStr);
    
    if (decoded.role) role = decoded.role;
    if (decoded.name) name = decoded.name;
  } catch(e) {
    // Agar cookie invalid JSON hai, toh crash hone ki jagah login pe bhej do
    console.error("Invalid session cookie format");
    redirect('/admin/auth');
  }

  return <DashboardClient role={role} name={name} />;
}