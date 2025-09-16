
export type SubScript = {
  title: string;
  content: string;
};

export type Script = {
  id: string;
  department: 'etg' | 'bookingcom' | 'common';
  category: string;
  title: string;
  content: string | SubScript[];
};
