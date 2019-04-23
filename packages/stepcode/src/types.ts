export enum ScrollDir {
  Top = 'top',
  Left = 'left'
}

export enum ScrollTarget {
  Editor = 'editor',
  Comment = 'comment'
}

export interface IUI {
  show(): void;
  hide(): void;
  update(data: any): void;
}
