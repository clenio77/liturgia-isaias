'use client';

import { Button } from '@/components/ui/button';
import { Menu, Cross, Bell, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function MobileHeader({ onMenuClick, title = "Liturgia Isaías" }: MobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuClick}
        className="p-2"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Title */}
      <div className="flex items-center space-x-2">
        <Cross className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="p-2">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Avatar */}
        <Button variant="ghost" size="sm" className="p-2">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
