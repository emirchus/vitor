export interface TimelineRow {
  id: string;
  action: TimelineAction;
}

export interface TimelineAction {
  id: string;
  rowId: string;
  start: number;
  end: number;
  duration: number;
  file?: File;
  thumbnail?: string;
  effects?: TimelineActionEffect[];
}

export interface TimelineActionEffect {
  id: string;
  actionId: number;
  start: number;
  end: number;

  // The effect type
}

export interface DragLineData {
  isMoving: boolean;
  movePositions: number[];
  assistPositions: number[];
}
