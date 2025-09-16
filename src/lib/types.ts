
export type SubScript = {
  title: string;
  content: string;
};

export type Script = {
  id: string;
  department: 'frontline' | 'schedule-change' | 'common';
  category: string;
  title: string;
  content: string | SubScript[];
};
