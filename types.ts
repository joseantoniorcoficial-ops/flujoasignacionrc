import React from 'react';
import { LucideIcon } from 'lucide-react';

export enum StepId {
  START = 'start',
  ASSIGNED = 'assigned',
  IN_PROCESS = 'in_process',
  CHECKLIST = 'checklist',
  REVIEW = 'review',
  COMPLETED = 'completed'
}

export interface ChecklistState {
  achievements: boolean;
  date: boolean;
  files: boolean;
  notify: boolean;
}

export interface StepCardProps {
  id: StepId;
  title: string;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'indigo' | 'purple' | 'teal' | 'green' | 'red';
  isActive: boolean;
  isCompleted: boolean;
  children: React.ReactNode;
  onActivate?: () => void;
}