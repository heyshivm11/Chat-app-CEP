export type SubScript = {
  title: string;
  content: string;
};

export type Script = {
  id: string;
  department: 'etg' | 'booking' | 'common';
  category: string;
  team: 'Frontline' | 'Schedule Change' | 'All';
  title: string;
  content: string | SubScript[];
};
