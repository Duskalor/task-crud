import React from 'react';
import { Badge } from '@/components/ui/badge';
type StatusKey = 'to do' | 'in_progress' | 'done';

type Props = {
  row: { original: { status: { name: string } } };
};

type Variants = 'red' | 'yellow' | 'green';

const status = {
  ['to do']: 'red',
  in_progress: 'yellow',
  done: 'green',
};

const StatusColor = (text: string) => {
  return status[text as StatusKey] as Variants;
};

export const StatusCell = ({ row }: Props) => {
  const nameCell = row.original.status.name;
  const color = StatusColor(nameCell);
  return <Badge variant={color}>{nameCell}</Badge>;
};
