import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, MobileHeader } from './Sidebar';

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <MobileHeader onMenuClick={() => setSidebarCollapsed(false)} />
      
      <main className="flex-1 min-h-screen lg:ml-0">
        <div className="pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
