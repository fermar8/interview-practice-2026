export type Slot = {
  id: string;
  capacity: number;
  reserved: number;
};

export type Reservation = {
  id: string;
  slotId: string;
  userId: string;
  createdAt: string;
};
